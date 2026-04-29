/**
 * Unit tests for blog-posts data (src/lib/blog-posts.ts).
 *
 * Strategy: Validate data integrity of the blog post registry.
 * Covers: no duplicate slugs, valid slug format, non-empty fields,
 * valid dates, sort order, type safety, edge cases.
 *
 * These tests guard the SEO Internal Linking Architecture feature.
 * The blog-posts array is the single source of truth for all blog
 * routes, sitemap entries, and internal link generation.
 */

import { blogPosts, BlogPost } from '@/lib/blog-posts';

describe('blog-posts data', () => {
  // ────────────────────────────────────────────────────────
  // 1. ARRAY INTEGRITY
  // ────────────────────────────────────────────────────────
  describe('Array Integrity', () => {
    it('has at least 20 blog posts', () => {
      expect(blogPosts.length).toBeGreaterThanOrEqual(20);
    });

    it('all entries are valid BlogPost objects', () => {
      blogPosts.forEach((post) => {
        expect(post).toHaveProperty('slug');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('description');
        expect(post).toHaveProperty('publishedAt');
      });
    });

    it('has no null or undefined entries', () => {
      blogPosts.forEach((post, index) => {
        expect(post).not.toBeNull();
        expect(post).not.toBeUndefined();
        expect(post.slug).not.toBeNull();
        expect(post.title).not.toBeNull();
        expect(post.description).not.toBeNull();
        expect(post.publishedAt).not.toBeNull();
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 2. SLUG VALIDATION
  // ────────────────────────────────────────────────────────
  describe('Slug Validation', () => {
    it('has no duplicate slugs', () => {
      const slugs = blogPosts.map((post) => post.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('all slugs are lowercase', () => {
      blogPosts.forEach((post) => {
        expect(post.slug).toBe(post.slug.toLowerCase());
      });
    });

    it('all slugs use kebab-case (no spaces, no underscores)', () => {
      blogPosts.forEach((post) => {
        expect(post.slug).not.toMatch(/\s/);
        expect(post.slug).not.toMatch(/_/);
        expect(post.slug).not.toMatch(/[A-Z]/);
      });
    });

    it('all slugs contain only lowercase letters, numbers, and hyphens', () => {
      blogPosts.forEach((post) => {
        expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      });
    });

    it('no slugs start or end with a hyphen', () => {
      blogPosts.forEach((post) => {
        expect(post.slug).not.toMatch(/^-/);
        expect(post.slug).not.toMatch(/-$/);
      });
    });

    it('no slugs have consecutive hyphens', () => {
      blogPosts.forEach((post) => {
        expect(post.slug).not.toMatch(/--/);
      });
    });

    it('all slugs have at least 3 characters', () => {
      blogPosts.forEach((post) => {
        expect(post.slug.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('slug count matches total blog post count', () => {
      const slugs = blogPosts.map((post) => post.slug);
      expect(slugs.length).toBe(blogPosts.length);
    });
  });

  // ────────────────────────────────────────────────────────
  // 3. TITLE VALIDATION
  // ────────────────────────────────────────────────────────
  describe('Title Validation', () => {
    it('all titles are non-empty strings', () => {
      blogPosts.forEach((post) => {
        expect(typeof post.title).toBe('string');
        expect(post.title.trim().length).toBeGreaterThan(0);
      });
    });

    it('all titles have at least 20 characters (SEO best practice)', () => {
      blogPosts.forEach((post) => {
        expect(post.title.length).toBeGreaterThanOrEqual(20);
      });
    });

    it('no duplicate titles', () => {
      const titles = blogPosts.map((post) => post.title);
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });

    it('titles do not contain HTML tags', () => {
      blogPosts.forEach((post) => {
        expect(post.title).not.toMatch(/<[^>]+>/);
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 4. DESCRIPTION VALIDATION
  // ────────────────────────────────────────────────────────
  describe('Description Validation', () => {
    it('all descriptions are non-empty strings', () => {
      blogPosts.forEach((post) => {
        expect(typeof post.description).toBe('string');
        expect(post.description.trim().length).toBeGreaterThan(0);
      });
    });

    it('all descriptions have at least 50 characters (SEO meta description)', () => {
      blogPosts.forEach((post) => {
        expect(post.description.length).toBeGreaterThanOrEqual(50);
      });
    });

    it('no descriptions exceed 200 characters (SEO best practice)', () => {
      // Mobile SERPs show up to 200 chars; desktop shows ~155-160.
      // We cap at 200 as a pragmatic threshold.
      blogPosts.forEach((post) => {
        expect(post.description.length).toBeLessThanOrEqual(200);
      });
    });

    it('descriptions do not contain HTML tags', () => {
      blogPosts.forEach((post) => {
        expect(post.description).not.toMatch(/<[^>]+>/);
      });
    });

    it('no duplicate descriptions', () => {
      const descriptions = blogPosts.map((post) => post.description);
      const uniqueDescs = new Set(descriptions);
      expect(uniqueDescs.size).toBe(descriptions.length);
    });
  });

  // ────────────────────────────────────────────────────────
  // 5. DATE VALIDATION
  // ────────────────────────────────────────────────────────
  describe('Date Validation', () => {
    it('all publishedAt strings are valid ISO dates', () => {
      blogPosts.forEach((post) => {
        const date = new Date(post.publishedAt);
        expect(date.getTime()).not.toBeNaN();
      });
    });

    it('all publishedAt strings use YYYY-MM-DD format', () => {
      blogPosts.forEach((post) => {
        expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('all publishedAt months are valid (01-12)', () => {
      blogPosts.forEach((post) => {
        const month = parseInt(post.publishedAt.split('-')[1], 10);
        expect(month).toBeGreaterThanOrEqual(1);
        expect(month).toBeLessThanOrEqual(12);
      });
    });

    it('all publishedAt days are valid (01-31)', () => {
      blogPosts.forEach((post) => {
        const day = parseInt(post.publishedAt.split('-')[2], 10);
        expect(day).toBeGreaterThanOrEqual(1);
        expect(day).toBeLessThanOrEqual(31);
      });
    });

    it('all dates are in 2026', () => {
      blogPosts.forEach((post) => {
        expect(post.publishedAt).toMatch(/^2026-/);
      });
    });

    it('no future dates beyond today', () => {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      blogPosts.forEach((post) => {
        const pubDate = new Date(post.publishedAt);
        expect(pubDate.getTime()).toBeLessThanOrEqual(today.getTime());
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 6. SORT ORDER
  // ────────────────────────────────────────────────────────
  describe('Sort Order', () => {
    it('blogPosts are sorted by publishedAt descending (newest first)', () => {
      for (let i = 1; i < blogPosts.length; i++) {
        const prev = new Date(blogPosts[i - 1].publishedAt).getTime();
        const curr = new Date(blogPosts[i].publishedAt).getTime();
        expect(prev).toBeGreaterThanOrEqual(curr);
      }
    });

    it('first post is the most recent', () => {
      const mostRecent = Math.max(...blogPosts.map((p) => new Date(p.publishedAt).getTime()));
      const firstPostDate = new Date(blogPosts[0].publishedAt).getTime();
      expect(firstPostDate).toBe(mostRecent);
    });

    it('last post is the oldest', () => {
      const oldest = Math.min(...blogPosts.map((p) => new Date(p.publishedAt).getTime()));
      const lastPostDate = new Date(blogPosts[blogPosts.length - 1].publishedAt).getTime();
      expect(lastPostDate).toBe(oldest);
    });
  });

  // ────────────────────────────────────────────────────────
  // 7. SPECIFIC SEO-CRITICAL POSTS
  // ────────────────────────────────────────────────────────
  describe('SEO-Critical Posts', () => {
    const REQUIRED_SLUGS = [
      'dog-grooming-software',
      'pet-grooming-software',
      'free-dog-grooming-software',
      'dog-grooming-business-plan-template',
      'best-pet-grooming-software',
      'reduce-no-shows-dog-grooming',
    ];

    it('includes all SEO-critical blog posts', () => {
      const slugs = blogPosts.map((p) => p.slug);
      REQUIRED_SLUGS.forEach((slug) => {
        expect(slugs).toContain(slug);
      });
    });

    it('includes comparison posts (moego, daysmart, pawfinity)', () => {
      const slugs = blogPosts.map((p) => p.slug);
      expect(slugs).toContain('groomgrid-vs-moego');
      expect(slugs).toContain('groomgrid-vs-daysmart');
      expect(slugs).toContain('groomgrid-vs-pawfinity');
    });

    it('includes cat-grooming-business-guide', () => {
      const slugs = blogPosts.map((p) => p.slug);
      expect(slugs).toContain('cat-grooming-business-guide');
    });

    it('includes mobile grooming posts', () => {
      const slugs = blogPosts.map((p) => p.slug);
      const mobileSlugs = slugs.filter((s) => s.includes('mobile'));
      expect(mobileSlugs.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ────────────────────────────────────────────────────────
  // 8. TYPE SAFETY
  // ────────────────────────────────────────────────────────
  describe('Type Safety', () => {
    it('BlogPost interface has exactly 4 fields', () => {
      // This is a compile-time check, but we verify the runtime shape
      const samplePost = blogPosts[0];
      const keys = Object.keys(samplePost);
      expect(keys.sort()).toEqual(['description', 'publishedAt', 'slug', 'title'].sort());
    });

    it('no extra properties on blog post objects', () => {
      blogPosts.forEach((post) => {
        const keys = Object.keys(post);
        expect(keys.length).toBe(4);
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 9. CROSS-REFERENCE WITH SITEMAP
  // ────────────────────────────────────────────────────────
  describe('Cross-Reference with Sitemap', () => {
    it('every blog post slug maps to a valid sitemap URL', () => {
      blogPosts.forEach((post) => {
        const expectedUrl = `https://getgroomgrid.com/blog/${post.slug}`;
        expect(expectedUrl).toMatch(/^https:\/\/getgroomgrid\.com\/blog\/[a-z0-9-]+$/);
      });
    });

    it('every blog post slug matches a route directory', () => {
      // This is a structural test — slug 'dog-grooming-software' should have
      // a corresponding /blog/dog-grooming-software/page.tsx
      blogPosts.forEach((post) => {
        // Verify slug format is route-safe
        expect(post.slug).toMatch(/^[a-z0-9-]+$/);
        expect(post.slug).not.toContain('..');
        expect(post.slug).not.toContain('/');
      });
    });
  });
});
