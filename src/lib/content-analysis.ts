/**
 * Extract keywords from existing content
 * This is a simplified version - in practice, you'd analyze your actual content
 * @returns Array of keywords extracted from existing content
 */
export function extractExistingKeywords(): string[] {
  // This would typically analyze your blog posts, pages, etc.
  // For now, returning a placeholder list
  return [
    'dog grooming',
    'pet grooming',
    'grooming salon',
    'mobile grooming',
    'dog bath',
    'pet care',
    'grooming service',
    'professional dog grooming'
  ].map(kw => kw.toLowerCase());
}

/**
 * Check if we have content for a keyword
 * @param keyword - Keyword to check
 * @returns Boolean indicating if we have content
 */
export function hasContentForKeyword(keyword: string): boolean {
  const existingKeywords = extractExistingKeywords();
  return existingKeywords.includes(keyword.toLowerCase());
}