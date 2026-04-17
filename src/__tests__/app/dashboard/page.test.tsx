import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/app/dashboard/page';
import { useSession } from 'next-auth/react';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('DashboardPage', () => {
  const mockSession = {
    user: {
      id: 'user123',
      name: 'Test User',
    },
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    });
    
    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
  });

  it('shows loading state initially', async () => {
    render(<DashboardPage />);
    
    expect(screen.getByText('Loading your dashboard...')).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    // Use 'Failed to fetch' which is the real browser network error message and
    // matches the check in fetchDashboardData for network error type.
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    render(<DashboardPage />);

    // Wait for error state to appear
    await waitFor(() => {
      expect(screen.getByText('Unable to Load Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText(/Network connection issue/i)).toBeInTheDocument();
  });

  it('allows retrying after error', async () => {
    const user = userEvent.setup();

    // fetchDashboardData uses Promise.all with 3 concurrent fetch calls.
    // The first round (3 calls) all fail — first one with a network error that
    // matches the error handler pattern, the other two as no-ops.
    // The second round (retry, 3 calls) all succeed.
    (global.fetch as jest.Mock)
      // Round 1 — profile (fails, triggers network error UI)
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      // Round 1 — clients (rejected too; Promise.all already rejected but call still fires)
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      // Round 1 — appointments (same)
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      // Round 2 (retry) — profile
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ profile: {} }) })
      // Round 2 (retry) — clients
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ clients: [] }) })
      // Round 2 (retry) — appointments
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ appointments: [] }) });

    render(<DashboardPage />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Unable to Load Dashboard')).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    await user.click(retryButton);

    // After retry succeeds, the error UI should disappear
    await waitFor(() => {
      expect(screen.queryByText('Unable to Load Dashboard')).not.toBeInTheDocument();
    });
  });

  it('shows timeout error when request times out', async () => {
    // Mock fetch to simulate timeout
    (global.fetch as jest.Mock).mockImplementation(() => {
      return new Promise((_, reject) => {
        // Simulate AbortError which would come from AbortController
        const abortError = new Error('Timeout');
        abortError.name = 'AbortError';
        reject(abortError);
      });
    });
    
    render(<DashboardPage />);
    
    // Wait for timeout error
    await waitFor(() => {
      expect(screen.getByText(/Request timed out/i)).toBeInTheDocument();
    });
  });
});
