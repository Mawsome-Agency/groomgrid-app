/**
 * Unit tests for NetworkErrorBoundary component
 *
 * A React error boundary that catches rendering errors and shows a fallback UI.
 * Test cases cover:
 * 1. Normal rendering (no error → children displayed)
 * 2. Error caught → fallback UI shown
 * 3. Custom fallback prop
 * 4. onError callback
 * 5. Console.error logging on caught errors
 * 6. Multiple children rendering
 * 7. Deeply nested errors
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NetworkErrorBoundary } from '@/components/network/NetworkErrorBoundary';

// ── Test Components ──────────────────────────────────────────────────────

/** A component that throws an error when `shouldThrow` is true. */
function ThrowOnProp({ shouldThrow, message = 'Test error' }: { shouldThrow: boolean; message?: string }) {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div data-testid="child-content">Content rendered successfully</div>;
}

/** A component that always throws. Must return never to satisfy TS JSX checks. */
function AlwaysThrows({ message = 'Always fails' }: { message?: string }): React.ReactElement {
  throw new Error(message);
}

// ── Suppress console.error in tests ─────────────────────────────────────
// React error boundaries log caught errors to console.error. We suppress
// this noise in test output but still verify the boundary works.

const originalConsoleError = console.error;
beforeEach(() => {
  console.error = jest.fn();
});
afterEach(() => {
  console.error = originalConsoleError;
});

// ── Test Suite ──────────────────────────────────────────────────────────

describe('NetworkErrorBoundary', () => {
  describe('normal rendering (no errors)', () => {
    it('renders children when no error occurs', () => {
      render(
        <NetworkErrorBoundary>
          <ThrowOnProp shouldThrow={false} />
        </NetworkErrorBoundary>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Content rendered successfully')).toBeInTheDocument();
    });

    it('renders multiple children when no error occurs', () => {
      render(
        <NetworkErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </NetworkErrorBoundary>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('does not show fallback UI when no error occurs', () => {
      render(
        <NetworkErrorBoundary>
          <ThrowOnProp shouldThrow={false} />
        </NetworkErrorBoundary>
      );

      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/network connection/i)).not.toBeInTheDocument();
    });
  });

  describe('error catching', () => {
    it('shows default fallback UI when a child throws an error', () => {
      render(
        <NetworkErrorBoundary>
          <AlwaysThrows message="Rendering failed" />
        </NetworkErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/check your network connection/i)).toBeInTheDocument();
    });

    it('does not render children after catching an error', () => {
      render(
        <NetworkErrorBoundary>
          <AlwaysThrows />
        </NetworkErrorBoundary>
      );

      expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    });

    it('catches errors with custom error messages', () => {
      render(
        <NetworkErrorBoundary>
          <AlwaysThrows message="Custom network failure" />
        </NetworkErrorBoundary>
      );

      // Default fallback should still show regardless of error message
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('logs the error via componentDidCatch', () => {
      render(
        <NetworkErrorBoundary>
          <AlwaysThrows message="Logged error message" />
        </NetworkErrorBoundary>
      );

      // React error boundaries call console.error with the error and componentStack.
      // We just verify that console.error was called (React logs it).
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('custom fallback prop', () => {
    it('renders custom fallback when provided and error occurs', () => {
      render(
        <NetworkErrorBoundary fallback={<div data-testid="custom-fallback">Custom error message</div>}>
          <AlwaysThrows />
        </NetworkErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('does not show default fallback when custom fallback is provided', () => {
      render(
        <NetworkErrorBoundary fallback={<div>Custom fallback</div>}>
          <AlwaysThrows />
        </NetworkErrorBoundary>
      );

      expect(screen.queryByText(/check your network connection/i)).not.toBeInTheDocument();
      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });

    it('renders custom fallback with complex JSX', () => {
      const complexFallback = (
        <div data-testid="complex-fallback">
          <h2>Connection Lost</h2>
          <button>Retry</button>
        </div>
      );

      render(
        <NetworkErrorBoundary fallback={complexFallback}>
          <AlwaysThrows />
        </NetworkErrorBoundary>
      );

      expect(screen.getByTestId('complex-fallback')).toBeInTheDocument();
      expect(screen.getByText('Connection Lost')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('does not render custom fallback when no error occurs', () => {
      render(
        <NetworkErrorBoundary fallback={<div data-testid="custom-fallback">Custom fallback</div>}>
          <ThrowOnProp shouldThrow={false} />
        </NetworkErrorBoundary>
      );

      expect(screen.queryByTestId('custom-fallback')).not.toBeInTheDocument();
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  describe('onError callback', () => {
    it('calls onError when an error is caught', () => {
      const onError = jest.fn();

      render(
        <NetworkErrorBoundary onError={onError}>
          <AlwaysThrows message="Callback error" />
        </NetworkErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      // Verify the error message is passed through
      const errorArg = onError.mock.calls[0][0] as Error;
      expect(errorArg.message).toBe('Callback error');
    });

    it('does not call onError when no error occurs', () => {
      const onError = jest.fn();

      render(
        <NetworkErrorBoundary onError={onError}>
          <ThrowOnProp shouldThrow={false} />
        </NetworkErrorBoundary>
      );

      expect(onError).not.toHaveBeenCalled();
    });

    it('calls onError even when custom fallback is provided', () => {
      const onError = jest.fn();

      render(
        <NetworkErrorBoundary
          onError={onError}
          fallback={<div>Custom</div>}
        >
          <AlwaysThrows message="Error with fallback" />
        </NetworkErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      const errorArg = onError.mock.calls[0][0] as Error;
      expect(errorArg.message).toBe('Error with fallback');
    });
  });

  describe('default fallback UI', () => {
    it('has correct styling classes on default fallback', () => {
      render(
        <NetworkErrorBoundary>
          <AlwaysThrows />
        </NetworkErrorBoundary>
      );

      const fallback = screen.getByText(/something went wrong/i).closest('div');
      expect(fallback).toHaveClass('p-4');
      expect(fallback).toHaveClass('bg-red-100');
      expect(fallback).toHaveClass('text-red-800');
      expect(fallback).toHaveClass('rounded');
    });

    it('mentions network connection in default fallback', () => {
      render(
        <NetworkErrorBoundary>
          <AlwaysThrows />
        </NetworkErrorBoundary>
      );

      expect(screen.getByText(/check your network connection and try again/i)).toBeInTheDocument();
    });
  });

  describe('error boundary lifecycle', () => {
    it('catches errors in deeply nested children', () => {
      const onError = jest.fn();

      render(
        <NetworkErrorBoundary onError={onError}>
          <div>
            <div>
              <div>
                <AlwaysThrows message="Deeply nested error" />
              </div>
            </div>
          </div>
        </NetworkErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(onError).toHaveBeenCalledTimes(1);
      const errorArg = onError.mock.calls[0][0] as Error;
      expect(errorArg.message).toBe('Deeply nested error');
    });
  });
});
