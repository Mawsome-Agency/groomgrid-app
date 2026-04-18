/**
 * Mock Jest mock for src/lib/ga4-server.ts
 * Provides the same exported signatures but performs **no‑op** behavior.
 * This prevents real HTTP calls to GA4 Measurement Protocol during tests.
 */

export interface GA4ServerEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function trackServerEvent(
  _clientId: string,
  _events: GA4ServerEvent | GA4ServerEvent[],
  _userId?: string
): Promise<void> {
  return;
}

export async function trackCheckoutCompletedServer(
  _clientId: string,
  _userId: string,
  _sessionId: string,
  _planType: string,
  _trialStarted: boolean
): Promise<void> {
  return;
}

export async function trackSubscriptionCreatedServer(
  _clientId: string,
  _userId: string,
  _subscriptionId: string,
  _planType: string,
  _status: string
): Promise<void> {
  return;
}

export async function trackSubscriptionUpdatedServer(
  _userId: string,
  _subscriptionId: string,
  _status: string
): Promise<void> {
  return;
}

export async function trackSubscriptionCancelledServer(
  _userId: string,
  _subscriptionId: string
): Promise<void> {
  return;
}

export async function trackSubscriptionStartedServer(
  _clientId: string,
  _userId: string,
  _subscriptionId: string,
  _planType: string,
  _status: string,
  _price: number
): Promise<void> {
  return;
}

export async function trackPaymentInitiatedServer(
  _userId: string,
  _sessionId: string,
  _planType: string
): Promise<void> {
  return;
}

export async function trackPaymentSuccessServer(
  _userId: string,
  _invoiceId: string,
  _amount: number
): Promise<void> {
  return;
}

export async function trackPaymentFailedServer(
  _userId: string,
  _invoiceId: string,
  _reason: string
): Promise<void> {
  return;
}

export async function trackPurchaseCompletedServer(
  _clientId: string,
  _userId: string,
  _sessionId: string,
  _planName: string,
  _planPrice: number
): Promise<void> {
  return;
}

export async function trackABTestAssignedServer(
  _userId: string,
  _testName: string,
  _variant: 'A' | 'B'
): Promise<void> {
  return;
}

export async function trackABTestConvertedServer(
  _userId: string,
  _testName: string,
  _variant: 'A' | 'B',
  _event: string
): Promise<void> {
  return;
}
