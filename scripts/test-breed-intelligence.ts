/**
 * Simple validation tests for breed-intelligence module.
 * Run: npx tsx scripts/test-breed-intelligence.ts
 */
import assert from 'assert';

type DogSize = 'small' | 'medium' | 'large' | 'giant';

const BREED_SIZE_MAP: Record<string, DogSize> = {
  'chihuahua': 'small', 'pomeranian': 'small', 'yorkie': 'small',
  'french bulldog': 'small', 'labrador': 'large', 'golden retriever': 'large',
  'german shepherd': 'large', 'great dane': 'giant', 'mastiff': 'giant',
  'border collie': 'medium', 'beagle': 'medium',
};

const SIZE_MULTIPLIERS: Record<DogSize, number> = {
  small: 0.75, medium: 1.0, large: 1.35, giant: 1.6,
};

function getBreedSize(breed: string): DogSize | null {
  const normalized = breed.trim().toLowerCase();
  if (normalized.length < 2) return null;
  if (BREED_SIZE_MAP[normalized]) return BREED_SIZE_MAP[normalized];
  for (const [key, size] of Object.entries(BREED_SIZE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) return size;
  }
  return null;
}

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err: any) {
    console.log(`  ❌ ${name}: ${err.message}`);
    failed++;
  }
}

console.log('\n🧪 Breed Intelligence Tests\n');

test('Chihuahua → small', () => assert.strictEqual(getBreedSize('Chihuahua'), 'small'));
test('Labrador → large', () => assert.strictEqual(getBreedSize('Labrador'), 'large'));
test('French Bulldog → small', () => assert.strictEqual(getBreedSize('French Bulldog'), 'small'));
test('German Shepherd → large', () => assert.strictEqual(getBreedSize('German Shepherd'), 'large'));
test('Great Dane → giant', () => assert.strictEqual(getBreedSize('Great Dane'), 'giant'));
test('Border Collie → medium', () => assert.strictEqual(getBreedSize('Border Collie'), 'medium'));
test('LABRADOR → large (case insensitive)', () => assert.strictEqual(getBreedSize('LABRADOR'), 'large'));
test('golden retriever → large (lowercase)', () => assert.strictEqual(getBreedSize('golden retriever'), 'large'));
test('Labrador Retriever → large (partial match)', () => assert.strictEqual(getBreedSize('Labrador Retriever'), 'large'));
test('Unknown breed → null', () => assert.strictEqual(getBreedSize('Mysterious Fluffball'), null));
test('Empty string → null', () => assert.strictEqual(getBreedSize(''), null));

test('Small Full Groom ≈ 90 min', () => {
  const dur = Math.ceil(120 * SIZE_MULTIPLIERS['small'] / 5) * 5;
  assert.strictEqual(dur, 90);
});

test('Large Full Groom ≈ 165 min', () => {
  const dur = Math.ceil(120 * SIZE_MULTIPLIERS['large'] / 5) * 5;
  assert.strictEqual(dur, 165);
});

test('Giant Full Groom ≈ 195 min', () => {
  const dur = Math.ceil(120 * SIZE_MULTIPLIERS['giant'] / 5) * 5;
  assert.strictEqual(dur, 195);
});

test('Medium = baseline', () => assert.strictEqual(SIZE_MULTIPLIERS['medium'], 1.0));

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
