/**
 * Tests for use-analytics.ts - React hook for analytics tracking.
 *
 * Testing strategy:
 * - Happy path: Hook returns correct functions and session ID
 * - Edge cases: SSR environment, missing env vars, network failures
 * - Session ID generation and persistence
 * - All hook functions tested
 */
import { renderHook, act } from '@testing-library/react';
import { useAnalytics, ANALYTICS_EVENTS } from '../use-analytics';

describe('useAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getOrCreateSessionId', () => {
    it('should generate new session ID if not exists', () => {
      const sessionId = useAnalytics().sessionId;

      expect(sessionId).toMatch(/^sess_\d+_[a-z0-9]+$/);
      expect(sessionStorage.getItem('gg_session_id')).toBe(sessionId);
    });

    it('should reuse existing session ID', () => {
      const firstCall = useAnalytics();
      const firstSessionId = firstCall.sessionId;

      // Call hook again in a new render
      jest.clearAllMocks();
      const secondCall = useAnalytics();
      const secondSessionId = secondCall.sessionId;

      expect(secondSessionId).toBe(firstSessionId);
      expect(sessionStorage.getItem('gg_session_id')).toBe(firstSessionId);
    });

    it('should return empty string in SSR environment', () => {
      const originalWindow = (global as any).window;
      delete (global as any).window;

      const sessionId = useAnalytics().sessionId;

      expect(sessionId).toBe('');
      expect(sessionStorage.getItem('gg_session_id')).toBeNull();

      (global as any).window = originalWindow;
    });

    it('should generate unique session IDs across calls', () => {
      sessionStorage.clear();
      const hook1 = useAnalytics();
      const sessionId1 = hook1.sessionId;

      jest.clearAllMocks();
      sessionStorage.clear();
      const hook2 = useAnalytics();
      const sessionId2 = hook2.sessionId;

      expect(sessionId1).not.toBe(sessionId2);
      expect(sessionId1).toMatch(/^sess_\d+_/);
      expect(sessionId2).toMatch(/^sess_\d+_/);
    });

    it('should generate session ID with timestamp', () => {
      const sessionId = useAnalytics().sessionId;
      const timestampMatch = sessionId.match(/sess_(\d+)_/);

      expect(timestampMatch).toBeTruthy();
      expect(parseInt(timestampMatch![1])).toBeLessThanOrEqual(Date.now());
    });

    it('should generate session ID with random component', () => {
      const sessionId1 = useAnalytics().sessionId;
      jest.clearAllMocks();
      sessionStorage.clear();
      const sessionId2 = useAnalytics().sessionId;

      const random1 = sessionId1.split('_')[2];
      const random2 = sessionId2.split('_')[2];

      expect(random1).not.toBe(random2);
      expect(random1).toMatch(/^[a-z0-9]+$/);
      expect(random2).toMatch(/^[a-z0-9]+$/);
    });
  });

  describe('useAnalytics hook', () => {
    it('should return track function', () => {
      const { track } = renderHook(() => useAnalytics()).result.current;

      expect(typeof track).toBe('function');
    });

    it('should return trackSession function', () => {
      const { trackSession } = renderHook(() => useAnalytics()).result.current;

      expect(typeof trackSession).toBe('function');
    });

    it('should return trackPageView function', () => {
      const { trackPageView } = renderHook(() => useAnalytics()).result.current;

      expect(typeof trackPageView).toBe('function');
    });

    it('should return sessionId', () => {
      const { sessionId } = renderHook(() => useAnalytics()).result.current;

      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBeGreaterThan(0);
    });

    it('should persist sessionId across re-renders', () => {
      const { result } = renderHook(() => useAnalytics());

      const sessionId1 = result.current.sessionId;
      result.rerender();
      const sessionId2 = result.current.sessionId;

      expect(sessionId2).toBe(sessionId1);
    });
  });

  describe('track function', () => {
    it('should send POST request to /api/analytics/track', async () => {
      const { track } = renderHook(() => useAnalytics()).result.current;

      await track('test_event', { param1: 'value1' });

      expect(fetch).toHaveBeenCalledWith('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'test_event',
          properties: { param1: 'value1' },
          sessionId: expect.any(String),
        }),
      });
    });

    it('should include sessionId in request body', async () => {
      const { track, sessionId } = renderHook(() => useAnalytics()).result.current;

      await track('test_event');

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.sessionId).toBe(sessionId);
    });

    it('should handle empty properties', async () => {
      const { track } = renderHook(() => useAnalytics()).result.current;

      await track('test_event');

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties).toEqual({});
    });

    it('should handle null/undefined properties', async () => {
      const { track } = renderHook(() => useAnalytics()).result.current;

      await track('test_event', null as any);

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties).toEqual({});
    });

    it('should handle complex properties objects', async () => {
      const { track } = renderHook(() => useAnalytics()).result.current;

      const properties = {
        string: 'value',
        number: 42,
        boolean: true,
        nested: { a: 1, b: 2 },
        array: ['x', 'y', 'z'],
      };

      await track('test_event', properties);

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties).toEqual(properties);
    });

    it('should handle fetch errors silently', async () => {
      const error = new Error('Network failed');
      (global as any).fetch = jest.fn().mockRejectedValue(error);
      const { track } = renderHook(() => useAnalytics()).result.current;

      await expect(track('test_event')).resolves.not.toThrow();
    });

    it('should not throw on network error', async () => {
      (global as any).fetch = jest.fn().mockRejectedValue(new Error('Failed'));
      const { track } = renderHook(() => useAnalytics()).result.current;

      const result = await track('test_event');

      expect(result).toBeUndefined();
    });
  });

  describe('trackSession function', () => {
    it('should call track with SESSION_START event', async () => {
      const { trackSession } = renderHook(() => useAnalytics()).result.current;

      await trackSession();

      expect(fetch).toHaveBeenCalledWith('/api/analytics/track', expect.objectContaining({
        method: 'POST',
      }));

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.eventName).toBe(ANALYTICS_EVENTS.SESSION_START);
    });

    it('should include window.location.href as url', async () => {
      const { trackSession } = renderHook(() => useAnalytics()).result.current;
      (global as any).window = { location: { href: 'https://example.com/page' } };

      await trackSession();

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties.url).toBe('https://example.com/page');
    });

    it('should handle empty href', async () => {
      const { trackSession } = renderHook(() => useAnalytics()).result.current;
      (global as any).window = { location: { href: '' } };

      await trackSession();

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties.url).toBe('');
    });

    it('should handle SSR environment (window undefined)', async () => {
      const originalWindow = (global as any).window;
      delete (global as any).window;

      const { trackSession } = renderHook(() => useAnalytics()).result.current;

      await trackSession();

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties.url).toBe('');

      (global as any).window = originalWindow;
    });
  });

  describe('trackPageView function', () => {
    it('should call track with PAGE_VIEWED event', async () => {
      const { trackPageView } = renderHook(() => useAnalytics()).result.current;

      await trackPageView('/dashboard');

      expect(fetch).toHaveBeenCalledWith('/api/analytics/track', expect.objectContaining({
        method: 'POST',
      }));

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.eventName).toBe(ANALYTICS_EVENTS.PAGE_VIEWED);
    });

    it('should include page param in properties', async () => {
      const { trackPageView } = renderHook(() => useAnalytics()).result.current;

      await trackPageView('/settings/billing');

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties.page).toBe('/settings/billing');
    });

    it('should handle page with query string', async () => {
      const { trackPageView } = renderHook(() => useAnalytics()).result.current;

      await trackPageView('/clients?filter=active');

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties.page).toBe('/clients?filter=active');
    });

    it('should handle page with hash fragment', async () => {
      const { trackPageView } = renderHook(() => useAnalytics()).result.current;

      await trackPageView('/dashboard#section');

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties.page).toBe('/dashboard#section');
    });

    it('should handle empty page path', async () => {
      const { trackPageView } = renderHook(() => useAnalytics()).result.current;

      await trackPageView('');

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties.page).toBe('');
    });
  });

  describe('ANALYTICS_EVENTS constant', () => {
    it('should have SESSION_START event', () => {
      expect(ANALYTICS_EVENTS.SESSION_START).toBe('session_start');
    });

    it('should have APPOINTMENT_CREATED event', () => {
      expect(ANALYTICS_EVENTS.APPOINTMENT_CREATED).toBe('appointment_created');
    });

    it('should have APPOINTMENT_UPDATED event', () => {
      expect(ANALYTICS_EVENTS.APPOINTMENT_UPDATED).toBe('appointment_updated');
    });

    it('should have CLIENT_ADDED event', () => {
      expect(ANALYTICS_EVENTS.CLIENT_ADDED).toBe('client_added');
    });

    it('should have CLIENT_UPDATED event', () => {
      expect(ANALYTICS_EVENTS.CLIENT_UPDATED).toBe('client_updated');
    });

    it('should have FEATURE_USED event', () => {
      expect(ANALYTICS_EVENTS.FEATURE_USED).toBe('feature_used');
    });

    it('should have PAGE_VIEWED event', () => {
      expect(ANALYTICS_EVENTS.PAGE_VIEWED).toBe('page_viewed');
    });

    it('should have SETTINGS_UPDATED event', () => {
      expect(ANALYTICS_EVENTS.SETTINGS_UPDATED).toBe('settings_updated');
    });

    it('should have REMINDER_ENABLED event', () => {
      expect(ANALYTICS_EVENTS.REMINDER_ENABLED).toBe('reminder_enabled');
    });

    it('should have UPGRADE_CLICKED event', () => {
      expect(ANALYTICS_EVENTS.UPGRADE_CLICKED).toBe('upgrade_clicked');
    });
  });

  describe('Integration tests - analytics tracking flow', () => {
    it('should track session start and page view in sequence', async () => {
      const { trackSession, trackPageView } = renderHook(() => useAnalytics()).result.current;
      jest.clearAllMocks();

      await trackSession();
      expect((fetch as jest.Mock).mock.calls[0][1].eventName).toBe('session_start');

      await trackPageView('/dashboard');
      expect((fetch as jest.Mock).mock.calls[1][1].eventName).toBe('page_viewed');
    });

    it('should maintain same sessionId across multiple track calls', async () => {
      const { track } = renderHook(() => useAnalytics()).result.current;

      await track('event1');
      const sessionId1 = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body).sessionId;

      jest.clearAllMocks();
      await track('event2');
      const sessionId2 = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body).sessionId;

      expect(sessionId1).toBe(sessionId2);
    });

    it('should include different properties for different event types', async () => {
      const { track, trackSession, trackPageView } = renderHook(() => useAnalytics()).result.current;
      jest.clearAllMocks();

      await track('custom_event', { customProp: 'value' });
      const customBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(customBody.properties.customProp).toBe('value');

      jest.clearAllMocks();
      await trackSession();
      const sessionBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(sessionBody.properties.url).toBeDefined();

      jest.clearAllMocks();
      await trackPageView('/test');
      const pageViewBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(pageViewBody.properties.page).toBe('/test');
    });
  });
});
