/**
 * Unit tests for hand-curated internal links in 7 SEO blog posts.
 *
 * Strategy: Source-code structural analysis. These blog posts received
 * hand-curated in-body contextual links and card-grid sections as part
 * of the "Add internal links to 7 weak blog posts" feature. We parse
 * the page.tsx source files to validate link integrity without
 * rendering the full page components (which are large static server
 * components with many dependencies).
 *
 * Covers:
 * - All internal blog links point to valid /blog/ slugs
 * - All hrefs end with trailing slash (SEO canonical URL)
 * - In-body links use correct Link component + styling
 * - Card grid section exists in each post
 * - Card grid is placed BEFORE PageRelatedLinks component
 * - Card grid structure matches reference pattern
 * - Each post has 4-8 total internal blog links
 * - No self-referencing links
 *
 * These tests guard against:
 * - Broken internal links (typos, deleted posts)
 * - Missing trailing slashes (duplicate URL paths)
 * - Missing card grid sections (accidental deletion)
 * - Wrong card grid placement (SEO hierarchy)
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Test Data ────────────────────────────────────────────────
const BLOG_DIR = path.join(process.cwd(), 'src', 'app', 'blog');

const POSTS_WITH_LINKS = [
  'dog-grooming-software',
  'how-to-start-mobile-grooming-business',
  'mobile-dog-grooming-business-plan',
  'reduce-no-shows-dog-grooming',
  'how-to-start-dog-grooming-business-at-home',
  'how-to-open-a-pet-grooming-business',
  'free-dog-grooming-software',
] as const;

// Expected link map per the mission spec
const EXPECTED_LINK_MAP: Record<string, string[]> = {
  'dog-grooming-software': ['best-pet-grooming-software', 'free-dog-grooming-software', 'pet-grooming-software'],
  'how-to-start-mobile-grooming-business': ['mobile-dog-grooming-business-plan', 'mobile-dog-grooming-business-tips', 'how-to-build-mobile-grooming-trailer'],
  'mobile-dog-grooming-business-plan': ['how-to-start-mobile-grooming-business', 'dog-grooming-pricing-guide', 'mobile-dog-grooming-business-tips'],
  'reduce-no-shows-dog-grooming': ['dog-grooming-business-management', 'dog-grooming-appointment-app', 'dog-grooming-client-intake-form'],
  'how-to-start-dog-grooming-business-at-home': ['how-much-to-start-dog-grooming-business', 'dog-grooming-tools-equipment-list', 'how-to-open-a-pet-grooming-business'],
  'how-to-open-a-pet-grooming-business': ['dog-grooming-business-plan-template', 'dog-grooming-business-insurance', 'how-much-to-start-dog-grooming-business'],
  'free-dog-grooming-software': ['dog-grooming-software', 'best-pet-grooming-software', 'groomgrid-vs-moego'],
};

/** Read a blog post page.tsx source */
function readPostSource(slug: string): string {
  const filePath = path.join(BLOG_DIR, slug, 'page.tsx');
  return fs.readFileSync(filePath, 'utf-8');
}

/** Extract all /blog/ href values from source code */
function extractBlogHrefs(source: string): string[] {
  const hrefRegex = /href=["'`{/]\/blog\/([^"'`}]+)/g;
  const hrefs: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = hrefRegex.exec(source)) !== null) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

/** Get all existing blog directory slugs */
function getExistingBlogSlugs(): Set<string> {
  const entries = fs.readdirSync(BLOG_DIR, { withFileTypes: true });
  return new Set(
    entries.filter((e) => e.isDirectory()).map((e) => e.name)
  );
}

/** Find line number of a pattern in source (1-indexed, 0 = not found) */
function findLineOf(source: string, pattern: string): number {
  const lines = source.split('\n');
  const idx = lines.findIndex((line) => line.includes(pattern));
  return idx + 1;
}

// ─── Tests ────────────────────────────────────────────────────
describe('Blog Post Internal Links Integrity', () => {
  const existingSlugs = getExistingBlogSlugs();

  // ────────────────────────────────────────────────────────
  // 1. LINK TARGET VALIDATION
  // ────────────────────────────────────────────────────────
  describe('Link Target Validation', () => {
    POSTS_WITH_LINKS.forEach((slug) => {
      describe(`/${slug}/`, () => {
        let source: string;
        let hrefs: string[];

        beforeAll(() => {
          source = readPostSource(slug);
          hrefs = extractBlogHrefs(source);
        });

        it('has at least 4 internal blog links (acceptance criteria: 4-8)', () => {
          expect(hrefs.length).toBeGreaterThanOrEqual(4);
        });

        it('has at most 8 internal blog links (acceptance criteria: 4-8)', () => {
          expect(hrefs.length).toBeLessThanOrEqual(8);
        });

        it('all link targets point to existing blog directories', () => {
          hrefs.forEach((href) => {
            const targetSlug = href.replace(/\/$/, '');
            expect(existingSlugs.has(targetSlug)).toBe(true);
          });
        });

        it('all link hrefs end with trailing slash', () => {
          hrefs.forEach((href) => {
            expect(href).toMatch(/\/$/);
          });
        });

        it('no self-referencing links (post does not link to itself)', () => {
          const selfHrefs = hrefs.filter((h) => h.replace(/\/$/, '') === slug);
          expect(selfHrefs).toHaveLength(0);
        });

        it('includes all expected target slugs from the link map', () => {
          const expected = EXPECTED_LINK_MAP[slug];
          expected.forEach((targetSlug) => {
            const hasLink = hrefs.some(
              (h) => h.replace(/\/$/, '') === targetSlug
            );
            expect(hasLink).toBe(true);
          });
        });
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 2. IN-BODY LINK MARKUP
  // ────────────────────────────────────────────────────────
  describe('In-Body Link Markup', () => {
    POSTS_WITH_LINKS.forEach((slug) => {
      describe(`/${slug}/`, () => {
        let source: string;

        beforeAll(() => {
          source = readPostSource(slug);
        });

        it('uses <Link> component for internal blog links', () => {
          const linkComponents = source.match(/<Link\s+href=["'{}]/g) || [];
          expect(linkComponents.length).toBeGreaterThanOrEqual(3);
        });

        it('in-body links use text-green-700 font-semibold hover:underline styling', () => {
          const styledLinks = source.match(
            /text-green-700 font-semibold hover:underline/g
          ) || [];
          // At least 3 in-body links should use this styling
          expect(styledLinks.length).toBeGreaterThanOrEqual(3);
        });
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 3. CARD GRID SECTION
  // ────────────────────────────────────────────────────────
  describe('Card Grid Section', () => {
    POSTS_WITH_LINKS.forEach((slug) => {
      describe(`/${slug}/`, () => {
        let source: string;

        beforeAll(() => {
          source = readPostSource(slug);
        });

        it('has a "More Grooming Business Resources" heading', () => {
          expect(source).toContain('More Grooming Business Resources');
        });

        it('card grid section is placed BEFORE PageRelatedLinks component', () => {
          const cardLine = findLineOf(source, 'More Grooming Business Resources');
          const relatedLine = findLineOf(source, '<PageRelatedLinks');
          expect(cardLine).toBeGreaterThan(0);
          expect(relatedLine).toBeGreaterThan(0);
          expect(cardLine).toBeLessThan(relatedLine);
        });

        it('card grid uses sm:grid-cols-3 layout', () => {
          expect(source).toMatch(/sm:grid-cols-3/);
        });

        it('card grid has 3 Link cards', () => {
          const cardSection = source.split('More Grooming Business Resources')[1] || '';
          const beforeRelated = cardSection.split('<PageRelatedLinks')[0] || '';
          const cardLinks = beforeRelated.match(/<Link\s/g) || [];
          expect(cardLinks.length).toBe(3);
        });

        it('each card has emoji (text-2xl), title (font-semibold text-sm), and description (text-stone-500 text-xs)', () => {
          const cardSection = source.split('More Grooming Business Resources')[1] || '';
          const beforeRelated = cardSection.split('<PageRelatedLinks')[0] || '';
          const emojiCount = (beforeRelated.match(/text-2xl mb-2/g) || []).length;
          const titleCount = (beforeRelated.match(/font-semibold text-stone-800 text-sm mb-1/g) || []).length;
          const descCount = (beforeRelated.match(/text-stone-500 text-xs/g) || []).length;
          expect(emojiCount).toBe(3);
          expect(titleCount).toBe(3);
          expect(descCount).toBe(3);
        });

        it('cards use hover:border-green-300 hover:shadow-sm transition-all styling', () => {
          const cardSection = source.split('More Grooming Business Resources')[1] || '';
          const beforeRelated = cardSection.split('<PageRelatedLinks')[0] || '';
          expect(beforeRelated).toContain('hover:border-green-300');
          expect(beforeRelated).toContain('hover:shadow-sm');
          expect(beforeRelated).toContain('transition-all');
        });

        it('cards use rounded-xl border border-stone-200 styling', () => {
          const cardSection = source.split('More Grooming Business Resources')[1] || '';
          const beforeRelated = cardSection.split('<PageRelatedLinks')[0] || '';
          expect(beforeRelated).toContain('rounded-xl');
          expect(beforeRelated).toContain('border-stone-200');
        });
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 4. CROSS-POST LINK CONSISTENCY
  // ────────────────────────────────────────────────────────
  describe('Cross-Post Link Consistency', () => {
    it('all hrefs across all 7 posts use trailing slashes', () => {
      const allHrefs: string[] = [];
      POSTS_WITH_LINKS.forEach((slug) => {
        const source = readPostSource(slug);
        allHrefs.push(...extractBlogHrefs(source));
      });

      const withoutTrailingSlash = allHrefs.filter((h) => !h.endsWith('/'));
      expect(withoutTrailingSlash).toHaveLength(0);
    });

    it('total internal links across all 7 posts is at least 30 (7 posts × ~4-6 links)', () => {
      let totalLinks = 0;
      POSTS_WITH_LINKS.forEach((slug) => {
        const source = readPostSource(slug);
        totalLinks += extractBlogHrefs(source).length;
      });
      expect(totalLinks).toBeGreaterThanOrEqual(30);
    });

    it('no broken link targets — all slugs resolve to existing blog directories', () => {
      const allTargetSlugs = new Set<string>();
      POSTS_WITH_LINKS.forEach((slug) => {
        const source = readPostSource(slug);
        extractBlogHrefs(source).forEach((href) => {
          allTargetSlugs.add(href.replace(/\/$/, ''));
        });
      });

      allTargetSlugs.forEach((targetSlug) => {
        expect(existingSlugs.has(targetSlug)).toBe(true);
      });
    });
  });

  // ────────────────────────────────────────────────────────
  // 5. REGRESSION GUARDS
  // ────────────────────────────────────────────────────────
  describe('Regression Guards', () => {
    it('the 7 modified posts are not accidentally reverted (card grid present)', () => {
      POSTS_WITH_LINKS.forEach((slug) => {
        const source = readPostSource(slug);
        expect(source).toContain('More Grooming Business Resources');
      });
    });

    it('no blog post links to a non-existent page (catches slug typos)', () => {
      POSTS_WITH_LINKS.forEach((slug) => {
        const source = readPostSource(slug);
        const hrefs = extractBlogHrefs(source);
        hrefs.forEach((href) => {
          const targetSlug = href.replace(/\/$/, '');
          expect(existingSlugs.has(targetSlug)).toBe(true);
        });
      });
    });
  });
});
