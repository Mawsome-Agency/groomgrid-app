/**
 * Tests for payment-lockout.ts
 *
 * Testing strategy:
 * - Happy path: each function returns expected results
 * - Edge cases: not found, DB errors, status transitions
 * - Verify prisma call shapes (fields, where clauses)
 */

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    paymentLockout: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from '@/lib/prisma';
import {
  createPaymentLockout,
  updatePaymentLockoutStatus,
  getPaymentLockoutForUser,
  getPaymentLockoutByPaymentId,
  resetLockoutForTest,
  deletePaymentLockout,
  retryPaymentLockout,
  type LockoutStatus,
} from '../payment-lockout';

const mockCreate = prisma.paymentLockout.create as jest.MockedFunction<typeof prisma.paymentLockout.create>;
const mockUpdate = prisma.paymentLockout.update as jest.MockedFunction<typeof prisma.paymentLockout.update>;
const mockFindFirst = prisma.paymentLockout.findFirst as jest.MockedFunction<typeof prisma.paymentLockout.findFirst>;
const mockFindUnique = prisma.paymentLockout.findUnique as jest.MockedFunction<typeof prisma.paymentLockout.findUnique>;
const mockDelete = prisma.paymentLockout.delete as jest.MockedFunction<typeof prisma.paymentLockout.delete>;

const LOCKOUT_FIXTURE = {
  id: 'lock-1',
  userId: 'user-abc',
  paymentId: 'pi_test_123',
  sessionId: 'cs_test_abc',
  status: 'processing' as LockoutStatus,
  errorMessage: null,
  retryCount: 0,
  lastRetryAt: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

beforeEach(() => jest.clearAllMocks());

// ─────────────────────────────────────────────
// createPaymentLockout
// ─────────────────────────────────────────────
describe('createPaymentLockout', () => {
  it('returns the created lockout record', async () => {
    mockCreate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);

    const result = await createPaymentLockout('user-abc', 'pi_test_123', 'cs_test_abc');

    expect(result).toEqual(LOCKOUT_FIXTURE);
  });

  it('calls prisma.create with correct data shape', async () => {
    mockCreate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);

    await createPaymentLockout('user-abc', 'pi_test_123', 'cs_test_abc');

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        userId: 'user-abc',
        paymentId: 'pi_test_123',
        sessionId: 'cs_test_abc',
        status: 'processing',
      },
    });
  });

  it('propagates DB errors', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Unique constraint failed'));

    await expect(createPaymentLockout('user-abc', 'pi_dup', 'cs_dup')).rejects.toThrow('Unique constraint failed');
  });

  it('calls prisma.create exactly once per call', async () => {
    mockCreate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await createPaymentLockout('user-abc', 'pi_test_123', 'cs_test_abc');
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('sets status to "processing" on creation', async () => {
    mockCreate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await createPaymentLockout('user-abc', 'pi_test_123', 'cs_test_abc');
    const call = mockCreate.mock.calls[0][0] as any;
    expect(call.data.status).toBe('processing');
  });
});

// ─────────────────────────────────────────────
// updatePaymentLockoutStatus
// ─────────────────────────────────────────────
describe('updatePaymentLockoutStatus', () => {
  it('returns the updated lockout record', async () => {
    const updated = { ...LOCKOUT_FIXTURE, status: 'completed' as LockoutStatus, retryCount: 0 };
    mockUpdate.mockResolvedValueOnce(updated as any);

    const result = await updatePaymentLockoutStatus('lock-1', 'completed');
    expect(result.status).toBe('completed');
  });

  it('updates where id matches', async () => {
    mockUpdate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await updatePaymentLockoutStatus('lock-1', 'completed');
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'lock-1' } }));
  });

  it('resets retryCount to 0 when status is "completed"', async () => {
    mockUpdate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await updatePaymentLockoutStatus('lock-1', 'completed');
    const call = mockUpdate.mock.calls[0][0] as any;
    expect(call.data.retryCount).toBe(0);
  });

  it('resets retryCount to 0 when status is "failed"', async () => {
    mockUpdate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await updatePaymentLockoutStatus('lock-1', 'failed');
    const call = mockUpdate.mock.calls[0][0] as any;
    expect(call.data.retryCount).toBe(0);
  });

  it('increments retryCount when status is "processing"', async () => {
    mockUpdate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await updatePaymentLockoutStatus('lock-1', 'processing');
    const call = mockUpdate.mock.calls[0][0] as any;
    expect(call.data.retryCount).toEqual({ increment: 1 });
  });

  it('sets lastRetryAt when status is "processing"', async () => {
    mockUpdate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await updatePaymentLockoutStatus('lock-1', 'processing');
    const call = mockUpdate.mock.calls[0][0] as any;
    expect(call.data.lastRetryAt).toBeInstanceOf(Date);
  });

  it('does not set lastRetryAt when status is "completed"', async () => {
    mockUpdate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await updatePaymentLockoutStatus('lock-1', 'completed');
    const call = mockUpdate.mock.calls[0][0] as any;
    expect(call.data.lastRetryAt).toBeUndefined();
  });

  it('includes errorMessage when provided', async () => {
    mockUpdate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await updatePaymentLockoutStatus('lock-1', 'failed', 'Payment timed out');
    const call = mockUpdate.mock.calls[0][0] as any;
    expect(call.data.errorMessage).toBe('Payment timed out');
  });

  it('propagates DB errors', async () => {
    mockUpdate.mockRejectedValueOnce(new Error('Record not found'));
    await expect(updatePaymentLockoutStatus('nonexistent', 'completed')).rejects.toThrow('Record not found');
  });
});

// ─────────────────────────────────────────────
// getPaymentLockoutForUser
// ─────────────────────────────────────────────
describe('getPaymentLockoutForUser', () => {
  it('returns lockout when found', async () => {
    mockFindFirst.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    const result = await getPaymentLockoutForUser('user-abc');
    expect(result).toEqual(LOCKOUT_FIXTURE);
  });

  it('returns null when no lockout exists', async () => {
    mockFindFirst.mockResolvedValueOnce(null);
    const result = await getPaymentLockoutForUser('user-abc');
    expect(result).toBeNull();
  });

  it('queries by userId', async () => {
    mockFindFirst.mockResolvedValueOnce(null);
    await getPaymentLockoutForUser('user-xyz');
    expect(mockFindFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: 'user-xyz' },
    }));
  });

  it('orders by createdAt descending (most recent first)', async () => {
    mockFindFirst.mockResolvedValueOnce(null);
    await getPaymentLockoutForUser('user-abc');
    const call = mockFindFirst.mock.calls[0][0] as any;
    expect(call.orderBy).toEqual({ createdAt: 'desc' });
  });

  it('propagates DB errors', async () => {
    mockFindFirst.mockRejectedValueOnce(new Error('DB timeout'));
    await expect(getPaymentLockoutForUser('user-abc')).rejects.toThrow('DB timeout');
  });
});

// ─────────────────────────────────────────────
// getPaymentLockoutByPaymentId
// ─────────────────────────────────────────────
describe('getPaymentLockoutByPaymentId', () => {
  it('returns lockout when found', async () => {
    mockFindUnique.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    const result = await getPaymentLockoutByPaymentId('pi_test_123');
    expect(result).toEqual(LOCKOUT_FIXTURE);
  });

  it('returns null when not found', async () => {
    mockFindUnique.mockResolvedValueOnce(null);
    const result = await getPaymentLockoutByPaymentId('pi_nonexistent');
    expect(result).toBeNull();
  });

  it('queries by paymentId (via id field)', async () => {
    mockFindUnique.mockResolvedValueOnce(null);
    await getPaymentLockoutByPaymentId('pi_test_123');
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 'pi_test_123' } });
  });

  it('propagates DB errors', async () => {
    mockFindUnique.mockRejectedValueOnce(new Error('Connection refused'));
    await expect(getPaymentLockoutByPaymentId('pi_test_123')).rejects.toThrow('Connection refused');
  });
});

// ─────────────────────────────────────────────
// resetLockoutForTest / deletePaymentLockout
// ─────────────────────────────────────────────
describe('resetLockoutForTest', () => {
  it('calls delete with correct id', async () => {
    mockDelete.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await resetLockoutForTest('lock-1');
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: 'lock-1' } });
  });

  it('propagates DB errors', async () => {
    mockDelete.mockRejectedValueOnce(new Error('Record not found'));
    await expect(resetLockoutForTest('nonexistent')).rejects.toThrow('Record not found');
  });
});

describe('deletePaymentLockout', () => {
  it('calls delete with correct id', async () => {
    mockDelete.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await deletePaymentLockout('lock-1');
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: 'lock-1' } });
  });

  it('propagates DB errors', async () => {
    mockDelete.mockRejectedValueOnce(new Error('Record not found'));
    await expect(deletePaymentLockout('nonexistent')).rejects.toThrow('Record not found');
  });
});

// ─────────────────────────────────────────────
// retryPaymentLockout
// ─────────────────────────────────────────────
describe('retryPaymentLockout', () => {
  it('returns updated lockout on success', async () => {
    const found = { ...LOCKOUT_FIXTURE, retryCount: 1 };
    const updated = { ...found, retryCount: 2, status: 'processing' as LockoutStatus };
    mockFindUnique.mockResolvedValueOnce(found as any);
    mockUpdate.mockResolvedValueOnce(updated as any);

    const result = await retryPaymentLockout('lock-1');
    expect(result.retryCount).toBe(2);
    expect(result.status).toBe('processing');
  });

  it('throws when lockout is not found', async () => {
    mockFindUnique.mockResolvedValueOnce(null);
    await expect(retryPaymentLockout('nonexistent')).rejects.toThrow('Payment lockout not found');
  });

  it('increments retryCount and sets status to processing', async () => {
    mockFindUnique.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    mockUpdate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);

    await retryPaymentLockout('lock-1');
    const updateCall = mockUpdate.mock.calls[0][0] as any;
    expect(updateCall.data.retryCount).toEqual({ increment: 1 });
    expect(updateCall.data.status).toBe('processing');
  });

  it('sets lastRetryAt on retry', async () => {
    mockFindUnique.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    mockUpdate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);

    await retryPaymentLockout('lock-1');
    const updateCall = mockUpdate.mock.calls[0][0] as any;
    expect(updateCall.data.lastRetryAt).toBeInstanceOf(Date);
  });

  it('looks up lockout by id before updating', async () => {
    mockFindUnique.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    mockUpdate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);

    await retryPaymentLockout('lock-1');
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 'lock-1' } });
  });

  it('propagates update errors after successful find', async () => {
    mockFindUnique.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    mockUpdate.mockRejectedValueOnce(new Error('DB write failed'));

    await expect(retryPaymentLockout('lock-1')).rejects.toThrow('DB write failed');
  });
});

// ─────────────────────────────────────────────
// LockoutStatus type coverage
// ─────────────────────────────────────────────
describe('LockoutStatus values', () => {
  it('accepts "processing" as a valid status', async () => {
    mockCreate.mockResolvedValueOnce({ ...LOCKOUT_FIXTURE, status: 'processing' } as any);
    const result = await createPaymentLockout('user-abc', 'pi_1', 'cs_1');
    expect(result.status).toBe('processing');
  });

  it('accepts "completed" as a valid status update', async () => {
    mockUpdate.mockResolvedValueOnce({ ...LOCKOUT_FIXTURE, status: 'completed' } as any);
    const result = await updatePaymentLockoutStatus('lock-1', 'completed');
    expect(result.status).toBe('completed');
  });

  it('accepts "failed" as a valid status update', async () => {
    mockUpdate.mockResolvedValueOnce({ ...LOCKOUT_FIXTURE, status: 'failed' } as any);
    const result = await updatePaymentLockoutStatus('lock-1', 'failed');
    expect(result.status).toBe('failed');
  });

  it('createPaymentLockout always creates with "processing" status regardless of input', async () => {
    mockCreate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await createPaymentLockout('u', 'p', 's');
    const call = mockCreate.mock.calls[0][0] as any;
    expect(call.data.status).toBe('processing');
  });

  it('getPaymentLockoutForUser returns null for users with no history', async () => {
    mockFindFirst.mockResolvedValueOnce(null);
    const result = await getPaymentLockoutForUser('brand-new-user');
    expect(result).toBeNull();
  });

  it('updatePaymentLockoutStatus with errorMessage undefined passes undefined', async () => {
    mockUpdate.mockResolvedValueOnce(LOCKOUT_FIXTURE as any);
    await updatePaymentLockoutStatus('lock-1', 'completed', undefined);
    const call = mockUpdate.mock.calls[0][0] as any;
    expect(call.data.errorMessage).toBeUndefined();
  });
});
