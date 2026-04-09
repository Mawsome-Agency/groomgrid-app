/**
 * axe-core configuration for accessibility testing
 * Custom rules and tag configuration
 */

export const axeConfig = {
  rules: {
    // Enable all WCAG 2.1 AA rules
    'color-contrast': { enabled: true },
    'image-alt': { enabled: true },
    'label': { enabled: true },
    'link-name': { enabled: true },
    'list': { enabled: true },
    'listitem': { enabled: true },
    'html-has-lang': { enabled: true },
    'page-has-title': { enabled: true },
    'landmark-one-main': { enabled: true },
    'region': { enabled: true },
    
    // Custom rules for GroomGrid
    'button-name': { enabled: true },
    'empty-button-name': { enabled: true },
    'input-button-name': { enabled: true },
    'link-in-text-block': { enabled: true },
    
    // Focus management
    'focus-order-semantics': { enabled: true },
    'tabindex': { enabled: true },
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
};

export default axeConfig;
