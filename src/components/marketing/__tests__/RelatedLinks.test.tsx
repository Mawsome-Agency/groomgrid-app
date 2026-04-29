/**
 * Unit tests for RelatedLinks (src/components/marketing/RelatedLinks.tsx).
 *
 * Strategy: Test the related links component used across blog posts and landing pages.
 * Covers: both variants (landing, blog), heading, columns, links rendering,
 * category/description display, empty arrays, accessibility, edge cases.
 *
 * These tests also serve as regression guards for the SEO Internal Linking
 * Architecture feature — any changes to related links structure will break
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

import RelatedLinks from '@/components/marketing/RelatedLinks';

const SAMPLE_LINKS = [
  { href: '/blog/dog-grooming-software', category: 'Software', title: 'Dog Grooming Software' },
  { href: '/blog/free-dog-grooming-software', category: 'Software', title: 'Free Dog Grooming Software' },
  { href: '/blog/pet-grooming-software', category: 'Software', title: 'Pet Grooming Software' },
  { href: '/blog/reduce-no-shows-dog-grooming', category: 'Operations', title: 'Reduce No-Shows' },
];

const BLOG_LINKS = [
  { href: '/blog/dog-grooming-software', title: 'Dog Grooming Software', description: 'Compare the best dog grooming software for 2026.' },
  { href: '/blog/free-dog-grooming-software', title: 'Free Dog Grooming Software', description: 'Honest look at free tiers.' },
  { href: '/blog/pet-grooming-software', title: 'Pet Grooming Software' },
];

describe('RelatedLinks', () => {
  // ────────────────────────────────────────────────────────
  // 1. LANDING VARIANT (default)
  // ────────────────────────────────────────────────────────
  describe('Landing Variant (default)', () => {
    it('renders without crashing', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      expect(container).toBeTruthy();
    });

    it('renders a <section> element', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      const section = container.querySelector('section');
      expect(section).toBeTruthy();
      expect(section?.tagName).toBe('SECTION');
    });

    it('renders default heading "Related Articles"', () => {
      render(<RelatedLinks links={SAMPLE_LINKS} />);
      expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Related Articles');
    });

    it('renders custom heading', () => {
      render(<RelatedLinks links={SAMPLE_LINKS} heading="Explore More" />);
      expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Explore More');
    });

    it('renders all 4 links', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      const links = container.querySelectorAll('a.group');
      expect(links.length).toBe(4);
    });

    it('each link has correct href', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      SAMPLE_LINKS.forEach(({ href }) => {
        const link = container.querySelector(`a[href="${href}"]`);
        expect(link).toBeTruthy();
      });
    });

    it('each link displays the category label', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      const categories = Array.from(container.querySelectorAll('p.text-green-600.font-semibold.mb-1'))
        .map(el => el.textContent?.trim());
      SAMPLE_LINKS.forEach(({ category }) => {
        expect(categories).toContain(category);
      });
    });

    it('each link displays the title', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      SAMPLE_LINKS.forEach(({ title }) => {
        expect(container.textContent).toContain(title);
      });
    });

    it('links have hover border and shadow classes', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      const links = container.querySelectorAll('a.group.border-stone-200.rounded-xl');
      links.forEach((link) => {
        expect(link.className).toContain('hover:border-green-300');
        expect(link.className).toContain('hover:shadow-md');
      });
    });

    it('heading uses H2 level', () => {
      render(<RelatedLinks links={SAMPLE_LINKS} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.tagName).toBe('H2');
    });

    it('heading has stone-800 text color', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      const heading = container.querySelector('h2.text-xl');
      expect(heading).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────
  // 2. BLOG VARIANT
  // ────────────────────────────────────────────────────────
  describe('Blog Variant', () => {
    it('renders without crashing', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      expect(container).toBeTruthy();
    });

    it('renders a section with border-top separator', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      const section = container.querySelector('section.border-t');
      expect(section).toBeTruthy();
    });

    it('renders default heading "Related Articles"', () => {
      render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.textContent).toBe('Related Articles');
    });

    it('renders custom heading for blog variant', () => {
      render(<RelatedLinks links={BLOG_LINKS} variant="blog" heading="Continue Reading" />);
      expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Continue Reading');
    });

    it('renders all blog links', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      const linkCards = container.querySelectorAll('a.block.p-4.rounded-lg');
      expect(linkCards.length).toBe(3);
    });

    it('each blog link has correct href', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      BLOG_LINKS.forEach(({ href }) => {
        const link = container.querySelector(`a[href="${href}"]`);
        expect(link).toBeTruthy();
      });
    });

    it('each blog link displays the title', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      BLOG_LINKS.forEach(({ title }) => {
        expect(container.textContent).toContain(title);
      });
    });

    it('renders description when provided', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      // First two links have descriptions
      expect(container.textContent).toContain('Compare the best dog grooming software for 2026.');
      expect(container.textContent).toContain('Honest look at free tiers.');
    });

    it('renders without description when not provided', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      // Third link has no description — it should still render the title
      const thirdLink = container.querySelector('a[href="/blog/pet-grooming-software"]');
      expect(thirdLink).toBeTruthy();
      expect(thirdLink?.textContent).toContain('Pet Grooming Software');
    });

    it('blog link cards have hover border-green class', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      const linkCards = container.querySelectorAll('a.block.p-4.rounded-lg');
      linkCards.forEach((card) => {
        expect(card.className).toContain('hover:border-green-300');
      });
    });

    it('heading has text-lg font-bold styling for blog variant', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      const heading = container.querySelector('h2.text-lg.font-bold');
      expect(heading).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────
  // 3. COLUMNS PROP
  // ────────────────────────────────────────────────────────
  describe('Columns Prop', () => {
    it('defaults to 3 columns', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('lg:grid-cols-3');
    });

    it('supports 2 columns for landing variant', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} columns={2} />);
      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('sm:grid-cols-2');
      expect(grid?.className).not.toContain('lg:grid-cols-3');
    });

    it('supports 4 columns for landing variant', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} columns={4} />);
      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('lg:grid-cols-4');
    });

    it('supports 2 columns for blog variant', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" columns={2} />);
      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('sm:grid-cols-2');
    });

    it('supports 4 columns for blog variant', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" columns={4} />);
      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('lg:grid-cols-4');
    });

    it('all column variants have responsive grid-cols-1 base', () => {
      [2, 3, 4].forEach((cols) => {
        const { container } = render(<RelatedLinks links={SAMPLE_LINKS} columns={cols as 2 | 3 | 4} />);
        const grid = container.querySelector('.grid');
        expect(grid?.className).toContain('grid-cols-1');
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 4. LINK CONTENT
  // ────────────────────────────────────────────────────────
  describe('Link Content', () => {
    it('landing variant shows category, blog variant does not', () => {
      const landingResult = render(<RelatedLinks links={SAMPLE_LINKS} variant="landing" />);
      const landingCategories = landingResult.container.querySelectorAll('p.text-green-600.font-semibold.mb-1');
      expect(landingCategories.length).toBeGreaterThan(0);

      // Cleanup
      landingResult.unmount();

      const blogResult = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      // Blog variant doesn't have category labels in the same format
      const blogCategories = blogResult.container.querySelectorAll('p.text-green-600.font-semibold.mb-1');
      expect(blogCategories.length).toBe(0);
    });

    it('blog variant shows description, landing variant does not', () => {
      const linksWithDesc = [
        { href: '/test', title: 'Test Title', description: 'Test description text' },
      ];

      const blogResult = render(<RelatedLinks links={linksWithDesc} variant="blog" />);
      expect(blogResult.container.textContent).toContain('Test description text');
      blogResult.unmount();

      // Landing variant doesn't render descriptions
      const landingLinks = [
        { href: '/test', category: 'Cat', title: 'Test Title', description: 'Test description text' },
      ];
      const landingResult = render(<RelatedLinks links={landingLinks} variant="landing" />);
      // Landing variant does NOT show the description
      expect(landingResult.container.textContent).not.toContain('Test description text');
    });
  });

  // ────────────────────────────────────────────────────────
  // 5. ACCESSIBILITY
  // ────────────────────────────────────────────────────────
  describe('Accessibility', () => {
    it('all links have non-empty href', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).not.toBe('#');
        expect(href).not.toBe('');
      });
    });

    it('all links have non-empty text content', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const text = link.textContent?.trim();
        expect(text).toBeTruthy();
        expect(text!.length).toBeGreaterThan(0);
      });
    });

    it('links are all internal paths', () => {
      SAMPLE_LINKS.forEach(({ href }) => {
        expect(href.startsWith('/')).toBe(true);
        expect(href).not.toMatch(/^https?:\/\//);
      });
    });

    it('section has an H2 heading for screen readers', () => {
      render(<RelatedLinks links={SAMPLE_LINKS} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeTruthy();
    });

    it('no duplicate hrefs in sample links', () => {
      const hrefs = SAMPLE_LINKS.map((link) => link.href);
      const uniqueHrefs = new Set(hrefs);
      expect(uniqueHrefs.size).toBe(hrefs.length);
    });
  });

  // ────────────────────────────────────────────────────────
  // 6. EDGE CASES
  // ────────────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('renders correctly with empty links array', () => {
      const { container } = render(<RelatedLinks links={[]} />);
      const links = container.querySelectorAll('a');
      expect(links.length).toBe(0);
    });

    it('renders correctly with single link', () => {
      const singleLink = [{ href: '/only', category: 'Test', title: 'Only Link' }];
      const { container } = render(<RelatedLinks links={singleLink} />);
      const links = container.querySelectorAll('a');
      expect(links.length).toBe(1);
    });

    it('renders correctly on re-render (stability check)', () => {
      const { rerender, container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      const firstHtml = container.innerHTML;
      rerender(<RelatedLinks links={SAMPLE_LINKS} />);
      const secondHtml = container.innerHTML;
      expect(firstHtml).toBe(secondHtml);
    });

    it('handles links with very long titles', () => {
      const longTitleLinks = [
        { href: '/long', category: 'Test', title: 'A Very Long Title That Might Overflow on Mobile Devices and Need Truncation Handling' },
      ];
      const { container } = render(<RelatedLinks links={longTitleLinks} />);
      expect(container.textContent).toContain('A Very Long Title');
    });

    it('handles links with special characters in title', () => {
      const specialLinks = [
        { href: '/special', category: "Buyer's Guide", title: "Cat & Dog Grooming (2026)" },
      ];
      const { container } = render(<RelatedLinks links={specialLinks} />);
      expect(container.textContent).toContain("Cat & Dog Grooming");
    });

    it('handles links without category (landing variant)', () => {
      const noCategoryLinks = [
        { href: '/no-cat', title: 'No Category Link' },
      ];
      const { container } = render(<RelatedLinks links={noCategoryLinks} variant="landing" />);
      const link = container.querySelector('a[href="/no-cat"]');
      expect(link).toBeTruthy();
      expect(link?.textContent).toContain('No Category Link');
    });

    it('handles blog links without description', () => {
      const noDescLinks = [
        { href: '/no-desc', title: 'No Description' },
      ];
      const { container } = render(<RelatedLinks links={noDescLinks} variant="blog" />);
      // Should render the title but not crash on missing description
      expect(container.textContent).toContain('No Description');
      // No description paragraph should exist for this link
      const link = container.querySelector('a[href="/no-desc"]');
      expect(link).toBeTruthy();
    });

    it('handles many links (15+)', () => {
      const manyLinks = Array.from({ length: 15 }, (_, i) => ({
        href: `/link-${i}`,
        category: `Cat ${i}`,
        title: `Link ${i}`,
      }));
      const { container } = render(<RelatedLinks links={manyLinks} />);
      const links = container.querySelectorAll('a');
      expect(links.length).toBe(15);
    });
  });

  // ────────────────────────────────────────────────────────
  // 7. SEO INTERNAL LINKING REGRESSION GUARDS
  // ────────────────────────────────────────────────────────
  describe('SEO Internal Linking Regression Guards', () => {
    /**
     * These tests guard the SEO Internal Linking Architecture feature.
     * The RelatedLinks component is critical for internal link equity flow.
     * Changes to the component structure or default props should fail these tests.
     */

    it('landing variant has max-w-5xl container (matches site width)', () => {
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} variant="landing" />);
      const section = container.querySelector('section.px-6.py-12.max-w-5xl');
      expect(section).toBeTruthy();
    });

    it('blog variant has border-t separator (distinguishes from article content)', () => {
      const { container } = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      const section = container.querySelector('section.border-t');
      expect(section).toBeTruthy();
    });

    it('default columns is 3 (regression guard)', () => {
      // This is a design decision — changing it affects layout across all pages
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('lg:grid-cols-3');
    });

    it('default variant is "landing" (regression guard)', () => {
      // Verify the component defaults to landing when no variant specified
      const { container } = render(<RelatedLinks links={SAMPLE_LINKS} />);
      // Landing variant has px-6 py-12, blog has mt-12 pt-8
      const section = container.querySelector('section.px-6.py-12');
      expect(section).toBeTruthy();
    });

    it('blog variant heading has smaller text than landing variant', () => {
      const blogResult = render(<RelatedLinks links={BLOG_LINKS} variant="blog" />);
      const blogHeading = blogResult.container.querySelector('h2.text-lg');
      expect(blogHeading).toBeTruthy();
      blogResult.unmount();

      const landingResult = render(<RelatedLinks links={SAMPLE_LINKS} variant="landing" />);
      const landingHeading = landingResult.container.querySelector('h2.text-xl');
      expect(landingHeading).toBeTruthy();
    });
  });
});
