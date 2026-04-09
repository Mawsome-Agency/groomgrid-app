'use client';

import { useState, useEffect, useCallback } from 'react';
import { OnboardingState, BusinessType } from '@/types';

const ONBOARDING_STATE_KEY = 'gg_onboarding_state';
const STATE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const INITIAL_STATE: OnboardingState = {
  currentStep: 1,
  businessType: null,
  petName: null,
  breed: null,
  appointmentDatetime: null,
  clientName: null,
  aiSuggestion: null,
  startedAt: null,
  completedAt: null,
};

/**
 * Custom hook for managing onboarding state in localStorage
 * Handles persistence, error handling, and React reactivity
 */
export function useOnboardingState() {
  const [state, setState] = useState<OnboardingState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    loadState();
  }, []);

  const loadState = useCallback((): OnboardingState | null => {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(ONBOARDING_STATE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as OnboardingState;

      // Validate state structure
      if (!parsed || typeof parsed !== 'object') return null;

      // Check if state is expired
      if (parsed.startedAt) {
        const startedAt = new Date(parsed.startedAt).getTime();
        const now = Date.now();
        if (now - startedAt > STATE_MAX_AGE_MS) {
          localStorage.removeItem(ONBOARDING_STATE_KEY);
          return null;
        }
      }

      setState(parsed);
      return parsed;
    } catch (err) {
      console.error('Failed to load onboarding state:', err);
      setError(err instanceof Error ? err : new Error('Failed to load state'));
      localStorage.removeItem(ONBOARDING_STATE_KEY);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveState = useCallback((stateToSave: OnboardingState): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      const serialized = JSON.stringify(stateToSave);
      localStorage.setItem(ONBOARDING_STATE_KEY, serialized);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'QuotaExceededError') {
          console.error('LocalStorage quota exceeded, clearing onboarding state');
          localStorage.removeItem(ONBOARDING_STATE_KEY);
        }
      }
      console.error('Failed to save onboarding state:', err);
      setError(err instanceof Error ? err : new Error('Failed to save state'));
      return false;
    }
  }, []);

  const updateState = useCallback((updates: Partial<OnboardingState>) => {
    setState((currentState) => {
      const newState = {
        ...currentState,
        ...updates,
      } as OnboardingState;
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  const resetState = useCallback(() => {
    const resetState = { ...INITIAL_STATE, startedAt: new Date().toISOString() };
    setState(resetState);
    saveState(resetState);
    setError(null);
  }, [saveState]);

  const getStep = useCallback((): number => {
    return state?.currentStep ?? 1;
  }, [state]);

  const setStep = useCallback((step: number) => {
    updateState({ currentStep: step });
  }, [updateState]);

  const isStepComplete = useCallback((step: number): boolean => {
    const currentStep = state?.currentStep ?? 1;
    return step < currentStep;
  }, [state]);

  const getTotalTimeSpent = useCallback((): number => {
    if (!state?.startedAt) return 0;
    const startedAt = new Date(state.startedAt).getTime();
    const endedAt = state.completedAt ? new Date(state.completedAt).getTime() : Date.now();
    return endedAt - startedAt;
  }, [state]);

  const completeOnboarding = useCallback(() => {
    updateState({
      currentStep: 5,
      completedAt: new Date().toISOString(),
    });
  }, [updateState]);

  return {
    state,
    isLoading,
    error,
    updateState,
    resetState,
    saveState,
    loadState,
    getStep,
    setStep,
    isStepComplete,
    getTotalTimeSpent,
    completeOnboarding,
  };
}
