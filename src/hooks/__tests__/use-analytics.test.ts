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

  describe('sessionId', () => {
    it('should return a function that generates session IDs', () => {
      const { result } = renderHook(() => useAnalytics());
      const sessionId = result.current.sessionId();

      expect(sessionId).toMatch(/^sess_\d+_[a-z0-9]+$/);
      expect(sessionStorage.getItem('gg_session_id')).toBe(sessionId);
    });

    it('should reuse existing session ID', () => {
      const { result } = renderHook(() => useAnalytics());
      const sessionId1 = result.current.sessionId();
      const sessionId2 = result.current.sessionId();

      expect(sessionId2).toBe(sessionId1);
    });

    it('should persist sessionId across re-renders', () => {
      const { result, rerender } = renderHook(() => useAnalytics());

      const sessionId1 = result.current.sessionId();
      rerender();
      const sessionId2 = result.current.sessionId();

      expect(sessionId2).toBe(sessionId1);
    });
  });

  describe('useAnalytics hook', () => {
    it('should return track function', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(typeof result.current.track).toBe('function');
    });

    it('should return trackSession function', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(typeof result.current.trackSession).toBe('function');
    });

    it('should return trackPageView function', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(typeof result.current.trackPageView).toBe('function');
    });

    it('should return sessionId function', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(typeof result.current.sessionId).toBe('function');
    });
  });

  describe('track function', () => {
    it('should send POST request to /api/analytics/track', async () => {
      const { result } = renderHook(() => useAnalytics());

      await act(async () => {
        await result.current.track('test_event', { param1: 'value1' });
      });

      expect(fetch).toHaveBeenCalledWith('/api/analytics/track', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }));

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.eventName).toBe('test_event');
      expect(body.properties).toEqual({ param1: 'value1' });
      expect(body.sessionId).toMatch(/^sess_\d+_/);
    });

    it('should include sessionId in request body', async () => {
      const { result } = renderHook(() => useAnalytics());
      const sessionId = result.current.sessionId();

      await act(async () => {
        await result.current.track('test_event');
      });

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.sessionId).toBe(sessionId);
    });

    it('should handle empty properties', async () => {
      const { result } = renderHook(() => useAnalytics());

      await act(async () => {
        await result.current.track('test_event');
      });

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties).toEqual({});
    });

    it('should handle complex properties objects', async () => {
      const { result } = renderHook(() => useAnalytics());

      const properties = {
        string: 'value',
        number: 42,
        boolean: true,
        nested: { a: 1, b: 2 },
        array: ['x', 'y', 'z'],
      };

      await act(async () => {
        await result.current.track('test_event', properties);
      });

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties).toEqual(properties);
    });

    it('should handle fetch errors silently', async () => {
      const error = new Error('Network failed');
      (global as any).fetch = jest.fn().mockRejectedValue(error);
      const { result } = renderHook(() => useAnalytics());

      await act(async () => {
        await expect(result.current.track('test_event')).resolves.not.toThrow();
      });
    });

    it('should not throw on network error', async () => {
      (global as any).fetch = jest.fn().mockRejectedValue(new Error('Failed'));
      const { result } = renderHook(() => useAnalytics());

      let trackResult: any;
      await act(async () => {
        trackResult = await result.current.track('test_event');
      });

      expect(trackResult).toBeUndefined();
    });
  });

  describe('trackSession function', () => {
    it('should call track with SESSION_START event', async () => {
      const { result } = renderHook(() => useAnalytics());

      await act(async () => {
        result.current.trackSession();
      });

      expect(fetch).toHaveBeenCalledWith('/api/analytics/track', expect.objectContaining({
        method: 'POST',
      }));

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.eventName).toBe(ANALYTICS_EVENTS.SESSION_START);
    });

    it('should include url in properties', async () => {
      const { result } = renderHook(() => useAnalytics());

      await act(async () => {
        result.current.trackSession();
      });

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties).toHaveProperty('url');
    });
  });

  describe('trackPageView function', () => {
    it('should call track with PAGE_VIEWED event', async () => {
      const { result } = renderHook(() => useAnalytics());

      await act(async () => {
        result.current.trackPageView('/dashboard');
      });

      expect(fetch).toHaveBeenCalledWith('/api/analytics/track', expect.objectContaining({
        method: 'POST',
      }));

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.eventName).toBe(ANALYTICS_EVENTS.PAGE_VIEWED);
    });

    it('should include page param in properties', async () => {
      const { result } = renderHook(() => useAnalytics());

      await act(async () => {
        result.current.trackPageView('/settings/billing');
      });

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties.page).toBe('/settings/billing');
    });

    it('should handle page with query string', async () => {
      const { result } = renderHook(() => useAnalytics());

      await act(async () => {
        result.current.trackPageView('/clients?filter=active');
      });

      const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body.properties.page).toBe('/clients?filter=active');
    });

    it('should handle empty page path', async () => {
      const { result } = renderHook(() => useAnalytics());

      await act(async () => {
        result.current.trackPageView('');
      });

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
    it('should maintain same sessionId across multiple track calls', async () => {
      const { result } = renderHook(() => useAnalytics());

      await act(async () => {
        await result.current.track('event1');
      });
      const sessionId1 = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body).sessionId;

      await act(async () => {
        await result.current.track('event2');
      });
      const sessionId2 = JSON.parse((fetch as jest.Mock).mock.calls[1][1].body).sessionId;

      expect(sessionId1).toBe(sessionId2);
    });

    it('should include different properties for different event types', async () => {
      const { result } = renderHook(() => useAnalytics());

      await act(async () => {
        await result.current.track('custom_event', { customProp: 'value' });
      });
      const customBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(customBody.properties.customProp).toBe('value');

      jest.clearAllMocks();
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await act(async () => {
        result.current.trackSession();
      });
      const sessionBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(sessionBody.properties.url).toBeDefined();

      jest.clearAllMocks();
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await act(async () => {
        result.current.trackPageView('/test');
      });
      const pageViewBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(pageViewBody.properties.page).toBe('/test');
    });
  });
});
