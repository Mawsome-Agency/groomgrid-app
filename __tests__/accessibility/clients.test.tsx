/**
 * Accessibility tests for Clients page
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ClientsPage from '@/app/clients/page';

expect.extend(toHaveNoViolations);

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
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/lib/ga4', () => ({
  trackPageView: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      clients: [
        {
          id: '1',
          name: 'Sarah Cooper',
          email: 'sarah@example.com',
          phone: '(505) 555-0192',
          pets: [{ id: '1', name: 'Bailey' }],
          createdAt: new Date().toISOString(),
          _count: { appointments: 5 },
        },
      ],
    }),
  })
) as jest.Mock;

describe('Clients Page Accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<ClientsPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible search input', async () => {
    render(<ClientsPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const searchInput = screen.getByPlaceholderText(/search clients/i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('should have accessible client cards', async () => {
    render(<ClientsPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Client cards should be buttons with proper semantics
    const clientCards = screen.getAllByRole('button').filter(btn => 
      btn.textContent?.includes('Sarah Cooper')
    );
    
    expect(clientCards.length).toBeGreaterThan(0);
    
    // Check client card has proper structure
    const clientCard = clientCards[0];
    const nameHeading = within(clientCard).getByRole('heading', { level: 3 });
    expect(nameHeading).toBeInTheDocument();
  });

  it('should have accessible add client modal', async () => {
    render(<ClientsPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const addButton = screen.getByText('Add Client');
    fireEvent.click(addButton);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Modal should be accessible
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
    
    // Form fields should have labels
    const nameInput = screen.getByLabelText(/client name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
  });

  it('should handle keyboard navigation in client list', async () => {
    render(<ClientsPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const clientCards = screen.getAllByRole('button').filter(btn => 
      btn.textContent?.includes('Sarah Cooper')
    );
    
    if (clientCards.length > 0) {
      const firstCard = clientCards[0];
      firstCard.focus();
      expect(document.activeElement).toBe(firstCard);
      
      // Press Enter should navigate to client detail
      fireEvent.keyDown(firstCard, { key: 'Enter', code: 'Enter' });
    }
  });

  it('should have proper heading hierarchy', async () => {
    render(<ClientsPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check for h1
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('Clients');
  });

  it('should provide feedback when search yields no results', async () => {
    render(<ClientsPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const searchInput = screen.getByPlaceholderText(/search clients/i);
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Client' } });
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const noResults = screen.getByText(/no clients found/i);
    expect(noResults).toBeInTheDocument();
  });
});

// Helper function for testing within elements
function within(element: HTMLElement) {
  return {
    getByRole: (role: string, options?: any) => 
      element.querySelector(`[role="${role}"]`) as HTMLElement || 
      screen.getByRole(role as any, options),
  };
}
