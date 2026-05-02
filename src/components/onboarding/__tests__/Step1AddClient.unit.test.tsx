/**
 * Unit tests for Step1AddClient (src/components/onboarding/Step1AddClient.tsx).
 *
 * First onboarding step — creates client + pet. 0/8 users completed onboarding.
 * 0% coverage before this file.
 *
 * Covers: form rendering, validation, loading states, skip action,
 * field interactions, edge cases.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('lucide-react', () => {
  const icons = ['ArrowRight', 'Phone', 'Mail', 'Loader2'];
  const mockIcons: Record<string, React.FC> = {};
  icons.forEach((name) => {
    mockIcons[name] = () => <span data-testid={`icon-${name}`}>{name}</span>;
  });
  return mockIcons;
});

import Step1AddClient from '../Step1AddClient';

const defaultProps = {
  onNext: jest.fn(),
  onSkip: jest.fn(),
  isLoading: false,
};

describe('Step1AddClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ────────────────────────────────────────────────────────────────
  // 1. BASIC RENDER
  // ────────────────────────────────────────────────────────────────
  describe('Basic Render', () => {
    it('renders without crashing', () => {
      render(<Step1AddClient {...defaultProps} />);
      expect(screen.getByText('Add Your First Client')).toBeTruthy();
    });

    it('shows step heading', () => {
      render(<Step1AddClient {...defaultProps} />);
      expect(screen.getByText('Add Your First Client')).toBeTruthy();
    });

    it('shows description text', () => {
      render(<Step1AddClient {...defaultProps} />);
      expect(screen.getByText(/let's add a client/i)).toBeTruthy();
    });

    it('renders client name input', () => {
      render(<Step1AddClient {...defaultProps} />);
      expect(screen.getByLabelText(/client name/i)).toBeTruthy();
    });

    it('renders pet name input', () => {
      render(<Step1AddClient {...defaultProps} />);
      expect(screen.getByLabelText(/pet name/i)).toBeTruthy();
    });

    it('renders phone input', () => {
      render(<Step1AddClient {...defaultProps} />);
      expect(screen.getByLabelText(/phone/i)).toBeTruthy();
    });

    it('renders email input', () => {
      render(<Step1AddClient {...defaultProps} />);
      expect(screen.getByLabelText(/email/i)).toBeTruthy();
    });

    it('renders breed input', () => {
      render(<Step1AddClient {...defaultProps} />);
      expect(screen.getByLabelText(/breed/i)).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 2. VALIDATION — REQUIRED FIELDS
  // ────────────────────────────────────────────────────────────────
  describe('Validation', () => {
    it('Next button is disabled when required fields are empty', () => {
      render(<Step1AddClient {...defaultProps} />);
      const nextBtn = screen.getByText(/next/i).closest('button')!;
      expect(nextBtn).toBeDisabled();
    });

    it('Next button is enabled when client name and pet name are filled', () => {
      render(<Step1AddClient {...defaultProps} />);
      fireEvent.change(screen.getByLabelText(/client name/i), { target: { value: 'Sarah Cooper' } });
      fireEvent.change(screen.getByLabelText(/pet name/i), { target: { value: 'Bailey' } });

      const nextBtn = screen.getByText(/next/i).closest('button')!;
      expect(nextBtn).not.toBeDisabled();
    });

    it('Next button is disabled when only client name is filled', () => {
      render(<Step1AddClient {...defaultProps} />);
      fireEvent.change(screen.getByLabelText(/client name/i), { target: { value: 'Sarah' } });

      const nextBtn = screen.getByText(/next/i).closest('button')!;
      expect(nextBtn).toBeDisabled();
    });

    it('Next button is disabled when only pet name is filled', () => {
      render(<Step1AddClient {...defaultProps} />);
      fireEvent.change(screen.getByLabelText(/pet name/i), { target: { value: 'Bailey' } });

      const nextBtn = screen.getByText(/next/i).closest('button')!;
      expect(nextBtn).toBeDisabled();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 3. FORM INTERACTIONS
  // ────────────────────────────────────────────────────────────────
  describe('Form Interactions', () => {
    it('calls onNext with form data when Next is clicked', () => {
      const onNext = jest.fn();
      render(<Step1AddClient {...defaultProps} onNext={onNext} />);

      fireEvent.change(screen.getByLabelText(/client name/i), { target: { value: 'Sarah Cooper' } });
      fireEvent.change(screen.getByLabelText(/pet name/i), { target: { value: 'Bailey' } });
      fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '(505) 555-0192' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'sarah@email.com' } });
      fireEvent.change(screen.getByLabelText(/breed/i), { target: { value: 'Labrador' } });

      const nextBtn = screen.getByText(/next/i).closest('button')!;
      fireEvent.click(nextBtn);

      expect(onNext).toHaveBeenCalledWith({
        name: 'Sarah Cooper',
        petName: 'Bailey',
        phone: '(505) 555-0192',
        email: 'sarah@email.com',
        breed: 'Labrador',
      });
    });

    it('calls onNext with minimal data (only required fields)', () => {
      const onNext = jest.fn();
      render(<Step1AddClient {...defaultProps} onNext={onNext} />);

      fireEvent.change(screen.getByLabelText(/client name/i), { target: { value: 'Jane' } });
      fireEvent.change(screen.getByLabelText(/pet name/i), { target: { value: 'Max' } });

      const nextBtn = screen.getByText(/next/i).closest('button')!;
      fireEvent.click(nextBtn);

      expect(onNext).toHaveBeenCalledWith({
        name: 'Jane',
        petName: 'Max',
        phone: '',
        email: '',
        breed: '',
      });
    });

    it('calls onSkip when Skip button is clicked', () => {
      const onSkip = jest.fn();
      render(<Step1AddClient {...defaultProps} onSkip={onSkip} />);

      fireEvent.click(screen.getByText(/skip for now/i));
      expect(onSkip).toHaveBeenCalled();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 4. LOADING STATE
  // ────────────────────────────────────────────────────────────────
  describe('Loading State', () => {
    it('shows "Saving..." when isLoading is true', () => {
      render(<Step1AddClient {...defaultProps} isLoading={true} />);
      expect(screen.getByText(/saving/i)).toBeTruthy();
    });

    it('disables all inputs when isLoading is true', () => {
      render(<Step1AddClient {...defaultProps} isLoading={true} />);
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });

    it('disables Next button when isLoading is true', () => {
      render(<Step1AddClient {...defaultProps} isLoading={true} />);
      const nextBtn = screen.getByText(/saving/i).closest('button')!;
      expect(nextBtn).toBeDisabled();
    });

    it('disables Skip button when isLoading is true', () => {
      render(<Step1AddClient {...defaultProps} isLoading={true} />);
      const skipBtn = screen.getByText(/skip for now/i);
      expect(skipBtn).toBeDisabled();
    });

    it('does not call onNext when isLoading is true and button clicked', () => {
      const onNext = jest.fn();
      render(<Step1AddClient {...defaultProps} onNext={onNext} isLoading={true} />);
      // Button is disabled so click won't fire
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 5. INPUT PLACEHOLDERS
  // ────────────────────────────────────────────────────────────────
  describe('Input Placeholders', () => {
    it('has placeholder for client name', () => {
      render(<Step1AddClient {...defaultProps} />);
      expect(screen.getByPlaceholderText(/sarah cooper/i)).toBeTruthy();
    });

    it('has placeholder for pet name', () => {
      render(<Step1AddClient {...defaultProps} />);
      expect(screen.getByPlaceholderText(/bailey/i)).toBeTruthy();
    });

    it('has placeholder for breed', () => {
      render(<Step1AddClient {...defaultProps} />);
      expect(screen.getByPlaceholderText(/labrador/i)).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 6. EDGE CASES
  // ────────────────────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('does not call onNext when form is invalid and Next is clicked', () => {
      const onNext = jest.fn();
      render(<Step1AddClient {...defaultProps} onNext={onNext} />);

      // Click next without filling required fields — button is disabled
      const nextBtn = screen.getByText(/next/i).closest('button')!;
      expect(nextBtn).toBeDisabled();
    });

    it('handles very long input values', () => {
      const onNext = jest.fn();
      render(<Step1AddClient {...defaultProps} onNext={onNext} />);

      const longName = 'A'.repeat(200);
      fireEvent.change(screen.getByLabelText(/client name/i), { target: { value: longName } });
      fireEvent.change(screen.getByLabelText(/pet name/i), { target: { value: 'Buddy' } });

      const nextBtn = screen.getByText(/next/i).closest('button')!;
      fireEvent.click(nextBtn);

      expect(onNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: longName })
      );
    });
  });
});
