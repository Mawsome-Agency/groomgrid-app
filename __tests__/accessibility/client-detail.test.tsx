/**
 * Accessibility tests for Client Detail page
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ClientDetailPage from '@/app/clients/[id]/page';

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
  useParams: () => ({ id: '1' }),
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
          address: '123 Main St, Albuquerque, NM',
          notes: 'Prefers early morning appointments',
          pets: [
            {
              id: '1',
              name: 'Bailey',
              breed: 'Labrador',
              size: 'large',
              age: '3 years',
              specialNotes: 'Needs extra treats',
            },
          ],
          createdAt: new Date().toISOString(),
        },
      ],
    }),
  })
) as jest.Mock;

describe('Client Detail Page Accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<ClientDetailPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible back button', async () => {
    render(<ClientDetailPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const backButton = screen.getByRole('button', { name: /back/i }) || 
                       document.querySelector('button[aria-label*="back"]');
    expect(backButton).toBeInTheDocument();
  });

  it('should have proper client information display', async () => {
    render(<ClientDetailPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Client name should be a heading
    const nameHeading = screen.getByRole('heading', { level: 1 });
    expect(nameHeading).toHaveTextContent('Sarah Cooper');
    
    // Contact information should be accessible
    const emailLink = screen.getByText('sarah@example.com');
    const phoneText = screen.getByText('(505) 555-0192');
    const addressText = screen.getByText(/123 Main St/);
    
    expect(emailLink).toBeInTheDocument();
    expect(phoneText).toBeInTheDocument();
    expect(addressText).toBeInTheDocument();
  });

  it('should have accessible pet information', async () => {
    render(<ClientDetailPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Pets section should have a heading
    const petsHeading = screen.getByRole('heading', { name: /pets/i });
    expect(petsHeading).toBeInTheDocument();
    
    // Pet cards should be accessible
    const petName = screen.getByText('Bailey');
    const petBreed = screen.getByText('Labrador');
    
    expect(petName).toBeInTheDocument();
    expect(petBreed).toBeInTheDocument();
  });

  it('should have accessible add pet modal', async () => {
    render(<ClientDetailPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const addPetButton = screen.getByText('Add Pet');
    fireEvent.click(addPetButton);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Modal should be accessible
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
    
    // Form fields should have labels
    const nameInput = screen.getByLabelText(/pet name/i);
    const breedInput = screen.getByLabelText(/breed/i);
    const sizeSelect = screen.getByLabelText(/size/i);
    
    expect(nameInput).toBeInTheDocument();
    expect(breedInput).toBeInTheDocument();
    expect(sizeSelect).toBeInTheDocument();
  });

  it('should have accessible quick action buttons', async () => {
    render(<ClientDetailPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Quick actions section
    const quickActionsHeading = screen.getByRole('heading', { name: /quick actions/i });
    expect(quickActionsHeading).toBeInTheDocument();
    
    // Action buttons should be accessible
    const bookAppointmentButton = screen.getByRole('button', { name: /book appointment/i });
    const serviceHistoryButton = screen.getByRole('button', { name: /service history/i });
    
    expect(bookAppointmentButton).toBeInTheDocument();
    expect(serviceHistoryButton).toBeInTheDocument();
  });

  it('should handle keyboard navigation properly', async () => {
    render(<ClientDetailPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Test tab order through buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // First button should be focusable
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('should have proper landmark regions', async () => {
    render(<ClientDetailPage />);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Should have navigation (back button area)
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Main content area
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});
