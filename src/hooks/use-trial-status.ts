'use client';

import { useMemo } from 'react';
import { computeTrialStatus, TrialStatus } from '@/lib/trial-status';

/**
 * Client-side hook that computes trial status from profile data.
 * Re-computes whenever the profile changes.
 */
export function useTrialStatus(profile: {
  subscriptionStatus?: string;
  subscription_status?: string;
  trialEndsAt?: string;
  trial_ends_at?: string;
} | null | undefined): TrialStatus {
  return useMemo(() => {
    if (!profile) {
      return computeTrialStatus(null, null);
    }

    const subscriptionStatus = profile.subscriptionStatus || profile.subscription_status;
    const trialEndsAt = profile.trialEndsAt || profile.trial_ends_at;

    return computeTrialStatus(subscriptionStatus, trialEndsAt);
  }, [
    profile?.subscriptionStatus,
    profile?.subscription_status,
    profile?.trialEndsAt,
    profile?.trial_ends_at,
  ]);
}
