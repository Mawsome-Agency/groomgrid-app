/**
 * Validation utilities for form fields
 * Provides reusable validation functions for email, password, and business name
 */

/**
 * Email validation result
 */
export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Business name validation result
 */
export interface BusinessNameValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email regex pattern (same as used in booking API)
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email format
 */
export function validateEmail(email: string): EmailValidationResult {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Validates password
 * Requirements: at least 8 characters
 */
export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  return { isValid: true };
}

/**
 * Validates business name
 * Requirements: at least 2 characters, max 100 characters, no special characters (alphanumeric, spaces, hyphens allowed)
 */
export function validateBusinessName(name: string): BusinessNameValidationResult {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { isValid: false, error: 'Business name is required' };
  }

  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Business name must be at least 2 characters' };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Business name must be less than 100 characters' };
  }

  // Allow alphanumeric, spaces, hyphens, apostrophes, and periods
  const businessNameRegex = /^[a-zA-Z0-9\s\-\'\.]+$/;

  if (!businessNameRegex.test(trimmedName)) {
    return { isValid: false, error: 'Business name can only contain letters, numbers, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true };
}
