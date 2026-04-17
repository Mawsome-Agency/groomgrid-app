/**
 * Unit tests for the welcome email sender (src/lib/email/welcome.ts).
 *
 * Tests sendWelcomeEmail in isolation — mocks the resend module so these
 * tests don't depend on Mailgun credentials or network access.
 *
 * Key contract to verify: sendWelcomeEmail is fire-and-forget.
 * It must NEVER throw or reject — signup must always succeed regardless
 * of email send outcome.
 */
/** @jest-environment node */

const mockSend = jest.fn();

jest.mock('../resend', () => ({
  FROM_EMAIL: 'GroomGrid <hello@email.mawsome.agency>',
  getResend: jest.fn(() => ({
    emails: {
      send: mockSend,
    },
  })),
}));

import { sendWelcomeEmail } from '../welcome';
import { getResend } from '../resend';

const originalEnv = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_APP_URL: 'https://app.getgroomgrid.com',
  };
});

afterEach(() => {
  process.env = originalEnv;
});

// ─── Group 1: Happy path ──────────────────────────────────────────────────────

describe('sendWelcomeEmail — happy path', () => {
  beforeEach(() => {
    mockSend.mockResolvedValue({ data: { id: 'msg.test' }, error: null });
  });

  it('calls getResend().emails.send exactly once', async () => {
    await sendWelcomeEmail('user@example.com', 'Fluffy Cuts');
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('sends to the provided email address', async () => {
    await sendWelcomeEmail('groomer@example.com', 'Paws & Claws');
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'groomer@example.com' })
    );
  });

  it('sends from FROM_EMAIL', async () => {
    await sendWelcomeEmail('user@example.com', 'My Business');
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'GroomGrid <hello@email.mawsome.agency>' })
    );
  });

  it('sends with subject "Welcome to GroomGrid!"', async () => {
    await sendWelcomeEmail('user@example.com', 'Bark Avenue');
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Welcome to GroomGrid!' })
    );
  });

  it('includes the businessName in the HTML body', async () => {
    await sendWelcomeEmail('user@example.com', 'Fluffy Kingdom');
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('Fluffy Kingdom');
  });

  it('includes the dashboard URL in the HTML body', async () => {
    await sendWelcomeEmail('user@example.com', 'Test Biz');
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('https://app.getgroomgrid.com/dashboard');
  });

  it('includes the businessName in the plain text body', async () => {
    await sendWelcomeEmail('user@example.com', 'Clipper Masters');
    const call = mockSend.mock.calls[0][0];
    expect(call.text).toContain('Clipper Masters');
  });

  it('falls back to https://getgroomgrid.com/dashboard when NEXT_PUBLIC_APP_URL is unset', async () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    // Re-import to pick up env change — welcome.ts reads NEXT_PUBLIC_APP_URL at call time
    jest.resetModules();
    jest.mock('../resend', () => ({
      FROM_EMAIL: 'GroomGrid <hello@email.mawsome.agency>',
      getResend: jest.fn(() => ({ emails: { send: mockSend } })),
    }));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { sendWelcomeEmail: sendFresh } = require('../welcome');

    await sendFresh('user@example.com', 'Trim Masters');

    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('https://getgroomgrid.com/dashboard');
    expect(call.text).toContain('https://getgroomgrid.com/dashboard');
  });
});

// ─── Group 2: Fire-and-forget error handling ─────────────────────────────────

describe('sendWelcomeEmail — fire-and-forget error handling', () => {
  it('resolves (does not reject) when send returns an error object', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'Mailgun 401: Forbidden' } });

    await expect(sendWelcomeEmail('user@example.com', 'Test')).resolves.toBeUndefined();
  });

  it('resolves (does not reject) when send throws a network error', async () => {
    mockSend.mockRejectedValue(new Error('network failure'));

    await expect(sendWelcomeEmail('user@example.com', 'Test')).resolves.toBeUndefined();
  });

  it('does NOT propagate errors — never rejects', async () => {
    mockSend.mockRejectedValue(new Error('catastrophic failure'));

    // If this were to throw, the test would fail — that's the assertion
    let threw = false;
    try {
      await sendWelcomeEmail('user@example.com', 'Test');
    } catch {
      threw = true;
    }
    expect(threw).toBe(false);
  });

  it('calls console.error when send throws', async () => {
    mockSend.mockRejectedValue(new Error('send exploded'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await sendWelcomeEmail('user@example.com', 'Test');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Welcome email failed'),
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});

// ─── Group 3: Return value contract ──────────────────────────────────────────

describe('sendWelcomeEmail — return value', () => {
  it('returns Promise<void> — resolves to undefined', async () => {
    mockSend.mockResolvedValue({ data: { id: 'msg.ok' }, error: null });

    const result = await sendWelcomeEmail('user@example.com', 'Test');
    expect(result).toBeUndefined();
  });

  it('does not return the email send result — callers get nothing', async () => {
    mockSend.mockResolvedValue({ data: { id: 'msg.ok' }, error: null });

    // sendWelcomeEmail is declared as Promise<void> — verify the resolution value
    const returnValue = await sendWelcomeEmail('user@example.com', 'Test');
    expect(returnValue).not.toEqual({ data: expect.anything() });
    expect(returnValue).toBeUndefined();
  });
});
