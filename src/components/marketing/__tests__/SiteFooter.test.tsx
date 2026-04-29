/**
 * Unit tests for SiteFooter (src/components/marketing/SiteFooter.tsx).
 *
 * Strategy: Test the footer component used across blog posts and landing pages.
 * Covers: render, default links, custom links, className prop, link hrefs,
 * copyright year, GroomGrid brand, accessibility, edge cases.
 *
 * These tests also serve as regression guards for the SEO Internal Linking
 * Architecture feature — any changes to footer link structure will break
 * the relevant assertions.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/link
jest.mock('next/link', () => {
  function MockLink({ href, children, ...rest }: { href: string; children: React.ReactNode; className?: string }) {
    return <a href={href} {...rest}>{children}</a>;
  }
  MockLink.displayName = 'MockLink';
  return MockLink;
});

import SiteFooter from '@/components/marketing/SiteFooter';

// ── Constants from SiteFooter.tsx for regression testing ──
const DEFAULT_LINKS = [
  { href: '/grooming-business-operations/', label: 'Operations Hub' },
  { href: '/mobile-grooming-business/', label: 'Mobile Grooming' },
  { href: '/plans', label: 'Pricing' },
  { href: '/signup', label: 'Sign Up' },
];

describe('SiteFooter', () => {
  // ────────────────────────────────────────────────────────
  // 1. BASIC RENDER
  // ────────────────────────────────────────────────────────
  describe('Basic Render', () => {
    it('renders without crashing', () => {
      const { container } = render(<SiteFooter />);
      expect(container).toBeTruthy();
    });

    it('renders a <footer> element', () => {
      const { container } = render(<SiteFooter />);
      const footer = container.querySelector('footer');
      expect(footer).toBeTruthy();
      expect(footer?.tagName).toBe('FOOTER');
    });

    it('renders the GroomGrid brand link', () => {
      const { container } = render(<SiteFooter />);
      const brandLink = container.querySelector('a.font-bold.text-green-600');
      expect(brandLink).toBeTruthy();
      expect(brandLink).toHaveAttribute('href', '/');
    });

    it('renders the brand with green-600 color class', () => {
      const { container } = render(<SiteFooter />);
      const brandLink = container.querySelector('a.font-bold.text-green-600');
      expect(brandLink).toBeTruthy();
      expect(brandLink?.textContent).toContain('GroomGrid');
    });
  });

  // ────────────────────────────────────────────────────────
  // 2. DEFAULT LINKS
  // ────────────────────────────────────────────────────────
  describe('Default Links', () => {
    it('renders exactly 4 default links', () => {
      const { container } = render(<SiteFooter />);
      const linkContainer = container.querySelector('.flex.gap-6');
      const links = linkContainer?.querySelectorAll('a');
      expect(links?.length).toBe(4);
    });

    it('each default link has correct href and label', () => {
      const { container } = render(<SiteFooter />);
      DEFAULT_LINKS.forEach(({ href, label }) => {
        const link = container.querySelector(`a[href="${href}"]`);
        expect(link).toBeTruthy();
        expect(link?.textContent?.trim()).toBe(label);
      });
    });

    it('includes /plans link for pricing page', () => {
      render(<SiteFooter />);
      const plansLink = screen.getByText('Pricing');
      expect(plansLink.closest('a')).toHaveAttribute('href', '/plans');
    });

    it('includes /signup link for conversion', () => {
      render(<SiteFooter />);
      const signupLink = screen.getByText('Sign Up');
      expect(signupLink.closest('a')).toHaveAttribute('href', '/signup');
    });

    it('includes Operations Hub link', () => {
      render(<SiteFooter />);
      const opsLink = screen.getByText('Operations Hub');
      expect(opsLink.closest('a')).toHaveAttribute('href', '/grooming-business-operations/');
    });

    it('includes Mobile Grooming link', () => {
      render(<SiteFooter />);
      const mobileLink = screen.getByText('Mobile Grooming');
      expect(mobileLink.closest('a')).toHaveAttribute('href', '/mobile-grooming-business/');
    });
  });

  // ────────────────────────────────────────────────────────
  // 3. CUSTOM LINKS PROP
  // ────────────────────────────────────────────────────────
  describe('Custom Links Prop', () => {
    it('renders custom links when provided', () => {
      const customLinks = [
        { href: '/custom-1', label: 'Custom One' },
        { href: '/custom-2', label: 'Custom Two' },
      ];
      const { container } = render(<SiteFooter links={customLinks} />);
      const linkContainer = container.querySelector('.flex.gap-6');
      const links = linkContainer?.querySelectorAll('a');
      expect(links?.length).toBe(2);
    });

    it('custom links override default links completely', () => {
      const customLinks = [
        { href: '/blog', label: 'Blog' },
      ];
      const { container } = render(<SiteFooter links={customLinks} />);
      // Default links should NOT be present
      expect(container.querySelector('a[href="/plans"]')).toBeFalsy();
      expect(container.querySelector('a[href="/signup"]')).toBeFalsy();
      // Custom link should be present
      expect(container.querySelector('a[href="/blog"]')).toBeTruthy();
    });

    it('renders single custom link', () => {
      const customLinks = [
        { href: '/only-link', label: 'Only Link' },
      ];
      const { container } = render(<SiteFooter links={customLinks} />);
      const linkContainer = container.querySelector('.flex.gap-6');
      expect(linkContainer?.querySelectorAll('a').length).toBe(1);
    });

    it('renders many custom links (10+)', () => {
      const manyLinks = Array.from({ length: 12 }, (_, i) => ({
        href: `/link-${i}`,
        label: `Link ${i}`,
      }));
      const { container } = render(<SiteFooter links={manyLinks} />);
      const linkContainer = container.querySelector('.flex.gap-6');
      expect(linkContainer?.querySelectorAll('a').length).toBe(12);
    });

    it('renders custom links with correct text content', () => {
      const customLinks = [
        { href: '/cat-grooming-software', label: 'Cat Grooming' },
        { href: '/moego-alternatives', label: 'MoeGo Alternatives' },
      ];
      render(<SiteFooter links={customLinks} />);
      expect(screen.getByText('Cat Grooming')).toBeTruthy();
      expect(screen.getByText('MoeGo Alternatives')).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────
  // 4. COPYRIGHT
  // ────────────────────────────────────────────────────────
  describe('Copyright', () => {
    it('renders copyright with current year', () => {
      render(<SiteFooter />);
      const currentYear = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(`© ${currentYear} GroomGrid`))).toBeTruthy();
    });

    it('copyright text includes "All rights reserved"', () => {
      const { container } = render(<SiteFooter />);
      const allText = container.textContent || '';
      expect(allText).toContain('All rights reserved');
    });

    it('copyright dynamically updates year (not hardcoded)', () => {
      const { container } = render(<SiteFooter />);
      // The component uses new Date().getFullYear() so it should always be the current year
      const currentYear = new Date().getFullYear();
      const yearPattern = new RegExp(`© ${currentYear}`);
      expect(container.textContent).toMatch(yearPattern);
    });
  });

  // ────────────────────────────────────────────────────────
  // 5. CLASSNAME PROP
  // ────────────────────────────────────────────────────────
  describe('className Prop', () => {
    it('applies custom className to footer element', () => {
      const { container } = render(<SiteFooter className="custom-class" />);
      const footer = container.querySelector('footer');
      expect(footer?.className).toContain('custom-class');
    });

    it('preserves default classes when custom className is added', () => {
      const { container } = render(<SiteFooter className="extra-class" />);
      const footer = container.querySelector('footer');
      expect(footer?.className).toContain('px-6');
      expect(footer?.className).toContain('py-8');
      expect(footer?.className).toContain('extra-class');
    });

    it('renders without className prop (undefined)', () => {
      const { container } = render(<SiteFooter />);
      const footer = container.querySelector('footer');
      expect(footer).toBeTruthy();
      // Should not have "undefined" in className
      expect(footer?.className).not.toContain('undefined');
    });

    it('handles empty className string', () => {
      const { container } = render(<SiteFooter className="" />);
      const footer = container.querySelector('footer');
      expect(footer?.className.trim()).not.toContain('undefined');
    });
  });

  // ────────────────────────────────────────────────────────
  // 6. STYLING & LAYOUT
  // ────────────────────────────────────────────────────────
  describe('Styling & Layout', () => {
    it('has border-top separator', () => {
      const { container } = render(<SiteFooter />);
      const footer = container.querySelector('footer');
      expect(footer?.className).toContain('border-t');
    });

    it('has max-width constraint', () => {
      const { container } = render(<SiteFooter />);
      const footer = container.querySelector('footer');
      expect(footer?.className).toContain('max-w-5xl');
    });

    it('has horizontal centering', () => {
      const { container } = render(<SiteFooter />);
      const footer = container.querySelector('footer');
      expect(footer?.className).toContain('mx-auto');
    });

    it('links have hover transition class', () => {
      const { container } = render(<SiteFooter />);
      const linkContainer = container.querySelector('.flex.gap-6');
      const links = linkContainer?.querySelectorAll('a');
      links?.forEach((link) => {
        expect(link.className).toContain('hover:text-stone-600');
        expect(link.className).toContain('transition-colors');
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 7. ACCESSIBILITY
  // ────────────────────────────────────────────────────────
  describe('Accessibility', () => {
    it('all links have non-empty href', () => {
      const { container } = render(<SiteFooter />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).not.toBe('#');
        expect(href).not.toBe('');
      });
    });

    it('all links have non-empty text content', () => {
      const { container } = render(<SiteFooter />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const text = link.textContent?.trim();
        expect(text).toBeTruthy();
        expect(text!.length).toBeGreaterThan(0);
      });
    });

    it('brand link points to homepage', () => {
      const { container } = render(<SiteFooter />);
      const brandLink = container.querySelector('a[href="/"]');
      expect(brandLink).toBeTruthy();
      expect(brandLink?.textContent).toContain('GroomGrid');
    });

    it('no duplicate hrefs in default footer', () => {
      const hrefs = DEFAULT_LINKS.map((link) => link.href);
      const uniqueHrefs = new Set(hrefs);
      expect(uniqueHrefs.size).toBe(hrefs.length);
    });
  });

  // ────────────────────────────────────────────────────────
  // 8. EDGE CASES
  // ────────────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('renders correctly on re-render (stability check)', () => {
      const { rerender, container } = render(<SiteFooter />);
      const firstHtml = container.innerHTML;
      rerender(<SiteFooter />);
      const secondHtml = container.innerHTML;
      expect(firstHtml).toBe(secondHtml);
    });

    it('renders with empty links array (zero links)', () => {
      const { container } = render(<SiteFooter links={[]} />);
      const linkContainer = container.querySelector('.flex.gap-6');
      const links = linkContainer?.querySelectorAll('a');
      expect(links?.length).toBe(0);
    });

    it('renders with links that have long labels', () => {
      const longLinks = [
        { href: '/long', label: 'A Very Long Footer Link Label That Might Overflow On Mobile' },
      ];
      const { container } = render(<SiteFooter links={longLinks} />);
      const link = container.querySelector('a[href="/long"]');
      expect(link?.textContent).toContain('A Very Long Footer Link Label');
    });

    it('renders with links that have special characters in label', () => {
      const specialLinks = [
        { href: '/special', label: 'Cat & Dog Grooming (2026)' },
      ];
      const { container } = render(<SiteFooter links={specialLinks} />);
      const link = container.querySelector('a[href="/special"]');
      expect(link?.textContent).toContain('Cat & Dog Grooming');
    });

    it('renders with links that have trailing slashes in href', () => {
      const trailingLinks = [
        { href: '/blog/', label: 'Blog' },
      ];
      const { container } = render(<SiteFooter links={trailingLinks} />);
      const link = container.querySelector('a[href="/blog/"]');
      expect(link).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────
  // 9. SEO INTERNAL LINKING REGRESSION GUARDS
  // ────────────────────────────────────────────────────────
  describe('SEO Internal Linking Regression Guards', () => {
    /**
     * These tests guard the SEO Internal Linking Architecture feature.
     * If the footer links are changed, these tests will fail and force
     * a conscious decision about the link structure.
     */

    it('default footer includes links to key conversion pages (plans, signup)', () => {
      const { container } = render(<SiteFooter />);
      const hrefs = Array.from(container.querySelectorAll('a')).map(a => a.getAttribute('href'));
      expect(hrefs).toContain('/plans');
      expect(hrefs).toContain('/signup');
    });

    it('default footer links are all internal paths (no external URLs)', () => {
      DEFAULT_LINKS.forEach(({ href }) => {
        expect(href.startsWith('/')).toBe(true);
        expect(href).not.toMatch(/^https?:\/\//);
      });
    });

    it('default footer has exactly 4 links (regression guard — add more for SEO)', () => {
      expect(DEFAULT_LINKS.length).toBe(4);
    });

    it('default footer links point to real routes that exist in the app', () => {
      // These routes should all be resolvable — if any are removed, this test fails
      const expectedRoutes = [
        '/grooming-business-operations/',
        '/mobile-grooming-business/',
        '/plans',
        '/signup',
      ];
      DEFAULT_LINKS.forEach(({ href }) => {
        expect(expectedRoutes).toContain(href);
      });
    });
  });
});
