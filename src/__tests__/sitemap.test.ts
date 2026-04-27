import sitemap from '../app/sitemap';

describe('Sitemap Generation', () => {
  it('should generate sitemap with all static pages', () => {
    const result = sitemap();

    // Check that we have the expected number of static pages
    const staticPages = result.filter(page => !page.url.includes('/blog/') && !page.url.includes('/best-') && !page.url.includes('/grooming-') && !page.url.includes('/mobile-') && !page.url.includes('/moego-'));
    expect(staticPages.length).toBeGreaterThan(0);

    // Check for required static pages
    const urls = result.map(page => page.url);
    expect(urls).toContain('https://getgroomgrid.com');
    expect(urls).toContain('https://getgroomgrid.com/signup');
    expect(urls).toContain('https://getgroomgrid.com/plans');
    expect(urls).toContain('https://getgroomgrid.com/blog');
  });

  it('should include all blog posts', () => {
    const result = sitemap();

    // Get blog post URLs
    const blogUrls = result.filter(page => page.url.includes('/blog/'));
    expect(blogUrls.length).toBeGreaterThan(0);

    // Check for specific blog posts
    const urls = blogUrls.map(page => page.url);
    expect(urls).toContain('https://getgroomgrid.com/blog/dog-grooming-business-management');
    expect(urls).toContain('https://getgroomgrid.com/blog/dog-grooming-contract-template');
    expect(urls).toContain('https://getgroomgrid.com/blog/how-to-start-mobile-grooming-business');
    expect(urls).toContain('https://getgroomgrid.com/blog/is-dog-grooming-a-profitable-business');
    expect(urls).toContain('https://getgroomgrid.com/blog/mobile-dog-grooming-business-plan');
    expect(urls).toContain('https://getgroomgrid.com/blog/reduce-no-shows-dog-grooming');
    expect(urls).toContain('https://getgroomgrid.com/blog/dog-grooming-software');
    expect(urls).toContain('https://getgroomgrid.com/blog/how-to-start-dog-grooming-business-at-home');
    expect(urls).toContain('https://getgroomgrid.com/blog/how-to-open-a-pet-grooming-business');
    expect(urls).toContain('https://getgroomgrid.com/blog/how-to-build-mobile-grooming-trailer');
    expect(urls).toContain('https://getgroomgrid.com/blog/free-dog-grooming-software');
    expect(urls).toContain('https://getgroomgrid.com/blog/groomgrid-vs-daysmart');
    expect(urls).toContain('https://getgroomgrid.com/blog/groomgrid-vs-pawfinity');
<<<<<<< HEAD
=======
    expect(urls).toContain('https://getgroomgrid.com/blog/cat-grooming-business-guide');
    expect(urls).toContain('https://getgroomgrid.com/blog/dog-grooming-pricing-guide');
    expect(urls).toContain('https://getgroomgrid.com/blog/how-to-become-a-dog-groomer');
    expect(urls).toContain('https://getgroomgrid.com/blog/do-you-tip-dog-groomers');
>>>>>>> origin/cortex/fix-ga4-event-naming-health-check
    expect(urls).toContain('https://getgroomgrid.com/blog/how-much-do-dog-groomers-make');
    expect(urls).toContain('https://getgroomgrid.com/blog/dog-grooming-business-insurance');
    expect(urls).toContain('https://getgroomgrid.com/blog/dog-grooming-appointment-app');
  });

  it('should include SEO landing pages', () => {
    const result = sitemap();
    const urls = result.map(page => page.url);

    expect(urls).toContain('https://getgroomgrid.com/best-dog-grooming-software');
    expect(urls).toContain('https://getgroomgrid.com/grooming-business-operations');
    expect(urls).toContain('https://getgroomgrid.com/mobile-grooming-business');
    expect(urls).toContain('https://getgroomgrid.com/mobile-grooming-software');
    expect(urls).toContain('https://getgroomgrid.com/moego-alternatives');
    expect(urls).toContain('https://getgroomgrid.com/daysmart-alternatives');
    expect(urls).toContain('https://getgroomgrid.com/pawfinity-alternatives');
  });

  it('should have correct priority for homepage', () => {
    const result = sitemap();
    const homepage = result.find(page => page.url === 'https://getgroomgrid.com');

    expect(homepage).toBeDefined();
    expect(homepage?.priority).toBe(1);
  });

  it('should have appropriate priorities for pillar pages', () => {
    const result = sitemap();

    // Check signup page priority
    const signupPage = result.find(p => p.url === 'https://getgroomgrid.com/signup');
    expect(signupPage?.priority).toBe(0.8);

    // Check plans page priority
    const plansPage = result.find(p => p.url === 'https://getgroomgrid.com/plans');
    expect(plansPage?.priority).toBe(0.8);

    // Check blog index page priority
    const blogPage = result.find(p => p.url === 'https://getgroomgrid.com/blog');
    expect(blogPage?.priority).toBe(0.9);
  });

  it('should have appropriate priorities for blog posts', () => {
    const result = sitemap();
    const blogPosts = result.filter(page => page.url.includes('/blog/'));

    blogPosts.forEach(post => {
      expect(post.priority).toBe(0.7);
    });
  });

  it('should have appropriate priorities for landing pages', () => {
    const result = sitemap();
    const landingSlugs = ['best-dog-grooming-software', 'grooming-business-operations', 'mobile-grooming-business', 'mobile-grooming-software', 'moego-alternatives', 'daysmart-alternatives', 'pawfinity-alternatives'];
    
    landingSlugs.forEach(slug => {
      const page = result.find(p => p.url === `https://getgroomgrid.com/${slug}`);
      expect(page?.priority).toBe(0.8);
    });
  });

  it('should have valid lastModified dates for all pages', () => {
    const result = sitemap();

    result.forEach(page => {
      expect(page.lastModified).toBeDefined();
      expect(page.lastModified).toBeInstanceOf(Date);
      expect((page.lastModified as Date).getTime()).not.toBeNaN();
    });
  });

  it('should have valid changeFrequency for all pages', () => {
    const result = sitemap();

    const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

    result.forEach(page => {
      expect(page.changeFrequency).toBeDefined();
      expect(validFrequencies).toContain(page.changeFrequency);
    });
  });

  it('should have valid URL format for all entries', () => {
    const result = sitemap();

    result.forEach(page => {
      expect(page.url).toBeDefined();
      expect(page.url).toMatch(/^https:\/\/getgroomgrid\.com/);
      // No trailing slashes in URLs
      expect(page.url).not.toMatch(/\/$/);
    });
  });

  it('should have total entries matching all pages', () => {
    const result = sitemap();

    // 4 static pages + 7 landing pages + 30 blog posts = 41 total
    expect(result.length).toBe(41);
  });
});
