/**
 * Tests for server-side trial gate logic.
 * Since checkTrialWriteAccess requires Prisma, we test the logic
 * through computeTrialStatus (which it delegates to) and verify
 * the integration contract.
 */
import { computeTrialStatus } from '@/lib/trial-status';

describe('trial gate (write access logic)', () => {
  const NOW = new Date('2026-05-03T12:00:00Z').getTime();

  describe('canWrite === false scenarios (should return 403)', () => {
    it('expired trial blocks writes', () => {
      const status = computeTrialStatus('trial', '2026-05-01T00:00:00Z', NOW);
      expect(status.canWrite).toBe(false);
      expect(status.isExpired).toBe(true);
    });

    it('cancelled subscription blocks writes', () => {
      const status = computeTrialStatus('cancelled', null, NOW);
      expect(status.canWrite).toBe(false);
    });
  });

  describe('canWrite === true scenarios (should allow 200)', () => {
    it('active trial allows writes', () => {
      const status = computeTrialStatus('trial', '2026-05-17T00:00:00Z', NOW);
      expect(status.canWrite).toBe(true);
    });

    it('expiring-soon trial still allows writes', () => {
      const status = computeTrialStatus('trial', '2026-05-05T00:00:00Z', NOW);
      expect(status.canWrite).toBe(true);
    });

    it('active subscriber allows writes', () => {
      const status = computeTrialStatus('active', null, NOW);
      expect(status.canWrite).toBe(true);
    });

    it('past_due subscriber allows writes', () => {
      const status = computeTrialStatus('past_due', null, NOW);
      expect(status.canWrite).toBe(true);
    });
  });

  describe('real production data scenarios', () => {
    it('Happy Paws Demo (expired April 21) should be gated', () => {
      const status = computeTrialStatus('trial', '2026-04-21T06:34:17.854Z', NOW);
      expect(status.canWrite).toBe(false);
      expect(status.shouldShowGate).toBe(true);
      expect(status.state).toBe('expired');
    });

    it('Funnel Test Co (expires May 9) should NOT be gated', () => {
      const status = computeTrialStatus('trial', '2026-05-09T06:18:28.671Z', NOW);
      expect(status.canWrite).toBe(true);
      expect(status.shouldShowGate).toBe(false);
      expect(status.state).toBe('active_trial');
      expect(status.daysLeft).toBe(6);
    });
  });
});
