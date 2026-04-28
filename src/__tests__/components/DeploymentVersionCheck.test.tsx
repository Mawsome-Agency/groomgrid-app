/**
 * Unit tests for DeploymentVersionCheck component
 *
 * This component is the LAST LINE OF DEFENSE against stale Server Action errors
 * that block conversions. If someone hits "Failed to find Server Action" on a
 * cached page, this component auto-reloads once, then shows a proper error on
 * second occurrence.
 *
 * Edge cases tested:
 * 1. Server Action error detection via window `error` event
 * 2. Server Action error detection via `unhandledrejection` event
 * 3. Auto-reload on first Server Action error occurrence
 * 4. Show error UI on second occurrence (after reload)
 * 5. Non-matching errors are ignored
 * 6. Build ID polling detects new deployments
 * 7. Build ID polling silently handles fetch failures
 * 8. Event listeners are cleaned up on unmount
 * 9. sessionStorage reload flag is cleared on mount
 * 10. Error UI has refresh button that reloads the page
 * 11. Version banner has reload button
 * 12. Edge case: unhandledrejection with non-standard reason types
 */

import React from 'react';
import { render, screen, act, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── Mocks ──────────────────────────────────────────────────────────────
// jsdom doesn't implement navigation, so we mock window.location.reload.
// We also mock sessionStorage and fetch for full control.

const mockReload = jest.fn();
const originalLocation = window.location;

// Real sessionStorage mock with store backing
let store: Record<string, string> = {};
const sessionStorageMock = {
  getItem: jest.fn((key: string) => store[key] ?? null),
  setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: jest.fn((key: string) => { delete store[key]; }),
  clear: jest.fn(() => { store = {}; }),
  get length() { return Object.keys(store).length; },
  key: jest.fn((index: number) => Object.keys(store)[index] ?? null),
};

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock window.location.reload
Object.defineProperty(window, 'location', {
  value: { ...originalLocation, reload: mockReload },
  writable: true,
});

// Mock fetch for /api/health polling
let mockFetchResponse: { buildId?: string } | null = { buildId: 'build-abc123' };
const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockFetchResponse),
  })
) as jest.Mock;
(global as unknown as Record<string, unknown>).fetch = mockFetch;

// Import the component AFTER mocks are set up
import DeploymentVersionCheck from '@/components/deployment/DeploymentVersionCheck';

// ── Helpers ────────────────────────────────────────────────────────────

const RELOAD_KEY = 'gg_server_action_reload_attempted';

/**
 * Dispatch a window error event simulating a Server Action error.
 */
function dispatchServerError(message = 'Failed to find Server Action "abc123"') {
  const event = new ErrorEvent('error', {
    message,
    bubbles: true,
    cancelable: true,
  });
  window.dispatchEvent(event);
}

/**
 * Dispatch an unhandledrejection event.
 * jsdom may not have PromiseRejectionEvent, so we use CustomEvent as fallback.
 */
function dispatchUnhandledRejection(reason: unknown) {
  if (typeof PromiseRejectionEvent !== 'undefined') {
    const event = new PromiseRejectionEvent('unhandledrejection', {
      promise: Promise.reject(reason),
      reason,
    });
    window.dispatchEvent(event);
  } else {
    // Fallback for jsdom: simulate the event structure the component listens for
    const event = new CustomEvent('unhandledrejection', {
      detail: { reason },
    });
    Object.defineProperty(event, 'reason', { value: reason, writable: false });
    window.dispatchEvent(event);
  }
}

// ── Test Suite ──────────────────────────────────────────────────────────

describe('DeploymentVersionCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    store = {}; // Reset sessionStorage store
    mockFetch.mockClear();
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFetchResponse),
      })
    );
    mockFetchResponse = { buildId: 'build-abc123' };
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  // ── Server Action Error Detection ───────────────────────────────

  describe('Server Action error detection via window error event', () => {
    it('auto-reloads the page on first Server Action error', () => {
      render(<DeploymentVersionCheck />);

      act(() => {
        dispatchServerError('Failed to find Server Action "abc123"');
      });

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(RELOAD_KEY, '1');
      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('does not reload if a non-Server-Action error occurs', () => {
      render(<DeploymentVersionCheck />);

      act(() => {
        dispatchServerError('TypeError: Cannot read property of undefined');
      });

      expect(mockReload).not.toHaveBeenCalled();
    });

    it('matches Server Action error case-insensitively', () => {
      render(<DeploymentVersionCheck />);

      act(() => {
        dispatchServerError('FAILED TO FIND SERVER ACTION "test"');
      });

      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('matches partial Server Action error messages', () => {
      render(<DeploymentVersionCheck />);

      act(() => {
        dispatchServerError('Error: Failed to find Server Action someId at React');
      });

      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });

  describe('Server Action error detection via unhandledrejection event', () => {
    it('auto-reloads on first Server Action rejection', () => {
      render(<DeploymentVersionCheck />);

      act(() => {
        dispatchUnhandledRejection('Failed to find Server Action "xyz789"');
      });

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(RELOAD_KEY, '1');
      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('handles Error objects as rejection reason', () => {
      render(<DeploymentVersionCheck />);

      act(() => {
        dispatchUnhandledRejection(new Error('Failed to find Server Action "errObj"'));
      });

      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('handles rejection reason with message property', () => {
      render(<DeploymentVersionCheck />);

      act(() => {
        dispatchUnhandledRejection({ message: 'Failed to find Server Action "objMsg"' });
      });

      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('ignores non-Server-Action rejections', () => {
      render(<DeploymentVersionCheck />);

      act(() => {
        dispatchUnhandledRejection('NetworkError: Failed to fetch');
      });

      expect(mockReload).not.toHaveBeenCalled();
    });

    it('handles null rejection reason gracefully without crashing', () => {
      render(<DeploymentVersionCheck />);

      expect(() => {
        act(() => {
          dispatchUnhandledRejection(null);
        });
      }).not.toThrow();

      expect(mockReload).not.toHaveBeenCalled();
    });

    it('handles non-string, non-object rejection reason without crashing', () => {
      render(<DeploymentVersionCheck />);

      expect(() => {
        act(() => {
          dispatchUnhandledRejection(42);
        });
      }).not.toThrow();

      expect(mockReload).not.toHaveBeenCalled();
    });
  });

  // ── Auto-reload Behavior ────────────────────────────────────────

  describe('auto-reload behavior', () => {
    it('sets sessionStorage flag before reloading', () => {
      render(<DeploymentVersionCheck />);

      act(() => {
        dispatchServerError();
      });

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(RELOAD_KEY, '1');
      expect(mockReload).toHaveBeenCalled();
    });

    it('shows error UI on second Server Action error occurrence (after reload)', () => {
      // The component clears the flag on mount. To test the "second occurrence"
      // path, we need to simulate what happens when:
      // 1. Error fires → flag set, reload called
      // 2. After reload, mount clears the flag
      // 3. If somehow the flag persists (race condition or slow mount),
      //    the second occurrence should show error UI instead of reloading.
      //
      // To test this, we render the component (which clears the flag),
      // then manually put the flag back in sessionStorage, then fire an error.
      render(<DeploymentVersionCheck />);

      // After mount, the flag was cleared. Simulate it being re-added
      // (e.g., by a race condition where the error fires before mount effect)
      store[RELOAD_KEY] = '1';

      act(() => {
        dispatchServerError();
      });

      // Should show the error message, not reload
      // Note: mockReload may have been called during the first error in this
      // test run — we just need to verify the error UI is shown
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/refresh the page/i)).toBeInTheDocument();
    });

    it('clears sessionStorage reload flag on component mount (fresh page load)', () => {
      render(<DeploymentVersionCheck />);

      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(RELOAD_KEY);
    });

    it('after showing error UI, clears sessionStorage so future errors can auto-reload', () => {
      // Test that when error UI is shown, the flag is cleared for future recovery
      render(<DeploymentVersionCheck />);

      // Manually set the flag to simulate "already reloaded" state
      store[RELOAD_KEY] = '1';

      act(() => {
        dispatchServerError();
      });

      // The handler should clear the flag when showing error UI
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(RELOAD_KEY);
    });
  });

  // ── Error UI ────────────────────────────────────────────────────

  describe('error UI', () => {
    it('renders error banner with red styling on persistent error', () => {
      render(<DeploymentVersionCheck />);

      // Set the flag to simulate "already reloaded once" state
      store[RELOAD_KEY] = '1';

      act(() => {
        dispatchServerError();
      });

      const banner = screen.getByText(/something went wrong/i).closest('div');
      expect(banner).toHaveClass('bg-red-600');
    });

    it('has a clickable refresh link in error state', () => {
      render(<DeploymentVersionCheck />);

      store[RELOAD_KEY] = '1';

      act(() => {
        dispatchServerError();
      });

      const refreshButton = screen.getByText('refresh the page');
      expect(refreshButton).toBeInTheDocument();
      expect(refreshButton).toHaveAttribute('class', expect.stringContaining('underline'));
    });

    it('clicking refresh button in error state calls window.location.reload', () => {
      render(<DeploymentVersionCheck />);

      store[RELOAD_KEY] = '1';

      act(() => {
        dispatchServerError();
      });

      mockReload.mockClear();

      const refreshButton = screen.getByText('refresh the page');
      act(() => {
        refreshButton.click();
      });

      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });

  // ── Build ID Polling ────────────────────────────────────────────

  describe('build ID polling for new version detection', () => {
    it('renders nothing when build ID has not changed', () => {
      const { container } = render(<DeploymentVersionCheck />);

      expect(container.firstChild).toBeNull();
    });

    it('shows new version banner when build ID changes', async () => {
      render(<DeploymentVersionCheck />);

      // Wait for initial fetch to complete
      await act(async () => {
        await Promise.resolve();
      });

      // Now change the mock build ID
      mockFetchResponse = { buildId: 'build-newversion456' };

      // Advance timer to trigger the next poll
      await act(async () => {
        jest.advanceTimersByTime(60_000);
        await Promise.resolve();
      });

      expect(screen.getByText(/new version of GroomGrid is available/i)).toBeInTheDocument();
      expect(screen.getByText('Reload now')).toBeInTheDocument();
    });

    it('does not show version banner when build ID stays the same', async () => {
      render(<DeploymentVersionCheck />);

      await act(async () => {
        await Promise.resolve();
      });

      // Don't change the build ID
      await act(async () => {
        jest.advanceTimersByTime(60_000);
        await Promise.resolve();
      });

      expect(screen.queryByText(/new version/i)).not.toBeInTheDocument();
    });

    it('shows version banner with green styling', async () => {
      render(<DeploymentVersionCheck />);

      await act(async () => {
        await Promise.resolve();
      });

      mockFetchResponse = { buildId: 'build-newversion456' };

      await act(async () => {
        jest.advanceTimersByTime(60_000);
        await Promise.resolve();
      });

      const banner = screen.getByText(/new version/i).closest('div');
      expect(banner).toHaveClass('bg-green-600');
    });

    it('clicking reload on version banner calls window.location.reload', async () => {
      render(<DeploymentVersionCheck />);

      await act(async () => {
        await Promise.resolve();
      });

      mockFetchResponse = { buildId: 'build-newversion456' };

      await act(async () => {
        jest.advanceTimersByTime(60_000);
        await Promise.resolve();
      });

      mockReload.mockClear();

      const reloadButton = screen.getByText('Reload now');
      act(() => {
        reloadButton.click();
      });

      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('does not poll until initial build ID is set', async () => {
      // Start with a response that has no buildId
      mockFetchResponse = {};

      render(<DeploymentVersionCheck />);

      await act(async () => {
        await Promise.resolve();
      });

      // Even after a poll interval, should not set version changed
      // since initialBuildId was never set
      mockFetchResponse = { buildId: 'build-shouldnotmatter' };

      await act(async () => {
        jest.advanceTimersByTime(60_000);
        await Promise.resolve();
      });

      expect(screen.queryByText(/new version/i)).not.toBeInTheDocument();
    });
  });

  // ── Health Check Failure ─────────────────────────────────────────

  describe('health check failure handling', () => {
    it('silently ignores fetch failures on initial load', () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      expect(() => {
        render(<DeploymentVersionCheck />);
      }).not.toThrow();
    });

    it('silently ignores fetch failures during polling', async () => {
      render(<DeploymentVersionCheck />);

      await act(async () => {
        await Promise.resolve();
      });

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        jest.advanceTimersByTime(60_000);
        await Promise.resolve();
      });

      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });
  });

  // ── Event Listener Cleanup ──────────────────────────────────────

  describe('event listener cleanup', () => {
    it('removes error event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = render(<DeploymentVersionCheck />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });

    it('removes unhandledrejection event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = render(<DeploymentVersionCheck />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });

    it('does not respond to Server Action errors after unmount', () => {
      const { unmount } = render(<DeploymentVersionCheck />);
      unmount();

      mockReload.mockClear();

      act(() => {
        dispatchServerError();
      });

      expect(mockReload).not.toHaveBeenCalled();
    });

    it('clears polling interval on unmount', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      const { unmount } = render(<DeploymentVersionCheck />);
      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });

  // ── Edge Cases ──────────────────────────────────────────────────

  describe('edge cases', () => {
    it('renders null by default (no banners, no errors)', () => {
      const { container } = render(<DeploymentVersionCheck />);

      expect(container.firstChild).toBeNull();
    });

    it('does not show error banner when no Server Action error has occurred', () => {
      render(<DeploymentVersionCheck />);

      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });

    it('does not show version banner when no new version is available', () => {
      render(<DeploymentVersionCheck />);

      expect(screen.queryByText(/new version/i)).not.toBeInTheDocument();
    });

    it('calls fetch with /api/health on mount', () => {
      render(<DeploymentVersionCheck />);

      expect(mockFetch).toHaveBeenCalledWith('/api/health');
    });

    it('handles health response without buildId gracefully', async () => {
      mockFetchResponse = {};

      render(<DeploymentVersionCheck />);

      await act(async () => {
        await Promise.resolve();
      });

      expect(screen.queryByText(/new version/i)).not.toBeInTheDocument();
    });
  });
});
