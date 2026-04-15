/**
 * Tests for SpyFu SEO keyword research functions
 *
 * Testing strategy:
 * - Pure utility functions (no network calls): isValidDomain, isValidKeyword,
 *   normalizeDomain, calculateOpportunityScore, identifyQuickWins, analyzeContentGaps
 * - Error class construction
 * - Gap analysis edge cases
 */

import {
  isValidDomain,
  isValidKeyword,
  normalizeDomain,
  calculateOpportunityScore,
  identifyQuickWins,
  analyzeContentGaps,
  SpyFuError,
  KeywordData,
  GapAnalysisOptions,
} from '../seo/spyfu';

// ─── SpyFuError ───────────────────────────────────────────────────────────────

describe('SpyFuError', () => {
  it('constructs with message only', () => {
    const err = new SpyFuError('something went wrong');
    expect(err.message).toBe('something went wrong');
    expect(err.name).toBe('SpyFuError');
    expect(err.statusCode).toBeUndefined();
    expect(err.retryable).toBe(false);
  });

  it('constructs with statusCode and retryable', () => {
    const err = new SpyFuError('rate limited', 429, true);
    expect(err.statusCode).toBe(429);
    expect(err.retryable).toBe(true);
  });

  it('is an instance of Error', () => {
    expect(new SpyFuError('x')).toBeInstanceOf(Error);
  });
});

// ─── isValidDomain ────────────────────────────────────────────────────────────

describe('isValidDomain', () => {
  it('accepts a simple domain', () => {
    expect(isValidDomain('example.com')).toBe(true);
  });

  it('accepts a domain with subdomain prefix stripped', () => {
    expect(isValidDomain('www.example.com')).toBe(true);
  });

  it('accepts https:// prefixed domain', () => {
    expect(isValidDomain('https://example.com')).toBe(true);
  });

  it('accepts http:// prefixed domain', () => {
    expect(isValidDomain('http://example.com')).toBe(true);
  });

  it('accepts multi-part TLD domain', () => {
    expect(isValidDomain('moego.pet')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidDomain('')).toBe(false);
  });

  it('rejects non-string input', () => {
    expect(isValidDomain(null as any)).toBe(false);
  });

  it('rejects a bare word with no TLD', () => {
    expect(isValidDomain('localhost')).toBe(false);
  });
});

// ─── isValidKeyword ───────────────────────────────────────────────────────────

describe('isValidKeyword', () => {
  it('accepts a typical keyword', () => {
    expect(isValidKeyword('dog grooming near me')).toBe(true);
  });

  it('accepts a two-character keyword', () => {
    expect(isValidKeyword('ab')).toBe(true);
  });

  it('rejects a single character', () => {
    expect(isValidKeyword('a')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidKeyword('')).toBe(false);
  });

  it('rejects keyword over 100 characters', () => {
    expect(isValidKeyword('a'.repeat(101))).toBe(false);
  });

  it('rejects whitespace only', () => {
    expect(isValidKeyword('   ')).toBe(false);
  });
});

// ─── normalizeDomain ──────────────────────────────────────────────────────────

describe('normalizeDomain', () => {
  it('lowercases the domain', () => {
    expect(normalizeDomain('EXAMPLE.COM')).toBe('example.com');
  });

  it('strips https:// prefix', () => {
    expect(normalizeDomain('https://example.com')).toBe('example.com');
  });

  it('strips www. prefix', () => {
    expect(normalizeDomain('www.example.com')).toBe('example.com');
  });

  it('strips trailing slash', () => {
    expect(normalizeDomain('example.com/')).toBe('example.com');
  });

  it('handles full URL with protocol and www', () => {
    expect(normalizeDomain('https://www.example.com/')).toBe('example.com');
  });
});

// ─── calculateOpportunityScore ────────────────────────────────────────────────

describe('calculateOpportunityScore', () => {
  const makeKeyword = (searchVolume: number, difficulty: number): KeywordData => ({
    keyword: 'test keyword',
    searchVolume,
    cpc: 1.0,
    difficulty,
    position: 5,
  });

  it('returns a number between 0 and 100', () => {
    const score = calculateOpportunityScore(makeKeyword(1000, 30));
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('scores zero-volume keyword lower than high-volume', () => {
    const low = calculateOpportunityScore(makeKeyword(0, 30));
    const high = calculateOpportunityScore(makeKeyword(10000, 30));
    expect(high).toBeGreaterThan(low);
  });

  it('scores high-difficulty keyword lower than low-difficulty at same volume', () => {
    const hard = calculateOpportunityScore(makeKeyword(1000, 90));
    const easy = calculateOpportunityScore(makeKeyword(1000, 10));
    expect(easy).toBeGreaterThan(hard);
  });

  it('returns an integer', () => {
    const score = calculateOpportunityScore(makeKeyword(5000, 45));
    expect(Number.isInteger(score)).toBe(true);
  });
});

// ─── identifyQuickWins ────────────────────────────────────────────────────────

const sampleKeywords: KeywordData[] = [
  { keyword: 'dog grooming tips', searchVolume: 2000, cpc: 1.5, difficulty: 25, position: 8 },
  { keyword: 'dog grooming near me', searchVolume: 8000, cpc: 3.0, difficulty: 60, position: 3 },
  { keyword: 'cat grooming', searchVolume: 300, cpc: 0.8, difficulty: 20, position: 12 },
  { keyword: 'pet grooming prices', searchVolume: 1500, cpc: 2.5, difficulty: 35, position: 6 },
  { keyword: 'best dog groomer', searchVolume: 5000, cpc: 4.0, difficulty: 75, position: 2 },
];

describe('identifyQuickWins', () => {
  it('filters out high-difficulty keywords', () => {
    const wins = identifyQuickWins(sampleKeywords, { maxDifficulty: 40 });
    wins.forEach((k) => expect(k.difficulty).toBeLessThanOrEqual(40));
  });

  it('filters out low-volume keywords', () => {
    const wins = identifyQuickWins(sampleKeywords, { minVolume: 500 });
    wins.forEach((k) => expect(k.searchVolume).toBeGreaterThanOrEqual(500));
  });

  it('respects the limit parameter', () => {
    const wins = identifyQuickWins(sampleKeywords, { limit: 1 });
    expect(wins).toHaveLength(1);
  });

  it('returns keywords sorted by opportunity score descending', () => {
    const wins = identifyQuickWins(sampleKeywords, { maxDifficulty: 100, minVolume: 0 });
    for (let i = 1; i < wins.length; i++) {
      expect((wins[i - 1] as any).opportunityScore).toBeGreaterThanOrEqual(
        (wins[i] as any).opportunityScore
      );
    }
  });

  it('returns empty array when no keywords match', () => {
    const wins = identifyQuickWins(sampleKeywords, { maxDifficulty: 5 });
    expect(wins).toHaveLength(0);
  });
});

// ─── analyzeContentGaps ───────────────────────────────────────────────────────

const ourKeywords: KeywordData[] = [
  { keyword: 'dog grooming tips', searchVolume: 2000, cpc: 1.5, difficulty: 25, position: 4 },
  { keyword: 'pet grooming prices', searchVolume: 1500, cpc: 2.5, difficulty: 35, position: 6 },
];

const competitorKeywords: KeywordData[] = [
  { keyword: 'dog grooming tips', searchVolume: 2000, cpc: 1.5, difficulty: 25, position: 3 },
  { keyword: 'mobile dog grooming', searchVolume: 3000, cpc: 2.0, difficulty: 30, position: 5 },
  { keyword: 'dog spa near me', searchVolume: 4000, cpc: 3.5, difficulty: 40, position: 2 },
  { keyword: 'how to groom', searchVolume: 50, cpc: 0.5, difficulty: 15, position: 7 }, // low volume
  { keyword: 'groomingspecialists', searchVolume: 500, cpc: 1.0, difficulty: 20, position: 15 }, // position > 10
];

describe('analyzeContentGaps', () => {
  it('excludes keywords we already rank for', async () => {
    const result = await analyzeContentGaps(ourKeywords, competitorKeywords, {
      minVolume: 100,
      maxPosition: 10,
      excludeBranded: false,
    });
    const gapKeywords = result.gaps.map((g) => g.keyword);
    expect(gapKeywords).not.toContain('dog grooming tips');
  });

  it('excludes competitor keywords with position > maxPosition', async () => {
    const result = await analyzeContentGaps(ourKeywords, competitorKeywords, {
      minVolume: 0,
      maxPosition: 10,
      excludeBranded: false,
    });
    // 'groomingspecialists' has position 15 - should be excluded
    const gapKeywords = result.gaps.map((g) => g.keyword);
    expect(gapKeywords).not.toContain('groomingspecialists');
  });

  it('excludes keywords below minVolume', async () => {
    const result = await analyzeContentGaps(ourKeywords, competitorKeywords, {
      minVolume: 100,
      maxPosition: 10,
      excludeBranded: false,
    });
    result.gaps.forEach((g) => expect(g.searchVolume).toBeGreaterThanOrEqual(100));
  });

  it('returns correct metadata', async () => {
    const result = await analyzeContentGaps(ourKeywords, competitorKeywords, {
      minVolume: 100,
      maxPosition: 10,
      excludeBranded: false,
    });
    expect(result.metadata.ourKeywords).toBe(ourKeywords.length);
    expect(result.metadata.totalCompetitorKeywords).toBe(competitorKeywords.length);
    expect(result.metadata.gapsFound).toBe(result.gaps.length);
  });

  it('handles empty competitor keywords gracefully', async () => {
    const result = await analyzeContentGaps(ourKeywords, [], {});
    expect(result.gaps).toHaveLength(0);
    expect(result.metadata.gapsFound).toBe(0);
  });

  it('handles empty our keywords (all competitor keywords are gaps)', async () => {
    const result = await analyzeContentGaps([], competitorKeywords, {
      minVolume: 0,
      maxPosition: 20,
      excludeBranded: false,
    });
    // All competitor keywords within position range should be gaps
    expect(result.gaps.length).toBeGreaterThan(0);
  });

  it('sorts gaps by opportunity score descending', async () => {
    const result = await analyzeContentGaps(ourKeywords, competitorKeywords, {
      minVolume: 0,
      maxPosition: 10,
      excludeBranded: false,
    });
    for (let i = 1; i < result.gaps.length; i++) {
      expect((result.gaps[i - 1] as any).opportunityScore).toBeGreaterThanOrEqual(
        (result.gaps[i] as any).opportunityScore
      );
    }
  });
});

// ─── utils.ts re-exports ──────────────────────────────────────────────────────

describe('utils.ts re-exports', () => {
  it('calculateOpportunityScore re-export matches spyfu implementation', async () => {
    const { calculateOpportunityScore: utilScore } = await import('../seo/utils');
    const kw: KeywordData = { keyword: 'test', searchVolume: 1000, cpc: 1, difficulty: 30, position: 5 };
    expect(utilScore(kw)).toBe(calculateOpportunityScore(kw));
  });
});
