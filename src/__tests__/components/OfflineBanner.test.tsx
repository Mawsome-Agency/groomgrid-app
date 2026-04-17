import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OfflineBanner } from '@/components/network/OfflineBanner';

// Mock both context hooks so we can control isOffline / pendingCount per test
jest.mock('@/context/NetworkStatusContext', () => ({
  useNetworkStatus: jest.fn(),
}));

jest.mock('@/context/RequestQueueContext', () => ({
  useRequestQueue: jest.fn(),
}));

import { useNetworkStatus } from '@/context/NetworkStatusContext';
import { useRequestQueue } from '@/context/RequestQueueContext';

const mockGoOnline = jest.fn();

function setNetworkStatus(isOffline: boolean) {
  (useNetworkStatus as jest.Mock).mockReturnValue({
    isOnline: !isOffline,
    isOffline,
    wasOffline: false,
    lastChanged: null,
    lastChecked: null,
    errorType: isOffline ? 'offline' : null,
    checkConnection: jest.fn(),
    goOnline: mockGoOnline,
  });
}

function setPendingCount(count: number) {
  (useRequestQueue as jest.Mock).mockReturnValue({
    pendingCount: count,
    requestIds: new Set(),
    addRequest: jest.fn(),
    removeRequest: jest.fn(),
    clearRequests: jest.fn(),
  });
}

describe('OfflineBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: online, no pending requests
    setNetworkStatus(false);
    setPendingCount(0);
  });

  it('does not render when online', () => {
    setNetworkStatus(false);
    render(<OfflineBanner />);

    expect(screen.queryByText(/You are currently offline/)).not.toBeInTheDocument();
  });

  it('renders when offline with no pending requests', () => {
    setNetworkStatus(true);
    setPendingCount(0);
    render(<OfflineBanner />);

    expect(
      screen.getByText('You are currently offline. Some features may be unavailable.')
    ).toBeInTheDocument();
  });

  it('shows queued count when offline with pending requests', () => {
    setNetworkStatus(true);
    setPendingCount(3);
    render(<OfflineBanner />);

    expect(screen.getByText(/3 requests queued/)).toBeInTheDocument();
  });

  it('shows singular "request" when count is 1', () => {
    setNetworkStatus(true);
    setPendingCount(1);
    render(<OfflineBanner />);

    expect(screen.getByText(/1 request queued/)).toBeInTheDocument();
    expect(screen.queryByText(/1 requests queued/)).not.toBeInTheDocument();
  });

  it('shows plural "requests" when count is greater than 1', () => {
    setNetworkStatus(true);
    setPendingCount(2);
    render(<OfflineBanner />);

    expect(screen.getByText(/2 requests queued/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    setNetworkStatus(true);
    setPendingCount(0);
    const { container } = render(<OfflineBanner className="custom-class" />);

    const banner = container.querySelector('.custom-class');
    expect(banner).toBeInTheDocument();
  });

  it('renders at top position by default', () => {
    setNetworkStatus(true);
    setPendingCount(0);
    const { container } = render(<OfflineBanner />);

    const banner = container.querySelector('.top-0');
    expect(banner).toBeInTheDocument();
  });

  it('renders at bottom position when specified', () => {
    setNetworkStatus(true);
    setPendingCount(0);
    const { container } = render(<OfflineBanner position="bottom" />);

    const banner = container.querySelector('.bottom-0');
    expect(banner).toBeInTheDocument();
  });

  it('shows spinner when there are pending requests', () => {
    setNetworkStatus(true);
    setPendingCount(1);
    const { container } = render(<OfflineBanner />);

    // Both the banner div and the inner LoadingSpinner have role="status".
    // Verify the spinner is present by checking the Lucide Loader2 icon class.
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows retry button when there are pending requests', () => {
    setNetworkStatus(true);
    setPendingCount(1);
    render(<OfflineBanner />);

    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
  });

  it('does not show retry button when there are no pending requests', () => {
    setNetworkStatus(true);
    setPendingCount(0);
    render(<OfflineBanner />);

    const retryButton = screen.queryByText('Retry');
    expect(retryButton).not.toBeInTheDocument();
  });

  it('has accessibility attributes', () => {
    setNetworkStatus(true);
    setPendingCount(1);
    const { container } = render(<OfflineBanner />);

    // Both the outer banner div and the inner LoadingSpinner have role="status".
    // Check the outer banner specifically by selecting the fixed-position element.
    const banner = container.querySelector('.fixed[role="status"]');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('aria-live', 'polite');
  });
});
