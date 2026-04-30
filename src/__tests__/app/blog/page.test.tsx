/**
 * Unit tests for Blog Index Page (src/app/blog/page.tsx).
 *
 * Strategy: Test the blog index page that lists all blog posts.
 * Covers: rendering, links to all posts, metadata, schema markup,
 * CTA section, footer, accessibility, SEO regression guards.
 *
 * These tests guard the SEO Internal Linking Architecture feature.
 * The blog index is a critical hub for internal link equity distribution.
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

// Mock blogPosts data
jest.mock('@/lib/blog-posts', () => ({
  blogPosts: [
    {
      slug: 'dog-grooming-software',
      title: 'Dog Grooming Software: The 2026 Buyer\'s Guide',
      description: 'Compare the best dog grooming software for 2026.',
      publishedAt: '2026-04-17',
    },
    {
      slug: 'pet-grooming-software',
      title: 'Pet Grooming Software: What It Is and Why Your Business Needs It',
      description: 'Pet grooming software automates booking and reminders.',
      publishedAt: '2026-04-21',
    },
    {
      slug: 'reduce-no-shows-dog-grooming',
      title: 'How to Reduce No-Shows in Your Dog Grooming Business',
      description: 'Cut grooming no-shows by 60%.',
      publishedAt: '2026-04-06',
    },
    {
      slug: 'free-dog-grooming-software',
      title: 'Free Dog Grooming Software: What You Actually Get',
      description: 'Honest look at free dog grooming software.',
      publishedAt: '2026-04-23',
    },
    {
      slug: 'dog-grooming-business-plan-template',
      title: 'Dog Grooming Business Plan Template: Free Download',
      description: 'Free dog grooming business plan template.',
      publishedAt: '2026-04-28',
    },
  ],
  BlogPost: undefined, // Type export
}));

import BlogIndexPage from '@/app/blog/page';

describe('Blog Index Page', () => {
  // ────────────────────────────────────────────────────────
  // 1. BASIC RENDER
  // ────────────────────────────────────────────────────────
  describe('Basic Render', () => {
    it('renders without crashing', () => {
      const { container } = render(<BlogIndexPage />);
      expect(container).toBeTruthy();
    });

    it('renders the page title "GroomGrid Blog"', () => {
      render(<BlogIndexPage />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1.textContent).toContain('GroomGrid Blog');
    });

    it('renders the blog description', () => {
      const { container } = render(<BlogIndexPage />);
      expect(container.textContent).toMatch(/expert tips/i);
      expect(container.textContent).toMatch(/pet grooming/i);
    });

    it('has a "Back to Home" link', () => {
      render(<BlogIndexPage />);
      const backLink = screen.getByText(/back to home/i);
      expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });
  });

  // ────────────────────────────────────────────────────────
  // 2. BLOG POST LINKS
  // ────────────────────────────────────────────────────────
  describe('Blog Post Links', () => {
    it('renders a link for each blog post', () => {
      const { container } = render(<BlogIndexPage />);
      // 5 mocked blog posts
      const postLinks = container.querySelectorAll('a[href^="/blog/"]');
      // Filter out the back-to-home link (it's href="/")
      const blogPostLinks = Array.from(postLinks).filter(
        (link) => link.getAttribute('href') !== '/'
      );
      // 5 blog post cards + footer internal links that also match /blog/*
      expect(blogPostLinks.length).toBeGreaterThanOrEqual(5);
    });

    it('each blog post link has correct href pattern', () => {
      const { container } = render(<BlogIndexPage />);
      const expectedSlugs = [
        'dog-grooming-software',
        'pet-grooming-software',
        'reduce-no-shows-dog-grooming',
        'free-dog-grooming-software',
        'dog-grooming-business-plan-template',
      ];
      expectedSlugs.forEach((slug) => {
        const link = container.querySelector(`a[href="/blog/${slug}"]`);
        expect(link).toBeTruthy();
      });
    });

    it('each blog post card displays the title', () => {
      const { container } = render(<BlogIndexPage />);
      const expectedTitles = [
        'Dog Grooming Software',
        'Pet Grooming Software',
        'How to Reduce No-Shows',
        'Free Dog Grooming Software',
        'Dog Grooming Business Plan Template',
      ];
      expectedTitles.forEach((title) => {
        expect(container.textContent).toContain(title);
      });
    });

    it('each blog post card displays the description', () => {
      const { container } = render(<BlogIndexPage />);
      // All descriptions should be rendered
      expect(container.textContent).toContain('Compare the best dog grooming software');
      expect(container.textContent).toContain('Pet grooming software automates booking');
      expect(container.textContent).toContain('Cut grooming no-shows by 60%');
    });

    it('each blog post card has an article element', () => {
      const { container } = render(<BlogIndexPage />);
      const articles = container.querySelectorAll('article');
      expect(articles.length).toBe(5);
    });

    it('blog post cards are in a grid layout', () => {
      const { container } = render(<BlogIndexPage />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeTruthy();
      expect(grid?.className).toContain('md:grid-cols-2');
    });
  });

  // ────────────────────────────────────────────────────────
  // 3. CTA SECTION
  // ────────────────────────────────────────────────────────
  describe('CTA Section', () => {
    it('renders a CTA heading about streamlining grooming business', () => {
      render(<BlogIndexPage />);
      const ctaHeading = screen.getByRole('heading', { name: /streamline your grooming business/i });
      expect(ctaHeading).toBeTruthy();
    });

    it('CTA has a signup link', () => {
      const { container } = render(<BlogIndexPage />);
      const signupLink = container.querySelector('a[href="/signup"]');
      expect(signupLink).toBeTruthy();
      expect(signupLink?.textContent).toMatch(/start free trial/i);
    });

    it('CTA mentions free trial duration', () => {
      const { container } = render(<BlogIndexPage />);
      expect(container.textContent).toMatch(/14 days free/i);
    });
  });

  // ────────────────────────────────────────────────────────
  // 4. FOOTER
  // ────────────────────────────────────────────────────────
  describe('Footer', () => {
    it('renders a footer element', () => {
      const { container } = render(<BlogIndexPage />);
      const footer = container.querySelector('footer');
      expect(footer).toBeTruthy();
    });

    it('renders copyright notice', () => {
      const { container } = render(<BlogIndexPage />);
      const footer = container.querySelector('footer');
      expect(footer?.textContent).toMatch(/© 2026 GroomGrid/);
    });

    it('renders legal links (Privacy & Terms)', () => {
      render(<BlogIndexPage />);
      const privacyLink = screen.getByRole('link', { name: /privacy/i });
      expect(privacyLink).toHaveAttribute('href', '/privacy');
      const termsLink = screen.getByRole('link', { name: /terms/i });
      expect(termsLink).toHaveAttribute('href', '/terms');
    });
  });

  // ────────────────────────────────────────────────────────
  // 5. SCHEMA MARKUP
  // ────────────────────────────────────────────────────────
  describe('Schema Markup', () => {
    it('renders Schema.org Blog markup', () => {
      const { container } = render(<BlogIndexPage />);
      const schemaScript = container.querySelector('script[type="application/ld+json"]');
      expect(schemaScript).toBeTruthy();
    });

    it('Schema.org markup contains @type Blog', () => {
      const { container } = render(<BlogIndexPage />);
      const schemaScript = container.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(schemaScript?.textContent || '{}');
      expect(schema['@type']).toBe('Blog');
    });

    it('Schema.org markup contains BlogPosting entries', () => {
      const { container } = render(<BlogIndexPage />);
      const schemaScript = container.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(schemaScript?.textContent || '{}');
      expect(schema.blogPost).toBeDefined();
      expect(schema.blogPost.length).toBe(5);
    });

    it('Schema.org markup has correct blog URL', () => {
      const { container } = render(<BlogIndexPage />);
      const schemaScript = container.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(schemaScript?.textContent || '{}');
      expect(schema.url).toBe('https://getgroomgrid.com/blog');
    });
  });

  // ────────────────────────────────────────────────────────
  // 6. ACCESSIBILITY
  // ────────────────────────────────────────────────────────
  describe('Accessibility', () => {
    it('has exactly one H1 heading', () => {
      const { container } = render(<BlogIndexPage />);
      const h1s = container.querySelectorAll('h1');
      expect(h1s.length).toBe(1);
    });

    it('each blog post card has an H2 heading', () => {
      const { container } = render(<BlogIndexPage />);
      const h2s = container.querySelectorAll('h2');
      // Blog post titles are H2s, plus CTA heading
      expect(h2s.length).toBeGreaterThanOrEqual(5);
    });

    it('all links have non-empty href attributes', () => {
      const { container } = render(<BlogIndexPage />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).not.toBe('#');
        expect(href).not.toBe('');
      });
    });

    it('all links have non-empty text content', () => {
      const { container } = render(<BlogIndexPage />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const text = link.textContent?.trim();
        expect(text).toBeTruthy();
        expect(text!.length).toBeGreaterThan(0);
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 7. SEO INTERNAL LINKING REGRESSION GUARDS
  // ────────────────────────────────────────────────────────
  describe('SEO Internal Linking Regression Guards', () => {
    it('blog post links use /blog/{slug} URL pattern', () => {
      const { container } = render(<BlogIndexPage />);
      const postLinks = container.querySelectorAll('a[href^="/blog/"]');
      postLinks.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).toMatch(/^\/blog\/[a-z0-9-]+$/);
      });
    });

    it('blog index links to every post returned by blogPosts data', () => {
      const { container } = render(<BlogIndexPage />);
      const postLinks = container.querySelectorAll('a[href^="/blog/"]');
      expect(postLinks.length).toBeGreaterThanOrEqual(5);
    });
  });
});
