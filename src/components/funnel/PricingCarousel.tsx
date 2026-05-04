'use client';

import { useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PricingCarouselProps {
  children: ReactNode;
  /** Optional className for the outermost wrapper */
  className?: string;
  /** Index of the plan to show initially on mobile (default: 0) */
  defaultIndex?: number;
}

/**
 * Safely call scrollIntoView — the method is absent in jsdom/test environments.
 */
function safeScrollIntoView(el: HTMLElement | null, options?: ScrollIntoViewOptions) {
  if (el && typeof el.scrollIntoView === 'function') {
    el.scrollIntoView(options);
  }
}

/**
 * Mobile-first pricing card layout.
 *
 * - **Mobile (< md)**: horizontal scroll-snap carousel with dot indicators.
 *   Each card is ~85vw wide so the next card peeks in, inviting a swipe.
 * - **Desktop (md+)**: normal 3-column grid, unchanged from before.
 *
 * Uses IntersectionObserver to track which card is centered → updates dot
 * indicators and fires an optional `onActiveChange` callback.
 */
export default function PricingCarousel({
  children,
  className,
  defaultIndex = 0,
}: PricingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const isScrollingRef = useRef(false);

  const childArray = Array.isArray(children) ? children : [children];
  const childCount = childArray.length;

  // ── Track centered card via IntersectionObserver ────────────────────────
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('[data-plan-card]');
    if (cards.length === 0) return;

    const observers: IntersectionObserver[] = [];

    cards.forEach((card, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActiveIndex(index);
          }
        },
        {
          root: container,
          threshold: 0.6,
        },
      );
      observer.observe(card);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [childCount]);

  // ── Scroll to default card on first mount ───────────────────────────────
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('[data-plan-card]');
    if (cards[defaultIndex]) {
      // Use requestAnimationFrame to ensure layout is settled
      requestAnimationFrame(() => {
        safeScrollIntoView(cards[defaultIndex], {
          behavior: 'auto',
          block: 'nearest',
          inline: 'center',
        });
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Programmatic scroll to a specific card ──────────────────────────────
  const scrollToCard = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('[data-plan-card]');
    if (cards[index]) {
      isScrollingRef.current = true;
      safeScrollIntoView(cards[index], {
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      // Reset scroll flag after animation completes (~350ms)
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 400);
    }
  }, []);

  return (
    <div className={className}>
      {/* ── Mobile: horizontal scroll carousel ──────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:hidden scrollbar-hide -mx-4 px-4 pb-2"
        style={{ WebkitOverflowScrolling: 'touch' }}
        role="list"
        aria-label="Pricing plans"
      >
        {childArray.map((child, i) => (
          <div
            key={i}
            data-plan-card
            className="flex-shrink-0 w-[85vw] max-w-[360px] snap-center"
            role="listitem"
          >
            {child}
          </div>
        ))}
      </div>

      {/* ── Desktop: normal 3-column grid ───────────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6">
        {children}
      </div>

      {/* ── Dot indicators (mobile only) ────────────────────────────────── */}
      {childCount > 1 && (
        <div
          className="flex justify-center items-center gap-2 mt-4 md:hidden"
          role="tablist"
          aria-label="Plan navigation"
        >
          {Array.from({ length: childCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`View plan ${i + 1} of ${childCount}`}
              className={cn(
                'h-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2',
                i === activeIndex
                  ? 'bg-green-500 w-6'
                  : 'bg-stone-300 w-2 hover:bg-stone-400',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
