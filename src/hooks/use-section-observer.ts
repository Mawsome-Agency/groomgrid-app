'use client';

import { useEffect, useRef, useState } from 'react';

interface SectionObserverOptions {
  /**
   * Intersection observer root margin
   * @default '0px 0px -10% 0px' (triggers when 10% of element is visible)
   */
  rootMargin?: string;
  /**
   * Intersection observer threshold (0-1)
   * @default 0.1 (triggers when 10% of element is visible)
   */
  threshold?: number;
  /**
   * Whether to observe sections
   * @default true
   */
  enabled?: boolean;
  /**
   * Callback fired when a section becomes visible
   */
  onSectionVisible?: (sectionId: string) => void;
  /**
   * Callback fired when a section is no longer visible
   */
  onSectionHidden?: (sectionId: string) => void;
}

interface SectionObserverResult {
  /**
   * Currently visible section IDs
   */
  visibleSections: Set<string>;
  /**
   * All sections that have been viewed at least once
   */
  viewedSections: Set<string>;
  /**
   * Time spent in each section (in milliseconds)
   */
  sectionTimeSpent: Record<string, number>;
  /**
   * Ref callback to attach to section elements
   */
  observeSection: (sectionId: string) => (element: HTMLElement | null) => void;
}

/**
 * Hook to observe which sections of a page are visible
 * 
 * @example
 * ```tsx
 * const { visibleSections, viewedSections, observeSection } = useSectionObserver({
 *   onSectionVisible: (sectionId) => {
 *     console.log(`Section ${sectionId} is now visible`);
 *   }
 * });
 * 
 * // In JSX:
 * <section ref={observeSection('hero')}>Hero content</section>
 * <section ref={observeSection('features')}>Features content</section>
 * ```
 */
export function useSectionObserver(options: SectionObserverOptions = {}): SectionObserverResult {
  const {
    rootMargin = '0px 0px -10% 0px',
    threshold = 0.1,
    enabled = true,
    onSectionVisible,
    onSectionHidden,
  } = options;

  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
  const [sectionTimeSpent, setSectionTimeSpent] = useState<Record<string, number>>({});
  
  const sectionRefsRef = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionTimersRef = useRef<Map<string, number>>(new Map());
  const viewedSectionsRef = useRef<Set<string>>(new Set());

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      sectionTimersRef.current.forEach((timer, sectionId) => {
        clearInterval(timer);
      });
    };
  }, []);

  // Create intersection observer
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (!sectionId) return;

          if (entry.isIntersecting) {
            // Section became visible
            setVisibleSections((prev) => new Set([...Array.from(prev), sectionId]));

            // Track if this is the first time viewing
            if (!viewedSectionsRef.current.has(sectionId)) {
              viewedSectionsRef.current.add(sectionId);
              setViewedSections(new Set(Array.from(viewedSectionsRef.current)));
              onSectionVisible?.(sectionId);
            }

            // Start timing this section
            if (!sectionTimersRef.current.has(sectionId)) {
              const startTime = Date.now();
              const timer = window.setInterval(() => {
                const elapsed = Date.now() - startTime;
                setSectionTimeSpent((prev) => ({
                  ...prev,
                  [sectionId]: elapsed,
                }));
              }, 1000); // Update every second
              sectionTimersRef.current.set(sectionId, timer as unknown as number);
            }
          } else {
            // Section became hidden
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              newSet.delete(sectionId);
              return newSet;
            });
            
            onSectionHidden?.(sectionId);

            // Stop timing this section
            const timer = sectionTimersRef.current.get(sectionId);
            if (timer) {
              clearInterval(timer);
              sectionTimersRef.current.delete(sectionId);
            }
          }
        });
      },
      { rootMargin, threshold }
    );

    // Observe all registered sections
    sectionRefsRef.current.forEach((element, sectionId) => {
      element.setAttribute('data-section-id', sectionId);
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [enabled, rootMargin, threshold, onSectionVisible, onSectionHidden]);

  // Ref callback to attach to section elements
  const observeSection = (sectionId: string) => (element: HTMLElement | null) => {
    if (!enabled) return;

    // Clean up previous ref for this section
    const prevElement = sectionRefsRef.current.get(sectionId);
    if (prevElement) {
      observerRef.current?.unobserve(prevElement);
    }

    if (element) {
      sectionRefsRef.current.set(sectionId, element);
      element.setAttribute('data-section-id', sectionId);
      observerRef.current?.observe(element);
    } else {
      sectionRefsRef.current.delete(sectionId);
    }
  };

  return {
    visibleSections,
    viewedSections,
    sectionTimeSpent,
    observeSection,
  };
}
