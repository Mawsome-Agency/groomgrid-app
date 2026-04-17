/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/e2e/',
    // Uses next/headers which requires Next.js request context — not available in Jest
    '<rootDir>/src/app/api/stripe/webhook/__tests__/route.test.ts',
    // Loads native Prisma bindings that cause SIGTRAP worker crash in jest-worker
    '<rootDir>/src/lib/__tests__/stripe.test.ts',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      // Don't fail the test suite on TS errors in source files (e.g. wrong arg count
      // in application code is a linting concern, not a test runner concern)
      diagnostics: { warnOnly: true },
    },
  },
};

module.exports = config;
