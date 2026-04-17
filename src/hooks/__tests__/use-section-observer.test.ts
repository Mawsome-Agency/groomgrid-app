import { renderHook, act } from '@testing-library/react';
import { useSectionObserver } from '../use-section-observer';

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Set<Element> = new Set();
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
  }

  observe(element: Element) {
    this.elements.add(element);
    // Simulate element becoming visible
    this.callback([{ target: element, isIntersecting: true } as IntersectionObserverEntry], this);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver as any;

describe('useSectionObserver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty sets', () => {
    const { result } = renderHook(() => useSectionObserver());
    
    expect(result.current.visibleSections.size).toBe(0);
    expect(result.current.viewedSections.size).toBe(0);
    expect(Object.keys(result.current.sectionTimeSpent).length).toBe(0);
  });

  it('should track visible sections', () => {
    const onSectionVisible = jest.fn();
    const { result } = renderHook(() => 
      useSectionObserver({ onSectionVisible })
    );
    
    const mockElement = document.createElement('div');
    mockElement.setAttribute('data-section-id', 'hero');
    
    act(() => {
      result.current.observeSection('hero')(mockElement);
    });

    expect(result.current.visibleSections.has('hero')).toBe(true);
    expect(result.current.viewedSections.has('hero')).toBe(true);
    expect(onSectionVisible).toHaveBeenCalledWith('hero');
  });

  it('should not call onSectionVisible twice for same section', () => {
    const onSectionVisible = jest.fn();
    const { result } = renderHook(() => 
      useSectionObserver({ onSectionVisible })
    );
    
    const mockElement = document.createElement('div');
    
    act(() => {
      result.current.observeSection('hero')(mockElement);
    });

    act(() => {
      result.current.observeSection('hero')(mockElement);
    });

    expect(onSectionVisible).toHaveBeenCalledTimes(1);
  });

  it('should track time spent in sections', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useSectionObserver());
    
    const mockElement = document.createElement('div');
    
    act(() => {
      result.current.observeSection('hero')(mockElement);
    });

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.sectionTimeSpent['hero']).toBeGreaterThanOrEqual(1000);
    
    jest.useRealTimers();
  });

  it('should clean up on unmount', () => {
    const { result, unmount } = renderHook(() => useSectionObserver());
    
    const mockElement = document.createElement('div');
    
    act(() => {
      result.current.observeSection('hero')(mockElement);
    });

    unmount();
    
    // After unmount, timers should be cleared
    // This is more of a smoke test - the real cleanup happens in the effect
  });

  it('should not observe when disabled', () => {
    const onSectionVisible = jest.fn();
    const { result } = renderHook(() => 
      useSectionObserver({ enabled: false, onSectionVisible })
    );
    
    const mockElement = document.createElement('div');
    
    act(() => {
      result.current.observeSection('hero')(mockElement);
    });

    expect(onSectionVisible).not.toHaveBeenCalled();
  });

  it('should handle null element ref', () => {
    const { result } = renderHook(() => useSectionObserver());
    
    act(() => {
      result.current.observeSection('hero')(null);
    });

    expect(result.current.visibleSections.has('hero')).toBe(false);
  });

  it('should use default options when none provided', () => {
    const { result } = renderHook(() => useSectionObserver());
    
    const mockElement = document.createElement('div');
    
    act(() => {
      result.current.observeSection('hero')(mockElement);
    });

    expect(result.current.visibleSections.has('hero')).toBe(true);
  });
});
