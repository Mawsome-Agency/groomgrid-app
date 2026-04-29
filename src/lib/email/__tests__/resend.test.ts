/**
 * Unit tests for the Mailgun HTTP email adapter (src/lib/email/resend.ts).
 *
 * Uses Node environment (not jsdom) because:
 *   - AbortSignal.timeout() is a Node.js 17.3+ built-in, not available in jsdom
 *   - Buffer.from() is used for Basic Auth encoding (Node built-in)
 *
 * The module uses a lazy singleton (_client), so jest.resetModules() is required
 * in beforeEach to get a fresh module state for each test.
 */
/** @jest-environment node */

const originalEnv = process.env;

// We use require() for dynamic re-import after jest.resetModules()
type ResendModule = typeof import('../resend');

let getResend: ResendModule['getResend'];
let FROM_EMAIL: ResendModule['FROM_EMAIL'];
let mockFetch: jest.MockedFunction<typeof fetch>;

beforeEach(() => {
  // Reset env before each test so FROM_EMAIL is re-evaluated on re-import
  process.env = {
    ...originalEnv,
    MAILGUN_API_KEY: 'key-test-abc123',
    MAILGUN_DOMAIN: 'sandbox.mailgun.org',
    MAILGUN_FROM_EMAIL: undefined as unknown as string,
  };
  delete process.env.MAILGUN_FROM_EMAIL;

  // Reset the module registry so the singleton _client and FROM_EMAIL are fresh
  jest.resetModules();

  // Re-import after resetModules
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod: ResendModule = require('../resend');
  getResend = mod.getResend;
  FROM_EMAIL = mod.FROM_EMAIL;

  // Replace global fetch with a mock
  mockFetch = jest.fn();
  global.fetch = mockFetch;
});

afterEach(() => {
  process.env = originalEnv;
  jest.restoreAllMocks();
});

// ─── Group 1: FROM_EMAIL constant ────────────────────────────────────────────

describe('FROM_EMAIL', () => {
  it('uses the hardcoded fallback when MAILGUN_FROM_EMAIL is not set', () => {
    // MAILGUN_FROM_EMAIL deleted in beforeEach
    expect(FROM_EMAIL).toBe('GroomGrid <hello@email.mawsome.agency>');
  });

  it('uses MAILGUN_FROM_EMAIL when it is set', () => {
    process.env.MAILGUN_FROM_EMAIL = 'Custom <custom@getgroomgrid.com>';
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod: ResendModule = require('../resend');
    expect(mod.FROM_EMAIL).toBe('Custom <custom@getgroomgrid.com>');
  });

  it('does NOT auto-derive from MAILGUN_DOMAIN — fallback domain is always email.mawsome.agency', () => {
    // MAILGUN_DOMAIN is 'sandbox.mailgun.org' but FROM_EMAIL should still use the hardcoded fallback
    expect(FROM_EMAIL).toBe('GroomGrid <hello@email.mawsome.agency>');
    expect(FROM_EMAIL).not.toContain('sandbox.mailgun.org');
  });
});

// ─── Group 2: getResend() singleton ──────────────────────────────────────────

describe('getResend() singleton', () => {
  it('returns an object with a .emails.send method', () => {
    const client = getResend();
    expect(client).toBeDefined();
    expect(typeof client.emails.send).toBe('function');
  });

  it('returns the same instance on repeated calls (referential equality)', () => {
    const first = getResend();
    const second = getResend();
    expect(first).toBe(second);
  });

  it('returns a new instance after jest.resetModules() re-import', () => {
    const first = getResend();
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod2: ResendModule = require('../resend');
    const second = mod2.getResend();
    // Different module instance — not the same reference
    expect(first).not.toBe(second);
  });
});

// ─── Group 3: send() — env var validation ────────────────────────────────────

describe('send() — env var validation', () => {
  it('throws when MAILGUN_API_KEY is unset', async () => {
    delete process.env.MAILGUN_API_KEY;
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod: ResendModule = require('../resend');

    await expect(
      mod.getResend().emails.send({
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test',
      })
    ).rejects.toThrow('Email configuration missing');
  });

  it('throws when MAILGUN_DOMAIN is unset', async () => {
    delete process.env.MAILGUN_DOMAIN;
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod: ResendModule = require('../resend');

    await expect(
      mod.getResend().emails.send({
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test',
      })
    ).rejects.toThrow('Email configuration missing');
  });

  it('throws when both MAILGUN_API_KEY and MAILGUN_DOMAIN are unset', async () => {
    delete process.env.MAILGUN_API_KEY;
    delete process.env.MAILGUN_DOMAIN;
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod: ResendModule = require('../resend');

    await expect(
      mod.getResend().emails.send({
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test',
      })
    ).rejects.toThrow('MAILGUN_API_KEY and MAILGUN_DOMAIN must be set');
  });
});

// ─── Group 4: send() — happy path ────────────────────────────────────────────

describe('send() — happy path', () => {
  function makeOkResponse(body: object = { id: 'msg.test123', message: 'Queued. Thank you.' }) {
    return {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(body),
      text: jest.fn().mockResolvedValue(JSON.stringify(body)),
    } as unknown as Response;
  }

  it('returns { data: { id }, error: null } on 200 response', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ id: 'msg.test123', message: 'Queued.' }));

    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test subject',
      html: '<p>Hello</p>',
    });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: 'msg.test123' });
  });

  it('constructs the correct Mailgun API URL', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse());

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.mailgun.net/v3/sandbox.mailgun.org/messages',
      expect.any(Object)
    );
  });

  it('sets the correct Basic Auth header', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse());

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
    });

    const expectedCredentials = Buffer.from('api:key-test-abc123').toString('base64');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Authorization: `Basic ${expectedCredentials}` },
      })
    );
  });

  it('appends the from field to FormData', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse());
    const appendSpy = jest.spyOn(FormData.prototype, 'append');

    await getResend().emails.send({
      from: 'Sender <sender@example.com>',
      to: 'user@example.com',
      subject: 'Test',
    });

    expect(appendSpy).toHaveBeenCalledWith('from', 'Sender <sender@example.com>');
  });

  it('appends a string to field to FormData', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse());
    const appendSpy = jest.spyOn(FormData.prototype, 'append');

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'recipient@example.com',
      subject: 'Test',
    });

    expect(appendSpy).toHaveBeenCalledWith('to', 'recipient@example.com');
  });

  it('joins an array to field into a comma-separated string', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse());
    const appendSpy = jest.spyOn(FormData.prototype, 'append');

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: ['a@example.com', 'b@example.com'],
      subject: 'Test',
    });

    expect(appendSpy).toHaveBeenCalledWith('to', 'a@example.com,b@example.com');
  });

  it('appends the subject field', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse());
    const appendSpy = jest.spyOn(FormData.prototype, 'append');

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'My Subject Line',
    });

    expect(appendSpy).toHaveBeenCalledWith('subject', 'My Subject Line');
  });

  it('appends html when provided', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse());
    const appendSpy = jest.spyOn(FormData.prototype, 'append');

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
      html: '<h1>Hello</h1>',
    });

    expect(appendSpy).toHaveBeenCalledWith('html', '<h1>Hello</h1>');
  });

  it('appends text when provided', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse());
    const appendSpy = jest.spyOn(FormData.prototype, 'append');

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
      text: 'Hello plain text',
    });

    expect(appendSpy).toHaveBeenCalledWith('text', 'Hello plain text');
  });

  it('does NOT append html when undefined', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse());
    const appendSpy = jest.spyOn(FormData.prototype, 'append');

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
      // html not provided
    });

    const htmlCalls = appendSpy.mock.calls.filter(([key]) => key === 'html');
    expect(htmlCalls).toHaveLength(0);
  });

  it('does NOT append text when undefined', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse());
    const appendSpy = jest.spyOn(FormData.prototype, 'append');

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
      // text not provided
    });

    const textCalls = appendSpy.mock.calls.filter(([key]) => key === 'text');
    expect(textCalls).toHaveLength(0);
  });
});

// ─── Group 5: send() — HTTP error paths ──────────────────────────────────────

describe('send() — HTTP error paths', () => {
  function makeErrorResponse(status: number, body = 'Error message from Mailgun') {
    return {
      ok: false,
      status,
      text: jest.fn().mockResolvedValue(body),
    } as unknown as Response;
  }

  it('returns { data: null, error } on 401 (bad API key)', async () => {
    mockFetch.mockResolvedValueOnce(makeErrorResponse(401, 'Forbidden'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error!.message).toContain('401');
    consoleSpy.mockRestore();
  });

  it('returns { data: null, error } on 500 (server error)', async () => {
    mockFetch.mockResolvedValueOnce(makeErrorResponse(500, 'Internal error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
    });

    expect(result.data).toBeNull();
    expect(result.error!.message).toContain('500');
    consoleSpy.mockRestore();
  });

  it('does NOT throw on HTTP error — returns error object', async () => {
    mockFetch.mockResolvedValueOnce(makeErrorResponse(403, 'Domain not verified'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Should resolve, not reject
    await expect(
      getResend().emails.send({ from: FROM_EMAIL, to: 'u@x.com', subject: 'Test' })
    ).resolves.toMatchObject({ data: null, error: expect.any(Object) });
  });

  it('logs console.error on non-ok HTTP response', async () => {
    mockFetch.mockResolvedValueOnce(makeErrorResponse(400, 'Bad request'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getResend().emails.send({ from: FROM_EMAIL, to: 'u@x.com', subject: 'Test' });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[email] Mailgun HTTP'),
      expect.anything()
    );
    consoleSpy.mockRestore();
  });
});

// ─── Group 6: send() — network failure and AbortSignal.timeout ───────────────

describe('send() — network failure and abort signal', () => {
  it('returns { data: null, error } when fetch throws a network error (does not rethrow)', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
    });

    expect(result.data).toBeNull();
    expect(result.error!.message).toContain('Failed to fetch');
  });

  it('passes a signal option to fetch (AbortSignal.timeout)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ id: 'msg.abc', message: 'ok' }),
    } as unknown as Response);

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
    });

    // Verify fetch was called with a signal property (when supported by environment)
    const [, fetchOptions] = mockFetch.mock.calls[0] as [string, RequestInit];
    // AbortSignal.timeout may not be available in test env — signal can be undefined
    if (typeof AbortSignal.timeout === 'function') {
      expect(fetchOptions.signal).toBeDefined();
    }
  });

  it('returns { data: null, error } when fetch throws a TimeoutError (does not rethrow)', async () => {
    const timeoutError = new DOMException('The operation was aborted.', 'TimeoutError');
    mockFetch.mockRejectedValueOnce(timeoutError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
    });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    // DOMException.message is 'The operation was aborted.'
    expect(result.error!.message).toContain('aborted');
    consoleSpy.mockRestore();
  });

  it('logs console.error when timeout fires', async () => {
    const timeoutError = new DOMException('The operation was aborted.', 'TimeoutError');
    mockFetch.mockRejectedValueOnce(timeoutError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getResend().emails.send({ from: FROM_EMAIL, to: 'u@x.com', subject: 'Test' });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[email] Mailgun send failed:'),
      expect.any(String)
    );
    consoleSpy.mockRestore();
  });
});

// ─── Group 7: edge cases ─────────────────────────────────────────────────────

describe('send() — edge cases', () => {
  it('handles response.text() throwing during error body read (wraps in no body)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: jest.fn().mockRejectedValue(new Error('body read failed')),
    } as unknown as Response);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
    });

    expect(result.data).toBeNull();
    expect(result.error!.message).toContain('503');
    expect(result.error!.message).toContain('(no body)');
  });

  it('returns { data: { id }, error: null } on 201 response (treated as success)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: jest.fn().mockResolvedValue({ id: 'msg.201test', message: 'Queued.' }),
    } as unknown as Response);

    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
    });

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: 'msg.201test' });
  });

  it('returns error when successful response json is malformed', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
    } as unknown as Response);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: 'user@example.com',
      subject: 'Test',
    });

    // json() throw is caught by the outer try/catch and returned as error
    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error!.message).toContain('Unexpected token');
  });
});
