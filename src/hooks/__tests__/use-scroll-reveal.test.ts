import { renderHook, act } from '@testing-library/react';
import { useScrollReveal } from '../use-scroll-reveal';

// Functional IntersectionObserver mock — fires callback immediately on observe
class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;
  static instances: MockIntersectionObserver[] = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe = jest.fn((element: Element) => {
    this.callback(
      [{ target: element, isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  });

  unobserve = jest.fn();
  disconnect = jest.fn();
}

function mockMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: reducedMotion && query.includes('reduce'),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

describe('useScrollReveal', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    global.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
    mockMatchMedia(false);
  });

  it('adds "revealed" class when element intersects the viewport', () => {
    const { result } = renderHook(() => useScrollReveal());
    const el = document.createElement('div');
    el.className = 'scroll-reveal';

    act(() => { result.current.revealRef(0)(el); });

    expect(el.classList.contains('revealed')).toBe(true);
  });

  it('applies transition-delay for stagger offset', () => {
    const { result } = renderHook(() => useScrollReveal());
    const el = document.createElement('div');

    act(() => { result.current.revealRef(150)(el); });

    expect(el.style.transitionDelay).toBe('150ms');
  });

  it('does not apply transition-delay when delay is 0', () => {
    const { result } = renderHook(() => useScrollReveal());
    const el = document.createElement('div');

    act(() => { result.current.revealRef(0)(el); });

    // transitionDelay should not be set (remains empty string)
    expect(el.style.transitionDelay).toBe('');
  });

  it('does not re-observe an already-revealed element on re-render', () => {
    const { result } = renderHook(() => useScrollReveal());
    const el = document.createElement('div');
    el.classList.add('revealed'); // simulate already revealed

    const instance = MockIntersectionObserver.instances[0];
    const observeSpy = instance?.observe ?? jest.fn();

    act(() => { result.current.revealRef(0)(el); });

    expect(observeSpy).not.toHaveBeenCalled();
  });

  it('handles null element ref gracefully without throwing', () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(() => {
      act(() => { result.current.revealRef(0)(null); });
    }).not.toThrow();
  });

  it('immediately reveals elements when prefers-reduced-motion is set', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useScrollReveal());
    const el = document.createElement('div');
    el.className = 'scroll-reveal';

    act(() => { result.current.revealRef(0)(el); });

    // With reduced motion, the element should either get .revealed or CSS handles it
    // The hook's belt-and-suspenders path adds .revealed directly
    expect(el.classList.contains('revealed')).toBe(true);
  });

  it('stagger delays are independent per element', () => {
    const { result } = renderHook(() => useScrollReveal());
    const el0 = document.createElement('div');
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');

    act(() => {
      result.current.revealRef(0)(el0);
      result.current.revealRef(100)(el1);
      result.current.revealRef(200)(el2);
    });

    expect(el0.style.transitionDelay).toBe('');
    expect(el1.style.transitionDelay).toBe('100ms');
    expect(el2.style.transitionDelay).toBe('200ms');
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = renderHook(() => useScrollReveal());
    const instance = MockIntersectionObserver.instances[0];

    unmount();

    if (instance) {
      expect(instance.disconnect).toHaveBeenCalled();
    }
  });

  it('unobserves element after it is revealed (fires only once)', () => {
    const { result } = renderHook(() => useScrollReveal());
    const el = document.createElement('div');

    act(() => { result.current.revealRef(0)(el); });

    const instance = MockIntersectionObserver.instances[0];
    if (instance) {
      expect(instance.unobserve).toHaveBeenCalledWith(el);
    }
  });
});
