import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';

// No caching — always fetch fresh PR data
export const dynamic = 'force-dynamic';

const GITHUB_REPO = 'mawsome-agency/groomgrid-app';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/pulls?state=open&per_page=50&sort=updated&direction=desc`;
const GITHUB_TIMEOUT_MS = 10_000;

/**
 * GET /api/admin/pipeline
 *
 * Proxies open GitHub PRs for the groomgrid-app repo.
 * Requires authentication via next-auth session.
 *
 * Error mapping:
 *   - 401/403/404 from GitHub → 503 (service unavailable)
 *   - 5xx from GitHub → 502 (bad gateway)
 *   - AbortError (timeout) → 504 (gateway timeout)
 *   - Network/unknown errors → 500
 */
export async function GET() {
  // ── Auth guard ──────────────────────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  // ── GitHub token check ──────────────────────────────────────────────
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('[Pipeline] GITHUB_TOKEN is not configured');
    return NextResponse.json(
      { error: 'Server configuration error — GITHUB_TOKEN missing' },
      { status: 503 },
    );
  }

  // ── GitHub proxy ─────────────────────────────────────────────────────
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GITHUB_TIMEOUT_MS);

  let ghRes: Response;

  try {
    ghRes = await fetch(GITHUB_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'GroomGrid-Admin-Pipeline',
      },
      signal: controller.signal,
    });
  } catch (err: unknown) {
    // Node.js 18+ fetch throws Error with name === 'AbortError' on abort,
    // NOT DOMException. Must check error.name, not instanceof DOMException.
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json(
        { error: 'GitHub API request timed out after 10 seconds' },
        { status: 504 },
      );
    }
    console.error('[Pipeline] Network error fetching GitHub PRs:', err);
    return NextResponse.json(
      { error: 'Failed to reach GitHub API' },
      { status: 500 },
    );
  } finally {
    clearTimeout(timeout);
  }

  // ── Error mapping ────────────────────────────────────────────────────
  if (!ghRes.ok) {
    const status = ghRes.status;
    let mappedStatus: number;
    let message: string;

    if (status === 401 || status === 403 || status === 404) {
      mappedStatus = 503;
      message = `GitHub API returned ${status} — service unavailable`;
    } else if (status >= 500) {
      mappedStatus = 502;
      message = `GitHub API returned ${status} — bad gateway`;
    } else {
      mappedStatus = 502;
      message = `GitHub API returned unexpected status ${status}`;
    }

    console.error(`[Pipeline] GitHub API error: ${status}`);
    return NextResponse.json({ error: message }, { status: mappedStatus });
  }

  let pullRequests;
  try {
    pullRequests = await ghRes.json();
  } catch (jsonErr) {
    console.error('[Pipeline] Failed to parse GitHub response:', jsonErr);
    return NextResponse.json(
      { error: 'Failed to parse GitHub response' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    pullRequests,
    fetchedAt: new Date().toISOString(),
  });
}
