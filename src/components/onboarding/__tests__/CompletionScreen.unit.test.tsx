/**
 * Unit tests for CompletionScreen (src/components/onboarding/CompletionScreen.tsx).
 *
 * Final onboarding step — shown after all 3 steps complete.
 * 0% coverage before this file.
 *
 * Covers: render, navigation, content display, accessibility.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('lucide-react', () => {
  const icons = ['CheckCircle2', 'ArrowRight'];
  const mockIcons: Record<string, React.FC> = {};
  icons.forEach((name) => {
    mockIcons[name] = () => <span data-testid={`icon-${name}`}>{name}</span>;
  });
  return mockIcons;
});

import CompletionScreen from '../CompletionScreen';

describe('CompletionScreen', () => {
  const mockOnDashboard = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ────────────────────────────────────────────────────────────────
  // 1. BASIC RENDER
  // ────────────────────────────────────────────────────────────────
  describe('Basic Render', () => {
    it('renders without crashing', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      expect(screen.getByText(/you're all set/i)).toBeTruthy();
    });

    it(`shows "You're All Set!" heading`, () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      expect(screen.getByText(/you're all set/i)).toBeTruthy();
    });

    it('shows account ready message', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      expect(screen.getByText(/account is ready to go/i)).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 2. NEXT STEPS CONTENT
  // ────────────────────────────────────────────────────────────────
  describe('Next Steps Content', () => {
    it('shows "Add more clients" step', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      expect(screen.getByText(/add more clients/i)).toBeTruthy();
    });

    it('shows "Book appointments" step', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      expect(screen.getByText(/book appointments/i)).toBeTruthy();
    });

    it('shows "Track revenue" step', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      expect(screen.getByText(/track revenue/i)).toBeTruthy();
    });

    it('shows 3 numbered steps', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      expect(screen.getByText('1')).toBeTruthy();
      expect(screen.getByText('2')).toBeTruthy();
      expect(screen.getByText('3')).toBeTruthy();
    });

    it('shows import clients description', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      expect(screen.getByText(/import clients or add them/i)).toBeTruthy();
    });

    it('shows + button description for appointments', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      expect(screen.getByText(/\+ button/i)).toBeTruthy();
    });

    it('shows dashboard earnings description', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      expect(screen.getByText(/see your earnings/i)).toBeTruthy();
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 3. CTA BUTTON
  // ────────────────────────────────────────────────────────────────
  describe('CTA Button', () => {
    it('renders "Go to Dashboard" button', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      expect(screen.getByText(/go to dashboard/i)).toBeTruthy();
    });

    it('calls onDashboard when button is clicked', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      fireEvent.click(screen.getByText(/go to dashboard/i));
      expect(mockOnDashboard).toHaveBeenCalledTimes(1);
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 4. ACCESSIBILITY
  // ────────────────────────────────────────────────────────────────
  describe('Accessibility', () => {
    it('CTA button is accessible', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      const btn = screen.getByText(/go to dashboard/i);
      expect(btn.tagName).toBe('BUTTON');
    });

    it('step numbers are visible', () => {
      render(<CompletionScreen onDashboard={mockOnDashboard} />);
      const stepNumbers = screen.getAllByText(/^[123]$/);
      expect(stepNumbers.length).toBe(3);
    });
  });
});
