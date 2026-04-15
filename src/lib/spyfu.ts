import axios from 'axios';

// Define types for SpyFu API responses
export interface SpyFuKeyword {
  keyword: string;
  volume: number;
  cpc: number;
  difficulty: number;
  position: number;
}

interface SpyFuResponse {
  results: SpyFuKeyword[];
}

interface CompetitorKeywords {
  [competitor: string]: SpyFuKeyword[];
}

// SpyFu API client
class SpyFuClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.spyfu.com/apis';
  }

  /**
   * Fetch organic keywords for a competitor
   * @param competitor - Competitor domain
   * @param pageSize - Number of keywords to fetch (default: 100)
   * @returns Array of keywords with metrics
   */
  async getOrganicKeywords(competitor: string, pageSize: number = 100): Promise<SpyFuKeyword[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/serp_api/v2/seo/getSeoKeywords`, {
        params: {
          query: competitor,
          startingRow: 1,
          pageSize: pageSize,
          countryCode: 'US',
          api_key: this.apiKey
        }
      });
      
      return response.data.results || [];
    } catch (error) {
      console.error(`Error fetching organic keywords for ${competitor}:`, error);
      throw new Error(`Failed to fetch organic keywords for ${competitor}`);
    }
  }

  /**
   * Fetch most valuable keywords for a competitor
   * @param competitor - Competitor domain
   * @param pageSize - Number of keywords to fetch (default: 100)
   * @returns Array of high-value keywords with metrics
   */
  async getMostValuableKeywords(competitor: string, pageSize: number = 100): Promise<SpyFuKeyword[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/serp_api/v2/seo/getMostValuableKeywords`, {
        params: {
          query: competitor,
          startingRow: 1,
          pageSize: pageSize,
          api_key: this.apiKey
        }
      });
      
      return response.data.results || [];
    } catch (error) {
      console.error(`Error fetching valuable keywords for ${competitor}:`, error);
      throw new Error(`Failed to fetch valuable keywords for ${competitor}`);
    }
  }

  /**
   * Fetch question keywords related to a seed keyword
   * @param keyword - Seed keyword
   * @param pageSize - Number of keywords to fetch (default: 50)
   * @returns Array of question-based keywords
   */
  async getQuestionKeywords(keyword: string, pageSize: number = 50): Promise<SpyFuKeyword[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/keyword_api/v2/related/getQuestionKeywords`, {
        params: {
          query: keyword,
          pageSize: pageSize,
          api_key: this.apiKey
        }
      });
      
      return response.data.results || [];
    } catch (error) {
      console.error(`Error fetching question keywords for ${keyword}:`, error);
      throw new Error(`Failed to fetch question keywords for ${keyword}`);
    }
  }
}

/**
 * Get competitor keywords for multiple competitors
 * @param competitors - List of competitor domains
 * @param apiKey - SpyFu API key
 * @returns Object mapping competitors to their keywords
 */
export async function getCompetitorKeywords(
  competitors: string[], 
  apiKey: string
): Promise<CompetitorKeywords> {
  const client = new SpyFuClient(apiKey);
  const results: CompetitorKeywords = {};

  for (const competitor of competitors) {
    try {
      // Fetch both organic and valuable keywords
      const organicKeywords = await client.getOrganicKeywords(competitor, 100);
      const valuableKeywords = await client.getMostValuableKeywords(competitor, 100);
      
      // Combine and deduplicate keywords
      const allKeywords = [...organicKeywords, ...valuableKeywords];
      const uniqueKeywords = Array.from(
        new Map(allKeywords.map(item => [item.keyword, item])).values()
      );
      
      results[competitor] = uniqueKeywords;
    } catch (error) {
      console.error(`Error processing competitor ${competitor}:`, error);
      results[competitor] = [];
    }
  }

  return results;
}

import { hasContentForKeyword } from './content-analysis';

/**
 * Perform gap analysis to find keywords competitors rank for but we don't have content for
 * @param competitorKeywords - Keywords from competitors
 * @returns Keywords with high volume (>100) that we're missing
 */
export function performGapAnalysis(
  competitorKeywords: CompetitorKeywords
): SpyFuKeyword[] {
  // Flatten all competitor keywords
  const allCompetitorKeywords: SpyFuKeyword[] = [];
  for (const competitor in competitorKeywords) {
    allCompetitorKeywords.push(...competitorKeywords[competitor]);
  }

  // Deduplicate and filter for high-volume keywords
  const uniqueKeywords = Array.from(
    new Map(allCompetitorKeywords.map(item => [item.keyword, item])).values()
  );

  // Filter for keywords with volume > 100
  const highVolumeKeywords = uniqueKeywords.filter(kw => kw.volume > 100);

  // Filter out keywords we already have content for
  const missingKeywords = highVolumeKeywords.filter(kw =>
    !hasContentForKeyword(kw.keyword)
  );

  // Sort by volume descending
  return missingKeywords.sort((a, b) => b.volume - a.volume);
}

/**
 * Get question keywords for content ideas
 * @param seedKeywords - Seed keywords to generate questions for
 * @param apiKey - SpyFu API key
 * @returns Array of question keywords
 */
export async function getQuestionKeywords(
  seedKeywords: string[],
  apiKey: string
): Promise<SpyFuKeyword[]> {
  const client = new SpyFuClient(apiKey);
  const allQuestions: SpyFuKeyword[] = [];

  for (const keyword of seedKeywords) {
    try {
      const questions = await client.getQuestionKeywords(keyword, 50);
      allQuestions.push(...questions);
    } catch (error) {
      console.error(`Error fetching questions for ${keyword}:`, error);
    }
  }

  // Deduplicate questions
  return Array.from(
    new Map(allQuestions.map(item => [item.keyword, item])).values()
  );
}

/**
 * Prioritize keywords based on difficulty and volume
 * @param keywords - Keywords to prioritize
 * @returns Prioritized keywords (low difficulty, high volume first)
 */
export function prioritizeKeywords(keywords: SpyFuKeyword[]): SpyFuKeyword[] {
  return keywords
    .filter(kw => kw.difficulty < 50) // Focus on low difficulty keywords
    .sort((a, b) => {
      // Sort by difficulty ascending, then volume descending
      if (a.difficulty !== b.difficulty) {
        return a.difficulty - b.difficulty;
      }
      return b.volume - a.volume;
    })
    .slice(0, 20); // Return top 20 keywords
}

export default SpyFuClient;