/**
 * SEO Utility Functions
 *
 * Shared utilities for keyword analysis and opportunity scoring.
 */

import { KeywordData, calculateOpportunityScore } from './spyfu';

// Re-export calculateOpportunityScore from spyfu.ts for backward compatibility
export { calculateOpportunityScore };

/**
 * Calculate keyword difficulty tier
 */
export function getDifficultyTier(difficulty: number): 'easy' | 'medium' | 'hard' | 'very-hard' {
  if (difficulty < 30) return 'easy';
  if (difficulty < 50) return 'medium';
  if (difficulty < 70) return 'hard';
  return 'very-hard';
}

/**
 * Format search volume for display
 */
export function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
}

/**
 * Format CPC for display
 */
export function formatCPC(cpc: number): string {
  return `$${cpc.toFixed(2)}`;
}

/**
 * Extract intent category from keyword
 */
export function getIntentCategory(keyword: string): 'informational' | 'transactional' | 'navigational' | 'commercial' {
  const lower = keyword.toLowerCase();
  
  // Transactional intent
  if (/\b(buy|purchase|order|price|cost|deal|discount|cheap|sale)\b/.test(lower)) {
    return 'transactional';
  }
  
  // Navigational intent (brand-specific)
  if (/\b(vs|versus|alternative|compared to|review of)\b/.test(lower)) {
    return 'commercial';
  }
  
  // Informational intent
  if (/\b(how|what|why|when|where|who|guide|tutorial|tips|best way to)\b/.test(lower)) {
    return 'informational';
  }
  
  return 'commercial';
}

/**
 * Estimate traffic potential based on position and volume
 * Uses a simple CTR model
 */
export function estimateTraffic(volume: number, position: number): number {
  // Approximate CTR by position
  const ctrByPosition: Record<number, number> = {
    1: 0.28,
    2: 0.15,
    3: 0.09,
    4: 0.06,
    5: 0.04,
    6: 0.03,
    7: 0.025,
    8: 0.02,
    9: 0.018,
    10: 0.015,
  };
  
  const ctr = ctrByPosition[Math.min(Math.max(Math.round(position), 1), 10)] || 0.01;
  return Math.round(volume * ctr);
}

/**
 * Group keywords by topic/theme
 */
export function groupKeywordsByTheme(keywords: KeywordData[]): Map<string, KeywordData[]> {
  const groups = new Map<string, KeywordData[]>();
  
  for (const keyword of keywords) {
    // Extract main topic (first 2-3 words usually indicate theme)
    const words = keyword.keyword.toLowerCase().split(/\s+/);
    const theme = words.slice(0, 2).join(' ');
    
    const existing = groups.get(theme) || [];
    existing.push(keyword);
    groups.set(theme, existing);
  }
  
  return groups;
}

/**
 * Filter out branded keywords
 */
export function filterBrandedKeywords(
  keywords: KeywordData[],
  brandTerms: string[] = []
): KeywordData[] {
  const defaultBrandTerms = ['moego', 'daysmart', 'pawfinity', 'groomgrid', 'petdesk'];
  const allBrands = [...defaultBrandTerms, ...brandTerms].map(b => b.toLowerCase());
  
  return keywords.filter(k => {
    const lowerKeyword = k.keyword.toLowerCase();
    return !allBrands.some(brand => lowerKeyword.includes(brand));
  });
}

/**
 * Calculate content gap priority score
 * Considers volume, difficulty, and competitive position
 */
export function calculateGapPriority(
  gap: KeywordData,
  competitorPosition: number
): number {
  const volumeScore = Math.min(Math.log10(gap.searchVolume + 1) / 5, 1) * 30;
  const difficultyScore = (100 - gap.difficulty) / 100 * 40;
  const positionScore = (11 - competitorPosition) / 10 * 30;
  
  return Math.round(volumeScore + difficultyScore + positionScore);
}
