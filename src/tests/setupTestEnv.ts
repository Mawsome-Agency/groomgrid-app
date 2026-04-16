// Test environment setup
// Seed a test user and ensure ENV for Stripe webhook bypass
import { prisma } from '@/lib/prisma';

beforeAll(async () => {
  // Create a test user if not exists
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: { email: 'test@example.com', passwordHash: 'hashed', timezone: 'UTC' },
  });
  // Ensure webhook bypass env
  process.env.ENABLE_TEST_WEBHOOK_BYPASS = 'true';
});

afterAll(async () => {
  // Cleanup test user
  await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
});
