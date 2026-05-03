/**
 * Trial status utilities — shared between client and server.
 *
 * Determines whether a user's trial is expired, expiring soon, or active,
 * and whether they should be gated from write actions.
 */

export type TrialState = 'expired' | 'expiring_soon' | 'active_trial' | 'subscribed' | 'no_trial';

export interface TrialStatus {
  state: TrialState;
  daysLeft: number;
  isExpired: boolean;
  isExpiringSoon: boolean; // 1-3 days remaining
  isTrialUser: boolean;
  isSubscriber: boolean;
  canWrite: boolean; // Can create appointments/clients
  shouldShowGate: boolean; // Full-screen upgrade overlay
  shouldShowWarning: boolean; // Warning banner (1-3 days left)
}

/**
 * Compute trial status from profile data.
 *
 * @param subscriptionStatus - 'trial' | 'active' | 'past_due' | 'cancelled'
 * @param trialEndsAt - ISO date string or Date, optional
 * @param now - override for testing (defaults to Date.now())
 */
export function computeTrialStatus(
  subscriptionStatus: string | null | undefined,
  trialEndsAt: string | Date | null | undefined,
  now: number = Date.now()
): TrialStatus {
  // Active subscribers — no trial UI at all
  if (subscriptionStatus === 'active') {
    return {
      state: 'subscribed',
      daysLeft: 0,
      isExpired: false,
      isExpiringSoon: false,
      isTrialUser: false,
      isSubscriber: true,
      canWrite: true,
      shouldShowGate: false,
      shouldShowWarning: false,
    };
  }

  // Not a trial user (cancelled, past_due without trial, etc.)
  if (subscriptionStatus !== 'trial') {
    return {
      state: 'no_trial',
      daysLeft: 0,
      isExpired: false,
      isExpiringSoon: false,
      isTrialUser: false,
      isSubscriber: false,
      canWrite: subscriptionStatus === 'past_due', // past_due still has access
      shouldShowGate: subscriptionStatus === 'cancelled',
      shouldShowWarning: false,
    };
  }

  // Trial user — check if expired or expiring
  if (!trialEndsAt) {
    // No trial end date set — treat as active trial with plenty of time
    return {
      state: 'active_trial',
      daysLeft: 14,
      isExpired: false,
      isExpiringSoon: false,
      isTrialUser: true,
      isSubscriber: false,
      canWrite: true,
      shouldShowGate: false,
      shouldShowWarning: false,
    };
  }

  const endsAt = new Date(trialEndsAt).getTime();
  const msLeft = endsAt - now;
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));

  // Expired: trial_ends_at has passed
  if (msLeft <= 0) {
    return {
      state: 'expired',
      daysLeft: 0,
      isExpired: true,
      isExpiringSoon: false,
      isTrialUser: true,
      isSubscriber: false,
      canWrite: false,
      shouldShowGate: true,
      shouldShowWarning: false,
    };
  }

  // Expiring soon: 1-3 days left
  if (daysLeft <= 3) {
    return {
      state: 'expiring_soon',
      daysLeft,
      isExpiringSoon: true,
      isExpired: false,
      isTrialUser: true,
      isSubscriber: false,
      canWrite: true,
      shouldShowGate: false,
      shouldShowWarning: true,
    };
  }

  // Active trial with plenty of time
  return {
    state: 'active_trial',
    daysLeft,
    isExpired: false,
    isExpiringSoon: false,
    isTrialUser: true,
    isSubscriber: false,
    canWrite: true,
    shouldShowGate: false,
    shouldShowWarning: false,
  };
}
