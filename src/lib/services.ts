/**
 * Centralized service definitions for GroomGrid.
 *
 * Single source of truth — all UI components and API routes import from here
 * instead of duplicating service data.
 */

export interface ServiceDefinition {
  name: string;
  baseDuration: number;  // minutes
  basePrice: number;     // cents
}

/**
 * Standard grooming services offered.
 * baseDuration is the default time for a medium-sized dog.
 * Actual duration varies by breed/size (see breed-intelligence.ts).
 */
export const SERVICES: ServiceDefinition[] = [
  { name: 'Full Groom',    baseDuration: 120, basePrice: 6500 },
  { name: 'Bath + Brush',  baseDuration: 60,  basePrice: 4000 },
  { name: 'Nail Trim',     baseDuration: 15,  basePrice: 2000 },
  { name: 'Teeth Brushing', baseDuration: 10,  basePrice: 1500 },
];

/** Lookup map for fast access by service name */
export const SERVICE_MAP: Record<string, ServiceDefinition> = Object.fromEntries(
  SERVICES.map(s => [s.name, s])
);

/** Format price in cents to display string ($XX) */
export function formatPrice(cents: number): string {
  return `$${Math.round(cents / 100)}`;
}

/** Format duration in minutes to display string */
export function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ${mins} min` : `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} min`;
}
