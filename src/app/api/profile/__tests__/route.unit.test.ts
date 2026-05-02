/**
 * @jest-environment node
 *
 * Unit tests for /api/profile — response format and planType field support
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
import { GET, PATCH } from '@/app/api/profile/route';
import prisma from '@/lib/prisma';

const mockProfileFindUnique = prisma.profile.findUnique as jest.MockedFunction<typeof prisma.profile.findUnique>;
const mockProfileUpdate = prisma.profile.update as jest.MockedFunction<typeof prisma.profile.update>;

const mockProfile = {
  id: 'profile-1',
  userId: 'user-123',
  businessName: 'Test Business',
  phone: null,
  planType: 'solo',
  subscriptionStatus: 'trial',
  trialEndsAt: new Date(),
  onboardingCompleted: false,
  onboardingStep: 0,
  welcomeShown: false,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  attributionData: null,
  emailUnsubscribed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeRequest(body: Record<string, unknown>): NextRequest {
  return { json: () => Promise.resolve(body) } as unknown as NextRequest;
}

describe('GET /api/profile — response format', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileFindUnique.mockResolvedValue(mockProfile as any);
  });

  it('wraps profile in { profile } object', async () => {
    const req = new NextRequest(new URL('/api/profile', 'http://localhost'));
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveProperty('profile');
    expect(body.profile).toMatchObject({
      id: 'profile-1',
      userId: 'user-123',
      businessName: 'Test Business',
      planType: 'solo',
      subscriptionStatus: 'trial',
      onboardingCompleted: false,
      onboardingStep: 0,
    });
  });

  it('returns profile with null value when not found', async () => {
    mockProfileFindUnique.mockResolvedValue(null);

    const req = new NextRequest(new URL('/api/profile', 'http://localhost'));
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ profile: null });
  });

  it('returns 401 with error and errorType when unauthorized', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValueOnce(null);

    const req = new NextRequest(new URL('/api/profile', 'http://localhost'));
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body).toEqual({ error: 'Unauthorized', errorType: 'generic' });
  });
});

describe('PATCH /api/profile — planType and response format', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileUpdate.mockResolvedValue(mockProfile as any);
  });

  it('wraps updated profile in { profile } object', async () => {
    const req = makeRequest({ businessName: 'New Name' });
    const res = await PATCH(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveProperty('profile');
    expect(body.profile).toMatchObject({
      id: 'profile-1',
      businessName: 'Test Business',
    });
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

  it('returns 401 with error and errorType when unauthorized', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValueOnce(null);

    const req = makeRequest({ businessName: 'New Name' });
    const res = await PATCH(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body).toEqual({ error: 'Unauthorized', errorType: 'generic' });
    expect(mockProfileUpdate).not.toHaveBeenCalled();
  });

  it('returns 500 with error and errorType on update failure', async () => {
    mockProfileUpdate.mockRejectedValueOnce(new Error('DB connection lost'));

    const req = makeRequest({ businessName: 'New Name' });
    const res = await PATCH(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ error: 'Failed to update profile', errorType: 'generic' });
  });
});
