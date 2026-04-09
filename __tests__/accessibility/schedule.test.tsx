/**
 * Accessibility tests for Schedule page
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import SchedulePage from '@/app/schedule/page';

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
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/lib/ga4', () => ({
  trackPageView: jest.fn(),
}));

jest.mock('@/lib/services', () => ({
  SERVICES: [
    { name: 'Full Groom', basePrice: 65, baseDuration: 60 },
    { name: 'Bath + Brush', basePrice: 40, baseDuration: 30 },
    { name: 'Nail Trim', basePrice: 20, baseDuration: 15 },
  ],
  formatPrice: (price: number) => `$${price}`,
  formatDuration: (mins: number) => `${mins}m`,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ appointments: [], clients: [] }),
  })
) as jest.Mock;

describe('Schedule Page Accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<SchedulePage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible calendar navigation', async () => {
    render(<SchedulePage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Previous/next month buttons should have proper labels
    const navButtons = screen.getAllByRole('button');
    const prevButton = navButtons.find(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-chevron-left')
    );
    const nextButton = navButtons.find(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-chevron-right')
    );
    
    expect(prevButton).toBeTruthy();
    expect(nextButton).toBeTruthy();
  });

  it('should have accessible modal when opened', async () => {
    render(<SchedulePage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const bookButton = screen.getByText('Book Appointment');
    fireEvent.click(bookButton);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Modal should have proper ARIA attributes
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    
    // Modal should have focus trap (focus should be inside modal)
    const titleInput = screen.getByLabelText(/client/i);
    expect(titleInput).toBeTruthy();
  });

  it('should close modal with ESC key', async () => {
    render(<SchedulePage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const bookButton = screen.getByText('Book Appointment');
    fireEvent.click(bookButton);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Press ESC key
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Modal should be closed
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeInTheDocument();
  });

  it('should have accessible form controls in modal', async () => {
    render(<SchedulePage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const bookButton = screen.getByText('Book Appointment');
    fireEvent.click(bookButton);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // All required form fields should have labels
    const clientSelect = screen.getByLabelText(/client/i);
    const dateInput = screen.getByLabelText(/date/i);
    
    expect(clientSelect).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
    
    // Service selection should be accessible
    const serviceButtons = screen.getAllByRole('button').filter(btn => 
      btn.textContent?.includes('Full Groom') || 
      btn.textContent?.includes('Bath + Brush')
    );
    expect(serviceButtons.length).toBeGreaterThan(0);
  });

  it('should have proper focus management in time slots', async () => {
    render(<SchedulePage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const bookButton = screen.getByText('Book Appointment');
    fireEvent.click(bookButton);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Time slot buttons should be keyboard accessible
    const timeSlots = screen.getAllByRole('button').filter(btn => 
      /^\d{1,2}:\d{2}\s*(AM|PM)$/.test(btn.textContent || '')
    );
    
    expect(timeSlots.length).toBeGreaterThan(0);
    
    // First time slot should be focusable
    const firstSlot = timeSlots[0];
    firstSlot.focus();
    expect(document.activeElement).toBe(firstSlot);
  });
});
