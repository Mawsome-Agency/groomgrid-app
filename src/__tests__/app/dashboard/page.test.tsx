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
    // Mock fetch to reject
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<DashboardPage />);
    
    // Wait for error state to appear
    await waitFor(() => {
      expect(screen.getByText('Unable to Load Dashboard')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Network connection issue/i)).toBeInTheDocument();
  });

  it('allows retrying after error', async () => {
    const user = userEvent.setup();
    
    // First fetch fails
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      // Second fetch succeeds
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ profile: {} }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ clients: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ appointments: [] }),
      });
    
    render(<DashboardPage />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Unable to Load Dashboard')).toBeInTheDocument();
    });
    
    // Click retry button
    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    await user.click(retryButton);
    
    // Should show loading state during retry
    expect(screen.getByText('Retrying...')).toBeInTheDocument();
    
    // Wait for successful load
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
