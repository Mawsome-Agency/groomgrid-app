/**
 * Focus trap utility for modals and dialogs
 * Ensures keyboard focus stays within the modal when open
 */

export interface FocusTrapOptions {
  container: HTMLElement;
  initialFocus?: HTMLElement | (() => HTMLElement);
  onEscape?: () => void;
  onDeactivate?: () => void;
}

let activeTrap: {
  container: HTMLElement;
  previousActiveElement: HTMLElement | null;
  onEscape?: () => void;
  onDeactivate?: () => void;
} | null = null;

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
  ];

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors.join(', ')));
}

function handleKeyDown(event: KeyboardEvent) {
  if (!activeTrap) return;

  const { container, onEscape, onDeactivate } = activeTrap;

  // Handle ESC key
  if (event.key === 'Escape' && onEscape) {
    onEscape();
    return;
  }

  // Handle Tab key
  if (event.key !== 'Tab') return;

  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    // Shift + Tab: move to previous element
    if (document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    }
  } else {
    // Tab: move to next element
    if (document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }
}

export function activateFocusTrap(options: FocusTrapOptions) {
  const { container, initialFocus, onEscape, onDeactivate } = options;

  // Store the currently focused element to restore later
  const previousActiveElement = document.activeElement as HTMLElement;

  // Set initial focus
  let focusTarget: HTMLElement;
  if (typeof initialFocus === 'function') {
    focusTarget = initialFocus();
  } else if (initialFocus) {
    focusTarget = initialFocus;
  } else {
    const focusableElements = getFocusableElements(container);
    focusTarget = focusableElements[0];
  }

  if (focusTarget) {
    focusTarget.focus();
  }

  // Store active trap
  activeTrap = {
    container,
    previousActiveElement,
    onEscape,
    onDeactivate,
  };

  // Add event listener
  document.addEventListener('keydown', handleKeyDown, true);
}

export function deactivateFocusTrap() {
  if (!activeTrap) return;

  // Remove event listener
  document.removeEventListener('keydown', handleKeyDown, true);

  // Restore focus to previous element
  if (activeTrap.previousActiveElement) {
    activeTrap.previousActiveElement.focus();
  }

  // Call deactivate callback
  if (activeTrap.onDeactivate) {
    activeTrap.onDeactivate();
  }

  activeTrap = null;
}

export function isFocusTrapActive(): boolean {
  return activeTrap !== null;
}
