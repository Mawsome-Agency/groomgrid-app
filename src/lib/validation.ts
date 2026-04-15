/**
 * Validates required environment variables for the application.
 *
 * This function ensures that critical environment variables are present
 * before attempting to use them, preventing runtime errors.
 */

// Updated validation utilities with module-specific checks and requireEnvVar helper

const requiredEnvVars: Record<string, string[]> = {
  stripe: [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_SOLO',
    'STRIPE_PRICE_SALON',
    'STRIPE_PRICE_ENTERPRISE',
  ],
  app: [
    'NEXT_PUBLIC_APP_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ],
  ga4: [
    'NEXT_PUBLIC_GA4_MEASUREMENT_ID',
    'GA4_API_SECRET',
  ],
};

/**
 * Validates that all required environment variables for the given module are present.
 * Throws a descriptive error if any are missing.
 */
export function ensureEnv(module: 'stripe' | 'app' | 'ga4' | 'all' = 'all'): void {
  const varsToCheck = module === 'all' ? Object.values(requiredEnvVars).flat() : requiredEnvVars[module] ?? [];
  const missing = varsToCheck.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. Please check your .env file.`
    );
  }
}

/**
 * Retrieves a specific environment variable, throwing if it is not set.
 */
export function requireEnvVar(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
  return value;
}
