require('@testing-library/jest-dom')

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123'
process.env.STRIPE_SECRET_KEY = 'sk_test_test123'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test123'
process.env.STRIPE_PRICE_SOLO = 'price_solo'
process.env.STRIPE_PRICE_SALON = 'price_salon'
process.env.STRIPE_PRICE_ENTERPRISE = 'price_enterprise'

// Mock window.matchMedia for reduced motion tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return [] }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
jest.mock('@/lib/ga4-server');
