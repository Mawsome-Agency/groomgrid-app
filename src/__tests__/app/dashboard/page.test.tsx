import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/app/(dashboard)/dashboard/page';
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
  useSearchParams: () => new URLSearchParams(),
}));

// Mock PaymentProcessingBanner to avoid its internal fetch leaking into dashboard tests
jest.mock('@/components/PaymentProcessingBanner', () => ({
  __esModule: true,
  default: () => null,
}));

// Mock ga4 tracking to avoid side effects
jest.mock('@/lib/ga4', () => ({
  trackPageView: jest.fn(),
  trackDashboardFirstView: jest.fn(),
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
    // 'Failed to fetch' is the real browser error message for a network failure;
    // the component maps this pattern to the "Network connection issue" message.
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

    // DashboardContent calls Promise.all with 4 fetches: profile, appointments,
    // clients, business-hours. All 4 mocks are consumed even though only the
    // first rejection matters for the error state (Promise.all rejects fast).
    // The component destructures as [profileRes, appointmentsRes, clientsRes, businessHoursRes].
    (global.fetch as jest.Mock)
      // Initial failure: all 4 parallel fetches rejected
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      // Retry success: profile → appointments → clients → business-hours
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ profile: {} }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ appointments: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ clients: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ businessHours: [] }),
      });

    render(<DashboardPage />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Unable to Load Dashboard')).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    await user.click(retryButton);

    // React 18 batches the setIsRetrying(true) + setLoading(true) calls so the
    // "Retrying..." button text is never painted as a separate frame — the
    // component goes straight to the loading screen.  Just verify the error
    // state is eventually cleared instead.
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

  // ── Trial banner tests (Gap 3: complete mock data spec) ────────────────────

  // Helper: set up 4 fetch mocks for a successful dashboard load
  const mockSuccessfulDashboardFetch = (overrides: {
    profile?: Record<string, unknown>;
    appointments?: unknown[];
    clients?: unknown[];
    businessHours?: unknown[];
  } = {}) => {
    const trialEndsAt = overrides.profile?.trialEndsAt as string | undefined;
    const profile = {
      businessName: 'Test Grooming',
      subscriptionStatus: 'trial',
      planType: 'solo',
      onboardingCompleted: true,
      onboardingStep: 3,
      ...(trialEndsAt ? { trialEndsAt } : {}),
      ...overrides.profile,
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ profile }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ appointments: overrides.appointments ?? [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ clients: overrides.clients ?? [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ businessHours: overrides.businessHours ?? [] }),
      });
  };

  it('shows trial banner with days remaining for trial users (>3 days)', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    mockSuccessfulDashboardFetch({
      profile: { trialEndsAt: futureDate.toISOString() },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('14-Day Free Trial Active')).toBeInTheDocument();
    });
    expect(screen.getByText(/days remaining/i)).toBeInTheDocument();
    // When trialDaysLeft > 3, the CTA reads "Set Up Payment" (no "Now")
    expect(screen.getByText('Set Up Payment')).toBeInTheDocument();
  });

  it('shows trial expiring warning banner when 3 or fewer days remain', async () => {
    const soonDate = new Date();
    soonDate.setDate(soonDate.getDate() + 2);
    mockSuccessfulDashboardFetch({
      profile: { trialEndsAt: soonDate.toISOString() },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      // Should show the expiring banner, not the regular trial banner
      expect(screen.getByText(/Your trial expires in 2 days/i)).toBeInTheDocument();
    });
    // Should show "Upgrade Now" CTA
    expect(screen.getByText('Upgrade Now')).toBeInTheDocument();
    // Should NOT show the regular "14-Day Free Trial Active" banner
    expect(screen.queryByText('14-Day Free Trial Active')).not.toBeInTheDocument();
  });

  it('shows full-screen expired overlay when trial is expired', async () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 2); // 2 days ago
    mockSuccessfulDashboardFetch({
      profile: { trialEndsAt: expiredDate.toISOString() },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Your 14-day free trial has ended')).toBeInTheDocument();
    });
    // Should have upgrade CTA
    expect(screen.getByText('View Plans & Upgrade')).toBeInTheDocument();
    // Should mention founding member code
    expect(screen.getByText('GROOMERFOUNDING')).toBeInTheDocument();
  });

  it('shows plan type in trial banner when plan is not solo', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    mockSuccessfulDashboardFetch({
      profile: {
        trialEndsAt: futureDate.toISOString(),
        planType: 'salon',
      },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('14-Day Free Trial Active')).toBeInTheDocument();
    });
    expect(screen.getByText(/Salon plan/i)).toBeInTheDocument();
  });

  it('does not show trial banner for non-trial users', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    mockSuccessfulDashboardFetch({
      profile: {
        subscriptionStatus: 'active',
        trialEndsAt: futureDate.toISOString(),
      },
    });

    render(<DashboardPage />);

    // Wait for dashboard to load (business name visible)
    await waitFor(() => {
      expect(screen.getByText('Test Grooming')).toBeInTheDocument();
    });
    expect(screen.queryByText('14-Day Free Trial Active')).not.toBeInTheDocument();
    expect(screen.queryByText('Your 14-day free trial has ended')).not.toBeInTheDocument();
    expect(screen.queryByText(/Your trial expires/)).not.toBeInTheDocument();
  });

  it('hides "Book Appointment" button for expired trial users', async () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1);
    mockSuccessfulDashboardFetch({
      profile: { trialEndsAt: expiredDate.toISOString() },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Your 14-day free trial has ended')).toBeInTheDocument();
    });
    // "Book Appointment" CTA should not be shown for expired users
    expect(screen.queryByText('Book Appointment')).not.toBeInTheDocument();
  });
});
