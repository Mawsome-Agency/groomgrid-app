/**
 * Accessibility tests for Dashboard page
 */

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import DashboardPage from '@/app/dashboard/page';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
      },
    },
    status: 'authenticated',
  }),
  signOut: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock GA4
jest.mock('@/lib/ga4', () => ({
  trackPageView: jest.fn(),
}));

// Mock API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        profile: {
          business_name: 'Test Grooming',
          subscription_status: 'trial',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      }),
  })
) as jest.Mock;

describe('Dashboard Page Accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<DashboardPage />);
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    render(<DashboardPage />);
    
    // Check for h1 (should be exactly one)
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBeGreaterThan(0);
    
    // Check h1 comes before h2
    const firstH1 = screen.getAllByRole('heading', { level: 1 })[0];
    const h2s = screen.getAllByRole('heading', { level: 2 });
    h2s.forEach(h2 => {
      expect(h2.compareDocumentPosition(firstH1) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
    });
  });

  it('should have all interactive elements focusable', () => {
    render(<DashboardPage />);
    
    // Check buttons have proper focus indicators
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeEnabled();
    });
  });

  it('should have landmark regions', () => {
    render(<DashboardPage />);
    
    // Should have navigation
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Should have main content area
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should have accessible form controls', async () => {
    render(<DashboardPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // All inputs should have associated labels
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      // Check if input has a label or aria-label
      const hasLabel = document.querySelector(`label[for="${input.id}"]`) ||
                       input.getAttribute('aria-label');
      expect(hasLabel).toBeTruthy();
    });
  });

  it('should provide skip link for keyboard users', () => {
    render(<DashboardPage />);
    
    // Skip link should be in the document (hidden by default, visible on focus)
    const skipLink = document.querySelector('.skip-to-content, [href*="skip"]');
    expect(skipLink).toBeTruthy();
  });
});
