'use client';

import { useCallback, useEffect, useRef } from 'react';

interface ScrollRevealOptions {
  /** Fraction of element that must be visible before revealing (0–1). Default: 0.15 */
  threshold?: number;
  /** IntersectionObserver root margin. Default: '0px 0px -5% 0px' */
  rootMargin?: string;
}

/**
 * IntersectionObserver-based scroll-reveal hook.
 *
 * Toggles `.revealed` on elements when they enter the viewport (fires once only).
 * Pairs with the `.scroll-reveal` CSS class in globals.css.
 * Respects `prefers-reduced-motion: reduce` — elements are shown immediately.
 *
 * @example
 * const { revealRef } = useScrollReveal();
 *
 * // Fade in when scrolled into view:
 * <section ref={revealRef(0)} className="scroll-reveal">...</section>
 *
 * // Staggered entrance (0 / 100 / 200ms):
 * {items.map((item, i) => (
 *   <div key={item.id} ref={revealRef(i * 100)} className="scroll-reveal">...</div>
 * ))}
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -5% 0px' } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);
  // Elements that attached their ref before the observer was created are queued here
  const pendingRef = useRef<Array<{ el: HTMLElement; delay: number }>>([]);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    reducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducedMotionRef.current) {
      // CSS handles this globally, but reveal pending elements immediately as well
      pendingRef.current.forEach(({ el }) => el.classList.add('revealed'));
      pendingRef.current = [];
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add('revealed');
          // Remove will-change after the CSS transition completes (perf cleanup)
          el.addEventListener(
            'transitionend',
            () => { el.style.willChange = 'auto'; },
            { once: true }
          );
          observerRef.current?.unobserve(el);
        });
      },
      { threshold, rootMargin }
    );

    // Drain any elements that registered before observer was ready
    pendingRef.current.forEach(({ el, delay }) => {
      if (delay > 0) el.style.transitionDelay = `${delay}ms`;
      observerRef.current?.observe(el);
    });
    pendingRef.current = [];

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin]);

  /**
   * Returns a ref callback for an element with an optional stagger `delay` (ms).
   * Pass the result directly to the `ref` prop:
   *   <div ref={revealRef(100)} className="scroll-reveal">
   */
  const revealRef = useCallback(
    (delay = 0) =>
      (el: HTMLElement | null) => {
        if (!el) return;
        // Already revealed on a previous render — skip
        if (el.classList.contains('revealed')) return;

        if (reducedMotionRef.current) {
          el.classList.add('revealed');
          return;
        }

        if (observerRef.current) {
          if (delay > 0) el.style.transitionDelay = `${delay}ms`;
          observerRef.current.observe(el);
        } else {
          // Observer not yet initialised — queue (deduplicate by element reference)
          if (!pendingRef.current.some((p) => p.el === el)) {
            pendingRef.current.push({ el, delay });
          }
        }
      },
    []
  );

  return { revealRef };
}
