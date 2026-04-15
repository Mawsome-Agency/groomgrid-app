import https from 'https';

/**
 * Interface for keyword data returned from SpyFu API
 */
export interface KeywordData {
  keyword: string;
  volume?: number;
  cpc?: number;
  ppc?: number;
  difficulty?: number;
  position?: number;
  url?: string;
  traffic?: number;
  results?: number;
}

/**
 * Makes API call to SpyFu endpoint
 * @param endpoint SpyFu API endpoint
 * @param params Query parameters
 * @returns Promise with API response
 */
function callSpyFuApi(endpoint: string, params: Record<string, string>): Promise<any> {
  return new Promise((resolve, reject) => {
    // Validate required environment variable
    const spyfuApiSecret = process.env.SPYFU_API_SECRET;
    if (!spyfuApiSecret) {
      reject(new Error('SPYFU_API_SECRET environment variable is required'));
      return;
    }

    // Construct query string
    const queryString = new URLSearchParams({
      ...params,
      api_key: spyfuApiSecret
    }).toString();

    const url = `https://api.spyfu.com/apis/${endpoint}?${queryString}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(new Error(`Failed to parse SpyFu API response: ${err.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`SpyFu API request failed: ${err.message}`));
    });
  });
}

/**
 * Fetches competitor organic keywords
 * @param competitorDomain Competitor domain to analyze
 * @returns Promise with array of keywords
 */
export async function fetchCompetitorKeywords(competitorDomain: string): Promise<KeywordData[]> {
  if (!competitorDomain || typeof competitorDomain !== 'string') {
    throw new Error('Valid competitor domain is required');
  }

  try {
    const response = await callSpyFuApi('serp_api/v2/seo/getSeoKeywords', {
      query: competitorDomain,
      startingRow: '1',
      pageSize: '100',
      countryCode: 'US'
    });

    // Return keywords array from response
    return response.keywords || [];
  } catch (error) {
    console.error(`Error fetching keywords for ${competitorDomain}:`, error.message);
    return [];
  }
}

/**
 * Fetches question keywords based on seed keyword
 * @param seedKeyword Seed keyword for question variations
 * @returns Promise with array of question keywords
 */
export async function fetchQuestionKeywords(seedKeyword: string): Promise<KeywordData[]> {
  if (!seedKeyword || typeof seedKeyword !== 'string') {
    throw new Error('Valid seed keyword is required');
  }

  try {
    const response = await callSpyFuApi('keyword_api/v2/related/getQuestionKeywords', {
      query: seedKeyword,
      pageSize: '50'
    });

    // Return keywords array from response
    return response.keywords || [];
  } catch (error) {
    console.error(`Error fetching question keywords for ${seedKeyword}:`, error.message);
    return [];
  }
}

/**
 * Filters keywords by minimum search volume
 * @param keywords Array of keyword objects
 * @param minVolume Minimum search volume threshold (default: 100)
 * @returns Filtered array of keywords
 */
export function filterHighVolumeKeywords(keywords: KeywordData[], minVolume: number = 100): KeywordData[] {
  return keywords.filter(keyword => (keyword.volume || 0) >= minVolume);
}

/**
 * Finds content gaps between current site and competitor keywords
 * @param currentSiteKeywords Current site's keywords
 * @param competitorKeywords Competitor's keywords
 * @returns Array of keywords where competitors rank 1-10 but current site has no content
 */
export function findContentGaps(
  currentSiteKeywords: KeywordData[], 
  competitorKeywords: KeywordData[]
): KeywordData[] {
  // Convert current site keywords to lowercase for comparison
  const currentSiteKeywordSet = new Set(
    currentSiteKeywords.map(k => k.keyword.toLowerCase())
  );

  // Filter competitor keywords that:
  // 1. Are not in current site's keyword set
  // 2. Rank between 1-10
  return competitorKeywords.filter(competitorKeyword => {
    const keywordLower = competitorKeyword.keyword.toLowerCase();
    return !currentSiteKeywordSet.has(keywordLower) && 
           (competitorKeyword.position >= 1 && competitorKeyword.position <= 10);
  });
}

/**
 * Calculates opportunity score based on volume/difficulty ratio
 * @param volume Search volume
 * @param difficulty Keyword difficulty (0-100)
 * @returns Opportunity score
 */
export function calculateOpportunityScore(volume: number, difficulty: number): number {
  // Validate inputs
  if (volume < 0) throw new Error('Volume cannot be negative');
  if (difficulty < 0 || difficulty > 100) throw new Error('Difficulty must be between 0 and 100');

  // Avoid division by zero
  if (difficulty === 0) return volume;
  
  // Higher volume and lower difficulty = higher opportunity
  return volume / difficulty;
}

/**
 * Sorts keywords by opportunity score descending
 * @param keywords Array of keyword objects
 * @returns Sorted array of keywords
 */
export function sortKeywordsByOpportunity(keywords: KeywordData[]): KeywordData[] {
  return [...keywords].sort((a, b) => {
    const scoreA = calculateOpportunityScore(a.volume || 0, a.difficulty || 100);
    const scoreB = calculateOpportunityScore(b.volume || 0, b.difficulty || 100);
    return scoreB - scoreA;
  });
}

/**
 * Returns top N keywords by opportunity score
 * @param keywords Array of keyword objects
 * @param count Number of keywords to return
 * @returns Top N keywords
 */
export function extractTopKeywords(keywords: KeywordData[], count: number): KeywordData[] {
  if (count <= 0) return [];
  const sorted = sortKeywordsByOpportunity(keywords);
  return sorted.slice(0, Math.min(count, sorted.length));
}

/**
 * Validates domain name format
 * @param domain Domain to validate
 * @returns True if valid domain format
 */
export function isValidDomain(domain: string): boolean {
  if (!domain || typeof domain !== 'string') return false;
  
  // Basic domain validation
  const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9\-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  return domainPattern.test(domain);
}

/**
 * Validates keyword format
 * @param keyword Keyword to validate
 * @returns True if valid keyword format
 */
export function isValidKeyword(keyword: string): boolean {
  if (!keyword || typeof keyword !== 'string') return false;
  
  // Basic keyword validation - allow letters, numbers, spaces, and basic punctuation
  const keywordPattern = /^[a-zA-Z0-9\s\-']{1,100}$/;
  return keywordPattern.test(keyword);
}
