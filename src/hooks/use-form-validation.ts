import { useState, useCallback, useEffect } from "react";

export interface ValidationError {
  message: string;
  field?: string;
}

export interface FormValidationState {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

/**
 * Reusable form validation hook.
 * 
 * Features:
 * - Errors displayed ABOVE fields (not below)
 * - Validate on blur and on change
 * - Supports custom validation rules
 * - Accessibility: screen reader announcements
 * 
 * Usage:
 * const { errors, touched, validateField, clearFieldError, isValid } = useFormValidation();
 * 
 * Input component:
 * {errors.email && touched.email && (
 *   <p className="text-red-600 text-sm mb-2" role="alert" aria-live="polite">
 *     {errors.email}
 *   </p>
 * )}
 * <input 
 *   onBlur={() => validateField('email', value, rules.email)}
 *   aria-invalid={!!errors.email}
 *   aria-describedby={errors.email ? 'email-error' : undefined}
 * />
 */
export function useFormValidation(initialRules?: ValidationRules) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Clear all errors (useful on form submit)
  const clearAllErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  // Clear a specific field error
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Set a specific field error
  const setFieldError = useCallback((fieldName: string, message: string) => {
    setErrors((prev) => ({ ...prev, [fieldName]: message }));
    // Announce to screen readers
    announceError(message);
  }, []);

  // Validate a single field
  const validateField = useCallback((
    fieldName: string, 
    value: string, 
    rules?: ValidationRule
  ): boolean => {
    const fieldRules = rules || initialRules?.[fieldName];
    if (!fieldRules) return true;

    let errorMessage: string | null = null;

    // Required check
    if (fieldRules.required && !value.trim()) {
      errorMessage = "This field is required";
    }

    // Min length check
    if (!errorMessage && fieldRules.minLength && value.length < fieldRules.minLength) {
      errorMessage = `Must be at least ${fieldRules.minLength} characters`;
    }

    // Max length check
    if (!errorMessage && fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errorMessage = `Must be no more than ${fieldRules.maxLength} characters`;
    }

    // Pattern check (email, phone, etc.)
    if (!errorMessage && fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errorMessage = "Invalid format";
    }

    // Custom validation
    if (!errorMessage && fieldRules.custom) {
      errorMessage = fieldRules.custom(value);
    }

    // Update error state
    if (errorMessage) {
      setFieldError(fieldName, errorMessage);
    } else {
      clearFieldError(fieldName);
    }

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    return !errorMessage;
  }, [initialRules, setFieldError, clearFieldError]);

  // Validate entire form
  const validateForm = useCallback((
    formData: Record<string, string>,
    rules: ValidationRules
  ): { isValid: boolean; errors: Record<string, string> } => {
    const formErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(rules).forEach((fieldName) => {
      const fieldRules = rules[fieldName];
      const value = formData[fieldName] || "";
      let errorMessage: string | null = null;

      // Required check
      if (fieldRules.required && !value.trim()) {
        errorMessage = "This field is required";
      }

      // Min length check
      if (!errorMessage && fieldRules.minLength && value.length < fieldRules.minLength) {
        errorMessage = `Must be at least ${fieldRules.minLength} characters`;
      }

      // Max length check
      if (!errorMessage && fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errorMessage = `Must be no more than ${fieldRules.maxLength} characters`;
      }

      // Pattern check
      if (!errorMessage && fieldRules.pattern && !fieldRules.pattern.test(value)) {
        errorMessage = "Invalid format";
      }

      // Custom validation
      if (!errorMessage && fieldRules.custom) {
        errorMessage = fieldRules.custom(value);
      }

      if (errorMessage) {
        formErrors[fieldName] = errorMessage;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return { isValid, errors: formErrors };
  }, [setErrors]);

  // Check if form is valid (all required fields have valid values)
  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    touched,
    validateField,
    clearFieldError,
    clearAllErrors,
    setFieldError,
    validateForm,
    isValid,
  };
}

/**
 * Announce error to screen readers
 */
function announceError(message: string) {
  // Create or update aria-live region for screen readers
  let announcer = document.getElementById("form-error-announcer");
  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "form-error-announcer";
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    document.body.appendChild(announcer);
  }
  announcer.textContent = message;
}
