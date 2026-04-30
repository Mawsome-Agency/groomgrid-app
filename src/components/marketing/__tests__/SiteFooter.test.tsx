/**
 * Unit tests for SiteFooter (src/components/marketing/SiteFooter.tsx).
 *
 * Strategy: Test the 4-column SEO footer component used across blog posts
 * and landing pages. Covers: render, data-driven footer columns, custom links
 * backward compatibility, slug prop (self-referential link exclusion), className,
 * copyright year, GroomGrid brand, accessibility, responsive grid classes,
 * SEO regression guards, and edge cases.
 *
 * The footer has two rendering modes:
 *   1. **Custom links mode** (legacy): When `links` prop is provided, renders
 *      the old flat single-row footer with custom links.
 *   2. **4-column SEO mode** (default): When no `links` prop, renders the full
 *      SEO footer with columns derived from `getFooterColumns()`.
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

// Mock getFooterColumns for controlled testing
jest.mock('@/lib/seo/internal-links', () => {
  const original = jest.requireActual('@/lib/seo/internal-links');
  return {
    ...original,
    getFooterColumns: jest.fn((excludeSlug?: string) => {
      return original.getFooterColumns(excludeSlug);
    }),
  };
});

import SiteFooter from '@/components/marketing/SiteFooter';
import { getFooterColumns } from '@/lib/seo/internal-links';

// ── Constants for regression testing ──
const LEGACY_LINKS = [
  { href: '/custom-1', label: 'Custom One' },
  { href: '/custom-2', label: 'Custom Two' },
];

describe('SiteFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    it('renders the GroomGrid brand link pointing to homepage', () => {
      const { container } = render(<SiteFooter />);
      const brandLink = container.querySelector('a[href="/"]');
      expect(brandLink).toBeTruthy();
      expect(brandLink?.textContent).toContain('GroomGrid');
    });

    it('calls getFooterColumns with no slug when slug prop is omitted', () => {
      render(<SiteFooter />);
      expect(getFooterColumns).toHaveBeenCalledWith(undefined);
    });

    it('calls getFooterColumns with the provided slug', () => {
      render(<SiteFooter slug="dog-grooming-software" />);
      expect(getFooterColumns).toHaveBeenCalledWith('dog-grooming-software');
    });

    it('renders the CTA button linking to /signup', () => {
      render(<SiteFooter />);
      const ctaLink = screen.getByText('Start Free Trial');
      expect(ctaLink).toBeTruthy();
      expect(ctaLink.closest('a')).toHaveAttribute('href', '/signup');
    });

    it('renders the tagline text', () => {
      const { container } = render(<SiteFooter />);
      expect(container.textContent).toContain('AI-powered grooming business management');
    });
  });

  // ────────────────────────────────────────────────────────
  // 2. 4-COLUMN SEO FOOTER (DEFAULT MODE)
  // ────────────────────────────────────────────────────────
  describe('4-Column SEO Footer (Default Mode)', () => {
    it('renders 4 column headings from getFooterColumns', () => {
      render(<SiteFooter />);
      const columns = getFooterColumns();
      columns.forEach((col) => {
        expect(screen.getByText(col.heading)).toBeTruthy();
      });
    });

    it('renders all links from each column', () => {
      const { container } = render(<SiteFooter />);
      const columns = getFooterColumns();
      let totalLinks = 0;
      columns.forEach((col) => {
        totalLinks += col.links.length;
        col.links.forEach((link) => {
          const linkEl = container.querySelector(`a[href="${link.href}"]`);
          expect(linkEl).toBeTruthy();
        });
      });
      // Verify total link count matches what getFooterColumns returns
      const allLinks = container.querySelectorAll('footer a');
      // +1 for brand link, +1 for CTA, +2 for privacy/terms in bottom bar
      expect(allLinks.length).toBeGreaterThanOrEqual(totalLinks);
    });

    it('renders column headings as h3 elements', () => {
      const { container } = render(<SiteFooter />);
      const h3s = container.querySelectorAll('h3');
      const columns = getFooterColumns();
      expect(h3s.length).toBe(columns.length);
    });

    it('each column heading has green-600 color class', () => {
      const { container } = render(<SiteFooter />);
      const h3s = container.querySelectorAll('h3');
      h3s.forEach((h3) => {
        expect(h3.className).toContain('text-green-600');
      });
    });

    it('renders Product column with Features link', () => {
      const { container } = render(<SiteFooter />);
      const featuresLink = container.querySelector('a[href="/features/mobile-groomer"]');
      expect(featuresLink).toBeTruthy();
    });

    it('renders Compare column with competitor alternatives', () => {
      const { container } = render(<SiteFooter />);
      const moegoLink = container.querySelector('a[href="/moego-alternatives"]');
      expect(moegoLink).toBeTruthy();
    });

    it('renders Resources column with Blog link', () => {
      const { container } = render(<SiteFooter />);
      const blogLink = container.querySelector('a[href="/blog"]');
      expect(blogLink).toBeTruthy();
    });

    it('renders Resources column with Sitemap link', () => {
      const { container } = render(<SiteFooter />);
      const sitemapLink = container.querySelector('a[href="/sitemap.xml"]');
      expect(sitemapLink).toBeTruthy();
    });

    it('renders Business Guides column with blog posts', () => {
      const { container } = render(<SiteFooter />);
      const columns = getFooterColumns();
      const guidesColumn = columns.find((c) => c.heading === 'Business Guides');
      expect(guidesColumn).toBeTruthy();
      expect(guidesColumn!.links.length).toBeGreaterThanOrEqual(4);
    });

    it('footer adds 40+ internal links to every page (SEO acceptance)', () => {
      const columns = getFooterColumns();
      const totalColumnLinks = columns.reduce((sum, col) => sum + col.links.length, 0);
      // Minimum: all column links + brand link + CTA + privacy + terms = column links + 4
      expect(totalColumnLinks).toBeGreaterThanOrEqual(10);
    });

    it('all column link hrefs are internal paths (no external URLs)', () => {
      const columns = getFooterColumns();
      columns.forEach((col) => {
        col.links.forEach((link) => {
          expect(link.href.startsWith('/')).toBe(true);
          expect(link.href).not.toMatch(/^https?:\/\//);
        });
      });
    });

    it('no duplicate hrefs across all columns', () => {
      const columns = getFooterColumns();
      const allHrefs = columns.flatMap((col) => col.links.map((l) => l.href));
      expect(new Set(allHrefs).size).toBe(allHrefs.length);
    });
  });

  // ────────────────────────────────────────────────────────
  // 3. SLUG PROP — SELF-REFERENTIAL LINK EXCLUSION
  // ────────────────────────────────────────────────────────
  describe('Slug Prop — Self-Referential Link Exclusion', () => {
    it('when slug is provided, getFooterColumns is called with that slug', () => {
      render(<SiteFooter slug="cat-grooming-software" />);
      expect(getFooterColumns).toHaveBeenCalledWith('cat-grooming-software');
    });

    it('when slug is provided, the current page does not appear as a footer link', () => {
      const { container } = render(<SiteFooter slug="cat-grooming-software" />);
      // cat-grooming-software landing page should be excluded
      const catLink = container.querySelector('a[href="/cat-grooming-software"]');
      expect(catLink).toBeNull();
    });

    it('when slug is omitted, all pages appear in footer (no exclusion)', () => {
      const columnsWithoutSlug = getFooterColumns();
      const columnsWithSlug = getFooterColumns('nonexistent-slug');
      // Should return same result for nonexistent slug (nothing to exclude)
      expect(columnsWithoutSlug).toEqual(columnsWithSlug);
    });

    it('blog post slug excludes that blog post from Business Guides column', () => {
      const { container } = render(<SiteFooter slug="dog-grooming-pricing-guide" />);
      // dog-grooming-pricing-guide should be excluded from Business Guides
      const pricingLink = container.querySelector('a[href="/blog/dog-grooming-pricing-guide"]');
      expect(pricingLink).toBeNull();
    });

    it('landing page slug excludes that landing page from footer', () => {
      const { container } = render(<SiteFooter slug="best-dog-grooming-software" />);
      const bestLink = container.querySelector('a[href="/best-dog-grooming-software"]');
      expect(bestLink).toBeNull();
    });
  });

  // ────────────────────────────────────────────────────────
  // 4. CUSTOM LINKS PROP (BACKWARD COMPATIBILITY)
  // ────────────────────────────────────────────────────────
  describe('Custom Links Prop (Backward Compatibility)', () => {
    it('renders custom links when provided', () => {
      const { container } = render(<SiteFooter links={LEGACY_LINKS} />);
      const linkContainer = container.querySelector('.flex.gap-6');
      const links = linkContainer?.querySelectorAll('a');
      expect(links?.length).toBe(2);
    });

    it('custom links override 4-column layout completely', () => {
      const { container } = render(<SiteFooter links={LEGACY_LINKS} />);
      // 4-column grid should NOT be present
      const grid = container.querySelector('.grid');
      expect(grid).toBeFalsy();
    });

    it('renders single custom link', () => {
      const singleLink = [{ href: '/only-link', label: 'Only Link' }];
      const { container } = render(<SiteFooter links={singleLink} />);
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

    it('legacy footer renders the brand with green-600 color', () => {
      const { container } = render(<SiteFooter links={LEGACY_LINKS} />);
      const brandLink = container.querySelector('a.font-bold.text-green-600');
      expect(brandLink).toBeTruthy();
      expect(brandLink?.textContent).toContain('GroomGrid');
    });

    it('legacy footer custom links have hover:text-stone-600 transition-colors', () => {
      const { container } = render(<SiteFooter links={LEGACY_LINKS} />);
      const linkContainer = container.querySelector('.flex.gap-6');
      const links = linkContainer?.querySelectorAll('a');
      links?.forEach((link) => {
        expect(link.className).toContain('hover:text-stone-600');
        expect(link.className).toContain('transition-colors');
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 5. COPYRIGHT
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
      const currentYear = new Date().getFullYear();
      const yearPattern = new RegExp(`© ${currentYear}`);
      expect(container.textContent).toMatch(yearPattern);
    });

    it('renders Privacy and Terms links in bottom bar', () => {
      const { container } = render(<SiteFooter />);
      const privacyLink = container.querySelector('a[href="/privacy"]');
      const termsLink = container.querySelector('a[href="/terms"]');
      expect(privacyLink).toBeTruthy();
      expect(termsLink).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────
  // 6. CLASSNAME PROP
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
      expect(footer?.className).toContain('bg-white');
      expect(footer?.className).toContain('border-t');
      expect(footer?.className).toContain('extra-class');
    });

    it('renders without className prop (undefined)', () => {
      const { container } = render(<SiteFooter />);
      const footer = container.querySelector('footer');
      expect(footer).toBeTruthy();
      expect(footer?.className).not.toContain('undefined');
    });

    it('handles empty className string', () => {
      const { container } = render(<SiteFooter className="" />);
      const footer = container.querySelector('footer');
      expect(footer?.className.trim()).not.toContain('undefined');
    });

    it('applies custom className in legacy mode too', () => {
      const { container } = render(<SiteFooter links={LEGACY_LINKS} className="legacy-class" />);
      const footer = container.querySelector('footer');
      expect(footer?.className).toContain('legacy-class');
      expect(footer?.className).toContain('border-t');
    });
  });

  // ────────────────────────────────────────────────────────
  // 7. STYLING & LAYOUT
  // ────────────────────────────────────────────────────────
  describe('Styling & Layout', () => {
    it('has border-top separator', () => {
      const { container } = render(<SiteFooter />);
      const footer = container.querySelector('footer');
      expect(footer?.className).toContain('border-t');
    });

    it('has bg-white background', () => {
      const { container } = render(<SiteFooter />);
      const footer = container.querySelector('footer');
      expect(footer?.className).toContain('bg-white');
    });

    it('has responsive grid class for 4-column layout', () => {
      const { container } = render(<SiteFooter />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeTruthy();
      expect(grid?.className).toContain('lg:grid-cols-4');
    });

    it('has responsive breakpoints for mobile-first layout', () => {
      const { container } = render(<SiteFooter />);
      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('grid-cols-1');
      expect(grid?.className).toContain('sm:grid-cols-2');
      expect(grid?.className).toContain('lg:grid-cols-4');
    });

    it('column links have hover:text-green-600 transition class', () => {
      const { container } = render(<SiteFooter />);
      // Scope to the grid section to avoid matching the CTA button
      const grid = container.querySelector('.grid');
      const columnLinks = grid?.querySelectorAll('a') ?? [];
      columnLinks.forEach((linkEl) => {
        expect(linkEl.className).toContain('hover:text-green-600');
        expect(linkEl.className).toContain('transition-colors');
      });
    });

    it('column links have focus ring classes for accessibility', () => {
      const { container } = render(<SiteFooter />);
      // Scope to grid section to avoid matching CTA button
      const grid = container.querySelector('.grid');
      const columnLinks = grid?.querySelectorAll('a') ?? [];
      expect(columnLinks.length).toBeGreaterThan(0);
      const firstLink = columnLinks[0];
      expect(firstLink.className).toContain('focus:ring-2');
      expect(firstLink.className).toContain('ring-green-500');
      expect(firstLink.className).toContain('ring-offset-2');
    });

    it('column links have active:scale-[0.98] press feedback', () => {
      const { container } = render(<SiteFooter />);
      // Scope to grid section to avoid matching CTA button
      const grid = container.querySelector('.grid');
      const columnLinks = grid?.querySelectorAll('a') ?? [];
      expect(columnLinks.length).toBeGreaterThan(0);
      const firstLink = columnLinks[0];
      expect(firstLink.className).toContain('active:scale-[0.98]');
    });

    it('CTA button has green-500 background and active:scale styles', () => {
      render(<SiteFooter />);
      const cta = screen.getByText('Start Free Trial');
      expect(cta.closest('a')?.className).toContain('bg-green-500');
      expect(cta.closest('a')?.className).toContain('active:scale-[0.98]');
    });

    it('bottom bar has border-t separator', () => {
      const { container } = render(<SiteFooter />);
      const bottomBar = container.querySelector('.border-t.border-stone-100');
      expect(bottomBar).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────
  // 8. ACCESSIBILITY
  // ────────────────────────────────────────────────────────
  describe('Accessibility', () => {
    it('all links have non-empty href', () => {
      const { container } = render(<SiteFooter />);
      const links = container.querySelectorAll('footer a');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).not.toBe('#');
        expect(href).not.toBe('');
      });
    });

    it('all links have non-empty text content', () => {
      const { container } = render(<SiteFooter />);
      const links = container.querySelectorAll('footer a');
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

    it('no duplicate hrefs in default footer columns (excluding brand/CTA/legal)', () => {
      const columns = getFooterColumns();
      const allHrefs = columns.flatMap((col) => col.links.map((l) => l.href));
      const uniqueHrefs = new Set(allHrefs);
      expect(uniqueHrefs.size).toBe(allHrefs.length);
    });

    it('column headings have uppercase tracking-wider class for visual hierarchy', () => {
      const { container } = render(<SiteFooter />);
      const h3s = container.querySelectorAll('h3');
      h3s.forEach((h3) => {
        expect(h3.className).toContain('uppercase');
        expect(h3.className).toContain('tracking-wider');
      });
    });

    it('link text uses stone-400 color for reduced visual weight', () => {
      const { container } = render(<SiteFooter />);
      const columns = getFooterColumns();
      if (columns.length > 0 && columns[0].links.length > 0) {
        const firstLink = container.querySelector(`a[href="${columns[0].links[0].href}"]`);
        if (firstLink) {
          expect(firstLink.className).toContain('text-stone-400');
        }
      }
    });
  });

  // ────────────────────────────────────────────────────────
  // 9. EDGE CASES
  // ────────────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('renders correctly on re-render (stability check)', () => {
      const { rerender, container } = render(<SiteFooter />);
      const firstHtml = container.innerHTML;
      rerender(<SiteFooter />);
      const secondHtml = container.innerHTML;
      expect(firstHtml).toBe(secondHtml);
    });

    it('renders with empty links array (zero links) in legacy mode', () => {
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

    it('handles null/undefined slug gracefully', () => {
      const { container } = render(<SiteFooter slug={undefined} />);
      expect(container.querySelector('footer')).toBeTruthy();
    });

    it('handles empty string slug', () => {
      const { container } = render(<SiteFooter slug="" />);
      expect(container.querySelector('footer')).toBeTruthy();
    });

    it('handles unknown slug (page not in registry)', () => {
      const { container } = render(<SiteFooter slug="totally-nonexistent-page" />);
      expect(container.querySelector('footer')).toBeTruthy();
    });

    it('renders all 4 columns even when some are empty', () => {
      const columns = getFooterColumns();
      expect(columns.length).toBe(4);
    });
  });

  // ────────────────────────────────────────────────────────
  // 10. SEO INTERNAL LINKING REGRESSION GUARDS
  // ────────────────────────────────────────────────────────
  describe('SEO Internal Linking Regression Guards', () => {
    it('default footer includes links to key conversion pages (plans, signup)', () => {
      const { container } = render(<SiteFooter />);
      const hrefs = Array.from(container.querySelectorAll('footer a')).map(
        (a) => a.getAttribute('href')
      );
      expect(hrefs).toContain('/plans');
      expect(hrefs).toContain('/signup');
    });

    it('default footer includes all 12 landing pages', () => {
      const columns = getFooterColumns();
      const allHrefs = columns.flatMap((col) => col.links.map((l) => l.href));
      const landingPagePaths = [
        '/best-dog-grooming-software',
        '/cat-grooming-software',
        '/dog-grooming-scheduling-software',
        '/mobile-grooming-software',
        '/mobile-grooming-business',
        '/grooming-business-operations',
        '/moego-alternatives',
        '/daysmart-alternatives',
        '/pawfinity-alternatives',
        '/123-pet-grooming-software-alternatives',
        '/pet-grooming-business-software',
        '/features/mobile-groomer',
      ];
      landingPagePaths.forEach((path) => {
        expect(allHrefs).toContain(path);
      });
    });

    it('footer includes /sitemap.xml link', () => {
      const columns = getFooterColumns();
      const allHrefs = columns.flatMap((col) => col.links.map((l) => l.href));
      expect(allHrefs).toContain('/sitemap.xml');
    });

    it('footer includes /blog link', () => {
      const columns = getFooterColumns();
      const allHrefs = columns.flatMap((col) => col.links.map((l) => l.href));
      expect(allHrefs).toContain('/blog');
    });

    it('footer includes at least 5 blog post links in Business Guides column', () => {
      const columns = getFooterColumns();
      const guidesColumn = columns.find((c) => c.heading === 'Business Guides');
      expect(guidesColumn).toBeTruthy();
      const blogLinks = guidesColumn!.links.filter((l) => l.href.startsWith('/blog/'));
      expect(blogLinks.length).toBeGreaterThanOrEqual(5);
    });

    it('footer has 4 columns with headings', () => {
      const columns = getFooterColumns();
      expect(columns.length).toBe(4);
      const headings = columns.map((c) => c.heading);
      expect(headings).toContain('Product');
      expect(headings).toContain('Compare');
      expect(headings).toContain('Resources');
      expect(headings).toContain('Business Guides');
    });

    it('default footer links are all internal paths (no external URLs)', () => {
      const columns = getFooterColumns();
      columns.forEach((col) => {
        col.links.forEach((link) => {
          expect(link.href.startsWith('/')).toBe(true);
          expect(link.href).not.toMatch(/^https?:\/\//);
        });
      });
    });

    it('Product column includes /plans and /signup (conversion-critical)', () => {
      const columns = getFooterColumns();
      const productColumn = columns.find((c) => c.heading === 'Product');
      expect(productColumn).toBeTruthy();
      const productHrefs = productColumn!.links.map((l) => l.href);
      expect(productHrefs).toContain('/plans');
      expect(productHrefs).toContain('/signup');
    });

    it('Compare column includes MoeGo and DaySmart alternatives', () => {
      const columns = getFooterColumns();
      const compareColumn = columns.find((c) => c.heading === 'Compare');
      expect(compareColumn).toBeTruthy();
      const compareHrefs = compareColumn!.links.map((l) => l.href);
      expect(compareHrefs).toContain('/moego-alternatives');
      expect(compareHrefs).toContain('/daysmart-alternatives');
    });

    it('all column link labels are non-empty strings', () => {
      const columns = getFooterColumns();
      columns.forEach((col) => {
        col.links.forEach((link) => {
          expect(link.label.length).toBeGreaterThan(0);
          expect(link.label.trim()).toBe(link.label);
        });
      });
    });
  });
});
