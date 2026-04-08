/**
 * Breed Intelligence Service for GroomGrid.
 *
 * Estimates grooming time based on dog breed and size.
 * Uses breed → size mapping and size-based duration multipliers
 * to adjust the base service time.
 *
 * Graceful fallback: unknown breeds use the pet's explicitly-set size,
 * or default to base duration if neither is available.
 */

import { SERVICE_MAP, type ServiceDefinition } from './services';

// ─── Types ──────────────────────────────────────────────────────────────────

export type DogSize = 'small' | 'medium' | 'large' | 'giant';

export interface GroomingEstimate {
  duration: number;        // estimated minutes
  baseDuration: number;    // unadjusted base
  size: DogSize | null;    // resolved size (null if unknown)
  adjusted: boolean;       // whether breed/size adjusted the duration
}

// ─── Breed → Size Mapping ───────────────────────────────────────────────────
//
// Covers the most popular dog breeds in the US.
// Breeds not listed here can still get estimates if their size is set on the Pet record.

const BREED_SIZE_MAP: Record<string, DogSize> = {
  // Small breeds (< 25 lbs)
  'chihuahua': 'small',
  'pomeranian': 'small',
  'yorkie': 'small',
  'yorkshire terrier': 'small',
  'maltese': 'small',
  'shihtzu': 'small',
  'shih tzu': 'small',
  'pug': 'small',
  'french bulldog': 'small',
  'frenchie': 'small',
  'boston terrier': 'small',
  'dachshund': 'small',
  'miniature poodle': 'small',
  'mini poodle': 'small',
  'toy poodle': 'small',
  'bichon frise': 'small',
  'papillon': 'small',
  'pekingese': 'small',
  'west highland terrier': 'small',
  'westie': 'small',
  'cavalier king charles': 'small',
  'cavalier': 'small',
  'havanese': 'small',
  'cocker spaniel': 'small',
  'pembroke welsh corgi': 'small',
  'corgi': 'small',
  'jack russell': 'small',
  'rat terrier': 'small',
  'italian greyhound': 'small',
  'min pin': 'small',
  'miniature pinscher': 'small',
  'lhasa apso': 'small',
  'scottish terrier': 'small',
  'scottie': 'small',
  'border terrier': 'small',
  'norfolk terrier': 'small',
  'silky terrier': 'small',
  'affenpinscher': 'small',

  // Medium breeds (25–50 lbs)
  'border collie': 'medium',
  'australian shepherd': 'medium',
  'aussie': 'medium',
  'beagle': 'medium',
  'brittany': 'medium',
  'english springer spaniel': 'medium',
  'springer spaniel': 'medium',
  'whippet': 'medium',
  'basenji': 'medium',
  'standard schnauzer': 'medium',
  'schnauzer': 'medium',
  'bulldog': 'medium',
  'english bulldog': 'medium',
  'american eskimo': 'medium',
  'samoyed': 'medium',
  'keeshond': 'medium',
  'finnish spitz': 'medium',
  'blue heeler': 'medium',
  'australian cattle dog': 'medium',
  'shiba inu': 'medium',
  'chow chow': 'medium',
  'dalmatian': 'medium',
  'setter': 'medium',
  'english setter': 'medium',
  'irish setter': 'medium',

  // Large breeds (50–90 lbs)
  'labrador': 'large',
  'labrador retriever': 'large',
  'golden retriever': 'large',
  'german shepherd': 'large',
  'husky': 'large',
  'siberian husky': 'large',
  'boxer': 'large',
  'rottweiler': 'large',
  'doberman': 'large',
  'doberman pinscher': 'large',
  'standard poodle': 'large',
  'weimaraner': 'large',
  'vizsla': 'large',
  'german shorthaired pointer': 'large',
  'pointer': 'large',
  'alaskan malamute': 'large',
  'malamute': 'large',
  'bernese mountain dog': 'large',
  'collie': 'large',
  'rough collie': 'large',
  'great pyrenees': 'large',
  'akita': 'large',
  'old english sheepdog': 'large',
  'bouvier': 'large',
  'bouvier des flandres': 'large',
  'rhodesian ridgeback': 'large',
  'ridgeback': 'large',
  'bloodhound': 'large',
  'coonhound': 'large',
  'giant schnauzer': 'large',

  // Giant breeds (90+ lbs)
  'great dane': 'giant',
  'mastiff': 'giant',
  'english mastiff': 'giant',
  'bullmastiff': 'giant',
  'st. bernard': 'giant',
  'saint bernard': 'giant',
  'newfoundland': 'giant',
  'newfie': 'giant',
  'irish wolfhound': 'giant',
  'scottish deerhound': 'giant',
  'dogue de bordeaux': 'giant',
  'leonberger': 'giant',
  'anatolian shepherd': 'giant',
  'tibetan mastiff': 'giant',
};

// ─── Duration Multipliers by Size ───────────────────────────────────────────
//
// How much longer each service takes compared to a medium-sized dog (baseline).
// Small dogs are faster; large/giant dogs take more time for coat work.

const SIZE_MULTIPLIERS: Record<DogSize, Record<string, number>> = {
  small: {
    'Full Groom': 0.75,     // 90 min instead of 120
    'Bath + Brush': 0.8,    // 48 min instead of 60
    'Nail Trim': 0.85,      // ~13 min instead of 15
    'Teeth Brushing': 1.0,  // size doesn't affect this
  },
  medium: {
    'Full Groom': 1.0,
    'Bath + Brush': 1.0,
    'Nail Trim': 1.0,
    'Teeth Brushing': 1.0,
  },
  large: {
    'Full Groom': 1.35,     // 162 min instead of 120
    'Bath + Brush': 1.25,   // 75 min instead of 60
    'Nail Trim': 1.15,      // ~17 min instead of 15
    'Teeth Brushing': 1.0,
  },
  giant: {
    'Full Groom': 1.6,      // 192 min instead of 120
    'Bath + Brush': 1.5,    // 90 min instead of 60
    'Nail Trim': 1.3,       // ~20 min instead of 15
    'Teeth Brushing': 1.0,
  },
};

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Look up size category from a breed name.
 * Handles case-insensitive matching and common breed aliases.
 */
export function getBreedSize(breed: string): DogSize | null {
  const normalized = breed.trim().toLowerCase();

  // Guard: empty or too-short strings can't meaningfully match
  if (normalized.length < 2) {
    return null;
  }

  // Direct lookup
  if (BREED_SIZE_MAP[normalized]) {
    return BREED_SIZE_MAP[normalized];
  }

  // Partial match (e.g., "Labrador" matches "labrador retriever")
  for (const [key, size] of Object.entries(BREED_SIZE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return size;
    }
  }

  return null;
}

/**
 * Validate that a string is a known dog size.
 */
export function isValidSize(size: string): size is DogSize {
  return ['small', 'medium', 'large', 'giant'].includes(size);
}

/**
 * Estimate grooming time for a service given optional breed and size info.
 *
 * Resolution order:
 * 1. If breed provided → look up size from breed map
 * 2. If size provided directly (and breed didn't resolve) → use it
 * 3. If neither → use base duration (no adjustment)
 */
export function estimateGroomingTime(
  serviceName: string,
  breed?: string | null,
  explicitSize?: string | null,
): GroomingEstimate {
  const service = SERVICE_MAP[serviceName];

  if (!service) {
    // Unknown service — return a reasonable default
    return {
      duration: 60,
      baseDuration: 60,
      size: null,
      adjusted: false,
    };
  }

  // Resolve size: breed lookup first, then explicit size, then null
  let resolvedSize: DogSize | null = null;

  if (breed) {
    resolvedSize = getBreedSize(breed);
  }

  if (!resolvedSize && explicitSize && isValidSize(explicitSize)) {
    resolvedSize = explicitSize;
  }

  if (!resolvedSize) {
    return {
      duration: service.baseDuration,
      baseDuration: service.baseDuration,
      size: null,
      adjusted: false,
    };
  }

  // Apply size multiplier
  const multiplier = SIZE_MULTIPLIERS[resolvedSize][serviceName] ?? 1.0;

  // Round to nearest 5 minutes for cleaner scheduling
  const adjustedDuration = Math.ceil(service.baseDuration * multiplier / 5) * 5;

  return {
    duration: adjustedDuration,
    baseDuration: service.baseDuration,
    size: resolvedSize,
    adjusted: adjustedDuration !== service.baseDuration,
  };
}
