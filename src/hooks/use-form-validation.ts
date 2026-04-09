'use client';

import { useState, useCallback } from 'react';

/**
 * Field state types for validation
 */
export type FieldState = 'untouched' | 'touched' | 'valid' | 'invalid' | 'pending-validation';

/**
 * Field validation result
 */
export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Props for useFieldValidation hook
 */
export interface UseFieldValidationProps {
  name: string;
  validatorFn: (value: string) => FieldValidationResult;
  asyncValidatorFn?: (value: string) => Promise<FieldValidationResult>;
}

/**
 * Return type for useFieldValidation
 */
export interface UseFieldValidationReturn {
  value: string;
  state: FieldState;
  error: string | undefined;
  touched: boolean;
  setValue: (value: string) => void;
  handleBlur: () => Promise<void>;
  handleChange: (value: string) => void;
}

/**
 * Hook for managing individual field validation state
 */
export function useFieldValidation({
  name,
  validatorFn,
  asyncValidatorFn,
}: UseFieldValidationProps): UseFieldValidationReturn {
  const [value, setValue] = useState('');
  const [state, setState] = useState<FieldState>('untouched');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleBlur = useCallback(async () => {
    if (state === 'untouched') {
      setState('touched');
    }

    // Run sync validation first
    const syncResult = validatorFn(value);
    if (!syncResult.isValid) {
      setState('invalid');
      setError(syncResult.error);
      return;
    }

    // If async validation exists and not yet validated
    if (asyncValidatorFn && state !== 'valid') {
      setState('pending-validation');
      const asyncResult = await asyncValidatorFn(value);
      if (asyncResult.isValid) {
        setState('valid');
        setError(undefined);
      } else {
        setState('invalid');
        setError(asyncResult.error);
      }
    } else if (!asyncValidatorFn) {
      // Only sync validation
      setState('valid');
      setError(undefined);
    }
  }, [value, state, validatorFn, asyncValidatorFn]);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    
    // Clear error state while typing (unless still invalid on blur)
    if (state === 'invalid') {
      setState('touched');
      setError(undefined);
    }
  }, [state]);

  return {
    value,
    state,
    error,
    touched: state !== 'untouched',
    setValue,
    handleBlur,
    handleChange,
  };
}

/**
 * Props for useFormValidation hook
 */
export interface UseFormValidationProps {
  fields: Record<string, UseFieldValidationProps>;
}

/**
 * Return type for useFormValidation
 */
export interface UseFormValidationReturn {
  fieldStates: Record<string, FieldState>;
  fieldErrors: Record<string, string | undefined>;
  isFormValid: boolean;
  isValidating: boolean;
}

/**
 * Hook for managing multiple field validations
 * Provides overall form validation state
 */
export function useFormValidation({ fields }: UseFormValidationProps): UseFormValidationReturn {
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  // Initialize field states on mount
  Object.keys(fields).forEach((fieldName) => {
    if (!fieldStates[fieldName]) {
      setFieldStates((prev) => ({
        ...prev,
        [fieldName]: 'untouched',
      }));
    }
  });

  const isFormValid = Object.entries(fieldStates).every(
    ([_, state]) => state === 'valid'
  );

  const isValidating = Object.values(fieldStates).some(
    (state) => state === 'pending-validation'
  );

  return {
    fieldStates,
    fieldErrors,
    isFormValid,
    isValidating,
  };
}
