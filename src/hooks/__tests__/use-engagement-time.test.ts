import { renderHook, act } from '@testing-library/react';
import { useEngagementTime } from '../use-engagement-time';

describe('useEngagementTime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with zero engagement time', () => {
    const { result } = renderHook(() => useEngagementTime());
    
    expect(result.current.engagementTime).toBe(0);
    expect(result.current.isActive).toBe(true);
    expect(result.current.timeSinceLastActivity).toBe(0);
  });

  it('should track engagement time when active', () => {
    const onTimeUpdate = jest.fn();
    const { result } = renderHook(() => 
      useEngagementTime({ onTimeUpdate, updateInterval: 1000 })
    );
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.engagementTime).toBe(1000);
    expect(onTimeUpdate).toHaveBeenCalledWith(1000);
  });

  it('should pause tracking when inactive', () => {
    // Use inactivityThreshold: 1500 so user becomes inactive between the 1st and 2nd intervals.
    // At t=1000ms: timeSinceActivity=1000 < 1500 → still active, engagementTime=1000.
    // At t=2000ms: timeSinceActivity=2000 > 1500 → inactive, does NOT increment.
    const { result } = renderHook(() =>
      useEngagementTime({ inactivityThreshold: 1500, updateInterval: 1000 })
    );

    // Track for 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.engagementTime).toBe(1000);
    expect(result.current.isActive).toBe(true);

    // Simulate inactivity (2 more intervals — user crosses threshold at 2nd tick)
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.engagementTime).toBe(1000); // Should not increase after inactive
  });

  it('should resume tracking on activity', () => {
    const onActive = jest.fn();
    const { result } = renderHook(() => 
      useEngagementTime({ 
        inactivityThreshold: 2000, 
        updateInterval: 1000,
        onActive 
      })
    );
    
    // Become inactive
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.isActive).toBe(false);

    // Simulate activity
    act(() => {
      window.dispatchEvent(new Event('mousemove'));
    });

    expect(result.current.isActive).toBe(true);
    expect(onActive).toHaveBeenCalled();
  });

  it('should call onInactive when user becomes inactive', () => {
    const onInactive = jest.fn();
    renderHook(() => 
      useEngagementTime({ 
        inactivityThreshold: 2000, 
        updateInterval: 1000,
        onInactive 
      })
    );
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onInactive).toHaveBeenCalled();
  });

  it('should reset engagement time', () => {
    const { result } = renderHook(() => useEngagementTime({ updateInterval: 1000 }));
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.engagementTime).toBe(2000);

    act(() => {
      result.current.reset();
    });

    expect(result.current.engagementTime).toBe(0);
    expect(result.current.timeSinceLastActivity).toBe(0);
  });

  it('should track time since last activity', () => {
    const { result } = renderHook(() => useEngagementTime({ updateInterval: 1000 }));

    // Dispatch activity to reset the lastActivity timestamp to "now"
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // Simulate activity to reset the clock
    act(() => {
      window.dispatchEvent(new Event('mousemove'));
    });

    // Right after activity: timeSinceLastActivity resets to 0
    expect(result.current.timeSinceLastActivity).toBe(0);

    // Advance 2 more intervals with no activity → timeSinceLastActivity = 2000
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.timeSinceLastActivity).toBe(2000);
  });

  it('should not track when disabled', () => {
    const onTimeUpdate = jest.fn();
    const { result } = renderHook(() => 
      useEngagementTime({ enabled: false, onTimeUpdate, updateInterval: 1000 })
    );
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.engagementTime).toBe(0);
    expect(onTimeUpdate).not.toHaveBeenCalled();
  });

  it('should use default update interval when none provided', () => {
    const { result } = renderHook(() => useEngagementTime());
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.engagementTime).toBe(1000);
  });

  it('should handle multiple activity events', () => {
    const { result } = renderHook(() => useEngagementTime({ updateInterval: 1000 }));
    
    act(() => {
      window.dispatchEvent(new Event('mousemove'));
      window.dispatchEvent(new Event('keydown'));
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.timeSinceLastActivity).toBe(0);
  });
});
