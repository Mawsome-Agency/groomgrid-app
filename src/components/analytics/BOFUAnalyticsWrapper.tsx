'use client';

import { useEffect, useRef } from 'react';
import { useScrollDepth } from '@/hooks/use-scroll-depth';
import { useSectionObserver } from '@/hooks/use-section-observer';
import { useEngagementTime } from '@/hooks/use-engagement-time';
import {
  trackBofuPageViewed,
  trackBofuScrollDepth,
  trackBofuSectionViewed,
  trackBofuEngagementTime,
  trackBofuCtaClick,
} from '@/lib/ga4';

interface BOFUAnalyticsWrapperProps {
  /**
   * Type of BOFU page (used for tracking)
   */
  pageType: string;
  /**
   * Section IDs to track (maps to section IDs in the DOM)
   */
  sectionIds: string[];
  /**
   * Human-readable section titles (must match sectionIds order)
   */
  sectionTitles: string[];
  /**
   * Whether to enable analytics tracking
   * @default true
   */
  enabled?: boolean;
  /**
   * Children to wrap
   */
  children: React.ReactNode;
}

/**
 * Analytics wrapper for BOFU (Bottom of Funnel) comparison pages.
 * 
 * Tracks:
 * - Page views
 * - Scroll depth milestones (25%, 50%, 75%, 100%)
 * - Section visibility
 * - Engagement time
 * - CTA clicks (via data attributes)
 * 
 * @example
 * ```tsx
 * <BOFUAnalyticsWrapper
 *   pageType="mobile-grooming-business"
 *   sectionIds={['hero', 'why-mobile', 'startup-costs', 'route-optimization', 'pricing', 'cta']}
 *   sectionTitles={['Hero', 'Why Mobile Grooming', 'Startup Costs', 'Route Optimization', 'Pricing Strategy', 'CTA']}
 * >
 *   <YourPageContent />
 * </BOFUAnalyticsWrapper>
 * ```
 */
export function BOFUAnalyticsWrapper({
  pageType,
  sectionIds,
  sectionTitles,
  enabled = true,
  children,
}: BOFUAnalyticsWrapperProps) {
  const hasTrackedPageView = useRef(false);
  const engagementTimeRef = useRef(0);
  const sectionsViewedRef = useRef<Set<string>>(new Set());

  // Track scroll depth
  const { maxDepth } = useScrollDepth({
    enabled,
    thresholds: [25, 50, 75, 100],
    onThresholdReached: (depth) => {
      trackBofuScrollDepth(pageType, depth);
    },
  });

  // Track section visibility
  const { viewedSections, sectionTimeSpent, observeSection } = useSectionObserver({
    enabled,
    onSectionVisible: (sectionId) => {
      const sectionIndex = sectionIds.indexOf(sectionId);
      if (sectionIndex !== -1 && sectionTitles[sectionIndex]) {
        trackBofuSectionViewed(pageType, sectionId, sectionTitles[sectionIndex]);
        sectionsViewedRef.current.add(sectionId);
      }
    },
  });

  // Track engagement time
  const { engagementTime } = useEngagementTime({
    enabled,
    onTimeUpdate: (time) => {
      engagementTimeRef.current = time;
    },
  });

  // Track page view on mount
  useEffect(() => {
    if (!enabled || hasTrackedPageView.current) return;

    const referrer = typeof window !== 'undefined' ? document.referrer : undefined;
    trackBofuPageViewed(pageType, referrer);
    hasTrackedPageView.current = true;
  }, [enabled, pageType]);

  // Track engagement time on unmount
  useEffect(() => {
    return () => {
      if (enabled && engagementTimeRef.current > 0) {
        trackBofuEngagementTime(
          pageType,
          engagementTimeRef.current,
          sectionsViewedRef.current.size
        );
      }
    };
  }, [enabled, pageType]);

  // Track CTA clicks via event delegation
  useEffect(() => {
    if (!enabled) return;

    const handleCtaClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const ctaButton = target.closest('[data-cta-type]');

      if (ctaButton) {
        const ctaType = ctaButton.getAttribute('data-cta-type');
        const ctaLocation = ctaButton.getAttribute('data-cta-location') || 'unknown';
        const sectionId = ctaButton.getAttribute('data-cta-section') || undefined;

        if (ctaType) {
          trackBofuCtaClick(pageType, ctaType, ctaLocation, sectionId);
        }
      }
    };

    document.addEventListener('click', handleCtaClick);
    return () => {
      document.removeEventListener('click', handleCtaClick);
    };
  }, [enabled, pageType]);

  // Expose observeSection function to children via context or render prop
  // For now, we'll use a data attribute approach
  useEffect(() => {
    if (!enabled) return;

    // Attach data-section-id to elements with data-section attribute
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => {
      const sectionId = section.getAttribute('data-section');
      if (sectionId && sectionIds.includes(sectionId)) {
        section.setAttribute('data-section-id', sectionId);
      }
    });
  }, [enabled, sectionIds]);

  return <>{children}</>;
}
