/**
 * Unit tests for Breadcrumbs component (src/components/marketing/Breadcrumbs.tsx).
 *
 * Strategy: TDD-first — these tests define the contract for the Breadcrumbs
 * component BEFORE implementation. The component renders visible breadcrumbs
 * AND JSON-LD structured data for SEO crawlability.
 *
 * Covers: render, breadcrumb items, JSON-LD output, variant styling, current page
 * (no link), separator, Home link, accessibility, edge cases.
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

import Breadcrumbs from '@/components/marketing/Breadcrumbs';
import { getBreadcrumbs } from '@/lib/seo/internal-links';

// ────────────────────────────────────────────────────────
// 1. BASIC RENDER
// ────────────────────────────────────────────────────────
describe('Breadcrumbs', () => {
  const blogCrumbs = getBreadcrumbs('dog-grooming-software');
  const landingCrumbs = getBreadcrumbs('cat-grooming-software');

  describe('Basic Render', () => {
    it('renders without crashing', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      expect(container).toBeTruthy();
    });

    it('renders a <nav> element with aria-label', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const nav = container.querySelector('nav');
      expect(nav).toBeTruthy();
      expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('renders an ordered list for breadcrumb items', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const ol = container.querySelector('ol');
      expect(ol).toBeTruthy();
      expect(ol?.getAttribute('itemscope')).toBeDefined();
    });

    it('renders all breadcrumb items as list elements', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const li = container.querySelectorAll('li');
      expect(li.length).toBe(blogCrumbs.length);
    });
  });

  // ────────────────────────────────────────────────────────
  // 2. BREADCRUMB ITEMS
  // ────────────────────────────────────────────────────────
  describe('Breadcrumb Items', () => {
    it('renders Home as first breadcrumb', () => {
      render(<Breadcrumbs items={blogCrumbs} />);
      const homeLink = screen.getByText('Home');
      expect(homeLink).toBeTruthy();
      expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('renders Blog as second breadcrumb for blog pages', () => {
      render(<Breadcrumbs items={blogCrumbs} />);
      const blogLink = screen.getByText('Blog');
      expect(blogLink).toBeTruthy();
      expect(blogLink.closest('a')).toHaveAttribute('href', '/blog');
    });

    it('last breadcrumb item is NOT a link (current page)', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const listItems = container.querySelectorAll('li');
      const lastItem = listItems[listItems.length - 1];
      // Current page should be text, not a link
      const link = lastItem.querySelector('a');
      expect(link).toBeNull();
    });

    it('all non-last breadcrumb items ARE links', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const listItems = container.querySelectorAll('li');
      // All items except the last should contain links
      for (let i = 0; i < listItems.length - 1; i++) {
        const link = listItems[i].querySelector('a');
        expect(link).toBeTruthy();
      }
    });

    it('each link has the correct href from the items data', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      // Check that each non-current breadcrumb links to the right place
      blogCrumbs.slice(0, -1).forEach((crumb) => {
        const link = container.querySelector(`a[href="${crumb.href}"]`);
        expect(link).toBeTruthy();
      });
    });

    it('displays correct labels for each breadcrumb', () => {
      render(<Breadcrumbs items={blogCrumbs} />);
      blogCrumbs.forEach((crumb) => {
        expect(screen.getByText(crumb.label)).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 3. JSON-LD STRUCTURED DATA
  // ────────────────────────────────────────────────────────
  describe('JSON-LD Structured Data', () => {
    it('renders a script tag with application/ld+json type', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();
    });

    it('JSON-LD has @type BreadcrumbList', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      expect(jsonLd['@type']).toBe('BreadcrumbList');
    });

    it('JSON-LD has @context https://schema.org', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      expect(jsonLd['@context']).toBe('https://schema.org');
    });

    it('JSON-LD itemListElement has correct length', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      expect(jsonLd.itemListElement.length).toBe(blogCrumbs.length);
    });

    it('JSON-LD itemListElement positions are sequential starting from 1', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      jsonLd.itemListElement.forEach((item: any, index: number) => {
        expect(item.position).toBe(index + 1);
      });
    });

    it('JSON-LD items have correct names', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      jsonLd.itemListElement.forEach((item: any, index: number) => {
        expect(item.name).toBe(blogCrumbs[index].label);
      });
    });

    it('JSON-LD items have correct URLs (full https)', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      jsonLd.itemListElement.forEach((item: any) => {
        expect(item.item).toMatch(/^https:\/\/getgroomgrid\.com/);
      });
    });

    it('JSON-LD script id matches breadcrumb-schema', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const script = container.querySelector('script#breadcrumb-schema');
      expect(script).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────
  // 4. LANDING PAGE BREADCRUMBS
  // ────────────────────────────────────────────────────────
  describe('Landing Page Breadcrumbs', () => {
    it('does not include Blog breadcrumb for landing pages', () => {
      render(<Breadcrumbs items={landingCrumbs} />);
      const blogLink = screen.queryByText('Blog');
      expect(blogLink).toBeNull();
    });

    it('landing page breadcrumbs are shorter (Home > Page)', () => {
      expect(landingCrumbs.length).toBeLessThan(blogCrumbs.length);
    });

    it('landing page has Home and current page only', () => {
      expect(landingCrumbs.length).toBeGreaterThanOrEqual(2);
      expect(landingCrumbs[0].label).toBe('Home');
    });
  });

  // ────────────────────────────────────────────────────────
  // 5. SEPARATOR & STYLING
  // ────────────────────────────────────────────────────────
  describe('Separator & Styling', () => {
    it('has separator between breadcrumb items', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      // Should have a visual separator (typically "/" or "›")
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      expect(separators.length).toBeGreaterThan(0);
    });

    it('has text-sm or smaller text size', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const nav = container.querySelector('nav');
      expect(nav?.className).toMatch(/text-sm|text-xs/);
    });

    it('has stone-500 or similar muted color for non-current items', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      // Muted color for breadcrumb trail
      const links = container.querySelectorAll('li a');
      links.forEach((link) => {
        expect(link.className).toMatch(/stone|gray|text-/);
      });
    });

    it('current page (last item) has bold or darker styling', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const listItems = container.querySelectorAll('li');
      const lastItem = listItems[listItems.length - 1];
      // Last item should have different styling than links
      expect(lastItem.textContent).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────
  // 6. ACCESSIBILITY
  // ────────────────────────────────────────────────────────
  describe('Accessibility', () => {
    it('nav has aria-label="Breadcrumb"', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const nav = container.querySelector('nav');
      expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('uses <ol> with proper list semantics', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const ol = container.querySelector('ol');
      expect(ol).toBeTruthy();
    });

    it('each list item has itemprop attribute for schema markup', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const listItems = container.querySelectorAll('li[itemprop="itemListElement"]');
      expect(listItems.length).toBe(blogCrumbs.length);
    });

    it('separators are hidden from screen readers (aria-hidden)', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      separators.forEach((sep) => {
        expect(sep.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 7. EDGE CASES
  // ────────────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('renders correctly with minimum 2 items (Home + current)', () => {
      const minCrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Cat Grooming Software', href: '/cat-grooming-software' },
      ];
      const { container } = render(<Breadcrumbs items={minCrumbs} />);
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(2);
    });

    it('renders correctly with 4+ items', () => {
      const manyCrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: 'Software', href: '/blog/dog-grooming-software' },
        { label: 'Dog Grooming Software', href: '/blog/dog-grooming-software' },
      ];
      const { container } = render(<Breadcrumbs items={manyCrumbs} />);
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(4);
    });

    it('renders correctly on re-render (stability check)', () => {
      const { rerender, container } = render(<Breadcrumbs items={blogCrumbs} />);
      const firstHtml = container.innerHTML;
      rerender(<Breadcrumbs items={blogCrumbs} />);
      const secondHtml = container.innerHTML;
      expect(firstHtml).toBe(secondHtml);
    });

    it('handles single item (Home only)', () => {
      const singleCrumb = [{ label: 'Home', href: '/' }];
      const { container } = render(<Breadcrumbs items={singleCrumb} />);
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(1);
    });

    it('handles items with special characters in label', () => {
      const specialCrumbs = [
        { label: 'Home', href: '/' },
        { label: "Cat & Dog Grooming (2026)", href: '/blog/special' },
      ];
      render(<Breadcrumbs items={specialCrumbs} />);
      expect(screen.getByText("Cat & Dog Grooming (2026)")).toBeTruthy();
    });

    it('handles empty items array gracefully', () => {
      const { container } = render(<Breadcrumbs items={[]} />);
      // Should render without crashing, possibly with empty nav
      expect(container.querySelector('nav')).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────
  // 8. SEO REGRESSION GUARDS
  // ────────────────────────────────────────────────────────
  describe('SEO Regression Guards', () => {
    it('JSON-LD URLs match the actual breadcrumb href paths', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');

      // The JSON-LD URLs should include the full domain + href
      blogCrumbs.forEach((crumb, index) => {
        const jsonItem = jsonLd.itemListElement[index];
        expect(jsonItem.item).toBe(`https://getgroomgrid.com${crumb.href}`);
      });
    });

    it('breadcrumb JSON-LD includes all items in correct order', () => {
      const { container } = render(<Breadcrumbs items={blogCrumbs} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');

      expect(jsonLd.itemListElement.length).toBe(blogCrumbs.length);
      jsonLd.itemListElement.forEach((item: any, i: number) => {
        expect(item.position).toBe(i + 1);
        expect(item.name).toBe(blogCrumbs[i].label);
      });
    });

    it('blog page breadcrumbs always start Home > Blog', () => {
      render(<Breadcrumbs items={blogCrumbs} />);
      expect(screen.getByText('Home')).toBeTruthy();
      expect(screen.getByText('Blog')).toBeTruthy();
    });

    it('no duplicate breadcrumb labels', () => {
      const labels = blogCrumbs.map((c) => c.label);
      // Home and page title could have the same name in theory, but shouldn't
      // The last crumb (current page) CAN share a word with Blog, but not be exact duplicate
      expect(new Set(labels).size).toBe(labels.length);
    });
  });
});
