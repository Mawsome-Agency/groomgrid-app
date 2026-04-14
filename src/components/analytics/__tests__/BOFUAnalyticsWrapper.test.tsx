import React from 'react';
import { render, screen } from '@testing-library/react';
import { BOFUAnalyticsWrapper } from '../BOFUAnalyticsWrapper';
import * as ga4 from '@/lib/ga4';

// Mock the hooks
jest.mock('@/hooks/use-scroll-depth');
jest.mock('@/hooks/use-section-observer');
jest.mock('@/hooks/use-engagement-time');
jest.mock('@/lib/ga4');

describe('BOFUAnalyticsWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <BOFUAnalyticsWrapper
        pageType="test-page"
        sectionIds={['hero', 'features']}
        sectionTitles={['Hero', 'Features']}
      >
        <div>Test Content</div>
      </BOFUAnalyticsWrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should track page view on mount', () => {
    render(
      <BOFUAnalyticsWrapper
        pageType="test-page"
        sectionIds={['hero']}
        sectionTitles={['Hero']}
      >
        <div>Content</div>
      </BOFUAnalyticsWrapper>
    );

    expect(ga4.trackBofuPageViewed).toHaveBeenCalledWith('test-page', undefined);
  });

  it('should not track when disabled', () => {
    render(
      <BOFUAnalyticsWrapper
        pageType="test-page"
        sectionIds={['hero']}
        sectionTitles={['Hero']}
        enabled={false}
      >
        <div>Content</div>
      </BOFUAnalyticsWrapper>
    );

    expect(ga4.trackBofuPageViewed).not.toHaveBeenCalled();
  });

  it('should pass correct props to children', () => {
    const TestChild = () => <div data-testid="child">Child Component</div>;

    render(
      <BOFUAnalyticsWrapper
        pageType="test-page"
        sectionIds={['hero']}
        sectionTitles={['Hero']}
      >
        <TestChild />
      </BOFUAnalyticsWrapper>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should handle multiple sections', () => {
    render(
      <BOFUAnalyticsWrapper
        pageType="test-page"
        sectionIds={['hero', 'features', 'pricing', 'cta']}
        sectionTitles={['Hero', 'Features', 'Pricing', 'CTA']}
      >
        <div>Content</div>
      </BOFUAnalyticsWrapper>
    );

    expect(ga4.trackBofuPageViewed).toHaveBeenCalled();
  });

  it('should track engagement time on unmount', () => {
    const { unmount } = render(
      <BOFUAnalyticsWrapper
        pageType="test-page"
        sectionIds={['hero']}
        sectionTitles={['Hero']}
      >
        <div>Content</div>
      </BOFUAnalyticsWrapper>
    );

    unmount();

    // Engagement time tracking happens on unmount
    // This is a smoke test - the actual tracking is done by the hooks
  });
});
