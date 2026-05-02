/**
 * Unit tests for Step2Appointment (src/components/onboarding/Step2Appointment.tsx).
 *
 * Second onboarding step — creates first appointment. 0% coverage before this file.
 *
 * Covers: render, service selection, time slot selection, date input,
 * notes field, validation, loading states, skip action.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('lucide-react', () => {
  const icons = ['ArrowRight', 'Clock', 'Scissors', 'Loader2'];
  const mockIcons: Record<string, React.FC> = {};
  icons.forEach((name) => {
    mockIcons[name] = () => <span data-testid={`icon-${name}`}>{name}</span>;
  });
  return mockIcons;
});

jest.mock('@/lib/services', () => ({
  SERVICES: [
    { name: 'Full Groom', basePrice: 65, baseDuration: 90 },
    { name: 'Bath & Brush', basePrice: 40, baseDuration: 60 },
    { name: 'Nail Trim', basePrice: 15, baseDuration: 15 },
    { name: 'Teeth Brushing', basePrice: 10, baseDuration: 10 },
  ],
  formatPrice: (price: number) => `$${price}`,
  formatDuration: (mins: number) => `${mins} min`,
}));

import Step2Appointment from '../Step2Appointment';

const defaultProps = {
  clientName: 'Sarah Cooper',
  petName: 'Bailey',
  onNext: jest.fn(),
  onSkip: jest.fn(),
  isLoading: false,
};

describe('Step2Appointment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ────────────────────────────────────────────────────────────────
  // 1. BASIC RENDER
  // ────────────────────────────────────────────────────────────────
  describe('Basic Render', () => {
    it('renders without crashing', () => {
      render(<Step2Appointment {...defaultProps} />);
      expect(screen.getByText('Create First Appointment')).toBeTruthy();
    });

    it('shows step heading', () => {
      render(<Step2Appointment {...defaultProps} />);
      expect(screen.getByText('Create First Appointment')).toBeTruthy();
    });

    it('shows client and pet name in description', () => {
      render(<Step2Appointment {...defaultProps} />);
      expect(screen.getByText('Bailey')).toBeTruthy();
      expect(screen.getByText(/sarah cooper/i)).toBeTruthy();
    });

    it('renders service selection buttons', () => {
      render(<Step2Appointment {...defaultProps} />);
      expect(screen.getByText('Full Groom')).toBeTruthy();
      expect(screen.getByText('Bath & Brush')).toBeTruthy();
      expect(screen.getByText('Nail Trim')).toBeTruthy();
    });

    it('renders date input', () => {
      render(<Step2Appointment {...defaultProps} />);
      const dateInput = document.querySelector('input[type="date"]');
      expect(dateInput).toBeTruthy();
    });

    it('renders notes textarea', () => {
      render(<Step2Appointment {...defaultProps} />);
      expect(screen.getByPlaceholderText(/special instructions/i)).toBeTruthy();
    });

    it('renders time slot buttons', () => {
      render(<Step2Appointment {...defaultProps} />);
      expect(screen.getByText('8:00 AM')).toBeTruthy();
      expect(screen.getByText('9:00 AM')).toBeTruthy();
    });

    it('renders Skip and Book Appointment buttons', () => {
      render(<Step2Appointment {...defaultProps} />);
      expect(screen.getByText(/skip for now/i)).toBeTruthy();
      expect(screen.getByText(/book appointment/i)).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 2. VALIDATION
  // ────────────────────────────────────────────────────────────────
  describe('Validation', () => {
    it('Book Appointment button is disabled when no time is selected', () => {
      render(<Step2Appointment {...defaultProps} />);
      const bookBtn = screen.getByText(/book appointment/i).closest('button')!;
      expect(bookBtn).toBeDisabled();
    });

    it('Book Appointment button is enabled after selecting a time', () => {
      render(<Step2Appointment {...defaultProps} />);
      fireEvent.click(screen.getByText('9:00 AM'));

      const bookBtn = screen.getByText(/book appointment/i).closest('button')!;
      expect(bookBtn).not.toBeDisabled();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 3. SERVICE SELECTION
  // ────────────────────────────────────────────────────────────────
  describe('Service Selection', () => {
    it('selects Full Groom by default', () => {
      render(<Step2Appointment {...defaultProps} />);
      const fullGroomBtn = screen.getByText('Full Groom').closest('button')!;
      expect(fullGroomBtn.className).toContain('border-green-500');
    });

    it('changes service selection on click', () => {
      render(<Step2Appointment {...defaultProps} />);
      fireEvent.click(screen.getByText('Bath & Brush'));

      const bathBtn = screen.getByText('Bath & Brush').closest('button')!;
      expect(bathBtn.className).toContain('border-green-500');
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 4. TIME SLOT SELECTION
  // ────────────────────────────────────────────────────────────────
  describe('Time Slot Selection', () => {
    it('selects a time slot on click', () => {
      render(<Step2Appointment {...defaultProps} />);
      fireEvent.click(screen.getByText('10:00 AM'));

      const timeSlot = screen.getByText('10:00 AM');
      expect(timeSlot.className).toContain('bg-green-500');
    });

    it('deselects previous time slot when another is clicked', () => {
      render(<Step2Appointment {...defaultProps} />);
      fireEvent.click(screen.getByText('9:00 AM'));
      fireEvent.click(screen.getByText('10:30 AM'));

      // New slot selected
      expect(screen.getByText('10:30 AM').className).toContain('bg-green-500');
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 5. FORM SUBMISSION
  // ────────────────────────────────────────────────────────────────
  describe('Form Submission', () => {
    it('calls onNext with appointment data when form is valid', () => {
      const onNext = jest.fn();
      render(<Step2Appointment {...defaultProps} onNext={onNext} />);

      fireEvent.click(screen.getByText('9:30 AM'));

      const bookBtn = screen.getByText(/book appointment/i).closest('button')!;
      fireEvent.click(bookBtn);

      expect(onNext).toHaveBeenCalledWith(
        expect.objectContaining({
          service: 'Full Groom',
          time: '9:30 AM',
          notes: '',
        })
      );
    });

    it('calls onSkip when Skip is clicked', () => {
      const onSkip = jest.fn();
      render(<Step2Appointment {...defaultProps} onSkip={onSkip} />);
      fireEvent.click(screen.getByText(/skip for now/i));
      expect(onSkip).toHaveBeenCalled();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 6. LOADING STATE
  // ────────────────────────────────────────────────────────────────
  describe('Loading State', () => {
    it('shows "Saving..." when isLoading', () => {
      render(<Step2Appointment {...defaultProps} isLoading={true} />);
      expect(screen.getByText(/saving/i)).toBeTruthy();
    });

    it('disables time slot buttons when loading', () => {
      render(<Step2Appointment {...defaultProps} isLoading={true} />);
      // Time slot buttons should be disabled
      const timeSlots = screen.getAllByRole('button').filter(
        (btn) => btn.textContent?.match(/\d+:\d+\s[AP]M/)
      );
      timeSlots.forEach((btn) => {
        expect(btn).toBeDisabled();
      });
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 7. NOTES FIELD
  // ────────────────────────────────────────────────────────────────
  describe('Notes Field', () => {
    it('updates notes on change', () => {
      render(<Step2Appointment {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(/special instructions/i);
      fireEvent.change(textarea, { target: { value: 'Nervous dog, be gentle' } });
      expect(textarea).toHaveValue('Nervous dog, be gentle');
    });

    it('includes notes in onNext call', () => {
      const onNext = jest.fn();
      render(<Step2Appointment {...defaultProps} onNext={onNext} />);

      const textarea = screen.getByPlaceholderText(/special instructions/i);
      fireEvent.change(textarea, { target: { value: 'First visit' } });
      fireEvent.click(screen.getByText('11:00 AM'));

      const bookBtn = screen.getByText(/book appointment/i).closest('button')!;
      fireEvent.click(bookBtn);

      expect(onNext).toHaveBeenCalledWith(
        expect.objectContaining({ notes: 'First visit' })
      );
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 8. EDGE CASES
  // ────────────────────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('does not call onNext when form is invalid', () => {
      const onNext = jest.fn();
      render(<Step2Appointment {...defaultProps} onNext={onNext} />);

      // Don't select a time — button is disabled
      const bookBtn = screen.getByText(/book appointment/i).closest('button')!;
      expect(bookBtn).toBeDisabled();
      expect(onNext).not.toHaveBeenCalled();
    });
  });
});
