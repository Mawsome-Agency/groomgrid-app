import { render, screen } from '@testing-library/react';
import OnboardingChecklist from '@/components/dashboard/OnboardingChecklist';

describe('OnboardingChecklist', () => {
  const defaultProps = {
    onboardingStep: 0,
    onboardingCompleted: false,
    clientCount: 0,
    appointmentCount: 0,
    hasBusinessHours: false,
  };

  it('renders all 3 checklist steps', () => {
    render(<OnboardingChecklist {...defaultProps} />);

    expect(screen.getByText('Add your first client')).toBeInTheDocument();
    expect(screen.getByText('Schedule an appointment')).toBeInTheDocument();
    expect(screen.getByText('Set business hours')).toBeInTheDocument();
  });

  it('links step 1 to /clients', () => {
    render(<OnboardingChecklist {...defaultProps} />);

    const link = screen.getByText('Add your first client').closest('a');
    expect(link).toHaveAttribute('href', '/clients');
  });

  it('links step 2 to /schedule', () => {
    render(<OnboardingChecklist {...defaultProps} />);

    const link = screen.getByText('Schedule an appointment').closest('a');
    expect(link).toHaveAttribute('href', '/schedule');
  });

  it('links step 3 to /onboarding (not /settings/business-hours)', () => {
    render(<OnboardingChecklist {...defaultProps} />);

    const link = screen.getByText('Set business hours').closest('a');
    expect(link).toHaveAttribute('href', '/onboarding');
  });

  it('links "Complete Setup Wizard" CTA to /onboarding', () => {
    render(<OnboardingChecklist {...defaultProps} />);

    const cta = screen.getByText('Complete Setup Wizard');
    expect(cta.closest('a')).toHaveAttribute('href', '/onboarding');
  });

  it('removes href from completed steps', () => {
    render(
      <OnboardingChecklist
        {...defaultProps}
        clientCount={5}
      />
    );

    // Step 1 is completed (clientCount > 0), so its link should have no href
    const step1Link = screen.getByText('Add your first client').closest('a');
    expect(step1Link).not.toHaveAttribute('href');

    // Step 2 is not completed, so it still has an href
    const step2Link = screen.getByText('Schedule an appointment').closest('a');
    expect(step2Link).toHaveAttribute('href', '/schedule');
  });

  it('returns null when onboarding is complete and all steps done', () => {
    const { container } = render(
      <OnboardingChecklist
        {...defaultProps}
        onboardingCompleted={true}
        clientCount={5}
        appointmentCount={3}
        hasBusinessHours={true}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows setup prompt when nothing is done', () => {
    render(<OnboardingChecklist {...defaultProps} />);

    expect(screen.getByText('Complete these steps to set up your business')).toBeInTheDocument();
  });

  it('shows correct progress when some steps are done', () => {
    render(
      <OnboardingChecklist
        {...defaultProps}
        clientCount={5}
        appointmentCount={3}
      />
    );

    expect(screen.getByText('2 of 3 steps complete')).toBeInTheDocument();
  });
});
