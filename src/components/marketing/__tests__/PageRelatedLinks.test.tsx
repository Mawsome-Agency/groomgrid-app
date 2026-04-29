/**
 * Unit tests for PageRelatedLinks (src/components/marketing/PageRelatedLinks.tsx).
 *
 * Strategy: PageRelatedLinks is a Server Component wrapper that calls getRelatedLinks()
 * from the internal-links module and passes results to the presentational RelatedLinks
 * component. Since this is a thin wrapper, tests focus on:
 * - Correct delegation to getRelatedLinks with slug and variant
 * - Correct prop forwarding to RelatedLinks
 * - Null/empty return behavior
 * - Edge cases: unknown slugs, missing slugs, variant defaults
 * - SEO regression guards (slug-to-link mapping integrity)
 *
 * The underlying getRelatedLinks() and RelatedLinks components have their own
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
  getRelatedLinks: jest.fn(),
}));

import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import { getRelatedLinks } from '@/lib/seo/internal-links';

const mockGetRelatedLinks = getRelatedLinks as jest.MockedFunction<typeof getRelatedLinks>;

// ────────────────────────────────────────────────────────
// TEST DATA
// ────────────────────────────────────────────────────────

const BLOG_LINKS = [
  {
    href: '/blog/dog-grooming-software',
    title: 'Dog Grooming Software',
    description: 'Compare the best dog grooming software for 2026.',
  },
  {
    href: '/blog/free-dog-grooming-software',
    title: 'Free Dog Grooming Software',
    description: 'Honest look at free tiers.',
  },
  {
    href: '/blog/pet-grooming-software',
    title: 'Pet Grooming Software',
  },
];

const LANDING_LINKS = [
  { href: '/best-dog-grooming-software', category: 'Software & Comparison', title: 'Best Dog Grooming Software' },
  { href: '/mobile-grooming-software', category: 'Mobile Grooming', title: 'Mobile Grooming Software' },
  { href: '/cat-grooming-software', category: 'Cat Grooming', title: 'Cat Grooming Software' },
  { href: '/moego-alternatives', category: 'Software & Comparison', title: 'MoeGo Alternatives' },
];

// ────────────────────────────────────────────────
// 1. DELEGATION TO getRelatedLinks
// ────────────────────────────────────────────────
describe('PageRelatedLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Delegation to getRelatedLinks', () => {
    it('calls getRelatedLinks with the provided slug and variant', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      expect(mockGetRelatedLinks).toHaveBeenCalledWith('dog-grooming-software', { variant: 'blog' });
    });

    it('calls getRelatedLinks with variant="blog" by default when variant not specified', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      render(<PageRelatedLinks slug="dog-grooming-software" />);
      expect(mockGetRelatedLinks).toHaveBeenCalledWith('dog-grooming-software', { variant: 'blog' });
    });

    it('calls getRelatedLinks with variant="landing" when specified', () => {
      mockGetRelatedLinks.mockReturnValue(LANDING_LINKS);
      render(<PageRelatedLinks slug="cat-grooming-software" variant="landing" />);
      expect(mockGetRelatedLinks).toHaveBeenCalledWith('cat-grooming-software', { variant: 'landing' });
    });

    it('calls getRelatedLinks exactly once per render', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      expect(mockGetRelatedLinks).toHaveBeenCalledTimes(1);
    });

    it('passes the slug string directly without transformation', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      render(<PageRelatedLinks slug="how-to-start-mobile-grooming-business" />);
      expect(mockGetRelatedLinks).toHaveBeenCalledWith('how-to-start-mobile-grooming-business', { variant: 'blog' });
    });
  });

  // ────────────────────────────────────────────────
  // 2. RENDERING WITH BLOG VARIANT
  // ────────────────────────────────────────────────
  describe('Rendering with Blog Variant', () => {
    it('renders without crashing when getRelatedLinks returns blog links', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { container } = render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      expect(container).toBeTruthy();
    });

    it('renders a section element (from RelatedLinks)', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { container } = render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      const section = container.querySelector('section');
      expect(section).toBeTruthy();
    });

    it('renders all blog link titles', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { container } = render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      BLOG_LINKS.forEach((link) => {
        expect(container.textContent).toContain(link.title);
      });
    });

    it('renders all blog link hrefs', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { container } = render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      BLOG_LINKS.forEach((link) => {
        const anchor = container.querySelector(`a[href="${link.href}"]`);
        expect(anchor).toBeTruthy();
      });
    });

    it('renders blog link descriptions when provided', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { container } = render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      // First two links have descriptions
      expect(container.textContent).toContain('Compare the best dog grooming software for 2026.');
      expect(container.textContent).toContain('Honest look at free tiers.');
    });

    it('blog variant has border-t separator (passed through to RelatedLinks)', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { container } = render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      const section = container.querySelector('section.border-t');
      expect(section).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────
  // 3. RENDERING WITH LANDING VARIANT
  // ────────────────────────────────────────────────
  describe('Rendering with Landing Variant', () => {
    it('renders without crashing when getRelatedLinks returns landing links', () => {
      mockGetRelatedLinks.mockReturnValue(LANDING_LINKS);
      const { container } = render(<PageRelatedLinks slug="cat-grooming-software" variant="landing" />);
      expect(container).toBeTruthy();
    });

    it('renders a section element (from RelatedLinks)', () => {
      mockGetRelatedLinks.mockReturnValue(LANDING_LINKS);
      const { container } = render(<PageRelatedLinks slug="cat-grooming-software" variant="landing" />);
      const section = container.querySelector('section');
      expect(section).toBeTruthy();
    });

    it('renders all landing link titles', () => {
      mockGetRelatedLinks.mockReturnValue(LANDING_LINKS);
      const { container } = render(<PageRelatedLinks slug="cat-grooming-software" variant="landing" />);
      LANDING_LINKS.forEach((link) => {
        expect(container.textContent).toContain(link.title);
      });
    });

    it('renders all landing link hrefs', () => {
      mockGetRelatedLinks.mockReturnValue(LANDING_LINKS);
      const { container } = render(<PageRelatedLinks slug="cat-grooming-software" variant="landing" />);
      LANDING_LINKS.forEach((link) => {
        const anchor = container.querySelector(`a[href="${link.href}"]`);
        expect(anchor).toBeTruthy();
      });
    });

    it('renders category labels for landing variant', () => {
      mockGetRelatedLinks.mockReturnValue(LANDING_LINKS);
      const { container } = render(<PageRelatedLinks slug="cat-grooming-software" variant="landing" />);
      LANDING_LINKS.forEach((link) => {
        if (link.category) {
          expect(container.textContent).toContain(link.category);
        }
      });
    });

    it('landing variant has max-w-5xl container', () => {
      mockGetRelatedLinks.mockReturnValue(LANDING_LINKS);
      const { container } = render(<PageRelatedLinks slug="cat-grooming-software" variant="landing" />);
      const section = container.querySelector('section.px-6.py-12.max-w-5xl');
      expect(section).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────
  // 4. CUSTOM HEADING PROP
  // ────────────────────────────────────────────────
  describe('Custom Heading Prop', () => {
    it('renders default heading when none specified', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.textContent).toBe('Related Articles');
    });

    it('renders custom heading when specified', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" heading="Continue Reading" />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.textContent).toBe('Continue Reading');
    });

    it('passes heading to RelatedLinks for landing variant too', () => {
      mockGetRelatedLinks.mockReturnValue(LANDING_LINKS);
      render(<PageRelatedLinks slug="cat-grooming-software" variant="landing" heading="Explore More" />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.textContent).toBe('Explore More');
    });
  });

  // ────────────────────────────────────────────────
  // 5. COLUMNS PROP
  // ────────────────────────────────────────────────
  describe('Columns Prop', () => {
    it('defaults to 3 columns when not specified', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { container } = render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('lg:grid-cols-3');
    });

    it('passes columns=2 to RelatedLinks', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { container } = render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" columns={2} />);
      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('sm:grid-cols-2');
    });

    it('passes columns=4 to RelatedLinks', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { container } = render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" columns={4} />);
      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('lg:grid-cols-4');
    });
  });

  // ────────────────────────────────────────────────
  // 6. EMPTY / NULL RETURN
  // ────────────────────────────────────────────────
  describe('Empty / Null Return Behavior', () => {
    it('returns null when getRelatedLinks returns empty array', () => {
      mockGetRelatedLinks.mockReturnValue([]);
      const { container } = render(<PageRelatedLinks slug="unknown-slug" />);
      // PageRelatedLinks returns null when links array is empty
      expect(container.innerHTML).toBe('');
    });

    it('returns null when getRelatedLinks returns undefined/null', () => {
      mockGetRelatedLinks.mockReturnValue(undefined as any);
      const { container } = render(<PageRelatedLinks slug="unknown-slug" />);
      expect(container.innerHTML).toBe('');
    });

    it('passes empty string slug to getRelatedLinks (which returns defaults)', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      render(<PageRelatedLinks slug="" />);
      expect(mockGetRelatedLinks).toHaveBeenCalledWith('', { variant: 'blog' });
    });
  });

  // ────────────────────────────────────────────────
  // 7. EDGE CASES
  // ────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('renders correctly on re-render (stability check)', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { rerender, container } = render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      const firstHtml = container.innerHTML;
      rerender(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      const secondHtml = container.innerHTML;
      expect(firstHtml).toBe(secondHtml);
    });

    it('updates when slug prop changes', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { rerender } = render(<PageRelatedLinks slug="slug-a" variant="blog" />);
      expect(mockGetRelatedLinks).toHaveBeenCalledWith('slug-a', { variant: 'blog' });

      mockGetRelatedLinks.mockReturnValue(LANDING_LINKS);
      rerender(<PageRelatedLinks slug="slug-b" variant="landing" />);
      expect(mockGetRelatedLinks).toHaveBeenCalledWith('slug-b', { variant: 'landing' });
    });

    it('handles slug with leading slash (passes through for normalization)', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      render(<PageRelatedLinks slug="/blog/dog-grooming-software" variant="blog" />);
      expect(mockGetRelatedLinks).toHaveBeenCalledWith('/blog/dog-grooming-software', { variant: 'blog' });
    });
  });

  // ────────────────────────────────────────────────
  // 8. SEO REGRESSION GUARDS
  // ────────────────────────────────────────────────
  describe('SEO Regression Guards', () => {
    it('always renders an H2 heading (accessibility requirement)', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeTruthy();
    });

    it('all rendered links are internal paths', () => {
      mockGetRelatedLinks.mockReturnValue(BLOG_LINKS);
      const { container } = render(<PageRelatedLinks slug="dog-grooming-software" variant="blog" />);
      const anchors = container.querySelectorAll('a');
      anchors.forEach((anchor) => {
        const href = anchor.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href?.startsWith('/')).toBe(true);
      });
    });

    it('renders at least one link for known slugs (not empty)', () => {
      mockGetRelatedLinks.mockReturnValue([
        { href: '/blog/test', title: 'Test', description: 'Test desc' },
      ]);
      const { container } = render(<PageRelatedLinks slug="test-slug" variant="blog" />);
      const anchors = container.querySelectorAll('a');
      expect(anchors.length).toBeGreaterThanOrEqual(1);
    });
  });
});
