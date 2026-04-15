import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { isAdminUser } from '@/lib/load-testing/auth';
import { collectLoadTestMetrics } from '@/lib/load-testing/metrics';

// Mock the imported functions
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn()
}));

jest.mock('@/lib/load-testing/auth', () => ({
  isAdminUser: jest.fn()
}));

jest.mock('@/lib/load-testing/metrics', () => ({
  collectLoadTestMetrics: jest.fn()
}));

// Mock NextResponse
const mockNextResponse = {
  json: (data: any) => ({
    status: 200,
    json: () => Promise.resolve(data)
  })
};

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, options: any) => ({
      status: options?.status || 200,
      json: () => Promise.resolve(data)
    })
  }
}));

// Mock Request for testing
class MockRequest {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  get ip() {
    return '127.0.0.1';
  }
}

describe('Load Testing API Routes', () => {
  // Dynamically import the route handler to avoid Next.js environment issues
  let GET: (req: NextRequest) => Promise<any>;

  beforeAll(async () => {
    const routeModule = await import('../route');
    GET = routeModule.GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/load-testing', () => {
    it('should return 403 if user is not admin', async () => {
      (isAdminUser as jest.Mock).mockResolvedValue(false);

      const req = new MockRequest('http://localhost:3000/api/admin/load-testing') as unknown as NextRequest;
      const res = await GET(req);

      expect(res.status).toBe(403);
    });

    it('should return 429 if rate limit is exceeded', async () => {
      (isAdminUser as jest.Mock).mockResolvedValue(true);
      (checkRateLimit as jest.Mock).mockReturnValue({
        allowed: false,
        retryAfter: 30
      });

      const req = new MockRequest('http://localhost:3000/api/admin/load-testing') as unknown as NextRequest;
      const res = await GET(req);

      expect(res.status).toBe(429);
    });

    it('should return metrics if authorized and within rate limit', async () => {
      (isAdminUser as jest.Mock).mockResolvedValue(true);
      (checkRateLimit as jest.Mock).mockReturnValue({
        allowed: true,
        retryAfter: 0
      });
      (collectLoadTestMetrics as jest.Mock).mockResolvedValue({
        timestamp: new Date().toISOString(),
        database: {},
        stripe: {},
        system: {},
        metadata: {}
      });

      const req = new MockRequest('http://localhost:3000/api/admin/load-testing') as unknown as NextRequest;
      const res = await GET(req);

      expect(res.status).toBe(200);
    });

    it('should return 500 if metrics collection fails', async () => {
      (isAdminUser as jest.Mock).mockResolvedValue(true);
      (checkRateLimit as jest.Mock).mockReturnValue({
        allowed: true,
        retryAfter: 0
      });
      (collectLoadTestMetrics as jest.Mock).mockRejectedValue(new Error('Collection failed'));

      const req = new MockRequest('http://localhost:3000/api/admin/load-testing') as unknown as NextRequest;
      const res = await GET(req);

      expect(res.status).toBe(500);
    });
  });
});