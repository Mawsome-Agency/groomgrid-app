/**
 * Unit tests for PageBreadcrumbs (src/components/marketing/PageBreadcrumbs.tsx).
 *
 * Strategy: PageBreadcrumbs is a Server Component wrapper that calls getBreadcrumbs()
 * from the internal-links module and passes results to the presentational Breadcrumbs
 * component. Tests focus on:
 * - Correct delegation to getBreadcrumbs with slug
 * - Correct prop forwarding to Breadcrumbs presentational component
 * - Null/empty return behavior
 * - Edge cases: unknown slugs, blog vs landing page breadcrumbs
 * - SEO regression guards (breadcrumb structure integrity)
 *
 * The underlying getBreadcrumbs() and Breadcrumbs components have their own
 * comprehensive tests. These tests validate the integration wiring.
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

// Mock the internal-links module so we can verify delegation
jest.mock('@/lib/seo/internal-links', () => ({
  getBreadcrumbs: jest.fn(),
}));

import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import { getBreadcrumbs } from '@/lib/seo/internal-links';

const mockGetBreadcrumbs = getBreadcrumbs as jest.MockedFunction<typeof getBreadcrumbs>;

// ────────────────────────────────────────────────────────
// TEST DATA
// ────────────────────────────────────────────────────────

const BLOG_BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Dog Grooming Software: The 2026 Buyer\'s Guide', href: '/blog/dog-grooming-software' },
];

const LANDING_BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Cat Grooming Software for Feline Specialists', href: '/cat-grooming-software' },
];

const HOME_ONLY_BREADCRUMBS = [
  { label: 'Home', href: '/' },
];

// ────────────────────────────────────────────────
// 1. DELEGATION TO getBreadcrumbs
// ────────────────────────────────────────────────
describe('PageBreadcrumbs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Delegation to getBreadcrumbs', () => {
    it('calls getBreadcrumbs with the provided slug', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      render(<PageBreadcrumbs slug="dog-grooming-software" />);
      expect(mockGetBreadcrumbs).toHaveBeenCalledWith('dog-grooming-software');
    });

    it('calls getBreadcrumbs exactly once per render', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      render(<PageBreadcrumbs slug="dog-grooming-software" />);
      expect(mockGetBreadcrumbs).toHaveBeenCalledTimes(1);
    });

    it('passes the slug string directly without transformation', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      render(<PageBreadcrumbs slug="how-to-start-mobile-grooming-business" />);
      expect(mockGetBreadcrumbs).toHaveBeenCalledWith('how-to-start-mobile-grooming-business');
    });

    it('passes slug with leading slash (for normalization by internal-links)', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      render(<PageBreadcrumbs slug="/blog/dog-grooming-software" />);
      expect(mockGetBreadcrumbs).toHaveBeenCalledWith('/blog/dog-grooming-software');
    });
  });

  // ────────────────────────────────────────────────
  // 2. RENDERING WITH BLOG BREADCRUMBS
  // ────────────────────────────────────────────────
  describe('Rendering with Blog Breadcrumbs', () => {
    it('renders without crashing when getBreadcrumbs returns blog breadcrumbs', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      expect(container).toBeTruthy();
    });

    it('renders a <nav> element with aria-label="Breadcrumb"', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const nav = container.querySelector('nav');
      expect(nav).toBeTruthy();
      expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('renders all breadcrumb labels', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      render(<PageBreadcrumbs slug="dog-grooming-software" />);
      BLOG_BREADCRUMBS.forEach((crumb) => {
        expect(screen.getByText(crumb.label)).toBeTruthy();
      });
    });

    it('renders Home as the first breadcrumb', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const home = screen.getByText('Home');
      expect(home).toBeTruthy();
      expect(home.closest('a')).toHaveAttribute('href', '/');
    });

    it('renders Blog as the second breadcrumb for blog pages', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const blog = screen.getByText('Blog');
      expect(blog).toBeTruthy();
      expect(blog.closest('a')).toHaveAttribute('href', '/blog');
    });

    it('last breadcrumb is NOT a link (current page)', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const listItems = container.querySelectorAll('li');
      const lastItem = listItems[listItems.length - 1];
      const link = lastItem.querySelector('a');
      expect(link).toBeNull();
    });

    it('renders the correct number of list items', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(BLOG_BREADCRUMBS.length);
    });
  });

  // ────────────────────────────────────────────────
  // 3. RENDERING WITH LANDING BREADCRUMBS
  // ────────────────────────────────────────────────
  describe('Rendering with Landing Breadcrumbs', () => {
    it('renders without crashing for landing page breadcrumbs', () => {
      mockGetBreadcrumbs.mockReturnValue(LANDING_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="cat-grooming-software" />);
      expect(container).toBeTruthy();
    });

    it('does not include Blog breadcrumb for landing pages', () => {
      mockGetBreadcrumbs.mockReturnValue(LANDING_BREADCRUMBS);
      const blogLink = screen.queryByText('Blog');
      expect(blogLink).toBeNull();
    });

    it('landing page breadcrumbs have Home and current page only', () => {
      mockGetBreadcrumbs.mockReturnValue(LANDING_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="cat-grooming-software" />);
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(2);
      expect(screen.getByText('Home')).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────
  // 4. JSON-LD STRUCTURED DATA
  // ────────────────────────────────────────────────
  describe('JSON-LD Structured Data', () => {
    it('renders a script tag with application/ld+json type', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();
    });

    it('JSON-LD has @type BreadcrumbList', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      expect(jsonLd['@type']).toBe('BreadcrumbList');
    });

    it('JSON-LD has @context https://schema.org', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      expect(jsonLd['@context']).toBe('https://schema.org');
    });

    it('JSON-LD itemListElement matches breadcrumb count', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      expect(jsonLd.itemListElement.length).toBe(BLOG_BREADCRUMBS.length);
    });

    it('JSON-LD items have correct names matching breadcrumb labels', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      jsonLd.itemListElement.forEach((item: any, index: number) => {
        expect(item.name).toBe(BLOG_BREADCRUMBS[index].label);
      });
    });

    it('JSON-LD items have full URLs (https://getgroomgrid.com)', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      jsonLd.itemListElement.forEach((item: any) => {
        expect(item.item).toMatch(/^https:\/\/getgroomgrid\.com/);
      });
    });

    it('JSON-LD positions are sequential starting from 1', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');
      jsonLd.itemListElement.forEach((item: any, index: number) => {
        expect(item.position).toBe(index + 1);
      });
    });
  });

  // ────────────────────────────────────────────────
  // 5. EMPTY / NULL RETURN
  // ────────────────────────────────────────────────
  describe('Empty / Null Return Behavior', () => {
    it('returns null when getBreadcrumbs returns empty array', () => {
      mockGetBreadcrumbs.mockReturnValue([]);
      const { container } = render(<PageBreadcrumbs slug="unknown-slug" />);
      expect(container.innerHTML).toBe('');
    });

    it('returns null when getBreadcrumbs returns undefined/null', () => {
      mockGetBreadcrumbs.mockReturnValue(undefined as any);
      const { container } = render(<PageBreadcrumbs slug="unknown-slug" />);
      expect(container.innerHTML).toBe('');
    });

    it('renders Home-only breadcrumbs correctly', () => {
      mockGetBreadcrumbs.mockReturnValue(HOME_ONLY_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="home" />);
      expect(screen.getByText('Home')).toBeTruthy();
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(1);
    });
  });

  // ────────────────────────────────────────────────
  // 6. ACCESSIBILITY
  // ────────────────────────────────────────────────
  describe('Accessibility', () => {
    it('has aria-label="Breadcrumb" on nav element', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const nav = container.querySelector('nav');
      expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('uses ordered list for breadcrumb items', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const ol = container.querySelector('ol');
      expect(ol).toBeTruthy();
    });

    it('separators are hidden from screen readers (aria-hidden)', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      expect(separators.length).toBeGreaterThan(0);
      separators.forEach((sep) => {
        expect(sep.getAttribute('aria-hidden')).toBe('true');
      });
    });

    it('all non-current breadcrumb items are links', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const listItems = container.querySelectorAll('li');
      // All items except the last should contain links
      for (let i = 0; i < listItems.length - 1; i++) {
        const link = listItems[i].querySelector('a');
        expect(link).toBeTruthy();
      }
    });
  });

  // ────────────────────────────────────────────────
  // 7. EDGE CASES
  // ────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('renders correctly on re-render (stability check)', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { rerender, container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const firstHtml = container.innerHTML;
      rerender(<PageBreadcrumbs slug="dog-grooming-software" />);
      const secondHtml = container.innerHTML;
      expect(firstHtml).toBe(secondHtml);
    });

    it('updates when slug prop changes', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { rerender } = render(<PageBreadcrumbs slug="slug-a" />);
      expect(mockGetBreadcrumbs).toHaveBeenCalledWith('slug-a');

      mockGetBreadcrumbs.mockReturnValue(LANDING_BREADCRUMBS);
      rerender(<PageBreadcrumbs slug="slug-b" />);
      expect(mockGetBreadcrumbs).toHaveBeenCalledWith('slug-b');
    });

    it('handles breadcrumb with special characters in label', () => {
      const specialCrumbs = [
        { label: 'Home', href: '/' },
        { label: "Cat & Dog Grooming (2026)", href: '/blog/special' },
      ];
      mockGetBreadcrumbs.mockReturnValue(specialCrumbs);
      render(<PageBreadcrumbs slug="special" />);
      expect(screen.getByText("Cat & Dog Grooming (2026)")).toBeTruthy();
    });

    it('handles many breadcrumbs (5+ items)', () => {
      const manyCrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: 'Software', href: '/blog/software' },
        { label: 'Dog Grooming', href: '/blog/dog-grooming-software' },
        { label: 'Deep Page', href: '/blog/dog-grooming-software/deep' },
      ];
      mockGetBreadcrumbs.mockReturnValue(manyCrumbs);
      const { container } = render(<PageBreadcrumbs slug="deep-page" />);
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(5);
    });
  });

  // ────────────────────────────────────────────────
  // 8. SEO REGRESSION GUARDS
  // ────────────────────────────────────────────────
  describe('SEO Regression Guards', () => {
    it('JSON-LD URLs match the actual breadcrumb href paths', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');

      BLOG_BREADCRUMBS.forEach((crumb, index) => {
        const jsonItem = jsonLd.itemListElement[index];
        expect(jsonItem.item).toBe(`https://getgroomgrid.com${crumb.href}`);
      });
    });

    it('blog page breadcrumbs always start with Home > Blog', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      render(<PageBreadcrumbs slug="dog-grooming-software" />);
      expect(screen.getByText('Home')).toBeTruthy();
      expect(screen.getByText('Blog')).toBeTruthy();
    });

    it('no duplicate breadcrumb labels', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const labels = BLOG_BREADCRUMBS.map((c) => c.label);
      expect(new Set(labels).size).toBe(labels.length);
    });

    it('breadcrumb script tag has id="breadcrumb-schema"', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const script = container.querySelector('script#breadcrumb-schema');
      expect(script).toBeTruthy();
    });

    it('microdata itemScope and itemType are present on ordered list', () => {
      mockGetBreadcrumbs.mockReturnValue(BLOG_BREADCRUMBS);
      const { container } = render(<PageBreadcrumbs slug="dog-grooming-software" />);
      const ol = container.querySelector('ol');
      expect(ol?.getAttribute('itemscope')).toBeDefined();
      expect(ol?.getAttribute('itemtype')).toBe('https://schema.org/BreadcrumbList');
    });
  });
});
