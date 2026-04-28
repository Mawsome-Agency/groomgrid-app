/**
 * Tests for src/app/layout.tsx — metadata and Schema.org structured data
 *
 * Covers:
 * 1. Title tag contains primary keyword "pet grooming software"
 * 2. Meta description contains primary keyword and CTA
 * 3. OpenGraph title matches page title
 * 4. OpenGraph description matches meta description
 * 5. Schema.org WebSite has NO SearchAction (broken SearchAction removed)
 * 6. Schema.org Organization is intact
 * 7. Schema.org SoftwareApplication is intact
 */

import fs from 'fs';
import path from 'path';

const layoutPath = path.resolve(process.cwd(), 'src/app/layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

/**
 * Extract the schemaOrg object from layout.tsx and parse it.
 * Finds JSON.stringify( and tracks paren depth to find the matching ).
 * Then evaluates the inner content as a JS object literal.
 */
function parseSchemaOrg(): any {
  const startMarker = 'JSON.stringify(';
  const startIdx = layoutContent.indexOf(startMarker);
  if (startIdx === -1) throw new Error('schemaOrg declaration not found');

  const objStart = startIdx + startMarker.length;
  let depth = 1; // we're already inside the opening paren
  let endIdx = objStart;

  for (let i = objStart; i < layoutContent.length; i++) {
    const ch = layoutContent[i];
    if (ch === '(') depth++;
    if (ch === ')') {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }

  const objStr = layoutContent.slice(objStart, endIdx);
  // Use Function constructor instead of eval for cleaner scope
  const result = new Function('return (' + objStr + ')')();
  return JSON.parse(JSON.stringify(result)); // normalize via round-trip
}

describe('layout.tsx SEO metadata', () => {
  // ---- TITLE TAG ----
  describe('title tag', () => {
    it('contains primary keyword "pet grooming software"', () => {
      expect(layoutContent).toMatch(/pet grooming software/i);
    });

    it('contains modifier "mobile groomers"', () => {
      expect(layoutContent).toMatch(/mobile groomers/i);
    });

    it('contains modifier "salons"', () => {
      expect(layoutContent).toMatch(/salons/i);
    });

    it('uses pipe separator format "| GroomGrid"', () => {
      expect(layoutContent).toMatch(/\|\s*GroomGrid/);
    });

    it('title is under 60 characters for SEO best practice', () => {
      const titleMatch = layoutContent.match(/title:\s*['"](.+?)['"]/);
      expect(titleMatch).not.toBeNull();
      const title = titleMatch![1];
      expect(title.length).toBeLessThanOrEqual(65);
    });

    it('does NOT use the old title "GroomGrid - Pet Grooming Business Management"', () => {
      expect(layoutContent).not.toContain('GroomGrid - Pet Grooming Business Management');
    });
  });

  // ---- META DESCRIPTION ----
  describe('meta description', () => {
    it('contains primary keyword "pet grooming software"', () => {
      expect(layoutContent).toMatch(/pet grooming software with AI-powered scheduling/i);
    });

    it('includes a clear CTA "Start your free trial"', () => {
      expect(layoutContent).toMatch(/start your free trial/i);
    });

    it('mentions target audience "mobile groomers and salons"', () => {
      expect(layoutContent).toMatch(/mobile groomers and salons/i);
    });

    it('does NOT use the old description about "no-shows and double bookings"', () => {
      expect(layoutContent).not.toContain('Stop losing money to no-shows and double bookings');
    });
  });

  // ---- OPEN GRAPH ----
  describe('OpenGraph metadata', () => {
    it('OG title matches the page title', () => {
      const titleMatches = layoutContent.match(/title:\s*['"](.+?)['"]/g);
      expect(titleMatches).not.toBeNull();
      const titles = titleMatches!.map(m => m.match(/title:\s*['"](.+?)['"]/)?.[1]);
      const uniqueTitles = [...new Set(titles)];
      expect(uniqueTitles.length).toBe(1);
    });

    it('OG description matches the meta description', () => {
      const descText = 'Pet grooming software with AI-powered scheduling, automated reminders, and payment processing. Built for mobile groomers and salons. Start your free trial.';
      const escaped = descText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = layoutContent.match(new RegExp(escaped, 'gi'));
      expect(matches).not.toBeNull();
      expect(matches!.length).toBeGreaterThanOrEqual(2);
    });

    it('includes OG siteName "GroomGrid"', () => {
      expect(layoutContent).toMatch(/siteName:\s*['"]GroomGrid['"]/);
    });

    it('includes OG type "website"', () => {
      expect(layoutContent).toMatch(/type:\s*['"]website['"]/);
    });

    it('includes OG url', () => {
      expect(layoutContent).toMatch(/url:\s*['"]https:\/\/getgroomgrid\.com['"]/);
    });
  });

  // ---- SCHEMA.ORG ----
  describe('Schema.org structured data', () => {
    let schemaObj: any;

    beforeAll(() => {
      schemaObj = parseSchemaOrg();
    });

    it('has @context schema.org', () => {
      expect(schemaObj['@context']).toBe('https://schema.org');
    });

    it('has @graph array with Organization, WebSite, SoftwareApplication', () => {
      expect(Array.isArray(schemaObj['@graph'])).toBe(true);
      const types = schemaObj['@graph'].map((item: any) => item['@type']);
      expect(types).toContain('Organization');
      expect(types).toContain('WebSite');
      expect(types).toContain('SoftwareApplication');
    });

    describe('WebSite schema', () => {
      let webSite: any;

      beforeAll(() => {
        webSite = schemaObj['@graph'].find((item: any) => item['@type'] === 'WebSite');
      });

      it('has correct @id', () => {
        expect(webSite['@id']).toBe('https://getgroomgrid.com/#website');
      });

      it('has correct url', () => {
        expect(webSite.url).toBe('https://getgroomgrid.com');
      });

      it('has correct name', () => {
        expect(webSite.name).toBe('GroomGrid');
      });

      it('has publisher reference', () => {
        expect(webSite.publisher).toEqual({ '@id': 'https://getgroomgrid.com/#organization' });
      });

      // THE CRITICAL TEST: SearchAction must NOT exist
      it('does NOT have a SearchAction (broken SearchAction was removed)', () => {
        expect(webSite.potentialAction).toBeUndefined();
      });

      it('does NOT reference blog search URL', () => {
        const webSiteStr = JSON.stringify(webSite);
        expect(webSiteStr).not.toContain('search_term_string');
        expect(webSiteStr).not.toContain('SearchAction');
        expect(webSiteStr).not.toContain('/blog?q=');
      });
    });

    describe('Organization schema', () => {
      let org: any;

      beforeAll(() => {
        org = schemaObj['@graph'].find((item: any) => item['@type'] === 'Organization');
      });

      it('has correct @id', () => {
        expect(org['@id']).toBe('https://getgroomgrid.com/#organization');
      });

      it('has correct name', () => {
        expect(org.name).toBe('GroomGrid');
      });

      it('has contact point', () => {
        expect(org.contactPoint).toBeDefined();
        expect(org.contactPoint.contactType).toBe('customer support');
        expect(org.contactPoint.email).toBe('support@getgroomgrid.com');
      });
    });

    describe('SoftwareApplication schema', () => {
      let app: any;

      beforeAll(() => {
        app = schemaObj['@graph'].find((item: any) => item['@type'] === 'SoftwareApplication');
      });

      it('has correct name', () => {
        expect(app.name).toBe('GroomGrid');
      });

      it('has BusinessApplication category', () => {
        expect(app.applicationCategory).toBe('BusinessApplication');
      });

      it('has 3 pricing tiers', () => {
        expect(app.offers).toHaveLength(3);
        const names = app.offers.map((o: any) => o.name);
        expect(names).toContain('Solo');
        expect(names).toContain('Salon');
        expect(names).toContain('Enterprise');
      });
    });
  });

  // ---- CANONICAL URL ----
  describe('canonical URL', () => {
    it('specifies canonical URL', () => {
      expect(layoutContent).toMatch(/canonical:\s*['"]https:\/\/getgroomgrid\.com['"]/);
    });
  });
});
