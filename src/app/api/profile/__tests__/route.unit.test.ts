/**
 * @jest-environment node
 *
 * Unit tests for PATCH /api/profile — planType field support
 */

// --- Mocks ---

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    profile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() =>
    Promise.resolve({ user: { id: 'user-123', email: 'test@example.com' } })
  ),
}));

jest.mock('@/lib/next-auth-options', () => ({
  authOptions: {},
}));

jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Headers()),
  cookies: jest.fn(() => ({ get: jest.fn(), getAll: jest.fn(() => []) })),
}));

// --- Imports ---

import { NextRequest } from 'next/server';
import { PATCH } from '@/app/api/profile/route';
import prisma from '@/lib/prisma';

const mockProfileUpdate = prisma.profile.update as jest.MockedFunction<typeof prisma.profile.update>;

function makeRequest(body: Record<string, unknown>): NextRequest {
  return { json: () => Promise.resolve(body) } as unknown as NextRequest;
}

describe('PATCH /api/profile — planType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileUpdate.mockResolvedValue({
      id: 'profile-1',
      userId: 'user-123',
      businessName: 'Test Business',
      planType: 'solo',
      subscriptionStatus: 'trial',
      trialEndsAt: new Date(),
      onboardingCompleted: false,
      onboardingStep: 0,
      welcomeShown: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
  });

  it('accepts valid planType "solo"', async () => {
    const req = makeRequest({ planType: 'solo' });
    const res = await PATCH(req);

    expect(res.status).toBe(200);
    expect(mockProfileUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ planType: 'solo' }),
      })
    );
  });

  it('accepts valid planType "salon"', async () => {
    const req = makeRequest({ planType: 'salon' });
    const res = await PATCH(req);

    expect(res.status).toBe(200);
    expect(mockProfileUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ planType: 'salon' }),
      })
    );
  });

  it('accepts valid planType "enterprise"', async () => {
    const req = makeRequest({ planType: 'enterprise' });
    const res = await PATCH(req);

    expect(res.status).toBe(200);
    expect(mockProfileUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ planType: 'enterprise' }),
      })
    );
  });

  it('rejects invalid planType', async () => {
    const req = makeRequest({ planType: 'premium' });
    const res = await PATCH(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Invalid plan type');
    expect(mockProfileUpdate).not.toHaveBeenCalled();
  });

  it('rejects empty string planType', async () => {
    const req = makeRequest({ planType: '' });
    const res = await PATCH(req);

    expect(res.status).toBe(400);
    expect(mockProfileUpdate).not.toHaveBeenCalled();
  });

  it('ignores planType when not provided', async () => {
    const req = makeRequest({ businessName: 'New Name' });
    const res = await PATCH(req);

    expect(res.status).toBe(200);
    // planType should NOT be in the data object
    const callData = (mockProfileUpdate as jest.Mock).mock.calls[0][0].data;
    expect(callData.planType).toBeUndefined();
    expect(callData.businessName).toBe('New Name');
  });
});
