import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OfflineBanner } from '@/components/network/OfflineBanner';
import { NetworkStatusProvider, useNetworkStatus } from '@/context/NetworkStatusContext';
import { RequestQueueProvider, useRequestQueue } from '@/context/RequestQueueContext';

// Helper component to control both contexts
const TestWrapper = ({ children, isOnline = true, initialPendingCount = 0 }: { children: React.ReactNode; isOnline?: boolean; initialPendingCount?: number }) => {
  return (
    <NetworkStatusProvider>
      <RequestQueueProvider>
        <TestInner isOnline={isOnline} initialPendingCount={initialPendingCount}>
          {children}
        </TestInner>
      </RequestQueueProvider>
    </NetworkStatusProvider>
  );
};

const TestInner = ({ children, isOnline, initialPendingCount }: { children: React.ReactNode; isOnline: boolean; initialPendingCount: number }) => {
  const networkContext = useNetworkStatus();
  const queueContext = useRequestQueue();

  // Set initial pending count
  React.useEffect(() => {
    for (let i = 0; i < initialPendingCount; i++) {
      queueContext.addRequest(`test-id-${i}`);
    }
  }, [initialPendingCount]);

  // Mock network status
  React.useEffect(() => {
    if (!isOnline) {
      // Simulate offline by setting the internal state
      (networkContext as any).isOnline = false;
      (networkContext as any).isOffline = true;
    }
  }, [isOnline]);

  return <>{children}</>;
};

describe('OfflineBanner', () => {
  it('does not render when online', () => {
    render(
      <TestWrapper isOnline={true}>
        <OfflineBanner />
      </TestWrapper>
    );

    expect(screen.queryByText(/You are currently offline/)).not.toBeInTheDocument();
  });

  it('renders when offline with no pending requests', () => {
    render(
      <TestWrapper isOnline={false}>
        <OfflineBanner />
      </TestWrapper>
    );

    expect(screen.getByText('You are currently offline. Some features may be unavailable.')).toBeInTheDocument();
  });

  it('shows queued count when offline with pending requests', () => {
    render(
      <TestWrapper isOnline={false} initialPendingCount={3}>
        <OfflineBanner />
      </TestWrapper>
    );

    expect(screen.getByText(/3 requests queued/)).toBeInTheDocument();
  });

  it('shows singular "request" when count is 1', () => {
    render(
      <TestWrapper isOnline={false} initialPendingCount={1}>
        <OfflineBanner />
      </TestWrapper>
    );

    expect(screen.getByText(/1 request queued/)).toBeInTheDocument();
    expect(screen.queryByText(/1 requests queued/)).not.toBeInTheDocument();
  });

  it('shows plural "requests" when count is greater than 1', () => {
    render(
      <TestWrapper isOnline={false} initialPendingCount={2}>
        <OfflineBanner />
      </TestWrapper>
    );

    expect(screen.getByText(/2 requests queued/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper isOnline={false}>
        <OfflineBanner className="custom-class" />
      </TestWrapper>
    );

    const banner = container.querySelector('.custom-class');
    expect(banner).toBeInTheDocument();
  });

  it('renders at top position by default', () => {
    const { container } = render(
      <TestWrapper isOnline={false}>
        <OfflineBanner />
      </TestWrapper>
    );

    const banner = container.querySelector('.top-0');
    expect(banner).toBeInTheDocument();
  });

  it('renders at bottom position when specified', () => {
    const { container } = render(
      <TestWrapper isOnline={false}>
        <OfflineBanner position="bottom" />
      </TestWrapper>
    );

    const banner = container.querySelector('.bottom-0');
    expect(banner).toBeInTheDocument();
  });

  it('shows spinner when there are pending requests', () => {
    render(
      <TestWrapper isOnline={false} initialPendingCount={1}>
        <OfflineBanner />
      </TestWrapper>
    );

    // Look for the spinner element (loading indicator)
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('shows retry button when there are pending requests', () => {
    render(
      <TestWrapper isOnline={false} initialPendingCount={1}>
        <OfflineBanner />
      </TestWrapper>
    );

    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
  });

  it('does not show retry button when there are no pending requests', () => {
    render(
      <TestWrapper isOnline={false} initialPendingCount={0}>
        <OfflineBanner />
      </TestWrapper>
    );

    const retryButton = screen.queryByText('Retry');
    expect(retryButton).not.toBeInTheDocument();
  });

  it('has accessibility attributes', () => {
    render(
      <TestWrapper isOnline={false} initialPendingCount={1}>
        <OfflineBanner />
      </TestWrapper>
    );

    const banner = screen.getByRole('status');
    expect(banner).toHaveAttribute('aria-live', 'polite');
  });
});
