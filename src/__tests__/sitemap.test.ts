import sitemap from '../app/sitemap.xml';

describe('Sitemap Generation', () => {
  it('should generate sitemap with all static pages', () => {
    const result = sitemap();

    // Check that we have the expected number of static pages
    const staticPages = result.filter(page => !page.url.includes('/blog/'));
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
    const signupPage = result.find(page => page.url === 'https://getgroomgrid.com/signup');
    expect(signupPage?.priority).toBe(0.8);

    // Check plans page priority
    const plansPage = result.find(page => page.url === 'https://getgroomgrid.com/plans');
    expect(plansPage?.priority).toBe(0.8);

    // Check blog index page priority
    const blogPage = result.find(page => page.url === 'https://getgroomgrid.com/blog');
    expect(blogPage?.priority).toBe(0.9);
  });

  it('should have appropriate priorities for blog posts', () => {
    const result = sitemap();
    const blogPosts = result.filter(page => page.url.includes('/blog/'));

    blogPosts.forEach(post => {
      expect(post.priority).toBe(0.7);
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
      // All URLs start with the base domain (root page has no trailing path)
      expect(page.url).toMatch(/^https:\/\/getgroomgrid\.com/);
    });
  });

  it('should include all expected static pages', () => {
    const result = sitemap();
    const urls = result.map(page => page.url);

    // Check for current static pages in the sitemap
    const expectedPages = [
      'https://getgroomgrid.com',
      'https://getgroomgrid.com/signup',
      'https://getgroomgrid.com/plans',
      'https://getgroomgrid.com/blog',
    ];

    expectedPages.forEach(expectedUrl => {
      expect(urls).toContain(expectedUrl);
    });
  });

  it('should have total entries matching static pages plus blog posts', () => {
    const result = sitemap();

    // 4 static pages + blog posts (dynamic)
    const staticCount = 4;
    const blogCount = result.filter(page => page.url.includes('/blog/')).length;
    expect(result.length).toBe(staticCount + blogCount);
    expect(result.length).toBeGreaterThan(staticCount);
  });
});
