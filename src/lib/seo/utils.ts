/**
 * SEO Utility Functions
 * 
 * Helper functions for processing and analyzing SEO data.
 */

/**
 * Calculates opportunity score based on volume/difficulty ratio
 * @param volume Search volume
 * @param difficulty Keyword difficulty (0-100)
 * @returns Opportunity score
 */
export function calculateOpportunityScore(volume: number, difficulty: number): number {
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
export function sortKeywordsByOpportunity(keywords: any[]): any[] {
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
export function extractTopKeywords(keywords: any[], count: number): any[] {
  const sorted = sortKeywordsByOpportunity(keywords);
  return sorted.slice(0, count);
}
