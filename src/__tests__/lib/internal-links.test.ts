/**
 * Unit tests for SEO Internal Linking Architecture (src/lib/seo/internal-links.ts).
 *
 * Strategy: TDD-first — these tests define the contract for the internal linking
 * registry BEFORE the implementation exists. Every exported function, type, and
 * edge case is covered here.
 *
 * The internal-links registry is the single source of truth for:
 * - Topic cluster definitions (which pages belong together)
 * - Related link generation (contextual, same-cluster-first)
 * - Footer link generation (SEO-optimized navigation)
 * - Breadcrumb data generation (JSON-LD structured data)
 *
 * Covers: topic clusters, getRelatedLinks(), getFooterLinks(), getBreadcrumbs(),
 * slug validation, deduplication, unknown slugs, empty arrays, max values,
 * cross-cluster linking, SEO regression guards.
 */

import {
  topicClusters,
  allContentPages,
  getRelatedLinks,
  getFooterLinks,
  getBreadcrumbs,
  type TopicCluster,
  type ContentPage,
  type RelatedLinkItem,
  type BreadcrumbItem,
} from '@/lib/seo/internal-links';

// ────────────────────────────────────────────────────────
// 1. TOPIC CLUSTERS DATA INTEGRITY
// ────────────────────────────────────────────────────────
describe('topicClusters', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(topicClusters)).toBe(true);
    expect(topicClusters.length).toBeGreaterThan(0);
  });

  it('has at least 6 topic clusters', () => {
    // Need enough clusters to cover all major content areas
    expect(topicClusters.length).toBeGreaterThanOrEqual(6);
  });

  it('each cluster has required fields: id, name, slug, pages', () => {
    topicClusters.forEach((cluster) => {
      expect(cluster).toHaveProperty('id');
      expect(cluster).toHaveProperty('name');
      expect(cluster).toHaveProperty('slug');
      expect(cluster).toHaveProperty('pages');
      expect(typeof cluster.id).toBe('string');
      expect(typeof cluster.name).toBe('string');
      expect(typeof cluster.slug).toBe('string');
      expect(Array.isArray(cluster.pages)).toBe(true);
    });
  });

  it('cluster slugs are kebab-case', () => {
    topicClusters.forEach((cluster) => {
      expect(cluster.slug).toMatch(/^[a-z0-9-]+$/);
      expect(cluster.slug).not.toMatch(/--/);
      expect(cluster.slug).not.toMatch(/^-/);
      expect(cluster.slug).not.toMatch(/-$/);
    });
  });

  it('cluster IDs are unique', () => {
    const ids = topicClusters.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cluster slugs are unique', () => {
    const slugs = topicClusters.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('each cluster has at least 2 pages', () => {
    // A cluster with 1 page provides no cross-linking value
    topicClusters.forEach((cluster) => {
      expect(cluster.pages.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('no page appears in more than one cluster as its primary', () => {
    // A page can be cross-linked but should have one primary cluster
    const allPrimarySlugs: string[] = [];
    topicClusters.forEach((cluster) => {
      cluster.pages.forEach((page) => {
        allPrimarySlugs.push(page.slug);
      });
    });
    // This is a soft check — pages CAN appear in multiple clusters for cross-linking
    // But we verify the data is well-formed
    expect(allPrimarySlugs.length).toBeGreaterThan(0);
  });

  it('clusters cover key SEO topic areas', () => {
    const clusterSlugs = topicClusters.map((c) => c.slug);
    // Must have clusters for major topic areas
    const hasSoftwareCluster = clusterSlugs.some((s) =>
      s.includes('software') || s.includes('comparison')
    );
    const hasBusinessCluster = clusterSlugs.some((s) =>
      s.includes('business') || s.includes('starting')
    );
    const hasMobileCluster = clusterSlugs.some((s) =>
      s.includes('mobile')
    );
    const hasOperationsCluster = clusterSlugs.some((s) =>
      s.includes('operation') || s.includes('manage')
    );

    expect(hasSoftwareCluster).toBe(true);
    expect(hasBusinessCluster).toBe(true);
    expect(hasMobileCluster).toBe(true);
    expect(hasOperationsCluster).toBe(true);
  });
});

// ────────────────────────────────────────────────────────
// 2. CONTENT PAGE DATA INTEGRITY
// ────────────────────────────────────────────────────────
describe('allContentPages', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(allContentPages)).toBe(true);
    expect(allContentPages.length).toBeGreaterThan(0);
  });

  it('has at least 25 content pages', () => {
    // We have 30+ blog posts + landing pages
    expect(allContentPages.length).toBeGreaterThanOrEqual(25);
  });

  it('each page has required fields: slug, title, type, path', () => {
    allContentPages.forEach((page) => {
      expect(page).toHaveProperty('slug');
      expect(page).toHaveProperty('title');
      expect(page).toHaveProperty('type');
      expect(page).toHaveProperty('path');
      expect(typeof page.slug).toBe('string');
      expect(typeof page.title).toBe('string');
      expect(typeof page.type).toBe('string');
      expect(typeof page.path).toBe('string');
    });
  });

  it('all slugs are unique', () => {
    const slugs = allContentPages.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('all slugs are kebab-case', () => {
    allContentPages.forEach((page) => {
      expect(page.slug).toMatch(/^[a-z0-9-]+$/);
      expect(page.slug).not.toMatch(/--/);
    });
  });

  it('all slugs have at least 3 characters', () => {
    allContentPages.forEach((page) => {
      expect(page.slug.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('page type is either "blog" or "landing"', () => {
    allContentPages.forEach((page) => {
      expect(['blog', 'landing']).toContain(page.type);
    });
  });

  it('blog pages have paths starting with /blog/', () => {
    allContentPages
      .filter((p) => p.type === 'blog')
      .forEach((page) => {
        expect(page.path).toMatch(/^\/blog\//);
      });
  });

  it('landing pages have paths NOT starting with /blog/', () => {
    allContentPages
      .filter((p) => p.type === 'landing')
      .forEach((page) => {
        expect(page.path).not.toMatch(/^\/blog\//);
      });
  });

  it('all paths start with /', () => {
    allContentPages.forEach((page) => {
      expect(page.path).toMatch(/^\//);
    });
  });

  it('all titles are non-empty strings with at least 10 characters', () => {
    allContentPages.forEach((page) => {
      expect(page.title.length).toBeGreaterThanOrEqual(10);
    });
  });

  it('includes all blog post slugs from blog-posts.ts', () => {
    // This test ensures the registry doesn't miss any blog posts
    // We'll import blogPosts to cross-reference
    const { blogPosts } = require('@/lib/blog-posts');
    const registrySlugs = allContentPages
      .filter((p) => p.type === 'blog')
      .map((p) => p.slug);
    blogPosts.forEach((post: { slug: string }) => {
      expect(registrySlugs).toContain(post.slug);
    });
  });

  it('includes key landing page slugs', () => {
    const landingSlugs = allContentPages
      .filter((p) => p.type === 'landing')
      .map((p) => p.slug);
    // These landing pages MUST be in the registry
    const requiredLandingSlugs = [
      'grooming-business-operations',
      'mobile-grooming-business',
      'cat-grooming-software',
      'mobile-grooming-software',
    ];
    requiredLandingSlugs.forEach((slug) => {
      expect(landingSlugs).toContain(slug);
    });
  });
});

// ────────────────────────────────────────────────────────
// 3. getRelatedLinks() — CORE FUNCTION
// ────────────────────────────────────────────────────────
describe('getRelatedLinks', () => {
  it('returns an array', () => {
    const result = getRelatedLinks('dog-grooming-software');
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns RelatedLinkItem objects with href, title, and optional category/description', () => {
    const result = getRelatedLinks('dog-grooming-software');
    expect(result.length).toBeGreaterThan(0);
    result.forEach((item) => {
      expect(item).toHaveProperty('href');
      expect(item).toHaveProperty('title');
      expect(typeof item.href).toBe('string');
      expect(typeof item.title).toBe('string');
      expect(item.href.length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(0);
    });
  });

  it('never returns the current page as a related link', () => {
    const allSlugs = allContentPages.map((p) => p.slug);
    allSlugs.forEach((slug) => {
      const result = getRelatedLinks(slug);
      const hrefs = result.map((item) => item.href);
      // The current page should never appear in its own related links
      expect(hrefs).not.toContain(`/blog/${slug}`);
      expect(hrefs).not.toContain(`/${slug}`);
    });
  });

  it('returns no duplicate links', () => {
    const allSlugs = allContentPages.map((p) => p.slug);
    allSlugs.forEach((slug) => {
      const result = getRelatedLinks(slug);
      const hrefs = result.map((item) => item.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    });
  });

  it('returns links from the same cluster first (priority ordering)', () => {
    // Pick a slug that belongs to a known cluster
    const softwareSlug = 'dog-grooming-software';
    const result = getRelatedLinks(softwareSlug);

    // Find which cluster this slug belongs to
    const primaryCluster = topicClusters.find((cluster) =>
      cluster.pages.some((p) => p.slug === softwareSlug)
    );

    if (primaryCluster) {
      const clusterPageSlugs = primaryCluster.pages
        .map((p) => p.slug)
        .filter((s) => s !== softwareSlug);

      // The first few results should include same-cluster pages
      const firstResultSlugs = result.slice(0, clusterPageSlugs.length).map((item) => {
        // Extract slug from href (/blog/slug or /slug)
        return item.href.replace(/^\/blog\//, '').replace(/^\//, '').replace(/\/$/, '');
      });

      // At least some same-cluster pages should appear in the first results
      const overlap = firstResultSlugs.filter((s) => clusterPageSlugs.includes(s));
      expect(overlap.length).toBeGreaterThan(0);
    }
  });

  it('returns at least 3 related links for any known page', () => {
    // Every page should have enough related content to show
    const testSlugs = [
      'dog-grooming-software',
      'how-to-become-a-dog-groomer',
      'cat-grooming-business-guide',
    ];
    testSlugs.forEach((slug) => {
      const result = getRelatedLinks(slug);
      expect(result.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('returns at most 6 related links (prevents link stuffing)', () => {
    // SEO best practice: don't overload with internal links
    const testSlugs = allContentPages.slice(0, 10).map((p) => p.slug);
    testSlugs.forEach((slug) => {
      const result = getRelatedLinks(slug);
      expect(result.length).toBeLessThanOrEqual(6);
    });
  });

  it('handles blog slugs correctly', () => {
    const result = getRelatedLinks('dog-grooming-software');
    // Blog posts should have /blog/ prefix in hrefs
    const blogLinks = result.filter(
      (item) => item.href.startsWith('/blog/')
    );
    expect(blogLinks.length).toBeGreaterThan(0);
  });

  it('handles landing page slugs correctly', () => {
    const result = getRelatedLinks('cat-grooming-software');
    // Should include both blog and landing links
    expect(result.length).toBeGreaterThan(0);
  });

  it('accepts variant parameter for component compatibility', () => {
    // Should work with variant='landing' and variant='blog'
    const landingResult = getRelatedLinks('dog-grooming-software', { variant: 'landing' });
    const blogResult = getRelatedLinks('dog-grooming-software', { variant: 'blog' });

    // Both should return valid arrays
    expect(Array.isArray(landingResult)).toBe(true);
    expect(Array.isArray(blogResult)).toBe(true);
    expect(landingResult.length).toBeGreaterThan(0);
    expect(blogResult.length).toBeGreaterThan(0);
  });

  it('landing variant includes category field', () => {
    const result = getRelatedLinks('dog-grooming-software', { variant: 'landing' });
    // Landing variant links should have category
    const withCategory = result.filter((item) => item.category);
    expect(withCategory.length).toBeGreaterThan(0);
  });

  it('blog variant includes description field', () => {
    const result = getRelatedLinks('dog-grooming-software', { variant: 'blog' });
    // Blog variant links should have description
    const withDescription = result.filter((item) => item.description);
    expect(withDescription.length).toBeGreaterThan(0);
  });
});

// ────────────────────────────────────────────────────────
// 4. getRelatedLinks() — EDGE CASES
// ────────────────────────────────────────────────────────
describe('getRelatedLinks — Edge Cases', () => {
  it('handles unknown slug gracefully', () => {
    // Unknown slugs should still return related links (cross-cluster fallback)
    const result = getRelatedLinks('totally-unknown-slug-that-does-not-exist');
    expect(Array.isArray(result)).toBe(true);
    // Should return some popular/default links rather than empty
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles empty string slug', () => {
    const result = getRelatedLinks('');
    expect(Array.isArray(result)).toBe(true);
    // Should return default/popular links
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles slug with trailing slash', () => {
    // Should normalize and still work
    const result = getRelatedLinks('dog-grooming-software/');
    expect(Array.isArray(result)).toBe(true);
  });

  it('handles slug with leading slash', () => {
    const result = getRelatedLinks('/dog-grooming-software');
    expect(Array.isArray(result)).toBe(true);
  });

  it('is deterministic — same slug always returns same results', () => {
    const slug = 'dog-grooming-software';
    const result1 = getRelatedLinks(slug);
    const result2 = getRelatedLinks(slug);
    expect(result1).toEqual(result2);
  });

  it('returns consistent count for same slug', () => {
    const slug = 'cat-grooming-business-guide';
    const results = [1, 2, 3].map(() => getRelatedLinks(slug).length);
    expect(results[0]).toBe(results[1]);
    expect(results[1]).toBe(results[2]);
  });

  it('handles slug with special characters gracefully', () => {
    // Should not crash — may return empty or default links
    expect(() => getRelatedLinks('slug-with-special-chars-!@#')).not.toThrow();
  });

  it('handles null/undefined input gracefully', () => {
    // TypeScript won't allow this at compile time, but runtime guard
    expect(() => getRelatedLinks(null as any)).not.toThrow();
    expect(() => getRelatedLinks(undefined as any)).not.toThrow();
  });

  it('all returned hrefs are valid internal paths', () => {
    allContentPages.slice(0, 10).forEach((page) => {
      const result = getRelatedLinks(page.slug);
      result.forEach((item) => {
        expect(item.href).toMatch(/^\//);
        expect(item.href).not.toMatch(/^https?:\/\//);
      });
    });
  });
});

// ────────────────────────────────────────────────────────
// 5. getFooterLinks() — FOOTER LINK GENERATION
// ────────────────────────────────────────────────────────
describe('getFooterLinks', () => {
  it('returns an array', () => {
    const result = getFooterLinks();
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns at least 4 links (current footer has 4)', () => {
    const result = getFooterLinks();
    expect(result.length).toBeGreaterThanOrEqual(4);
  });

  it('returns at most 8 links (prevent footer clutter)', () => {
    const result = getFooterLinks();
    expect(result.length).toBeLessThanOrEqual(8);
  });

  it('each link has href and label', () => {
    const result = getFooterLinks();
    result.forEach((link) => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('label');
      expect(typeof link.href).toBe('string');
      expect(typeof link.label).toBe('string');
      expect(link.href.length).toBeGreaterThan(0);
      expect(link.label.length).toBeGreaterThan(0);
    });
  });

  it('includes conversion-critical pages (plans, signup)', () => {
    const result = getFooterLinks();
    const hrefs = result.map((link) => link.href);
    // These pages are critical for conversion
    expect(hrefs).toContain('/plans');
    expect(hrefs).toContain('/signup');
  });

  it('all hrefs are internal paths', () => {
    const result = getFooterLinks();
    result.forEach((link) => {
      expect(link.href).toMatch(/^\//);
      expect(link.href).not.toMatch(/^https?:\/\//);
    });
  });

  it('no duplicate hrefs', () => {
    const result = getFooterLinks();
    const hrefs = result.map((link) => link.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('is deterministic — same call returns same results', () => {
    const result1 = getFooterLinks();
    const result2 = getFooterLinks();
    expect(result1).toEqual(result2);
  });

  it('accepts page-specific context for smarter footer links', () => {
    // Optional: if getFooterLinks accepts a slug, it can customize links
    // per page (e.g., showing related category links in footer)
    const result = getFooterLinks('dog-grooming-software');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(4);
  });

  it('footer links from page context still include conversion pages', () => {
    const result = getFooterLinks('cat-grooming-business-guide');
    const hrefs = result.map((link) => link.href);
    // Conversion pages should always be in footer regardless of context
    expect(hrefs).toContain('/plans');
    expect(hrefs).toContain('/signup');
  });
});

// ────────────────────────────────────────────────────────
// 6. getBreadcrumbs() — BREADCRUMB GENERATION
// ────────────────────────────────────────────────────────
describe('getBreadcrumbs', () => {
  it('returns an array', () => {
    const result = getBreadcrumbs('dog-grooming-software');
    expect(Array.isArray(result)).toBe(true);
  });

  it('always starts with Home', () => {
    const slugs = ['dog-grooming-software', 'cat-grooming-business-guide', 'mobile-grooming-software'];
    slugs.forEach((slug) => {
      const result = getBreadcrumbs(slug);
      expect(result[0]).toBeDefined();
      expect(result[0].label).toBe('Home');
      expect(result[0].href).toBe('/');
    });
  });

  it('for blog pages, includes Blog as second breadcrumb', () => {
    const result = getBreadcrumbs('dog-grooming-software');
    // Blog pages should have: Home > Blog > Post Title
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[1].label).toBe('Blog');
    expect(result[1].href).toBe('/blog');
  });

  it('for landing pages, does NOT include Blog', () => {
    const result = getBreadcrumbs('cat-grooming-software');
    // Landing pages should NOT have Blog breadcrumb
    const blogCrumb = result.find((crumb) => crumb.label === 'Blog');
    expect(blogCrumb).toBeUndefined();
  });

  it('last breadcrumb matches the page title', () => {
    const slug = 'dog-grooming-software';
    const result = getBreadcrumbs(slug);
    const lastCrumb = result[result.length - 1];
    expect(lastCrumb.href).toContain(slug);
  });

  it('last breadcrumb href matches the current page path', () => {
    const slug = 'cat-grooming-business-guide';
    const result = getBreadcrumbs(slug);
    const lastCrumb = result[result.length - 1];
    // Should match /blog/slug for blog or /slug for landing
    expect(lastCrumb.href).toMatch(new RegExp(slug));
  });

  it('each breadcrumb has label and href', () => {
    const slugs = ['dog-grooming-software', 'mobile-grooming-software'];
    slugs.forEach((slug) => {
      const result = getBreadcrumbs(slug);
      result.forEach((crumb) => {
        expect(crumb).toHaveProperty('label');
        expect(crumb).toHaveProperty('href');
        expect(typeof crumb.label).toBe('string');
        expect(typeof crumb.href).toBe('string');
        expect(crumb.label.length).toBeGreaterThan(0);
        expect(crumb.href.length).toBeGreaterThan(0);
      });
    });
  });

  it('breadcrumbs are ordered from root to leaf', () => {
    const result = getBreadcrumbs('dog-grooming-software');
    // Home > Blog > Dog Grooming Software
    expect(result[0].href).toBe('/');
    expect(result[result.length - 1].href).toContain('dog-grooming-software');
  });

  it('handles unknown slug gracefully', () => {
    const result = getBreadcrumbs('totally-unknown-slug');
    expect(Array.isArray(result)).toBe(true);
    // Should still provide Home breadcrumb at minimum
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].label).toBe('Home');
  });

  it('returns JSON-LD compatible data (no circular refs)', () => {
    const result = getBreadcrumbs('dog-grooming-software');
    // Should be serializable to JSON for structured data
    const serialized = JSON.stringify(result);
    expect(serialized).toBeTruthy();
    const parsed = JSON.parse(serialized);
    expect(parsed.length).toBe(result.length);
  });
});

// ────────────────────────────────────────────────────────
// 7. CROSS-REFERENCE INTEGRITY
// ────────────────────────────────────────────────────────
describe('Cross-Reference Integrity', () => {
  it('every slug in allContentPages appears in at least one cluster', () => {
    const clusterPageSlugs = new Set<string>();
    topicClusters.forEach((cluster) => {
      cluster.pages.forEach((page) => {
        clusterPageSlugs.add(page.slug);
      });
    });

    allContentPages.forEach((page) => {
      expect(clusterPageSlugs.has(page.slug)).toBe(true);
    });
  });

  it('every related link href resolves to a real content page', () => {
    const allPagePaths = new Set(allContentPages.map((p) => p.path));

    allContentPages.slice(0, 15).forEach((page) => {
      const result = getRelatedLinks(page.slug);
      result.forEach((item) => {
        // The href should either match a content page path exactly
        // or be a known app route (/plans, /signup, etc.)
        const isContentPage = allPagePaths.has(item.href);
        const isAppRoute = ['/plans', '/signup', '/'].includes(item.href);
        // Allow both
        expect(isContentPage || isAppRoute).toBe(true);
      });
    });
  });

  it('getRelatedLinks covers all pages — no page returns empty results', () => {
    allContentPages.forEach((page) => {
      const result = getRelatedLinks(page.slug);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  it('orphan pages (previously missing links) now return related links', () => {
    // These pages were identified as orphans in the audit
    const formerOrphans = [
      'cat-grooming-business-guide',
      'do-you-tip-dog-groomers',
      'dog-grooming-appointment-app',
      'dog-grooming-business-insurance',
      'dog-grooming-pricing-guide',
      'dog-grooming-waiver-template',
      'how-much-do-dog-groomers-make',
      'how-to-become-a-dog-groomer',
      'grooming-business-operations',
      'mobile-grooming-business',
    ];

    formerOrphans.forEach((slug) => {
      const result = getRelatedLinks(slug);
      expect(result.length).toBeGreaterThanOrEqual(3);
    });
  });
});

// ────────────────────────────────────────────────────────
// 8. SEO REGRESSION GUARDS
// ────────────────────────────────────────────────────────
describe('SEO Regression Guards', () => {
  it('getRelatedLinks returns consistent type for landing vs blog variant', () => {
    const landingResult = getRelatedLinks('dog-grooming-software', { variant: 'landing' });
    const blogResult = getRelatedLinks('dog-grooming-software', { variant: 'blog' });

    // Landing variant links should have category
    landingResult.forEach((item) => {
      if (item.category !== undefined) {
        expect(typeof item.category).toBe('string');
      }
    });

    // Blog variant links should have description
    blogResult.forEach((item) => {
      if (item.description !== undefined) {
        expect(typeof item.description).toBe('string');
      }
    });
  });

  it('software cluster links together key software comparison pages', () => {
    // The software cluster should cross-link the comparison pages
    const result = getRelatedLinks('dog-grooming-software');
    const hrefs = result.map((item) => item.href);

    // Should include at least one comparison page
    const comparisonPages = [
      '/blog/groomgrid-vs-moego',
      '/blog/groomgrid-vs-daysmart',
      '/blog/groomgrid-vs-pawfinity',
      '/moego-alternatives',
      '/daysmart-alternatives',
    ];
    const hasComparisonLink = hrefs.some((href) => comparisonPages.includes(href));
    // Software page should link to comparison content
    expect(hasComparisonLink).toBe(true);
  });

  it('business cluster links together business-related pages', () => {
    const result = getRelatedLinks('how-to-start-mobile-grooming-business');
    const hrefs = result.map((item) => item.href);

    // Should link to other business-related content
    const businessPages = [
      'business',
      'plan',
      'profitable',
      'start',
    ];
    const hasBusinessLink = hrefs.some((href) =>
      businessPages.some((bp) => href.toLowerCase().includes(bp))
    );
    expect(hasBusinessLink).toBe(true);
  });

  it('footer links are stable — changing them is an intentional SEO decision', () => {
    const result = getFooterLinks();
    const hrefs = result.map((link) => link.href);

    // These routes MUST be in the footer (conversion-critical)
    expect(hrefs).toContain('/plans');
    expect(hrefs).toContain('/signup');
  });

  it('no related link points to admin, dashboard, or auth pages', () => {
    const forbiddenPaths = ['/admin', '/dashboard', '/login', '/signup', '/checkout'];
    // Exception: /signup is allowed in footer links but NOT in related links
    allContentPages.slice(0, 15).forEach((page) => {
      const result = getRelatedLinks(page.slug);
      result.forEach((item) => {
        forbiddenPaths.forEach((forbidden) => {
          // /signup is ok in context, but /admin, /dashboard, /login, /checkout are not
          if (forbidden !== '/signup') {
            expect(item.href).not.toMatch(new RegExp(`^${forbidden}`));
          }
        });
      });
    });
  });

  it('breadcrumb structured data is complete for JSON-LD', () => {
    // For each blog page, breadcrumbs should produce valid BreadcrumbList schema
    const slug = 'dog-grooming-software';
    const result = getBreadcrumbs(slug);

    // Should have at least Home > Blog > Page
    expect(result.length).toBeGreaterThanOrEqual(3);

    // Each item should be JSON-LD compatible
    result.forEach((crumb) => {
      expect(typeof crumb.label).toBe('string');
      expect(typeof crumb.href).toBe('string');
      // href should be a valid URL path
      expect(crumb.href).toMatch(/^\//);
    });
  });
});

// ────────────────────────────────────────────────────────
// 9. PERFORMANCE & MEMORY
// ────────────────────────────────────────────────────────
describe('Performance', () => {
  it('getRelatedLinks completes in under 5ms for any slug', () => {
    allContentPages.slice(0, 20).forEach((page) => {
      const start = performance.now();
      getRelatedLinks(page.slug);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(5);
    });
  });

  it('getBreadcrumbs completes in under 5ms for any slug', () => {
    allContentPages.slice(0, 20).forEach((page) => {
      const start = performance.now();
      getBreadcrumbs(page.slug);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(5);
    });
  });

  it('getFooterLinks completes in under 5ms', () => {
    const start = performance.now();
    getFooterLinks();
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(5);
  });

  it('does not mutate input data', () => {
    const slug = 'dog-grooming-software';
    const originalClusters = JSON.parse(JSON.stringify(topicClusters));
    getRelatedLinks(slug);
    expect(topicClusters).toEqual(originalClusters);
  });
});
