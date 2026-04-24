/**
 * @jest-environment jsdom
 *
 * Tests for the Admin Pipeline page component.
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PipelinePage from '@/app/admin/pipeline/page';

// ── Mocks ──────────────────────────────────────────────────────────────

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock data
const MOCK_PRS = [
  {
    number: 166,
    title: 'feat(seo): add FAQPage schema',
    html_url: 'https://github.com/mawsome-agency/groomgrid-app/pull/166',
    state: 'open',
    draft: false,
    user: { login: 'jesse-korbin', avatar_url: 'https://github.com/avatar.png' },
    head: { ref: 'feat/faq-schema', sha: 'abc123' },
    created_at: '2026-04-20T12:00:00Z',
    updated_at: '2026-04-20T12:30:00Z',
  },
  {
    number: 165,
    title: 'fix(tests): update sitemap count',
    html_url: 'https://github.com/mawsome-agency/groomgrid-app/pull/165',
    state: 'open',
    draft: true,
    user: { login: 'arjun-patel', avatar_url: 'https://github.com/avatar2.png' },
    head: { ref: 'cortex/fix-sitemap-test', sha: 'def456' },
    created_at: '2026-04-19T08:30:00Z',
    updated_at: '2026-04-19T09:00:00Z',
  },
];

const MOCK_RESPONSE = {
  pullRequests: MOCK_PRS,
  fetchedAt: '2026-04-23T18:00:00Z',
};

// ── Helpers ─────────────────────────────────────────────────────────────

function mockSuccessResponse(data = MOCK_RESPONSE) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
}

// ── Tests ───────────────────────────────────────────────────────────────

describe('PipelinePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Default: tab is visible
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows loading state initially', () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // never resolves
    render(<PipelinePage />);
    expect(screen.getByText('Loading pipeline data...')).toBeInTheDocument();
  });

  it('renders PRs after successful fetch', async () => {
    mockSuccessResponse();

    render(<PipelinePage />);

    await waitFor(() => {
      // With default cortex/ filter, only #165 is visible
      expect(screen.getByText('fix(tests): update sitemap count')).toBeInTheDocument();
    });
  });

  it('shows Draft badge for draft PRs', async () => {
    mockSuccessResponse();

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('Draft')).toBeInTheDocument();
    });
  });

  it('displays branch name and author', async () => {
    mockSuccessResponse();

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('cortex/fix-sitemap-test')).toBeInTheDocument();
    });

    expect(screen.getByText('arjun-patel')).toBeInTheDocument();
  });

  it('shows View PR links', async () => {
    mockSuccessResponse();

    render(<PipelinePage />);

    await waitFor(() => {
      const links = screen.getAllByText('View PR');
      // Only 1 link because default filter is cortex/ and only 1 PR matches
      expect(links).toHaveLength(1);
    });
  });

  it('displays empty state when no PRs exist', async () => {
    mockSuccessResponse({ pullRequests: [] as any[], fetchedAt: '2026-04-23T18:00:00Z' });

    render(<PipelinePage />);

    await waitFor(() => {
      // With default cortex/ filter and 0 PRs, shows "No open PRs matching cortex/"
      expect(screen.getByText(/No open PRs matching/)).toBeInTheDocument();
    });
  });

  it('displays filtered empty state when branch filter matches nothing', async () => {
    mockSuccessResponse();

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('fix(tests): update sitemap count')).toBeInTheDocument();
    });

    // Change filter to something that doesn't match any PR
    const input = screen.getByLabelText('Branch filter:');
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).clear(input);
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(input, 'nonexistent/');

    expect(screen.getByText(/No open PRs matching "nonexistent\/"/)).toBeInTheDocument();
  });

  it('shows all PRs when filter is cleared', async () => {
    mockSuccessResponse();

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('fix(tests): update sitemap count')).toBeInTheDocument();
    });

    // Clear the filter to see all PRs
    const input = screen.getByLabelText('Branch filter:');
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).clear(input);

    // Both PRs should now be visible
    expect(screen.getByText('feat(seo): add FAQPage schema')).toBeInTheDocument();
    expect(screen.getByText('fix(tests): update sitemap count')).toBeInTheDocument();
    expect(screen.getByText('Showing 2 of 2 open PRs')).toBeInTheDocument();
  });

  it('shows error message on failed fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'GitHub API returned 500 — bad gateway' }),
    });

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText(/bad gateway/i)).toBeInTheDocument();
    });
  });

  it('shows error message on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  it('refreshes data when Refresh button is clicked', async () => {
    mockSuccessResponse();
    mockSuccessResponse(); // second call for refresh

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('fix(tests): update sitemap count')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(refreshButton);

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('filters PRs by branch prefix using default cortex/', async () => {
    mockSuccessResponse();

    render(<PipelinePage />);

    await waitFor(() => {
      // Only the cortex/fix-sitemap-test PR should be shown by default
      expect(screen.getByText('Showing 1 of 2 open PRs')).toBeInTheDocument();
    });
  });

  it('resets branch filter when clicking reset link', async () => {
    mockSuccessResponse();

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('Showing 1 of 2 open PRs')).toBeInTheDocument();
    });

    // Clear the filter to see all PRs
    const input = screen.getByLabelText('Branch filter:');
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).clear(input);

    expect(screen.getByText('Showing 2 of 2 open PRs')).toBeInTheDocument();

    // Type a different filter
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(input, 'feat/');

    // Reset link should appear
    const resetLink = screen.getByText('Reset to default');
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(resetLink);

    // Should be back to default cortex/ filter
    expect(screen.getByText('Showing 1 of 2 open PRs')).toBeInTheDocument();
  });

  it('shows count summary', async () => {
    mockSuccessResponse();

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('Showing 1 of 2 open PRs')).toBeInTheDocument();
    });
  });

  it('polls for data every 30 seconds when tab is visible', async () => {
    mockSuccessResponse();
    mockSuccessResponse(); // second poll

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('fix(tests): update sitemap count')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Advance timer by 30 seconds
    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('skips polling when tab is hidden', async () => {
    mockSuccessResponse();

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('fix(tests): update sitemap count')).toBeInTheDocument();
    });

    // Simulate hidden tab
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });

    // Advance timer by 30 seconds — should NOT trigger fetch
    await act(async () => {
      jest.advanceTimersByTime(30_000);
    });

    // Only the initial fetch, no polling fetch
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('shows "unknown" for PRs with null user', async () => {
    const prsWithNullUser = [
      {
        number: 170,
        title: 'chore: update deps',
        html_url: 'https://github.com/mawsome-agency/groomgrid-app/pull/170',
        state: 'open',
        draft: false,
        user: null,
        head: { ref: 'cortex/update-deps', sha: 'xyz789' },
        created_at: '2026-04-22T10:00:00Z',
        updated_at: '2026-04-22T10:00:00Z',
      },
    ];

    mockSuccessResponse({ pullRequests: prsWithNullUser as any[], fetchedAt: '2026-04-23T18:00:00Z' });

    render(<PipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('unknown')).toBeInTheDocument();
    });
  });
});
