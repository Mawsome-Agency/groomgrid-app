/**
 * Skip link component for keyboard navigation
 * Allows users to skip navigation and jump to main content
 */

import React from 'react';

interface SkipLinkProps {
  /**
   * The ID of the element to skip to (usually 'main-content')
   */
  targetId?: string;
  /**
   * Text to display for the skip link
   */
  text?: string;
}

/**
 * SkipLink component - Add this at the top of your layout
 *
 * @example
 * <SkipLink targetId="main-content" />
 * <main id="main-content">...</main>
 */
export function SkipLink({
  targetId = 'main-content',
  text = 'Skip to main content',
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-600 focus:text-white focus:rounded-lg focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
    >
      {text}
    </a>
  );
}
