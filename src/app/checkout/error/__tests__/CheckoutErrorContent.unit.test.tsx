/**
 * Unit tests for CheckoutErrorContent (src/app/checkout/error/CheckoutErrorContent.tsx).
 *
 * This is the payment error recovery page — critical for funnel recovery.
 * 0% coverage, ZERO tests existed before this file.
 *
 * Covers: all 5 error types, decline code mapping, GA4 tracking,
 * navigation actions, BETA50 promo reminder, accessibility, edge cases.
 */

import React, { Suspense } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockPush = jest.fn();
const mockBack = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useSearchParams: () => mockSearchParams,
}));

jest.mock('@/lib/ga4', () => ({
  trackEvent: jest.fn(),
}));

jest.mock('lucide-react', () => {
  const icons = [
    'ArrowLeft', 'RefreshCw', 'Mail', 'CreditCard', 'Tag', 'AlertCircle',
  ];
  const mockIcons: Record<string, React.FC> = {};
  icons.forEach((name) => {
    mockIcons[name] = () => <span data-testid={`icon-${name}`}>{name}</span>;
  });
  return mockIcons;
});

import { CheckoutErrorContent } from '../CheckoutErrorContent';
import { trackEvent } from '@/lib/ga4';

// Helper to render with Suspense (useSearchParams requires Suspense boundary in Next.js)
const renderWithSuspense = (ui: React.ReactElement) => {
  return render(
    <Suspense fallback={<div>Loading...</div>}>
      {ui}
    </Suspense>
  );
};

// ─── Tests ─────────────────────────────────────────────────────────────────────
describe('CheckoutErrorContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockBack.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  // ────────────────────────────────────────────────────────────────
  // 1. BASIC RENDER — GENERIC ERROR (DEFAULT)
  // ────────────────────────────────────────────────────────────────
  describe('Basic Render — Generic Error', () => {
    it('renders without crashing', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText('Payment Failed')).toBeTruthy();
      });
    });

    it('shows "Payment Failed" heading', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText('Payment Failed')).toBeTruthy();
      });
    });

    it('shows generic error config by default', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText(/something unexpected happened/i)).toBeTruthy();
      });
    });

    it('shows primary action button', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByLabelText(/try again/i)).toBeTruthy();
      });
    });

    it('shows secondary action button for generic error', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /contact support/i })).toBeTruthy();
      });
    });

    it('shows GroomGrid brand in header', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText('GroomGrid')).toBeTruthy();
      });
    });

    it('shows "Go back" button', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByLabelText('Go back')).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 2. ERROR TYPE: DECLINED
  // ────────────────────────────────────────────────────────────────
  describe('Error Type: declined', () => {
    it('shows declined error when error_type=declined', async () => {
      mockSearchParams = new URLSearchParams('error_type=declined');
      renderWithSuspense(<CheckoutErrorContent />);

      await waitFor(() => {
        expect(screen.getByText(/payment trouble/i)).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 3. ERROR TYPE: INSUFFICIENT FUNDS (via decline_code)
  // ────────────────────────────────────────────────────────────────
  describe('Error Type: insufficient (via decline_code)', () => {
    it('shows insufficient funds error when decline_code=insufficient_funds', async () => {
      mockSearchParams = new URLSearchParams('decline_code=insufficient_funds');
      renderWithSuspense(<CheckoutErrorContent />);

      await waitFor(() => {
        expect(screen.getByText(/payment on hold/i)).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 4. ERROR TYPE: EXPIRED (via decline_code)
  // ────────────────────────────────────────────────────────────────
  describe('Error Type: expired (via decline_code)', () => {
    it('shows expired card error when decline_code=expired_card', async () => {
      mockSearchParams = new URLSearchParams('decline_code=expired_card');
      renderWithSuspense(<CheckoutErrorContent />);

      await waitFor(() => {
        expect(screen.getByText(/card expired/i)).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 5. ERROR TYPE: MAX RETRIES
  // ────────────────────────────────────────────────────────────────
  describe('Error Type: maxRetries', () => {
    it('shows max retries error when error_type=maxRetries', async () => {
      mockSearchParams = new URLSearchParams('error_type=maxRetries');
      renderWithSuspense(<CheckoutErrorContent />);

      await waitFor(() => {
        expect(screen.getByText(/too many retries/i)).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 6. BETA50 PROMO REMINDER
  // ────────────────────────────────────────────────────────────────
  describe('BETA50 Promo Reminder', () => {
    it('shows BETA50 founding pricing reminder section', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText(/don't miss your founding pricing/i)).toBeTruthy();
      });
    });

    it('shows BETA50 code badge', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText('BETA50')).toBeTruthy();
      });
    });

    it('shows $14.50/mo pricing in promo section', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText(/\$14\.50\/mo/i)).toBeTruthy();
      });
    });

    it('shows "Try checkout again with BETA50" link', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText(/try checkout again with beta50/i)).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 7. NAVIGATION ACTIONS
  // ────────────────────────────────────────────────────────────────
  describe('Navigation Actions', () => {
    it('clicking primary "Try Again" button navigates to /plans', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText('Payment Failed')).toBeTruthy();
      });

      const tryAgainBtn = screen.getByLabelText(/try again/i);
      fireEvent.click(tryAgainBtn);
      expect(mockPush).toHaveBeenCalledWith('/plans');
    });

    it('clicking "Go back" calls router.back()', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText('Payment Failed')).toBeTruthy();
      });

      const backBtn = screen.getByLabelText('Go back');
      fireEvent.click(backBtn);
      expect(mockBack).toHaveBeenCalled();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 8. GA4 TRACKING
  // ────────────────────────────────────────────────────────────────
  describe('GA4 Tracking', () => {
    it('tracks checkout_error_viewed on mount', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(trackEvent).toHaveBeenCalledWith(
          'checkout_error_viewed',
          expect.objectContaining({ error_type: expect.any(String) })
        );
      });
    });

    it('tracks checkout_error_retry_clicked when retry button clicked', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(trackEvent).toHaveBeenCalled();
      });
      jest.clearAllMocks();

      const tryAgainBtn = screen.getByLabelText(/try again/i);
      fireEvent.click(tryAgainBtn);
      expect(trackEvent).toHaveBeenCalledWith(
        'checkout_error_retry_clicked',
        expect.objectContaining({ error_type: expect.any(String) })
      );
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 9. SUPPORT
  // ────────────────────────────────────────────────────────────────
  describe('Support', () => {
    it('shows support email link', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText('hello@getgroomgrid.com')).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 10. ACCESSIBILITY
  // ────────────────────────────────────────────────────────────────
  describe('Accessibility', () => {
    it('error alert has role="alert"', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeTruthy();
      });
    });

    it('alert has aria-live="polite"', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert.getAttribute('aria-live')).toBe('polite');
      });
    });

    it('all buttons have accessible names', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        buttons.forEach((btn) => {
          expect(btn.textContent || btn.getAttribute('aria-label')).toBeTruthy();
        });
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 11. TIP SECTION
  // ────────────────────────────────────────────────────────────────
  describe('Tip Section', () => {
    it('generic error shows tip message', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText(/we've logged this issue/i)).toBeTruthy();
      });
    });

    it('tip shows lightbulb emoji', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        expect(screen.getByText('💡')).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 12. ERROR LIST ITEMS
  // ────────────────────────────────────────────────────────────────
  describe('Error List Items', () => {
    it('renders error list with bullet points', async () => {
      renderWithSuspense(<CheckoutErrorContent />);
      await waitFor(() => {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems.length).toBeGreaterThan(0);
      });
    });
  });
});
