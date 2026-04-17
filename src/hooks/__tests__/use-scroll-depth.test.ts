import { renderHook, act } from '@testing-library/react';
import { useScrollDepth } from '../use-scroll-depth';

// RAF is a no-op in jsdom — replace with a synchronous implementation so state updates work
global.requestAnimationFrame = (cb: FrameRequestCallback) => { cb(performance.now()); return 0; };
global.cancelAnimationFrame = jest.fn();

// Mock window and document
const mockScrollTop = 0;
const mockScrollHeight = 1000;
const mockClientHeight = 800;

Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  configurable: true,
  value: mockScrollTop,
});

Object.defineProperty(document.documentElement, 'scrollHeight', {
  writable: true,
  configurable: true,
  value: mockScrollHeight,
});

Object.defineProperty(document.documentElement, 'clientHeight', {
  writable: true,
  configurable: true,
  value: mockClientHeight,
});

describe('useScrollDepth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.pageYOffset = 0;
  });

  it('should initialize with zero depth', () => {
    const { result } = renderHook(() => useScrollDepth());
    
    expect(result.current.currentDepth).toBe(0);
    expect(result.current.maxDepth).toBe(0);
    expect(result.current.reachedThresholds.size).toBe(0);
  });

  it('should track scroll depth when scrolling', () => {
    const { result } = renderHook(() => useScrollDepth({ thresholds: [25, 50] }));
    
    act(() => {
      window.pageYOffset = 100; // 50% of 200px scrollable height
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.currentDepth).toBe(50);
    expect(result.current.maxDepth).toBe(50);
  });

  it('should trigger callback when threshold is reached', () => {
    const onThresholdReached = jest.fn();
    const { result } = renderHook(() => 
      useScrollDepth({ thresholds: [25, 50], onThresholdReached })
    );
    
    act(() => {
      window.pageYOffset = 50; // 25% of 200px scrollable height
      window.dispatchEvent(new Event('scroll'));
    });

    expect(onThresholdReached).toHaveBeenCalledWith(25);
    expect(result.current.reachedThresholds.has(25)).toBe(true);
  });

  it('should not trigger callback for same threshold twice', () => {
    const onThresholdReached = jest.fn();
    const { result } = renderHook(() => 
      useScrollDepth({ thresholds: [25], onThresholdReached })
    );
    
    act(() => {
      window.pageYOffset = 50;
      window.dispatchEvent(new Event('scroll'));
    });

    act(() => {
      window.pageYOffset = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(onThresholdReached).toHaveBeenCalledTimes(1);
  });

  it('should update max depth correctly', () => {
    const { result } = renderHook(() => useScrollDepth());
    
    act(() => {
      window.pageYOffset = 50;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.maxDepth).toBe(25);

    act(() => {
      window.pageYOffset = 150;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.maxDepth).toBe(75);
  });

  it('should cap scroll depth at 100%', () => {
    const { result } = renderHook(() => useScrollDepth());
    
    act(() => {
      window.pageYOffset = 500; // Beyond scrollable height
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.currentDepth).toBe(100);
  });

  it('should not track when disabled', () => {
    const onThresholdReached = jest.fn();
    renderHook(() => 
      useScrollDepth({ enabled: false, thresholds: [25], onThresholdReached })
    );
    
    act(() => {
      window.pageYOffset = 50;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(onThresholdReached).not.toHaveBeenCalled();
  });

  it('should use default thresholds when none provided', () => {
    const { result } = renderHook(() => useScrollDepth());
    
    act(() => {
      window.pageYOffset = 50;
      window.dispatchEvent(new Event('scroll'));
    });

    // Default thresholds are [25, 50, 75, 100]
    expect(result.current.reachedThresholds.has(25)).toBe(true);
  });
});
