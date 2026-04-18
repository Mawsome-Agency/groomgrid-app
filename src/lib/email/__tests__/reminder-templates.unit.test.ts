/**
 * Unit tests for appointment reminder email senders (src/lib/email/reminder-templates.ts).
 *
 * Tests send24hReminder and sendDayOfReminder in isolation — mocks the resend
 * module so tests don't depend on Mailgun credentials or network access.
 *
 * Key contracts:
 *  - Both functions RETURN the send result (not fire-and-forget). Errors propagate.
 *  - Optional fields (petName, clientAddress, clientPhone, notes) only appear
 *    in the email when they are provided — no "undefined" strings in output.
 *  - Price is in CENTS and must be formatted as "$X.XX" in the email.
 *  - Subject line format: "Tomorrow: <service> for <client> (<pet>) at <time>"
 *    or "Today: <service> for <client> (<pet>) at <time>" with petName omitted
 *    when not provided.
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

import {
  send24hReminder,
  sendDayOfReminder,
  type Send24hReminderParams,
  type SendDayOfReminderParams,
  type AppointmentReminderDetails,
} from '../reminder-templates';

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const BASE_APPOINTMENT: AppointmentReminderDetails = {
  clientName: 'Jane Smith',
  service: 'Full Groom',
  startTime: new Date('2026-04-20T10:00:00'),
  price: 7500, // $75.00 in cents
};

const BASE_24H_PARAMS: Send24hReminderParams = {
  groomerEmail: 'groomer@example.com',
  groomerName: 'Alex Groomer',
  appointment: BASE_APPOINTMENT,
  appUrl: 'https://app.getgroomgrid.com',
};

const BASE_DAY_OF_PARAMS: SendDayOfReminderParams = {
  groomerEmail: 'groomer@example.com',
  groomerName: 'Alex Groomer',
  appointment: BASE_APPOINTMENT,
  appUrl: 'https://app.getgroomgrid.com',
};

beforeEach(() => {
  jest.clearAllMocks();
  mockSend.mockResolvedValue({ data: { id: 'msg.reminder.test' }, error: null });
});

// ─── Group 1: send24hReminder — happy path ────────────────────────────────────

describe('send24hReminder — happy path', () => {
  it('calls getResend().emails.send exactly once', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('sends to the groomerEmail address', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'groomer@example.com' })
    );
  });

  it('sends from FROM_EMAIL', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'GroomGrid <hello@email.mawsome.agency>' })
    );
  });

  it('subject starts with "Tomorrow:"', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toMatch(/^Tomorrow:/);
  });

  it('subject contains the service name', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toContain('Full Groom');
  });

  it('subject contains the client name', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toContain('Jane Smith');
  });

  it('includes client name in the HTML body', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('Jane Smith');
  });

  it('includes service name in the HTML body', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('Full Groom');
  });

  it('includes the schedule link with appUrl', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('https://app.getgroomgrid.com/schedule');
    expect(call.text).toContain('https://app.getgroomgrid.com/schedule');
  });

  it('includes both html and text in the send params', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toBeTruthy();
    expect(call.text).toBeTruthy();
  });

  it('HTML body is a complete document (has DOCTYPE)', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('<!DOCTYPE html>');
  });

  it('passes through the send result (not fire-and-forget)', async () => {
    const mockResult = { data: { id: 'msg.passthrough' }, error: null };
    mockSend.mockResolvedValueOnce(mockResult);
    const result = await send24hReminder(BASE_24H_PARAMS);
    expect(result).toEqual(mockResult);
  });
});

// ─── Group 2: send24hReminder — price formatting ─────────────────────────────

describe('send24hReminder — price formatting (cents to dollars)', () => {
  it('formats 7500 cents as $75.00', async () => {
    await send24hReminder({ ...BASE_24H_PARAMS, appointment: { ...BASE_APPOINTMENT, price: 7500 } });
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('$75.00');
    expect(call.text).toContain('$75.00');
  });

  it('formats 2550 cents as $25.50', async () => {
    await send24hReminder({ ...BASE_24H_PARAMS, appointment: { ...BASE_APPOINTMENT, price: 2550 } });
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('$25.50');
    expect(call.text).toContain('$25.50');
  });

  it('formats 0 cents as $0.00', async () => {
    await send24hReminder({ ...BASE_24H_PARAMS, appointment: { ...BASE_APPOINTMENT, price: 0 } });
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('$0.00');
    expect(call.text).toContain('$0.00');
  });

  it('formats 100 cents as $1.00 (not $0.1 or $1)', async () => {
    await send24hReminder({ ...BASE_24H_PARAMS, appointment: { ...BASE_APPOINTMENT, price: 100 } });
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('$1.00');
  });
});

// ─── Group 3: send24hReminder — optional fields ───────────────────────────────

describe('send24hReminder — petName optional field', () => {
  it('includes petName in subject when provided', async () => {
    const params = { ...BASE_24H_PARAMS, appointment: { ...BASE_APPOINTMENT, petName: 'Biscuit' } };
    await send24hReminder(params);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toContain('Biscuit');
  });

  it('includes petName in HTML body when provided', async () => {
    const params = { ...BASE_24H_PARAMS, appointment: { ...BASE_APPOINTMENT, petName: 'Biscuit' } };
    await send24hReminder(params);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('Biscuit');
    expect(call.text).toContain('Biscuit');
  });

  it('omits petName from subject when not provided', async () => {
    await send24hReminder(BASE_24H_PARAMS); // no petName
    const call = mockSend.mock.calls[0][0];
    // Subject should not contain "(undefined)" or "(null)"
    expect(call.subject).not.toContain('undefined');
    expect(call.subject).not.toContain('null');
    expect(call.subject).not.toContain('(');
  });

  it('subject with petName uses "(petName)" parenthetical format', async () => {
    const params = { ...BASE_24H_PARAMS, appointment: { ...BASE_APPOINTMENT, petName: 'Rex' } };
    await send24hReminder(params);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toContain('(Rex)');
  });
});

describe('send24hReminder — clientAddress optional field', () => {
  it('includes clientAddress in HTML and text when provided', async () => {
    const params = {
      ...BASE_24H_PARAMS,
      appointment: { ...BASE_APPOINTMENT, clientAddress: '123 Main St, Albuquerque NM' },
    };
    await send24hReminder(params);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('123 Main St, Albuquerque NM');
    expect(call.text).toContain('123 Main St, Albuquerque NM');
  });

  it('omits Location row from HTML when clientAddress is not provided', async () => {
    await send24hReminder(BASE_24H_PARAMS); // no clientAddress
    const call = mockSend.mock.calls[0][0];
    expect(call.html).not.toContain('Location:');
    expect(call.text).not.toContain('Location:');
  });
});

describe('send24hReminder — clientPhone optional field', () => {
  it('includes clientPhone in HTML and text when provided', async () => {
    const params = {
      ...BASE_24H_PARAMS,
      appointment: { ...BASE_APPOINTMENT, clientPhone: '505-555-0100' },
    };
    await send24hReminder(params);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('505-555-0100');
    expect(call.text).toContain('505-555-0100');
  });

  it('omits Phone row from HTML when clientPhone is not provided', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).not.toContain('Phone:');
    expect(call.text).not.toContain('Phone:');
  });
});

describe('send24hReminder — notes optional field', () => {
  it('includes notes in HTML and text when provided', async () => {
    const params = {
      ...BASE_24H_PARAMS,
      appointment: { ...BASE_APPOINTMENT, notes: 'Dog is nervous around other animals' },
    };
    await send24hReminder(params);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('Dog is nervous around other animals');
    expect(call.text).toContain('Dog is nervous around other animals');
  });

  it('omits Notes row when notes is not provided', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).not.toContain('Notes:');
    expect(call.text).not.toContain('Notes:');
  });
});

describe('send24hReminder — all optional fields present', () => {
  it('includes all optional fields when all are provided', async () => {
    const fullAppointment: AppointmentReminderDetails = {
      ...BASE_APPOINTMENT,
      petName: 'Biscuit',
      clientAddress: '456 Oak Ave',
      clientPhone: '505-555-9999',
      notes: 'Allergic to lavender shampoo',
    };
    await send24hReminder({ ...BASE_24H_PARAMS, appointment: fullAppointment });
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('Biscuit');
    expect(call.html).toContain('456 Oak Ave');
    expect(call.html).toContain('505-555-9999');
    expect(call.html).toContain('Allergic to lavender shampoo');
    expect(call.text).toContain('Biscuit');
    expect(call.text).toContain('456 Oak Ave');
    expect(call.text).toContain('505-555-9999');
    expect(call.text).toContain('Allergic to lavender shampoo');
  });
});

// ─── Group 4: send24hReminder — error propagation ────────────────────────────

describe('send24hReminder — error propagation (NOT fire-and-forget)', () => {
  it('THROWS when send rejects — errors propagate to caller', async () => {
    mockSend.mockRejectedValue(new Error('Mailgun network failure'));
    await expect(send24hReminder(BASE_24H_PARAMS)).rejects.toThrow('Mailgun network failure');
  });

  it('THROWS when credentials are missing (config error)', async () => {
    mockSend.mockRejectedValue(
      new Error('Email configuration missing: MAILGUN_API_KEY and MAILGUN_DOMAIN must be set')
    );
    await expect(send24hReminder(BASE_24H_PARAMS)).rejects.toThrow('Email configuration missing');
  });
});

// ─── Group 5: sendDayOfReminder — happy path ─────────────────────────────────

describe('sendDayOfReminder — happy path', () => {
  it('calls getResend().emails.send exactly once', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('sends to the groomerEmail address', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'groomer@example.com' })
    );
  });

  it('sends from FROM_EMAIL', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'GroomGrid <hello@email.mawsome.agency>' })
    );
  });

  it('subject starts with "Today:"', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toMatch(/^Today:/);
  });

  it('subject contains the service name', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toContain('Full Groom');
  });

  it('subject contains the client name', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toContain('Jane Smith');
  });

  it('includes client name in the HTML body', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('Jane Smith');
  });

  it('includes service name in the HTML body', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('Full Groom');
  });

  it('includes the schedule link with appUrl', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('https://app.getgroomgrid.com/schedule');
    expect(call.text).toContain('https://app.getgroomgrid.com/schedule');
  });

  it('includes both html and text in the send params', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toBeTruthy();
    expect(call.text).toBeTruthy();
  });

  it('HTML body is a complete document (has DOCTYPE)', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('<!DOCTYPE html>');
  });

  it('passes through the send result (not fire-and-forget)', async () => {
    const mockResult = { data: { id: 'msg.dayof.passthrough' }, error: null };
    mockSend.mockResolvedValueOnce(mockResult);
    const result = await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    expect(result).toEqual(mockResult);
  });

  it('plain text header says "Today\'s appointment reminder"', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.text).toContain("Today's appointment reminder");
  });
});

// ─── Group 6: sendDayOfReminder vs send24hReminder — subject differentiation ──

describe('send24hReminder vs sendDayOfReminder — subject prefix distinction', () => {
  it('send24hReminder subject starts with "Tomorrow:" not "Today:"', async () => {
    await send24hReminder(BASE_24H_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toMatch(/^Tomorrow:/);
    expect(call.subject).not.toMatch(/^Today:/);
  });

  it('sendDayOfReminder subject starts with "Today:" not "Tomorrow:"', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toMatch(/^Today:/);
    expect(call.subject).not.toMatch(/^Tomorrow:/);
  });
});

// ─── Group 7: sendDayOfReminder — price formatting ────────────────────────────

describe('sendDayOfReminder — price formatting (cents to dollars)', () => {
  it('formats 5000 cents as $50.00', async () => {
    await sendDayOfReminder({
      ...BASE_DAY_OF_PARAMS,
      appointment: { ...BASE_APPOINTMENT, price: 5000 },
    });
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('$50.00');
    expect(call.text).toContain('$50.00');
  });

  it('formats 999 cents as $9.99', async () => {
    await sendDayOfReminder({
      ...BASE_DAY_OF_PARAMS,
      appointment: { ...BASE_APPOINTMENT, price: 999 },
    });
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('$9.99');
  });
});

// ─── Group 8: sendDayOfReminder — optional fields ────────────────────────────

describe('sendDayOfReminder — optional fields', () => {
  it('includes petName in subject when provided', async () => {
    const params = {
      ...BASE_DAY_OF_PARAMS,
      appointment: { ...BASE_APPOINTMENT, petName: 'Luna' },
    };
    await sendDayOfReminder(params);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).toContain('Luna');
    expect(call.subject).toContain('(Luna)');
  });

  it('omits parenthetical from subject when petName is not provided', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.subject).not.toContain('undefined');
    expect(call.subject).not.toContain('null');
    expect(call.subject).not.toContain('(');
  });

  it('omits Location row when clientAddress is absent', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).not.toContain('Location:');
    expect(call.text).not.toContain('Location:');
  });

  it('includes Location row when clientAddress is present', async () => {
    const params = {
      ...BASE_DAY_OF_PARAMS,
      appointment: { ...BASE_APPOINTMENT, clientAddress: '789 Pine Rd' },
    };
    await sendDayOfReminder(params);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('789 Pine Rd');
    expect(call.text).toContain('789 Pine Rd');
  });

  it('omits Phone row when clientPhone is absent', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).not.toContain('Phone:');
    expect(call.text).not.toContain('Phone:');
  });

  it('includes Phone row when clientPhone is present', async () => {
    const params = {
      ...BASE_DAY_OF_PARAMS,
      appointment: { ...BASE_APPOINTMENT, clientPhone: '505-555-1234' },
    };
    await sendDayOfReminder(params);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('505-555-1234');
    expect(call.text).toContain('505-555-1234');
  });

  it('omits Notes row when notes are absent', async () => {
    await sendDayOfReminder(BASE_DAY_OF_PARAMS);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).not.toContain('Notes:');
    expect(call.text).not.toContain('Notes:');
  });

  it('includes Notes row when notes are present', async () => {
    const params = {
      ...BASE_DAY_OF_PARAMS,
      appointment: { ...BASE_APPOINTMENT, notes: 'Check for matting behind ears' },
    };
    await sendDayOfReminder(params);
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('Check for matting behind ears');
    expect(call.text).toContain('Check for matting behind ears');
  });
});

// ─── Group 9: sendDayOfReminder — error propagation ──────────────────────────

describe('sendDayOfReminder — error propagation (NOT fire-and-forget)', () => {
  it('THROWS when send rejects — errors propagate to caller', async () => {
    mockSend.mockRejectedValue(new Error('Mailgun timeout'));
    await expect(sendDayOfReminder(BASE_DAY_OF_PARAMS)).rejects.toThrow('Mailgun timeout');
  });

  it('THROWS when credentials are missing (config error)', async () => {
    mockSend.mockRejectedValue(
      new Error('Email configuration missing: MAILGUN_API_KEY and MAILGUN_DOMAIN must be set')
    );
    await expect(sendDayOfReminder(BASE_DAY_OF_PARAMS)).rejects.toThrow('Email configuration missing');
  });
});
