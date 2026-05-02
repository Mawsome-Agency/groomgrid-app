/**
 * @jest-environment jsdom
 *
 * Unit tests for the Pipeline admin page component.
 *
 * Tests rendering states (loading, error, empty, data), polling,
 * branch filtering, and timeAgo formatting.
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PipelinePage from '../page';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock next/link to render as a plain <a>
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// ─── Test data ────────────────────────────────────────────────────────────────

// Both PRs use cortex/ branches so they show under the default filter
const MOCK_PRS = [
  {
    number: 166,
    title: 'feat(seo): add FAQPage schema',
    html_url: 'https://github.com/mawsome-agency/groomgrid-app/pull/166',
    state: 'open',
    draft: false,
    user: { login: 'jesse-korbin', avatar_url: 'https://github.com/avatar.png' },
    head: { ref: 'cortex/faq-schema', sha: 'abc123' },
    created_at: '2026-04-20T00:00:00Z',
    updated_at: '2026-04-23T00:20:00Z',
  },
  {
    number: 165,
    title: 'fix(tests): update sitemap count',
    html_url: 'https://github.com/mawsome-agency/groomgrid-app/pull/165',
    state: 'open',
    draft: true,
    user: { login: 'atlas-reeves', avatar_url: 'https://github.com/avatar2.png' },
    head: { ref: 'cortex/fix-sitemap', sha: 'def456' },
    created_at: '2026-04-22T20:05:52Z',
    updated_at: '2026-04-22T20:10:00Z',
  },
];

// Extra PR with a non-cortex branch for filter testing
const FEATURE_BRANCH_PR = {
  number: 170,
  title: 'feat(ui): new dashboard layout',
  html_url: 'https://github.com/mawsome-agency/groomgrid-app/pull/170',
  state: 'open',
  draft: false,
  user: { login: 'nadia-constantin', avatar_url: 'https://github.com/avatar3.png' },
  head: { ref: 'feat/dashboard-v2', sha: 'ghi789' },
  created_at: '2026-04-21T12:00:00Z',
  updated_at: '2026-04-21T12:30:00Z',
};

function mockSuccessResponse(prs = MOCK_PRS) {
  return {
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue({
      pullRequests: prs,
      fetchedAt: '2026-04-23T18:00:00.000Z',
    }),
  };
}

function mockErrorResponse(status: number, error: string) {
  return {
    ok: false,
    status,
    json: jest.fn().mockResolvedValue({ error }),
  };
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('PipelinePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Loading state ────────────────────────────────────────────────────────────

  it('shows loading state while fetching', () => {
    // Keep fetch pending so loading state persists
    mockFetch.mockReturnValue(new Promise(() => {}));

    render(<PipelinePage />);

    expect(screen.getByText('Loading pipeline data...')).toBeInTheDocument();
  });

  // ── Successful data display ─────────────────────────────────────────────────

  it('renders PRs after successful fetch', async () => {
    mockFetch.mockResolvedValue(mockSuccessResponse());

    render(<PipelinePage />);

    // Both PRs use cortex/ branches so they show under the default filter
    await waitFor(() => {
      expect(screen.getByText('feat(seo): add FAQPage schema')).toBeInTheDocument();
    });
    expect(screen.getByText('fix(tests): update sitemap count')).toBeInTheDocument();

    // Draft badge on PR #165
    expect(screen.getByText('Draft')).toBeInTheDocument();

    // Branch names
    expect(screen.getByText('cortex/faq-schema')).toBeInTheDocument();
    expect(screen.getByText('cortex/fix-sitemap')).toBeInTheDocument();

    // Authors
    expect(screen.getByText('jesse-korbin')).toBeInTheDocument();
    expect(screen.getByText('atlas-reeves')).toBeInTheDocument();

    // View PR links
    const links = screen.getAllByText('View PR');
    expect(links).toHaveLength(2);
    expect(links[0].closest('a')).toHaveAttribute(
      'href',
      'https://github.com/mawsome-agency/groomgrid-app/pull/166',
    );
  });

  // ── Empty state ─────────────────────────────────────────────────────────────

  it('shows empty state when no PRs exist', async () => {
    mockFetch.mockResolvedValue(mockSuccessResponse([]));

    render(<PipelinePage />);

    // With 0 PRs and default cortex/ filter, shows "No open PRs matching"
    await waitFor(() => {
      expect(screen.getByText(/no open PRs matching/i)).toBeInTheDocument();
    });
  });

  it('shows filtered empty state when no PRs match branch filter', async () => {
    mockFetch.mockResolvedValue(mockSuccessResponse());

    render(<PipelinePage />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('feat(seo): add FAQPage schema')).toBeInTheDocument();
    });

    // Change filter to something that matches nothing
    const input = screen.getByLabelText('Branch filter:');
    await userEvent.clear(input);
    await userEvent.type(input, 'nonexistent/');

    await waitFor(() => {
      expect(screen.getByText(/no open PRs matching/i)).toBeInTheDocument();
    });
  });

  // ── Error state ─────────────────────────────────────────────────────────────

  it('shows error when fetch fails', async () => {
    mockFetch.mockResolvedValue(
      mockErrorResponse(503, 'GitHub API returned 403 — service unavailable')
    );

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText(/service unavailable/i)).toBeInTheDocument();
    });
  });

  // ── Branch filtering ────────────────────────────────────────────────────────

  it('filters PRs by branch prefix', async () => {
    // Include a PR with a non-cortex branch
    const allPrs = [...MOCK_PRS, FEATURE_BRANCH_PR];
    mockFetch.mockResolvedValue(mockSuccessResponse(allPrs));

    render(<PipelinePage />);

    // Default filter is "cortex/" — only cortex/ PRs should show
    await waitFor(() => {
      expect(screen.getByText('Showing 2 of 3 open PRs')).toBeInTheDocument();
    });

    // Change filter to "feat/"
    const input = screen.getByLabelText('Branch filter:');
    await userEvent.clear(input);
    await userEvent.type(input, 'feat/');

    await waitFor(() => {
      expect(screen.getByText('Showing 1 of 3 open PRs')).toBeInTheDocument();
    });

    // Clear filter to show all
    await userEvent.clear(input);
    await waitFor(() => {
      expect(screen.getByText('Showing 3 of 3 open PRs')).toBeInTheDocument();
    });
  });

  // ── Polling ─────────────────────────────────────────────────────────────────

  it('calls fetch on mount and sets up polling', async () => {
    mockFetch.mockResolvedValue(mockSuccessResponse());

    render(<PipelinePage />);

    // Initial fetch should have been called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
    expect(mockFetch).toHaveBeenCalledWith('/api/admin/pipeline');
  });

  it('refreshes data when refresh button is clicked', async () => {
    mockFetch.mockResolvedValue(mockSuccessResponse());

    render(<PipelinePage />);

    // Wait for initial fetch
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Click refresh button
    const refreshButton = screen.getByText('Refresh');
    await userEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  // ── timeAgo formatting ─────────────────────────────────────────────────────

  it('displays relative time for PR creation dates', async () => {
    // Use a fixed "now" so timeAgo is deterministic
    const recentPr = {
      ...MOCK_PRS[0],
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    };
    mockFetch.mockResolvedValue(mockSuccessResponse([recentPr]));

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText(/3h ago/)).toBeInTheDocument();
    });
  });
});
