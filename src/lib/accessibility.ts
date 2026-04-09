/**
 * Accessibility utility functions for GroomGrid
 * Provides consistent helpers for ARIA attributes, focus management, and screen reader announcements.
 */

/**
 * Generates a stable id for a form field and its associated elements.
 * Usage: const id = fieldId('email') → 'field-email'
 */
export function fieldId(name: string): string {
  return `field-${name}`;
}

/**
 * Generates the id for the error message associated with a field.
 * Usage: const errorId = fieldErrorId('email') → 'field-email-error'
 */
export function fieldErrorId(name: string): string {
  return `field-${name}-error`;
}

/**
 * Generates the id for the description/hint associated with a field.
 * Usage: const hintId = fieldHintId('password') → 'field-password-hint'
 */
export function fieldHintId(name: string): string {
  return `field-${name}-hint`;
}

/**
 * Returns aria-describedby value combining error and hint ids.
 * Only includes ids that have active content.
 */
export function ariaDescribedBy(
  fieldName: string,
  options: { hasError?: boolean; hasHint?: boolean }
): string | undefined {
  const ids: string[] = [];
  if (options.hasError) ids.push(fieldErrorId(fieldName));
  if (options.hasHint) ids.push(fieldHintId(fieldName));
  return ids.length > 0 ? ids.join(' ') : undefined;
}

/**
 * Returns aria-invalid value based on whether the field has an error.
 */
export function ariaInvalid(hasError: boolean): boolean | 'grammar' | 'spelling' | undefined {
  return hasError ? true : undefined;
}

/**
 * Imperatively announces a message to screen readers via a live region.
 * Creates a temporary element if none exists.
 *
 * @param message The message to announce
 * @param priority 'polite' (default) or 'assertive' (interrupts current speech)
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof window === 'undefined') return;

  const regionId = `sr-announce-${priority}`;
  let region = document.getElementById(regionId);

  if (!region) {
    region = document.createElement('div');
    region.id = regionId;
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
    // Visually hidden but readable by screen readers
    region.style.cssText =
      'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    document.body.appendChild(region);
  }

  // Clear then set to ensure re-announcement of same message
  region.textContent = '';
  requestAnimationFrame(() => {
    if (region) region.textContent = message;
  });
}

/**
 * Traps keyboard focus within a container element.
 * Returns a cleanup function that removes the event listener.
 *
 * @param container The DOM element to trap focus within
 * @param onEscape Optional callback when Escape is pressed
 */
export function trapFocus(
  container: HTMLElement,
  onEscape?: () => void
): () => void {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter((el) => !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]'));

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}

/**
 * Moves focus to the first focusable element within a container,
 * or to the container itself if it's focusable.
 */
export function focusFirst(container: HTMLElement): void {
  const focusableSelectors =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const firstFocusable = container.querySelector<HTMLElement>(focusableSelectors);
  if (firstFocusable) {
    firstFocusable.focus();
  } else if (container.tabIndex >= 0) {
    container.focus();
  }
}

/**
 * Visually hidden class names for Tailwind — keeps element accessible to screen readers
 * while hidden from sighted users.
 */
export const visuallyHidden =
  'absolute w-px h-px p-0 -m-px overflow-hidden clip-0 whitespace-nowrap border-0';
