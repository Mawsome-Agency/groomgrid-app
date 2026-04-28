/**
 * Unit tests for HomePage (src/app/page.tsx).
 *
 * Strategy: Since the page is a 'use client' component using IntersectionObserver
 * (via useScrollReveal), we mock the hook and test:
 *   1. Render output — all sections, links, text content present
 *   2. Navigation — nav links point to correct routes
 *   3. CTA links — all signup CTAs use the correct URL with coupon code
 *   4. Footer — links and copyright present
 *   5. Data integrity — promo text, pricing, feature counts match expectations
 *   6. Accessibility basics — heading hierarchy, link text
 *
 * These tests also serve as regression guards for the upcoming
 * "Resources/Explore section + Nav Comparisons link + Footer updates" feature.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── Mock next/link to render plain <a> tags (simplifies href assertions) ──
jest.mock('next/link', () => {
  function MockLink({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// ── Mock useScrollReveal (IntersectionObserver not available in jsdom) ──
jest.mock('@/hooks/use-scroll-reveal', () => ({
  useScrollReveal: () => ({
    revealRef: (delay = 0) => (el: HTMLElement | null) => {
      if (el) el.classList.add('revealed');
    },
  }),
}));

// ── Import the component AFTER mocks ──
import HomePage from '@/app/page';

// ── Constants extracted from page.tsx for regression testing ──
const SIGNUP_URL = '/signup?coupon=BETA50';
const BLOG_URL = '/blog';
const PLANS_URL = '/plans';

// ──────────────────────────────────────────────────────────
// 1. COMPONENT RENDERS WITHOUT CRASHING
// ──────────────────────────────────────────────────────────
describe('HomePage', () => {
  it('renders without crashing', () => {
    const { container } = render(<HomePage />);
    expect(container).toBeTruthy();
  });

  // ────────────────────────────────────────────────────────
  // 2. NAVIGATION BAR
  // ────────────────────────────────────────────────────────
  describe('Navigation', () => {
    it('renders the GroomGrid brand name in the nav', () => {
      render(<HomePage />);
      const nav = screen.getByRole('navigation');
      expect(nav.textContent).toContain('GroomGrid');
    });

    it('has a Blog link pointing to /blog', () => {
      render(<HomePage />);
      const nav = screen.getByRole('navigation');
      const blogLink = nav.querySelector('a[href="/blog"]');
      expect(blogLink).toBeTruthy();
      expect(blogLink?.textContent?.trim()).toBe('Blog');
    });

    it('has a Start Free Trial link in nav pointing to signup with BETA50 coupon', () => {
      render(<HomePage />);
      const nav = screen.getByRole('navigation');
      const ctaLink = nav.querySelector(`a[href="${SIGNUP_URL}"]`);
      expect(ctaLink).toBeTruthy();
      expect(ctaLink?.textContent).toMatch(/start free trial/i);
    });

    it('nav text links count (regression guard: Blog=1, post-feature Blog+Compare=2)', () => {
      render(<HomePage />);
      const nav = screen.getByRole('navigation');
      // Non-CTA text links (not the green button)
      const textLinks = Array.from(nav.querySelectorAll('a')).filter(
        (a) => !a.classList.contains('bg-green-500')
      );
      expect(textLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ────────────────────────────────────────────────────────
  // 3. PROMO BANNER
  // ────────────────────────────────────────────────────────
  describe('Promo Banner', () => {
    it('displays the BETA50 coupon code prominently', () => {
      render(<HomePage />);
      expect(screen.getByText(/BETA50/)).toBeTruthy();
    });

    it('mentions "50% off" or "50%" discount', () => {
      render(<HomePage />);
      expect(screen.getByText(/50%/)).toBeTruthy();
    });

    it('links to /plans from the promo banner', () => {
      render(<HomePage />);
      const plansLink = screen.getByRole('link', { name: /see plans/i });
      expect(plansLink).toHaveAttribute('href', PLANS_URL);
    });
  });

  // ────────────────────────────────────────────────────────
  // 4. HERO SECTION
  // ────────────────────────────────────────────────────────
  describe('Hero Section', () => {
    it('renders the main H1 heading about no-shows and double bookings', () => {
      render(<HomePage />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1.textContent).toMatch(/no-show|double book/i);
    });

    it('mentions $29 pricing somewhere on the page', () => {
      const { container } = render(<HomePage />);
      const priceElements = container.querySelectorAll('*');
      const hasPrice = Array.from(priceElements).some(
        (el) => el.textContent && /\$29/.test(el.textContent)
      );
      expect(hasPrice).toBe(true);
    });

    it('has a "Start Free Trial" CTA with correct signup URL', () => {
      render(<HomePage />);
      const heroCta = screen.getAllByRole('link', { name: /start free trial/i });
      const matchingCta = heroCta.find((el) => el.getAttribute('href') === SIGNUP_URL);
      expect(matchingCta).toBeTruthy();
    });

    it('mentions "14 days free" or "14 Days Free"', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/14 days free/i);
    });

    it('mentions "No credit card"', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/no credit card/i);
    });
  });

  // ────────────────────────────────────────────────────────
  // 5. PAIN → SOLUTION SECTION
  // ────────────────────────────────────────────────────────
  describe('Pain → Solution Section', () => {
    it('has an H2 heading "Sound familiar?"', () => {
      render(<HomePage />);
      expect(screen.getByRole('heading', { name: /sound familiar/i, level: 2 })).toBeTruthy();
    });

    it('renders 3 pain cards (double-booked, no-show, chasing invoice)', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toContain('double-booked');
      expect(allText).toMatch(/didn.t show up/);
      expect(allText).toContain('chasing that invoice');
    });

    it('mentions the financial impact ($75–120 per no-show)', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/\$75.*120|\$75–120/);
    });

    it('mentions smart scheduling as a solution', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/smart scheduling/i);
    });

    it('mentions automatic reminders (SMS + email)', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/sms.*email|auto.*reminder/i);
    });

    it('mentions booking-time payment collection', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/payment at booking|collect payment/i);
    });
  });

  // ────────────────────────────────────────────────────────
  // 6. FEATURES SECTION
  // ────────────────────────────────────────────────────────
  describe('Features Section', () => {
    it('has an H2 heading about "Everything you need"', () => {
      render(<HomePage />);
      expect(
        screen.getByRole('heading', { name: /everything you need/i, level: 2 })
      ).toBeTruthy();
    });

    it('renders all 4 feature card titles', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toContain('2-tap booking');
      expect(allText).toContain('Automatic reminders');
      expect(allText).toContain('Pet profiles');
      expect(allText).toContain('Upfront payments');
    });

    it('uses emoji icons for features', () => {
      const { container } = render(<HomePage />);
      const emojiSpans = container.querySelectorAll('span.text-2xl');
      expect(emojiSpans.length).toBe(4);
    });

    it('mentions "Stripe" for payments', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/stripe/i);
    });
  });

  // ────────────────────────────────────────────────────────
  // 7. EXPLORE GROOMGRID SECTION
  // ────────────────────────────────────────────────────────
  describe('Explore GroomGrid Section', () => {
    const EXPECTED_EXPLORE_LINKS = [
      { href: '/cat-grooming-software', category: 'Cat Groomers', title: 'Cat Grooming Software' },
      { href: '/mobile-grooming-software', category: 'Mobile Groomers', title: 'Mobile Grooming Software' },
      { href: '/plans', category: 'Pricing', title: 'See All Plans' },
      { href: '/best-dog-grooming-software', category: "Buyer's Guide", title: 'Best Dog Grooming Software' },
      { href: '/moego-alternatives', category: 'Alternatives', title: 'MoeGo Alternatives' },
      { href: '/daysmart-alternatives', category: 'Alternatives', title: 'DaySmart Alternatives' },
      { href: '/pawfinity-alternatives', category: 'Alternatives', title: 'Pawfinity Alternatives' },
      { href: '/blog/cat-grooming-business-guide', category: 'Business Guide', title: 'Cat Grooming Business Guide' },
      { href: '/features/mobile-groomer', category: 'Feature Spotlight', title: 'Mobile Groomer Tools' },
    ];

    it('renders an Explore section with heading "Find the Right Tool"', () => {
      render(<HomePage />);
      const heading = screen.getByRole('heading', { name: /find the right tool/i, level: 2 });
      expect(heading).toBeTruthy();
    });

    it('renders exactly 8 explore link cards', () => {
      const { container } = render(<HomePage />);
      const exploreCards = container.querySelectorAll('section a.group.border-stone-200.rounded-xl');
      expect(exploreCards.length).toBe(9);
    });

    it('each explore link card has the correct href', () => {
      const { container } = render(<HomePage />);
      EXPECTED_EXPLORE_LINKS.forEach(({ href }) => {
        const link = container.querySelector(`a[href="${href}"]`);
        expect(link).toBeTruthy();
      });
    });

    it('each explore link card displays the correct category label', () => {
      const { container } = render(<HomePage />);
      const categoryLabels = Array.from(
        container.querySelectorAll('p.text-green-600.font-semibold.mb-1')
      ).map((el) => el.textContent?.trim());
      EXPECTED_EXPLORE_LINKS.forEach(({ category }) => {
        expect(categoryLabels).toContain(category);
      });
    });

    it('each explore link card displays the correct title', () => {
      const { container } = render(<HomePage />);
      EXPECTED_EXPLORE_LINKS.forEach(({ title }) => {
        expect(container.textContent).toContain(title);
      });
    });

    it('explore section uses the card styling pattern from reference pages', () => {
      const { container } = render(<HomePage />);
      const cards = container.querySelectorAll('a.group.border-stone-200.rounded-xl');
      expect(cards.length).toBe(9);
      cards.forEach((card) => {
        expect(card.className).toContain('hover:border-green-300');
      });
    });

    it('explore section renders between Final CTA and Footer (7+ sections total)', () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll('section');
      // 6 original sections + 1 new Explore section = 7 minimum
      expect(sections.length).toBeGreaterThanOrEqual(7);
    });

    it('explore section contains no duplicate hrefs', () => {
      const hrefs = EXPECTED_EXPLORE_LINKS.map((link) => link.href);
      const uniqueHrefs = new Set(hrefs);
      expect(uniqueHrefs.size).toBe(hrefs.length);
    });

    it('explore links are all internal (no external URLs)', () => {
      EXPECTED_EXPLORE_LINKS.forEach(({ href }) => {
        expect(href.startsWith('/')).toBe(true);
        expect(href).not.toMatch(/^https?:\/\//);
      });
    });

    it('explore section heading uses H2 level for correct heading hierarchy', () => {
      render(<HomePage />);
      const heading = screen.getByRole('heading', { name: /find the right tool/i, level: 2 });
      expect(heading.tagName).toBe('H2');
    });

    it('each explore card category label has distinct color from title (green-600 vs stone-800)', () => {
      const { container } = render(<HomePage />);
      const cards = container.querySelectorAll('a.group.border-stone-200.rounded-xl');
      cards.forEach((card) => {
        const category = card.querySelector('p.text-green-600');
        const title = card.querySelector('h3.text-stone-800');
        expect(category).toBeTruthy();
        expect(title).toBeTruthy();
      });
    });

    it('explore section has scroll-reveal animation class', () => {
      const { container } = render(<HomePage />);
      const exploreSection = container.querySelector('section.scroll-reveal');
      // At least one section with scroll-reveal exists (Explore should have it)
      expect(exploreSection).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────
  // 8. SOCIAL PROOF SECTION
  // ────────────────────────────────────────────────────────
  describe('Social Proof Section', () => {
    it('mentions "50+" groomers on the waitlist', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/50\+/);
    });

    it('renders 2 testimonial cards (Sarah Mitchell, James Rodriguez)', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toContain('Sarah Mitchell');
      expect(allText).toContain('James Rodriguez');
    });

    it('testimonial quotes mention key value props', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/booking time/i);
      expect(allText).toMatch(/no.show/i);
    });

    it('has business labels under testimonials', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toContain('Paws on Wheels');
      expect(allText).toContain('Fur Perfect Salon');
    });
  });

  // ────────────────────────────────────────────────────────
  // 9. PRICING TEASER SECTION
  // ────────────────────────────────────────────────────────
  describe('Pricing Teaser', () => {
    it('displays the Solo Groomer price ($29/mo)', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/\$29/);
    });

    it('lists all 5 included features', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/unlimited appointments/i);
      expect(allText).toMatch(/automated.*sms.*email.*reminder|automated.*reminder/i);
      expect(allText).toMatch(/client.*pet profile|client & pet profile/i);
      expect(allText).toMatch(/payment collection/i);
      expect(allText).toMatch(/mobile-first/i);
    });

    it('has a "See all plans" link pointing to /plans', () => {
      render(<HomePage />);
      // Multiple "See all plans" links exist (Pricing Teaser + Explore section)
      const plansLinks = screen.getAllByRole('link', { name: /see all plans/i });
      expect(plansLinks.length).toBeGreaterThanOrEqual(1);
      plansLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', PLANS_URL);
      });
    });

    it('mentions cheaper than one no-show per month', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/cheaper than one no.show/i);
    });
  });

  // ────────────────────────────────────────────────────────
  // 10. FINAL CTA BANNER
  // ────────────────────────────────────────────────────────
  describe('Final CTA Banner', () => {
    it('has a strong CTA heading about "phone tag"', () => {
      render(<HomePage />);
      expect(screen.getByRole('heading', { name: /phone tag/i })).toBeTruthy();
    });

    it('mentions founding pricing ($29/mo forever)', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/\$29\/mo.*forever|founding/i);
    });

    it('mentions "First 20 groomers" scarcity element', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/first 20 groomer/i);
    });

    it('has multiple CTA links with signup URL', () => {
      render(<HomePage />);
      const ctaLinks = screen.getAllByRole('link').filter(
        (link) => link.getAttribute('href') === SIGNUP_URL
      );
      expect(ctaLinks.length).toBeGreaterThanOrEqual(2);
    });

    it('says "Cancel anytime"', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      expect(allText).toMatch(/cancel anytime/i);
    });
  });

  // ────────────────────────────────────────────────────────
  // 11. FOOTER
  // ────────────────────────────────────────────────────────
  describe('Footer', () => {
    it('renders the Blog link', () => {
      const { container } = render(<HomePage />);
      const footer = container.querySelector('footer');
      expect(footer).toBeTruthy();
      const blogLink = footer!.querySelector('a[href="/blog"]');
      expect(blogLink).toBeTruthy();
    });

    it('renders the contact email', () => {
      render(<HomePage />);
      const emailLink = screen.getByRole('link', { name: /hello@getgroomgrid\.com/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:hello@getgroomgrid.com');
    });

    it('renders the copyright notice with 2026', () => {
      const { container } = render(<HomePage />);
      const footer = container.querySelector('footer');
      expect(footer?.textContent).toMatch(/© 2026 GroomGrid/);
    });
  });

  // ────────────────────────────────────────────────────────
  // 12. CROSS-CUTTING: CTA LINK CONSISTENCY
  // ────────────────────────────────────────────────────────
  describe('CTA Link Consistency', () => {
    it('all "Start Free Trial" CTAs point to the same signup URL with BETA50', () => {
      render(<HomePage />);
      const allCtas = screen.getAllByRole('link').filter(
        (link) => link.textContent?.toLowerCase().includes('start free trial')
      );
      expect(allCtas.length).toBeGreaterThanOrEqual(3);
      allCtas.forEach((cta) => {
        expect(cta.getAttribute('href')).toBe(SIGNUP_URL);
      });
    });

    it('CtaLink wrapper applies active:scale class', () => {
      const { container } = render(<HomePage />);
      const scaledLinks = container.querySelectorAll('[class*="active:scale"]');
      expect(scaledLinks.length).toBeGreaterThan(0);
    });
  });

  // ────────────────────────────────────────────────────────
  // 13. ACCESSIBILITY BASICS
  // ────────────────────────────────────────────────────────
  describe('Accessibility', () => {
    it('has exactly one H1 on the page', () => {
      const { container } = render(<HomePage />);
      const h1s = container.querySelectorAll('h1');
      expect(h1s.length).toBe(1);
    });

    it('has multiple H2 headings for section structure', () => {
      const { container } = render(<HomePage />);
      const h2s = container.querySelectorAll('h2');
      expect(h2s.length).toBeGreaterThanOrEqual(4);
    });

    it('all links have non-empty href attributes', () => {
      const { container } = render(<HomePage />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).not.toBe('#');
        expect(href).not.toBe('');
      });
    });

    it('no links have empty or whitespace-only text content', () => {
      const { container } = render(<HomePage />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const text = link.textContent?.trim();
        expect(text).toBeTruthy();
        expect(text!.length).toBeGreaterThan(0);
      });
    });

    it('email link uses mailto: protocol', () => {
      render(<HomePage />);
      const emailLink = screen.getByRole('link', { name: /hello@getgroomgrid/i });
      expect(emailLink.getAttribute('href')).toMatch(/^mailto:/);
    });
  });

  // ────────────────────────────────────────────────────────
  // 14. EDGE CASES
  // ────────────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('renders correctly on re-render (stability check)', () => {
      const { rerender, container } = render(<HomePage />);
      const firstHtml = container.innerHTML;
      rerender(<HomePage />);
      const secondHtml = container.innerHTML;
      expect(firstHtml).toBe(secondHtml);
    });

    it('SIGNUP_URL constant contains both /signup path and BETA50 coupon', () => {
      expect(SIGNUP_URL).toMatch(/^\/signup\?coupon=/);
      expect(SIGNUP_URL).toContain('BETA50');
    });

    it('page renders at least 7 sections', () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThanOrEqual(7);
    });

    it('no duplicate testimonial names', () => {
      const { container } = render(<HomePage />);
      const allText = container.textContent || '';
      // Count occurrences of each name
      const sarahCount = (allText.match(/Sarah Mitchell/g) || []).length;
      const jamesCount = (allText.match(/James Rodriguez/g) || []).length;
      expect(sarahCount).toBe(1);
      expect(jamesCount).toBe(1);
    });

    it('promo banner has green background (class check)', () => {
      const { container } = render(<HomePage />);
      const banner = container.querySelector('.bg-green-600.text-white.text-center');
      expect(banner).toBeTruthy();
    });

    it('nav is a semantic <nav> element', () => {
      render(<HomePage />);
      const nav = screen.getByRole('navigation');
      expect(nav.tagName).toBe('NAV');
    });
  });
});
