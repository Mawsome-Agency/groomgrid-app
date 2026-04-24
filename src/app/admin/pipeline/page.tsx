'use client';

/**
 * Admin Pipeline Dashboard
 *
 * Shows current GitHub PR pipeline status for groomgrid-app.
 * Auto-refreshes every 30 seconds (only when tab is visible).
 * Follows the ab-tests page pattern.
 */

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { PipelineItem, PipelineResponse } from '@/types/pipeline';

const POLL_INTERVAL = 30_000; // 30 seconds
// Default filters to "cortex/" since all Cortex-managed PR branches follow this prefix
const DEFAULT_BRANCH_FILTER = 'cortex/';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export default function PipelinePage() {
  const [pullRequests, setPullRequests] = useState<PipelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [branchFilter, setBranchFilter] = useState(DEFAULT_BRANCH_FILTER);
  const [lastFetched, setLastFetched] = useState<string>('');

  const fetchPipeline = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/pipeline');
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(data.error || `Failed to fetch pipeline data (${res.status})`);
      }
      const data: PipelineResponse = await res.json();
      setPullRequests(data.pullRequests);
      setLastFetched(data.fetchedAt);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pipeline data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPipeline();
    const interval = setInterval(() => {
      // Only poll when tab is visible to avoid burning GitHub API rate limit
      if (document.visibilityState === 'visible') {
        fetchPipeline();
      }
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPipeline]);

  const filtered = branchFilter
    ? pullRequests.filter((pr) =>
        pr.head.ref.toLowerCase().startsWith(branchFilter.toLowerCase()),
      )
    : pullRequests;

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Pipeline</h1>
            <p className="mt-1 text-sm text-stone-500">
              Open pull requests for groomgrid-app
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastFetched && (
              <span className="text-xs text-stone-500">
                Updated {timeAgo(lastFetched)}
              </span>
            )}
            <button
              onClick={fetchPipeline}
              disabled={loading}
              className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Branch filter */}
        <div className="mb-4 flex items-center gap-3">
          <label htmlFor="branch-filter" className="text-sm font-medium text-stone-700">
            Branch filter:
          </label>
          <input
            id="branch-filter"
            type="text"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            placeholder="e.g. cortex/"
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
          />
          {branchFilter !== DEFAULT_BRANCH_FILTER && (
            <button
              onClick={() => setBranchFilter(DEFAULT_BRANCH_FILTER)}
              className="text-xs text-brand-600 hover:underline"
            >
              Reset to default
            </button>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div aria-live="polite" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && pullRequests.length === 0 ? (
          <div role="status" className="flex items-center justify-center py-12">
            <div className="text-stone-500">Loading pipeline data...</div>
          </div>
        ) : (
          <div aria-live="polite" className="space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
                <p className="text-stone-500">
                  {branchFilter
                    ? `No open PRs matching "${branchFilter}"`
                    : 'No open pull requests'}
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  {branchFilter
                    ? 'Try adjusting the branch filter'
                    : 'All clear — no PRs in the pipeline'}
                </p>
              </div>
            ) : (
              filtered.map((pr) => (
                <div
                  key={pr.number}
                  className="rounded-xl border border-stone-200 bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-stone-600">
                          #{pr.number}
                        </span>
                        <h3 className="truncate text-base font-semibold text-stone-800">
                          {pr.title}
                        </h3>
                        {pr.draft && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            Draft
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-stone-500">
                        <span className="font-mono text-xs text-stone-600">
                          {pr.head.ref}
                        </span>
                        <span>·</span>
                        <span>
                          {pr.user?.login ?? 'unknown'}
                        </span>
                        <span>·</span>
                        <span>{timeAgo(pr.created_at)}</span>
                      </div>
                    </div>
                    <Link
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                      View PR
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Count summary */}
        {pullRequests.length > 0 && (
          <div className="mt-4 text-center text-xs text-stone-500">
            Showing {filtered.length} of {pullRequests.length} open PRs
          </div>
        )}
      </div>
    </div>
  );
}
