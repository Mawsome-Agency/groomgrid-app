import { computeTrialStatus } from '@/lib/trial-status';

describe('computeTrialStatus', () => {
  const NOW = new Date('2026-05-03T12:00:00Z').getTime();

  describe('active subscribers', () => {
    it('returns subscribed state for active users', () => {
      const result = computeTrialStatus('active', '2026-05-10T00:00:00Z', NOW);
      expect(result.state).toBe('subscribed');
      expect(result.isSubscriber).toBe(true);
      expect(result.isTrialUser).toBe(false);
      expect(result.canWrite).toBe(true);
      expect(result.shouldShowGate).toBe(false);
      expect(result.shouldShowWarning).toBe(false);
    });

    it('shows no trial UI regardless of trialEndsAt value', () => {
      const result = computeTrialStatus('active', '2026-04-01T00:00:00Z', NOW);
      expect(result.shouldShowGate).toBe(false);
      expect(result.shouldShowWarning).toBe(false);
      expect(result.isExpired).toBe(false);
    });
  });

  describe('expired trial', () => {
    it('shows gate when trial has passed', () => {
      // Trial ended yesterday
      const result = computeTrialStatus('trial', '2026-05-02T00:00:00Z', NOW);
      expect(result.state).toBe('expired');
      expect(result.isExpired).toBe(true);
      expect(result.isTrialUser).toBe(true);
      expect(result.canWrite).toBe(false);
      expect(result.shouldShowGate).toBe(true);
      expect(result.shouldShowWarning).toBe(false);
      expect(result.daysLeft).toBe(0);
    });

    it('shows gate when trial ended exactly now (0ms remaining)', () => {
      const result = computeTrialStatus('trial', '2026-05-03T12:00:00Z', NOW);
      expect(result.state).toBe('expired');
      expect(result.isExpired).toBe(true);
      expect(result.shouldShowGate).toBe(true);
      expect(result.canWrite).toBe(false);
    });

    it('shows gate when trial ended weeks ago', () => {
      const result = computeTrialStatus('trial', '2026-04-15T00:00:00Z', NOW);
      expect(result.state).toBe('expired');
      expect(result.shouldShowGate).toBe(true);
      expect(result.canWrite).toBe(false);
    });
  });

  describe('expiring soon (1-3 days)', () => {
    it('shows warning when 1 day remains', () => {
      // Trial ends tomorrow
      const result = computeTrialStatus('trial', '2026-05-04T12:00:00Z', NOW);
      expect(result.state).toBe('expiring_soon');
      expect(result.isExpiringSoon).toBe(true);
      expect(result.shouldShowWarning).toBe(true);
      expect(result.shouldShowGate).toBe(false);
      expect(result.canWrite).toBe(true);
      expect(result.daysLeft).toBe(1);
    });

    it('shows warning when 2 days remain', () => {
      const result = computeTrialStatus('trial', '2026-05-05T12:00:00Z', NOW);
      expect(result.state).toBe('expiring_soon');
      expect(result.shouldShowWarning).toBe(true);
      expect(result.canWrite).toBe(true);
      expect(result.daysLeft).toBe(2);
    });

    it('shows warning when 3 days remain', () => {
      const result = computeTrialStatus('trial', '2026-05-06T12:00:00Z', NOW);
      expect(result.state).toBe('expiring_soon');
      expect(result.shouldShowWarning).toBe(true);
      expect(result.canWrite).toBe(true);
      expect(result.daysLeft).toBe(3);
    });

    it('shows warning when exactly 3 days + a few hours remain', () => {
      // 3 days and 6 hours from NOW → ceil = 4 days → NOT expiring_soon
      const result = computeTrialStatus('trial', '2026-05-06T18:00:00Z', NOW);
      // ceil((3.25 days in ms) / day_ms) = 4 → active_trial
      expect(result.state).toBe('active_trial');
      expect(result.shouldShowWarning).toBe(false);
    });
  });

  describe('active trial (>3 days remaining)', () => {
    it('shows no warning or gate for trial with plenty of time', () => {
      const result = computeTrialStatus('trial', '2026-05-17T00:00:00Z', NOW);
      expect(result.state).toBe('active_trial');
      expect(result.isTrialUser).toBe(true);
      expect(result.canWrite).toBe(true);
      expect(result.shouldShowGate).toBe(false);
      expect(result.shouldShowWarning).toBe(false);
      expect(result.daysLeft).toBe(14);
    });

    it('treats missing trialEndsAt as active trial', () => {
      const result = computeTrialStatus('trial', null, NOW);
      expect(result.state).toBe('active_trial');
      expect(result.canWrite).toBe(true);
      expect(result.daysLeft).toBe(14);
    });

    it('treats undefined trialEndsAt as active trial', () => {
      const result = computeTrialStatus('trial', undefined, NOW);
      expect(result.state).toBe('active_trial');
      expect(result.canWrite).toBe(true);
    });
  });

  describe('cancelled subscription', () => {
    it('shows gate for cancelled users', () => {
      const result = computeTrialStatus('cancelled', null, NOW);
      expect(result.state).toBe('no_trial');
      expect(result.shouldShowGate).toBe(true);
      expect(result.canWrite).toBe(false);
    });
  });

  describe('past_due subscription', () => {
    it('allows writes for past_due users', () => {
      const result = computeTrialStatus('past_due', null, NOW);
      expect(result.state).toBe('no_trial');
      expect(result.canWrite).toBe(true);
      expect(result.shouldShowGate).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles null subscriptionStatus', () => {
      const result = computeTrialStatus(null, null, NOW);
      expect(result.state).toBe('no_trial');
    });

    it('handles undefined subscriptionStatus', () => {
      const result = computeTrialStatus(undefined, null, NOW);
      expect(result.state).toBe('no_trial');
    });
  });
});
