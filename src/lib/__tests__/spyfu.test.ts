// Mock the content-analysis module
jest.mock('../content-analysis', () => ({
  hasContentForKeyword: jest.fn((keyword: string) => {
    // Mock implementation - only 'existing keyword' is considered as existing content
    return keyword === 'existing keyword';
  })
}));

import { performGapAnalysis, prioritizeKeywords, SpyFuKeyword } from '../spyfu';

describe('SpyFu Functions', () => {
  describe('performGapAnalysis', () => {
    it('should filter keywords by volume and content existence', () => {
      const competitorKeywords = {
        'competitor1.com': [
          { keyword: 'high volume keyword', volume: 1000, cpc: 2.5, difficulty: 30, position: 5 },
          { keyword: 'low volume keyword', volume: 50, cpc: 1.0, difficulty: 20, position: 10 },
          { keyword: 'existing keyword', volume: 500, cpc: 3.0, difficulty: 40, position: 3 }
        ]
      };

      const result = performGapAnalysis(competitorKeywords);

      // Should only return high volume keywords that we don't have content for
      expect(result.length).toBe(1);
      expect(result[0].keyword).toBe('high volume keyword');
      expect(result[0].volume).toBe(1000);
    });
  });

  describe('prioritizeKeywords', () => {
    it('should prioritize keywords by difficulty and volume', () => {
      const keywords: SpyFuKeyword[] = [
        { keyword: 'easy high volume', volume: 1000, cpc: 2.5, difficulty: 20, position: 5 },
        { keyword: 'hard high volume', volume: 900, cpc: 2.0, difficulty: 70, position: 8 },
        { keyword: 'easy low volume', volume: 100, cpc: 1.5, difficulty: 15, position: 3 },
        { keyword: 'medium difficulty', volume: 500, cpc: 3.0, difficulty: 40, position: 6 }
      ];

      const result = prioritizeKeywords(keywords);

      // Should prioritize low difficulty keywords first
      expect(result[0].difficulty).toBeLessThan(result[result.length - 1].difficulty);

      // Should still consider volume (high volume low difficulty should rank higher than low volume low difficulty)
      expect(result[0].volume).toBeGreaterThanOrEqual(result[1].volume);
    });
  });
});