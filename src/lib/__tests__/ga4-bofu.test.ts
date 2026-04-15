import {
  trackBofuPageViewed,
  trackBofuScrollDepth,
  trackBofuSectionViewed,
  trackBofuEngagementTime,
  trackBofuCtaClick,
} from '../ga4';

// Mock window.gtag
const mockGtag = jest.fn();
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

describe('BOFU GA4 Tracking Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.gtag = mockGtag;
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  });

  describe('trackBofuPageViewed', () => {
    it('should track page view with required parameters', () => {
      trackBofuPageViewed('mobile-grooming-business');

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_page_viewed', expect.objectContaining({
        page_type: 'mobile-grooming-business',
        referrer: 'direct',
        timestamp: expect.any(String),
      }));
    });

    it('should include referrer when provided', () => {
      trackBofuPageViewed('grooming-business-operations', 'https://google.com');

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_page_viewed', expect.objectContaining({
        page_type: 'grooming-business-operations',
        referrer: 'https://google.com',
      }));
    });

    it('should not track when GA4 is not configured', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      window.gtag = undefined;

      trackBofuPageViewed('mobile-grooming-business');

      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('trackBofuScrollDepth', () => {
    it('should track scroll depth milestone', () => {
      trackBofuScrollDepth('mobile-grooming-business', 50);

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_scroll_depth', expect.objectContaining({
        page_type: 'mobile-grooming-business',
        depth_percentage: 50,
        timestamp: expect.any(String),
      }));
    });

    it('should track 100% scroll depth', () => {
      trackBofuScrollDepth('grooming-business-operations', 100);

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_scroll_depth', expect.objectContaining({
        depth_percentage: 100,
      }));
    });

    it('should track 25% scroll depth', () => {
      trackBofuScrollDepth('mobile-grooming-business', 25);

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_scroll_depth', expect.objectContaining({
        depth_percentage: 25,
      }));
    });
  });

  describe('trackBofuSectionViewed', () => {
    it('should track section view with all parameters', () => {
      trackBofuSectionViewed('mobile-grooming-business', 'hero', 'Hero Section');

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_section_viewed', expect.objectContaining({
        page_type: 'mobile-grooming-business',
        section_id: 'hero',
        section_title: 'Hero Section',
        timestamp: expect.any(String),
      }));
    });

    it('should track different sections', () => {
      trackBofuSectionViewed('grooming-business-operations', 'pricing', 'Pricing Strategy');

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_section_viewed', expect.objectContaining({
        section_id: 'pricing',
        section_title: 'Pricing Strategy',
      }));
    });
  });

  describe('trackBofuEngagementTime', () => {
    it('should track engagement time with sections viewed', () => {
      trackBofuEngagementTime('mobile-grooming-business', 30000, 5);

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_engagement_time', expect.objectContaining({
        page_type: 'mobile-grooming-business',
        time_spent_ms: 30000,
        time_spent_seconds: 30,
        sections_viewed: 5,
        timestamp: expect.any(String),
      }));
    });

    it('should convert milliseconds to seconds', () => {
      trackBofuEngagementTime('grooming-business-operations', 65000, 3);

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_engagement_time', expect.objectContaining({
        time_spent_ms: 65000,
        time_spent_seconds: 65,
      }));
    });

    it('should track zero sections viewed', () => {
      trackBofuEngagementTime('mobile-grooming-business', 5000, 0);

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_engagement_time', expect.objectContaining({
        sections_viewed: 0,
      }));
    });
  });

  describe('trackBofuCtaClick', () => {
    it('should track CTA click with all parameters', () => {
      trackBofuCtaClick('mobile-grooming-business', 'start_trial', 'cta', 'cta');

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_cta_click', expect.objectContaining({
        page_type: 'mobile-grooming-business',
        cta_type: 'start_trial',
        cta_location: 'cta',
        section_id: 'cta',
        timestamp: expect.any(String),
      }));
    });

    it('should track CTA click without section ID', () => {
      trackBofuCtaClick('grooming-business-operations', 'see_plans', 'nav');

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_cta_click', expect.objectContaining({
        cta_type: 'see_plans',
        cta_location: 'nav',
        section_id: null,
      }));
    });

    it('should track different CTA types', () => {
      trackBofuCtaClick('mobile-grooming-business', 'learn_more', 'inline', 'features');

      expect(mockGtag).toHaveBeenCalledWith('event', 'bofu_cta_click', expect.objectContaining({
        cta_type: 'learn_more',
        cta_location: 'inline',
        section_id: 'features',
      }));
    });
  });

  describe('timestamp format', () => {
    it('should include ISO timestamp in all events', () => {
      trackBofuPageViewed('test-page');
      trackBofuScrollDepth('test-page', 50);
      trackBofuSectionViewed('test-page', 'hero', 'Hero');
      trackBofuEngagementTime('test-page', 10000, 2);
      trackBofuCtaClick('test-page', 'cta', 'hero');

      const calls = mockGtag.mock.calls;
      calls.forEach(call => {
        const params = call[2];
        expect(params.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });
    });
  });
});
