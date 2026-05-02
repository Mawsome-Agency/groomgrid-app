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

  // ── onboardingStep-based completion ────────────────────────────────────────

  it('marks step 1 complete when onboardingStep >= 1', () => {
    render(<OnboardingChecklist {...defaultProps} onboardingStep={1} />);

    const step1Link = screen.getByText('Add your first client').closest('a');
    expect(step1Link).not.toHaveAttribute('href');
  });

  it('marks step 2 complete when onboardingStep >= 2', () => {
    render(<OnboardingChecklist {...defaultProps} onboardingStep={2} />);

    const step2Link = screen.getByText('Schedule an appointment').closest('a');
    expect(step2Link).not.toHaveAttribute('href');
  });

  it('marks step 3 complete when onboardingStep >= 3', () => {
    render(<OnboardingChecklist {...defaultProps} onboardingStep={3} />);

    const step3Link = screen.getByText('Set business hours').closest('a');
    expect(step3Link).not.toHaveAttribute('href');
  });

  // ── hasBusinessHours flag ───────────────────────────────────────────────────

  it('marks step 3 complete when hasBusinessHours is true', () => {
    render(<OnboardingChecklist {...defaultProps} hasBusinessHours={true} />);

    const step3Link = screen.getByText('Set business hours').closest('a');
    expect(step3Link).not.toHaveAttribute('href');
  });

  // ── onboardingCompleted overrides ───────────────────────────────────────────

  it('marks step 3 complete when onboardingCompleted is true (even without other data)', () => {
    render(
      <OnboardingChecklist
        {...defaultProps}
        onboardingCompleted={true}
        clientCount={0}
        appointmentCount={0}
        hasBusinessHours={false}
      />
    );

    // Step 3 completed via onboardingCompleted
    const step3Link = screen.getByText('Set business hours').closest('a');
    expect(step3Link).not.toHaveAttribute('href');
  });

  it('renders component when onboardingCompleted=true but not all steps done', () => {
    const { container } = render(
      <OnboardingChecklist
        {...defaultProps}
        onboardingCompleted={true}
        clientCount={0}
        appointmentCount={0}
        hasBusinessHours={false}
      />
    );

    // Should NOT return null because not all steps are complete
    expect(container.firstChild).not.toBeNull();
  });

  // ── Progress percentage display ─────────────────────────────────────────────

  it('shows 0% when no steps are complete', () => {
    render(<OnboardingChecklist {...defaultProps} />);

    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('shows 33% when 1 of 3 steps complete', () => {
    render(<OnboardingChecklist {...defaultProps} clientCount={1} />);

    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('shows 67% when 2 of 3 steps complete', () => {
    render(
      <OnboardingChecklist
        {...defaultProps}
        clientCount={1}
        appointmentCount={1}
      />
    );

    expect(screen.getByText('67%')).toBeInTheDocument();
  });

  it('shows 100% when all steps complete', () => {
    render(
      <OnboardingChecklist
        {...defaultProps}
        clientCount={1}
        appointmentCount={1}
        hasBusinessHours={true}
      />
    );

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  // ── "All set!" message ──────────────────────────────────────────────────────

  it('shows "All set!" message when all steps complete but onboarding not fully done', () => {
    render(
      <OnboardingChecklist
        {...defaultProps}
        clientCount={1}
        appointmentCount={1}
        hasBusinessHours={true}
      />
    );

    expect(screen.getByText(/All set!/)).toBeInTheDocument();
  });

  // ── "Complete Setup Wizard" CTA visibility ──────────────────────────────────

  it('hides "Complete Setup Wizard" CTA when onboardingCompleted is true', () => {
    render(
      <OnboardingChecklist
        {...defaultProps}
        onboardingCompleted={true}
        clientCount={0}
      />
    );

    expect(screen.queryByText('Complete Setup Wizard')).not.toBeInTheDocument();
  });

  it('shows "Complete Setup Wizard" CTA when onboarding not complete and steps remain', () => {
    render(<OnboardingChecklist {...defaultProps} />);

    expect(screen.getByText('Complete Setup Wizard')).toBeInTheDocument();
  });

  // ── Step label styling ──────────────────────────────────────────────────────

  it('completed step label has line-through styling', () => {
    render(<OnboardingChecklist {...defaultProps} clientCount={1} />);

    const step1Label = screen.getByText('Add your first client');
    expect(step1Label.className).toContain('line-through');
  });

  it('incomplete step label does not have line-through styling', () => {
    render(<OnboardingChecklist {...defaultProps} />);

    const step1Label = screen.getByText('Add your first client');
    expect(step1Label.className).not.toContain('line-through');
  });
});
