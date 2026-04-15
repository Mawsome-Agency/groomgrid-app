/**
 * SpyFu API Client for SEO Keyword Research
 *
 * Provides functions to fetch competitor keywords, analyze gaps,
 * generate question keywords, and identify quick-win opportunities.
 */

import https from 'https';

const SPYFU_API_BASE = 'api.spyfu.com';
const DEFAULT_TIMEOUT = 15000; // 15 seconds
const DEFAULT_MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second

// Rate limit tracking
let lastRateLimitStatus: SpyFuRateLimit | null = null;

export interface SpyFuRateLimit {
  remaining: number;
  resetAt: number;
  limit: number;
}

export interface KeywordData {
  keyword: string;
  searchVolume: number;
  cpc: number;
  difficulty: number;
  position: number;
  url?: string;
  clicks?: number;
}

export interface GapAnalysisOptions {
  minVolume?: number;
  maxPosition?: number;
  minPosition?: number;
  excludeBranded?: boolean;
}

export interface GapAnalysisResult {
  gaps: KeywordData[];
  metadata: {
    totalCompetitorKeywords: number;
    ourKeywords: number;
    gapsFound: number;
    competitorsAnalyzed: number;
    avgCompetitorPosition: number;
  };
}

/**
 * Custom error class for SpyFu API errors
 */
export class SpyFuError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'SpyFuError';
  }
}

/**
 * Get the last known rate limit status from SpyFu API
 */
export function getLastRateLimitStatus(): SpyFuRateLimit | null {
  return lastRateLimitStatus;
}

/**
 * Validate a domain string
 */
export function isValidDomain(domain: string): boolean {
  if (!domain || typeof domain !== 'string') return false;
  // Remove protocol and www
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/i, '').trim();
  // Basic domain validation - at least one dot and valid characters
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  return domainRegex.test(cleanDomain);
}

/**
 * Validate a keyword string
 */
export function isValidKeyword(keyword: string): boolean {
  if (!keyword || typeof keyword !== 'string') return false;
  const trimmed = keyword.trim();
  // Must be 2-100 characters, not just whitespace
  return trimmed.length >= 2 && trimmed.length <= 100;
}

/**
 * Clean and normalize domain for API calls
 */
export function normalizeDomain(domain: string): string {
  return domain
    .replace(/^(https?:\/\/)?(www\.)?/i, '')
    .replace(/\/+$/, '')
    .trim()
    .toLowerCase();
}

/**
 * Make a request to the SpyFu API with timeout and error handling
 */
function makeSpyFuRequest(
  endpoint: string,
  params: Record<string, string>
): Promise<any> {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.SPYFU_API_SECRET;
    if (!apiKey) {
      reject(new SpyFuError('SPYFU_API_SECRET not configured', 500, false));
      return;
    }

    const queryParams = new URLSearchParams({
      ...params,
      api_key: apiKey,
    });

    const url = `https://${SPYFU_API_BASE}${endpoint}?${queryParams.toString()}`;

    const req = https.get(
      url,
      {
        timeout: DEFAULT_TIMEOUT,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'GroomGrid/1.0',
        },
      },
      (res) => {
        // Track rate limit if headers present
        const remaining = res.headers['x-ratelimit-remaining'];
        const resetAt = res.headers['x-ratelimit-reset'];
        const limit = res.headers['x-ratelimit-limit'];

        if (remaining || resetAt || limit) {
          lastRateLimitStatus = {
            remaining: remaining ? parseInt(remaining as string, 10) : 100,
            resetAt: resetAt ? parseInt(resetAt as string, 10) * 1000 : Date.now() + 3600000,
            limit: limit ? parseInt(limit as string, 10) : 100,
          };
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode && res.statusCode >= 400) {
              const errorMessage = res.statusCode === 429
                ? 'SpyFu API rate limit exceeded'
                : `SpyFu API error: ${res.statusCode}`;
              reject(
                new SpyFuError(
                  errorMessage,
                  res.statusCode,
                  res.statusCode === 429 || res.statusCode >= 500
                )
              );
              return;
            }

            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            reject(new SpyFuError('Failed to parse SpyFu API response', 500, true));
          }
        });
      }
    );

    req.on('error', (error) => {
      reject(new SpyFuError(`Network error: ${error.message}`, 500, true));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new SpyFuError('SpyFu API request timed out', 504, true));
    });
  });
}

/**
 * Call SpyFu API with retry logic for resilience
 */
export async function callSpyFuApiWithRetry(
  endpoint: string,
  params: Record<string, string>,
  maxRetries: number = DEFAULT_MAX_RETRIES
): Promise<any> {
  let lastError: SpyFuError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await makeSpyFuRequest(endpoint, params);
    } catch (error) {
      if (error instanceof SpyFuError) {
        lastError = error;

        // Don't retry non-retryable errors or client errors (4xx except 429)
        if (!error.retryable || (error.statusCode && error.statusCode < 500 && error.statusCode !== 429)) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = RETRY_DELAY_BASE * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw lastError || new SpyFuError('Max retries exceeded', 500, false);
}

/**
 * Fetch organic keywords for a competitor domain
 */
export async function fetchCompetitorKeywords(
  competitorDomain: string,
  options: { minVolume?: number; pageSize?: number } = {}
): Promise<KeywordData[]> {
  const domain = normalizeDomain(competitorDomain);

  if (!isValidDomain(domain)) {
    throw new SpyFuError(`Invalid domain: ${competitorDomain}`, 400, false);
  }

  const params: Record<string, string> = {
    query: domain,
    startingRow: '1',
    pageSize: String(options.pageSize || 100),
    countryCode: 'US',
  };

  const response = await callSpyFuApiWithRetry(
    '/apis/serp_api/v2/seo/getSeoKeywords',
    params
  );

  if (!response || !Array.isArray(response)) {
    return [];
  }

  const minVolume = options.minVolume || 0;

  return response
    .map((item: any) => ({
      keyword: item.keyword || '',
      searchVolume: item.monthlyClicks || item.searchVolume || 0,
      cpc: item.costPerClick || 0,
      difficulty: item.organicDifficulty || item.difficulty || 0,
      position: item.position || item.rankingPosition || 0,
      url: item.url || item.rankingUrl || '',
      clicks: item.monthlyClicks || 0,
    }))
    .filter((k: KeywordData) => k.keyword && k.searchVolume >= minVolume);
}

/**
 * Fetch question keywords based on a seed keyword
 */
export async function fetchQuestionKeywords(
  seedKeyword: string,
  options: { pageSize?: number } = {}
): Promise<KeywordData[]> {
  const keyword = seedKeyword.trim();

  if (!isValidKeyword(keyword)) {
    throw new SpyFuError(`Invalid keyword: ${seedKeyword}`, 400, false);
  }

  const params: Record<string, string> = {
    query: keyword,
    pageSize: String(options.pageSize || 50),
  };

  const response = await callSpyFuApiWithRetry(
    '/apis/keyword_api/v2/related/getQuestionKeywords',
    params
  );

  if (!response || !Array.isArray(response)) {
    return [];
  }

  return response.map((item: any) => ({
    keyword: item.keyword || '',
    searchVolume: item.searchVolume || item.monthlyClicks || 0,
    cpc: item.costPerClick || 0,
    difficulty: item.organicDifficulty || item.difficulty || 0,
    position: 0, // Question keywords don't have position data
    url: '',
    clicks: item.monthlyClicks || 0,
  }));
}

/**
 * Fetch related keywords for a seed term
 */
export async function fetchRelatedKeywords(
  seedKeyword: string,
  options: { pageSize?: number } = {}
): Promise<KeywordData[]> {
  const keyword = seedKeyword.trim();

  if (!isValidKeyword(keyword)) {
    throw new SpyFuError(`Invalid keyword: ${seedKeyword}`, 400, false);
  }

  const params: Record<string, string> = {
    query: keyword,
    pageSize: String(options.pageSize || 100),
  };

  const response = await callSpyFuApiWithRetry(
    '/apis/keyword_api/v2/related/getRelatedKeywords',
    params
  );

  if (!response || !Array.isArray(response)) {
    return [];
  }

  return response.map((item: any) => ({
    keyword: item.keyword || '',
    searchVolume: item.searchVolume || item.monthlyClicks || 0,
    cpc: item.costPerClick || 0,
    difficulty: item.organicDifficulty || item.difficulty || 0,
    position: 0,
    url: '',
    clicks: item.monthlyClicks || 0,
  }));
}

/**
 * Calculate opportunity score for a keyword
 * Higher score = better opportunity (low difficulty, high volume)
 */
export function calculateOpportunityScore(keyword: KeywordData): number {
  const volumeWeight = 0.4;
  const difficultyWeight = 0.6;

  // Normalize volume (log scale) - typical range 0-100k
  const normalizedVolume = Math.min(Math.log10(keyword.searchVolume + 1) / 5, 1);

  // Normalize difficulty (0-100 scale, inverted so lower is better)
  const normalizedDifficulty = (100 - Math.min(keyword.difficulty, 100)) / 100;

  return Math.round((normalizedVolume * volumeWeight + normalizedDifficulty * difficultyWeight) * 100);
}

/**
 * Analyze content gaps between our keywords and competitor keywords
 */
export async function analyzeContentGaps(
  ourKeywords: KeywordData[],
  competitorKeywords: KeywordData[],
  options: GapAnalysisOptions = {}
): Promise<GapAnalysisResult> {
  const minVolume = options.minVolume || 10;
  const maxPosition = options.maxPosition || 10;
  const minPosition = options.minPosition || 1;
  const excludeBranded = options.excludeBranded ?? true;

  // Create a set of our keywords for O(1) lookup
  const ourKeywordSet = new Set(ourKeywords.map((k) => k.keyword.toLowerCase()));

  // Filter competitor keywords
  const filteredCompetitorKeywords = competitorKeywords.filter((k) => {
    // Volume threshold
    if (k.searchVolume < minVolume) return false;

    // Position range (competitor ranks well for this)
    if (k.position < minPosition || k.position > maxPosition) return false;

    // Exclude branded terms (rough heuristic)
    if (excludeBranded) {
      const words = k.keyword.split(/\s+/);
      const hasBrandedTerm = words.some((word) => word.length > 8); // Long words often brand names
      if (hasBrandedTerm) return false;
    }

    return true;
  });

  // Find gaps (keywords competitors rank for that we don't)
  const gaps = filteredCompetitorKeywords.filter(
    (k) => !ourKeywordSet.has(k.keyword.toLowerCase())
  );

  // Add opportunity scores and sort by score
  const gapsWithScores = gaps
    .map((k) => ({
      ...k,
      opportunityScore: calculateOpportunityScore(k),
    }))
    .sort((a, b) => calculateOpportunityScore(b) - calculateOpportunityScore(a));

  // Calculate metadata
  const avgPosition =
    filteredCompetitorKeywords.reduce((sum, k) => sum + k.position, 0) /
    (filteredCompetitorKeywords.length || 1);

  return {
    gaps: gapsWithScores,
    metadata: {
      totalCompetitorKeywords: competitorKeywords.length,
      ourKeywords: ourKeywords.length,
      gapsFound: gaps.length,
      competitorsAnalyzed: 1, // Single competitor analysis
      avgCompetitorPosition: Math.round(avgPosition * 10) / 10,
    },
  };
}

/**
 * Identify quick-win keywords (low difficulty, high intent)
 */
export function identifyQuickWins(
  keywords: KeywordData[],
  options: {
    maxDifficulty?: number;
    minVolume?: number;
    limit?: number;
  } = {}
): KeywordData[] {
  const maxDifficulty = options.maxDifficulty ?? 40;
  const minVolume = options.minVolume ?? 50;
  const limit = options.limit ?? 20;

  return keywords
    .filter((k) => k.difficulty <= maxDifficulty && k.searchVolume >= minVolume)
    .map((k) => ({
      ...k,
      opportunityScore: calculateOpportunityScore(k),
    }))
    .sort((a, b) => {
      const scoreDiff = calculateOpportunityScore(b) - calculateOpportunityScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return b.searchVolume - a.searchVolume; // Tie-break by volume
    })
    .slice(0, limit);
}
