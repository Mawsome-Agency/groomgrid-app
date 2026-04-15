/**
 * Analytics Verification Utilities
 *
 * Provides functions to verify that analytics events are properly
 * configured and firing in production environments.
 */

export interface AnalyticsVerificationResult {
  status: 'pass' | 'fail' | 'warning';
  category: 'client' | 'server' | 'config' | 'integration';
  message: string;
  details?: Record<string, unknown>;
}

export interface BOFUEventConfig {
  eventName: string;
  requiredParams: string[];
  optionalParams?: string[];
  description: string;
}

/**
 * BOFU Events Configuration
 * Defines the expected events and their parameters for BOFU analytics
 */
export const BOFU_EVENT_CONFIG: BOFUEventConfig[] = [
  {
    eventName: 'bofu_page_viewed',
    requiredParams: ['page_type', 'page_name'],
    optionalParams: ['competitor_name', 'client_id', 'utm_source', 'utm_medium', 'utm_campaign'],
    description: 'Tracked when a user views a BOFU comparison/alternative page',
  },
  {
    eventName: 'bofu_entry',
    requiredParams: ['page_name', 'referrer'],
    description: 'Tracked on initial entry to BOFU page',
  },
  {
    eventName: 'bofu_scroll_depth',
    requiredParams: ['page_name', 'depth_percent'],
    description: 'Tracked at 25%, 50%, 75%, and 100% scroll depth',
  },
  {
    eventName: 'bofu_time_on_page',
    requiredParams: ['page_name', 'seconds'],
    description: 'Tracked when user leaves the page',
  },
  {
    eventName: 'bofu_cta_click',
    requiredParams: ['page_name', 'page_type', 'cta_type', 'destination'],
    optionalParams: ['plan_type', 'competitor_name'],
    description: 'Tracked when user clicks any CTA button',
  },
  {
    eventName: 'bofu_outbound_click',
    requiredParams: ['page_name', 'destination', 'domain', 'is_competitor'],
    description: 'Tracked when user clicks external link',
  },
  {
    eventName: 'bofu_comparison_viewed',
    requiredParams: ['page_name', 'software_name'],
    description: 'Tracked when comparison section is viewed',
  },
];

/**
 * Client-side analytics configuration verification
 */
export function verifyClientAnalyticsConfig(): AnalyticsVerificationResult[] {
  const results: AnalyticsVerificationResult[] = [];

  // Check GA4 Measurement ID
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  if (!measurementId) {
    results.push({
      status: 'fail',
      category: 'config',
      message: 'NEXT_PUBLIC_GA4_MEASUREMENT_ID is not set',
      details: { env: 'client' },
    });
  } else if (!measurementId.startsWith('G-')) {
    results.push({
      status: 'warning',
      category: 'config',
      message: 'NEXT_PUBLIC_GA4_MEASUREMENT_ID format may be invalid (should start with G-)',
      details: { measurementId },
    });
  } else {
    results.push({
      status: 'pass',
      category: 'config',
      message: 'NEXT_PUBLIC_GA4_MEASUREMENT_ID is configured',
      details: { measurementId },
    });
  }

  return results;
}

/**
 * Server-side analytics configuration verification
 */
export function verifyServerAnalyticsConfig(): AnalyticsVerificationResult[] {
  const results: AnalyticsVerificationResult[] = [];

  // Check GA4 API Secret
  const apiSecret = process.env.GA4_API_SECRET;
  if (!apiSecret) {
    results.push({
      status: 'warning',
      category: 'config',
      message: 'GA4_API_SECRET is not set - server-side events will not be tracked',
      details: { env: 'server' },
    });
  } else {
    results.push({
      status: 'pass',
      category: 'config',
      message: 'GA4_API_SECRET is configured',
    });
  }

  return results;
}

/**
 * Verify BOFU event payload structure
 */
export function verifyBOFUEventPayload(
  eventName: string,
  payload: Record<string, unknown>
): AnalyticsVerificationResult {
  const config = BOFU_EVENT_CONFIG.find((e) => e.eventName === eventName);

  if (!config) {
    return {
      status: 'warning',
      category: 'client',
      message: `Unknown BOFU event: ${eventName}`,
    };
  }

  const missingParams = config.requiredParams.filter(
    (param) => !(param in payload) || payload[param] === undefined || payload[param] === null
  );

  if (missingParams.length > 0) {
    return {
      status: 'fail',
      category: 'client',
      message: `Event "${eventName}" missing required params: ${missingParams.join(', ')}`,
      details: { eventName, missingParams, payload },
    };
  }

  return {
    status: 'pass',
    category: 'client',
    message: `Event "${eventName}" payload is valid`,
    details: { eventName, payload },
  };
}

/**
 * Get summary of all BOFU events expected in production
 */
export function getBOFUEventSummary(): {
  totalEvents: number;
  events: Array<{ name: string; description: string; requiredParams: string[] }>;
} {
  return {
    totalEvents: BOFU_EVENT_CONFIG.length,
    events: BOFU_EVENT_CONFIG.map((e) => ({
      name: e.eventName,
      description: e.description,
      requiredParams: e.requiredParams,
    })),
  };
}
