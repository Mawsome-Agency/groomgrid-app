/**
 * Unit tests for CheckoutSuccessContent (src/app/checkout/success/CheckoutSuccessContent.tsx).
 *
 * This is the post-payment success page — the single most revenue-critical
 * page in the funnel. 0% coverage, ZERO tests existed before this file.
 *
 * Covers: render states, billing data fetch, countdown redirect, GA4 tracking,
 * API error handling, accessibility, edge cases.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams('session_id=cs_test_123'),
}));

jest.mock('@/lib/ga4', () => ({
  trackPaymentPageView: jest.fn(),
}));

jest.mock('@/components/trust/TrustSignals', () => ({
  __esModule: true,
  default: ({ billingData, location }: any) => (
    <div data-testid="trust-signals" data-location={location}>
      {billingData?.planName && <span data-testid="plan-name">{billingData.planName}</span>}
      {billingData?.promoCode && <span data-testid="promo-code">{billingData.promoCode}</span>}
      {billingData?.recurringAmount === 0 && <span data-testid="free-forever">FREE forever</span>}
    </div>
  ),
}));

jest.mock('@/components/trust/BillingSummary', () => ({
  __esModule: true,
  BillingSummary: ({ data }: any) => (
    <div data-testid="billing-summary">
      {data?.planName || 'No plan'}
    </div>
  ),
}));

import { CheckoutSuccessContent } from '../CheckoutSuccessContent';
import { trackPaymentPageView } from '@/lib/ga4';

// ─── Test Helpers ─────────────────────────────────────────────────────────────

function mockFetchSuccess(data: Record<string, any> = {}) {
  return jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({
      metadata: { planName: 'Solo Groomer', planPrice: '2900', isTrial: 'true', planType: 'solo' },
      trial_end_days_left: 14,
      isFoundingMember: false,
      promoCode: null,
      discountDescription: null,
      discountPercentage: 0,
      amountDiscount: 0,
      ...data,
    }),
  });
}

function mockFetchError() {
  return jest.fn().mockResolvedValue({
    ok: false,
    status: 500,
  });
}

// ─── Tests ─────────────────────────────────────────────────────────────────────
describe('CheckoutSuccessContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    // Default: successful billing fetch
    global.fetch = mockFetchSuccess();
  });

  // ────────────────────────────────────────────────────────────────
  // 1. BASIC RENDER
  // ────────────────────────────────────────────────────────────────
  describe('Basic Render', () => {
    it('renders without crashing', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/you're in/i)).toBeTruthy();
      });
    });

    it('shows "Your 14-day free trial has started" message', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/14-day free trial has started/i)).toBeTruthy();
      });
    });

    it('shows "No charge until your trial ends" reassurance', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/no charge until your trial ends/i)).toBeTruthy();
      });
    });

    it('shows "Set Up Your Account" CTA button', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/set up your account/i)).toBeTruthy();
      });
    });

    it('shows trial active message', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/trial active/i)).toBeTruthy();
      });
    });

    it('shows GroomGrid confirmation email mention', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/confirmation to your email/i)).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 2. BILLING DATA FETCH
  // ────────────────────────────────────────────────────────────────
  describe('Billing Data Fetch', () => {
    it('fetches billing data from /api/checkout/success on mount', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/checkout/success?session_id=cs_test_123')
        );
      });
    });

    it('passes plan name to TrustSignals', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByTestId('plan-name')).toBeTruthy();
        expect(screen.getByTestId('plan-name').textContent).toBe('Solo Groomer');
      });
    });

    it('falls back to "Unknown Plan" when metadata.planName is missing', async () => {
      global.fetch = mockFetchSuccess({ metadata: { planPrice: '2900', isTrial: 'true' } });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByTestId('plan-name').textContent).toBe('Unknown Plan');
      });
    });

    it('falls back to planType when planName is missing', async () => {
      global.fetch = mockFetchSuccess({
        metadata: { planType: 'salon', planPrice: '7900', isTrial: 'true' }
      });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByTestId('plan-name').textContent).toBe('salon');
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 3. API ERROR HANDLING
  // ────────────────────────────────────────────────────────────────
  describe('API Error Handling', () => {
    it('handles API error gracefully — still renders page', async () => {
      global.fetch = mockFetchError();
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/you're in/i)).toBeTruthy();
      });
    });

    it('does not show TrustSignals when billing fetch fails', async () => {
      global.fetch = mockFetchError();
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/you're in/i)).toBeTruthy();
      });
      // TrustSignals should not render without billingData
      expect(screen.queryByTestId('trust-signals')).toBeNull();
    });

    it('handles fetch throwing an exception', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/you're in/i)).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 4. COUNTDOWN & AUTO-REDIRECT
  // ────────────────────────────────────────────────────────────────
  describe('Countdown & Auto-Redirect', () => {
    it('shows countdown text initially', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/redirecting automatically/i)).toBeTruthy();
      });
    });

    it('countdown starts at 8 seconds', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/8 second/i)).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 5. CTA BUTTON NAVIGATION
  // ────────────────────────────────────────────────────────────────
  describe('CTA Button Navigation', () => {
    it('clicking "Set Up Your Account" navigates to /onboarding with session_id', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/set up your account/i)).toBeTruthy();
      });

      const btn = screen.getByText(/set up your account/i);
      fireEvent.click(btn);

      expect(mockPush).toHaveBeenCalledWith('/onboarding?session_id=cs_test_123');
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 6. GA4 TRACKING
  // ────────────────────────────────────────────────────────────────
  describe('GA4 Tracking', () => {
    it('tracks checkout_success page view after billing data loads', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(trackPaymentPageView).toHaveBeenCalledWith('checkout_success', expect.any(String));
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 7. LOADING STATE
  // ────────────────────────────────────────────────────────────────
  describe('Loading State', () => {
    it('shows loading state while billing data is being fetched', () => {
      // Make fetch hang
      global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));
      const { container } = render(<CheckoutSuccessContent />);
      expect(container.textContent).toContain('Loading');
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 8. ACCESSIBILITY
  // ────────────────────────────────────────────────────────────────
  describe('Accessibility', () => {
    it('has a clickable button for "Set Up Your Account"', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        const btn = screen.getByText(/set up your account/i);
        expect(btn.tagName).toBe('BUTTON');
      });
    });

    it('checkmark SVG is decorative (aria-hidden)', async () => {
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        const svg = document.querySelector('svg[aria-hidden="true"]');
        expect(svg).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 9. EDGE CASES
  // ────────────────────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('handles billing data with isTrial=false', async () => {
      global.fetch = mockFetchSuccess({
        metadata: { planName: 'Salon Team', planPrice: '7900', isTrial: 'false' },
        trial_end_days_left: 0,
      });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/you're in/i)).toBeTruthy();
      });
    });

    it('handles metadata.planPrice as a number', async () => {
      global.fetch = mockFetchSuccess({
        metadata: { planName: 'Enterprise', planPrice: 14900, isTrial: 'true' },
      });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/you're in/i)).toBeTruthy();
      });
    });

    it('handles null metadata gracefully', async () => {
      global.fetch = mockFetchSuccess({ metadata: null });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/you're in/i)).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 10. FOUNDING MEMBER RENDERING
  // ────────────────────────────────────────────────────────────────
  describe('Founding Member (GROOMERFOUNDING)', () => {
    it('shows founding member welcome message when isFoundingMember=true', async () => {
      global.fetch = mockFetchSuccess({
        isFoundingMember: true,
        promoCode: 'GROOMERFOUNDING',
        discountDescription: 'Founding Member — free for life',
        metadata: { planName: 'Solo Groomer', planPrice: '2900', planType: 'solo' },
      });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/welcome, founding member/i)).toBeTruthy();
      });
    });

    it('shows founding member badge', async () => {
      global.fetch = mockFetchSuccess({
        isFoundingMember: true,
        promoCode: 'GROOMERFOUNDING',
        discountDescription: 'Founding Member — free for life',
        metadata: { planName: 'Solo Groomer', planPrice: '2900', planType: 'solo' },
      });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/founding member — free for life/i)).toBeTruthy();
      });
    });

    it('shows "free for life" messaging instead of trial text', async () => {
      global.fetch = mockFetchSuccess({
        isFoundingMember: true,
        promoCode: 'GROOMERFOUNDING',
        discountDescription: 'Founding Member — free for life',
        metadata: { planName: 'Solo Groomer', planPrice: '2900', planType: 'solo' },
      });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/your account is free for life/i)).toBeTruthy();
      });
      expect(screen.queryByText(/14-day free trial has started/i)).toBeNull();
    });

    it('does not show trial active banner for founding members', async () => {
      global.fetch = mockFetchSuccess({
        isFoundingMember: true,
        promoCode: 'GROOMERFOUNDING',
        discountDescription: 'Founding Member — free for life',
        metadata: { planName: 'Solo Groomer', planPrice: '2900', planType: 'solo' },
      });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/welcome, founding member/i)).toBeTruthy();
      });
      expect(screen.queryByText(/trial active/i)).toBeNull();
    });

    it('passes $0 recurringAmount to TrustSignals for founding members', async () => {
      global.fetch = mockFetchSuccess({
        isFoundingMember: true,
        promoCode: 'GROOMERFOUNDING',
        discountDescription: 'Founding Member — free for life',
        metadata: { planName: 'Solo Groomer', planPrice: '2900', planType: 'solo' },
      });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByTestId('free-forever')).toBeTruthy();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 11. BETA50 DISCOUNT RENDERING
  // ────────────────────────────────────────────────────────────────
  describe('BETA50 Discount', () => {
    it('shows standard trial messaging for BETA50 users', async () => {
      global.fetch = mockFetchSuccess({
        isFoundingMember: false,
        promoCode: 'BETA50',
        discountDescription: 'Launch pricing — 50% off first month',
        discountPercentage: 50,
        metadata: { planName: 'Solo Groomer', planPrice: '2900', isTrial: 'true', planType: 'solo' },
      });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/14-day free trial has started/i)).toBeTruthy();
      });
    });

    it('passes BETA50 promoCode to TrustSignals', async () => {
      global.fetch = mockFetchSuccess({
        isFoundingMember: false,
        promoCode: 'BETA50',
        discountDescription: 'Launch pricing — 50% off first month',
        discountPercentage: 50,
        metadata: { planName: 'Solo Groomer', planPrice: '2900', isTrial: 'true', planType: 'solo' },
      });
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByTestId('promo-code')).toHaveTextContent('BETA50');
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 12. REGULAR TRIAL USER (unchanged behavior)
  // ────────────────────────────────────────────────────────────────
  describe('Regular Trial User', () => {
    it('still shows 14-day trial messaging when no coupon is used', async () => {
      global.fetch = mockFetchSuccess();
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByText(/14-day free trial has started/i)).toBeTruthy();
        expect(screen.getByText(/trial active/i)).toBeTruthy();
      });
    });

    it('still passes regular plan data to TrustSignals for trial users', async () => {
      global.fetch = mockFetchSuccess();
      render(<CheckoutSuccessContent />);
      await waitFor(() => {
        expect(screen.getByTestId('plan-name')).toHaveTextContent('Solo Groomer');
      });
    });
  });
});
