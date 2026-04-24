/**
 * @jest-environment node
 *
 * Unit tests for GET /api/admin/pipeline
 *
 * Tests auth guard, GitHub API proxy, timeout, error mapping, and response shape.
 */

// ── Mocks ──────────────────────────────────────────────────────────────

// Mock next-auth getServerSession
const mockGetServerSession = jest.fn();
jest.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}));

// Mock next-auth-options (used by getServerSession)
jest.mock('@/lib/next-auth-options', () => ({
  authOptions: { providers: [] },
}));

// Mock global fetch to control GitHub API responses
const mockFetch = jest.fn();
global.fetch = mockFetch;

// ── Helpers ─────────────────────────────────────────────────────────────

const ORIGINAL_ENV = process.env;

const GITHUB_PRS_RESPONSE = [
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
    title: 'fix(tests): update sitemap entry count',
    html_url: 'https://github.com/mawsome-agency/groomgrid-app/pull/165',
    state: 'open',
    draft: true,
    user: { login: 'arjun-patel', avatar_url: 'https://github.com/avatar2.png' },
    head: { ref: 'cortex/fix-sitemap', sha: 'def456' },
    created_at: '2026-04-19T08:30:00Z',
    updated_at: '2026-04-19T09:00:00Z',
  },
];

const AUTHENTICATED_SESSION = {
  user: { id: 'user_123', email: 'admin@groomgrid.com', name: 'Admin' },
  expires: '2026-12-31T23:59:59.000Z',
};

function mockGithubResponse(body: unknown, status = 200, ok = true): Response {
  return {
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

// ── Import after mocks ─────────────────────────────────────────────────

import { GET } from '../route';

// ── Tests ───────────────────────────────────────────────────────────────

describe('GET /api/admin/pipeline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...ORIGINAL_ENV, GITHUB_TOKEN: 'ghp_testtoken123' };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  // ── Auth guard ────────────────────────────────────────────────────────

  it('returns 401 when no session exists', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Authentication required');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 401 when session has no user.id', async () => {
    mockGetServerSession.mockResolvedValue({ user: {} });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Authentication required');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // ── Missing GITHUB_TOKEN ──────────────────────────────────────────────

  it('returns 503 when GITHUB_TOKEN is not configured', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    delete process.env.GITHUB_TOKEN;

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.error).toContain('GITHUB_TOKEN');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // ── Successful fetch ──────────────────────────────────────────────────

  it('returns pullRequests array on success', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockResolvedValueOnce(mockGithubResponse(GITHUB_PRS_RESPONSE));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.pullRequests).toHaveLength(2);
    expect(body.pullRequests[0].number).toBe(166);
    expect(body.pullRequests[0].title).toBe('feat(seo): add FAQPage schema');
    expect(body.pullRequests[0].head.ref).toBe('feat/faq-schema');
    expect(body.pullRequests[0].user.login).toBe('jesse-korbin');
    expect(body.pullRequests[0].draft).toBe(false);
    expect(body.pullRequests[1].draft).toBe(true);
    expect(body.fetchedAt).toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('sends correct GitHub API URL, Bearer token, Accept, and User-Agent headers', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockResolvedValueOnce(mockGithubResponse([]));

    await GET();

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/mawsome-agency/groomgrid-app/pulls?state=open&per_page=50&sort=updated&direction=desc',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer ghp_testtoken123',
          Accept: 'application/vnd.github+json',
          'User-Agent': 'GroomGrid-Admin-Pipeline',
        }),
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('returns empty pullRequests array when GitHub returns empty', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockResolvedValueOnce(mockGithubResponse([]));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.pullRequests).toEqual([]);
  });

  // ── GitHub HTTP error mapping ─────────────────────────────────────────

  it('maps 401 from GitHub to 503', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({ message: 'Bad credentials' }),
    } as unknown as Response);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.error).toContain('401');
  });

  it('maps 403 from GitHub to 503', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: jest.fn().mockResolvedValue({ message: 'Forbidden' }),
    } as unknown as Response);

    const res = await GET();
    expect(res.status).toBe(503);
  });

  it('maps 404 from GitHub to 503', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({ message: 'Not Found' }),
    } as unknown as Response);

    const res = await GET();
    expect(res.status).toBe(503);
  });

  it('maps 5xx from GitHub to 502', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({ message: 'Internal Server Error' }),
    } as unknown as Response);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.error).toContain('500');
  });

  it('maps other unexpected 4xx from GitHub to 502', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: jest.fn().mockResolvedValue({ message: 'Validation Failed' }),
    } as unknown as Response);

    const res = await GET();
    expect(res.status).toBe(502);
  });

  // ── Timeout / network errors ───────────────────────────────────────────

  it('returns 504 when GitHub request times out (AbortError)', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    // In Node.js 18+, fetch abort throws Error with name='AbortError', not DOMException
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    mockFetch.mockRejectedValueOnce(abortError);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(504);
    expect(body.error).toContain('timed out');
  });

  it('returns 500 for generic network fetch errors', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Failed to reach GitHub API');
  });

  it('returns 500 for unknown thrown errors', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockRejectedValueOnce(new Error('Something unexpected'));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Failed to reach GitHub API');
  });

  it('handles non-Error thrown values', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockRejectedValueOnce('string error');

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Failed to reach GitHub API');
  });

  // ── Response parsing ─────────────────────────────────────────────────

  it('handles PRs with null user gracefully', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockResolvedValueOnce(mockGithubResponse([
      {
        number: 99,
        title: 'Test PR',
        html_url: 'https://github.com/mawsome-agency/groomgrid-app/pull/99',
        state: 'open',
        draft: false,
        user: null,
        head: { ref: 'main', sha: 'abc123' },
        created_at: '2026-04-23T00:00:00Z',
        updated_at: '2026-04-23T00:00:00Z',
      },
    ]));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.pullRequests[0].user).toBeNull();
    expect(body.pullRequests[0].number).toBe(99);
  });

  it('returns 500 when GitHub returns non-JSON', async () => {
    mockGetServerSession.mockResolvedValue(AUTHENTICATED_SESSION);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as unknown as Response);

    const res = await GET();
    expect(res.status).toBe(500);
  });
});
