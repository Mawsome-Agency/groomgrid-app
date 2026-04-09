/**
 * ARIA live region announcer for screen readers
 * Used to announce dynamic content changes
 */

let announcerElement: HTMLElement | null = null;

/**
 * Initialize the announcer element
 */
function getAnnouncer(): HTMLElement {
  if (!announcerElement) {
    announcerElement = document.createElement('div');
    announcerElement.setAttribute('aria-live', 'polite');
    announcerElement.setAttribute('aria-atomic', 'true');
    announcerElement.setAttribute('role', 'status');
    announcerElement.style.position = 'absolute';
    announcerElement.style.left = '-10000px';
    announcerElement.style.width = '1px';
    announcerElement.style.height = '1px';
    announcerElement.style.overflow = 'hidden';
    document.body.appendChild(announcerElement);
  }
  return announcerElement;
}

/**
 * Announce a message to screen readers
 * @param message - The message to announce
 * @param priority - 'polite' for general announcements, 'assertive' for urgent ones
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcer = getAnnouncer();

  // Update aria-live based on priority
  announcer.setAttribute('aria-live', priority);

  // Clear any existing content and add new message
  announcer.textContent = '';

  // Use setTimeout to ensure screen readers pick up the change
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);

  // Clear after announcement
  setTimeout(() => {
    announcer.textContent = '';
  }, 3000);
}

/**
 * Announce a success message
 */
export function announceSuccess(message: string): void {
  announce(message, 'polite');
}

/**
 * Announce an error message
 */
export function announceError(message: string): void {
  announce(`Error: ${message}`, 'assertive');
}

/**
 * Announce a status update
 */
export function announceStatus(message: string): void {
  announce(message, 'polite');
}

/**
 * Announce that a page has loaded
 */
export function announcePageLoad(pageName: string): void {
  announce(`${pageName} loaded`, 'polite');
}

/**
 * Announce that a modal has opened
 */
export function announceModalOpen(modalTitle: string): void {
  announce(`${modalTitle} dialog opened`, 'polite');
}

/**
 * Announce that a modal has closed
 */
export function announceModalClosed(): void {
  announce('Dialog closed', 'polite');
}
