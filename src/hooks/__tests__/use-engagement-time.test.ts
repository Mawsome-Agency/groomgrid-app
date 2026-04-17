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
    const { result } = renderHook(() => 
      useEngagementTime({ inactivityThreshold: 2000, updateInterval: 1000 })
    );
    
    // Track for 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.engagementTime).toBe(1000);
    expect(result.current.isActive).toBe(true);

    // Simulate inactivity
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.isActive).toBe(false);
    // engagementTime increments up to the tick before inactivity is detected (t=2000),
    // then stops. With updateInterval=1000 and inactivityThreshold=2000 (strictly >),
    // the second tick at t=2000 still counts as active (2000 is not > 2000).
    expect(result.current.engagementTime).toBe(2000); // increments until inactivity detected
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

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // After 1s with no activity events, timeSinceLastActivity = elapsed time since mount
    expect(result.current.timeSinceLastActivity).toBe(1000);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // After 3s total with no activity events, timeSinceLastActivity = 3000
    expect(result.current.timeSinceLastActivity).toBe(3000);
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
