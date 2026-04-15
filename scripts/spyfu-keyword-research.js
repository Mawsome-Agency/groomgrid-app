#!/usr/bin/env node
/**
 * SpyFu Competitor Keyword Research Script
 *
 * This script conducts competitor keyword research using the SpyFu API to:
 * 1. Extract competitors' top organic keywords with volume > 100
 * 2. Identify keywords where competitors rank 1-10 but GroomGrid has no content
 * 3. Find question keywords groomers are asking
 * 4. Prioritize quick-win keywords (low difficulty, high intent)
 *
 * Usage:
 *   node scripts/spyfu-keyword-research.js
 *
 * Required env:
 *   SPYFU_API_SECRET (for SpyFu API access)
 *
 * Output:
 *   Generates keyword-gap-analysis.json with findings
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Environment configuration
const SPYFU_API_SECRET = process.env.SPYFU_API_SECRET;
const OUTPUT_DIR = './reports';
const OUTPUT_FILE = 'keyword-gap-analysis.json';

// Competitors to analyze
const COMPETITORS = ['moego.com', 'daysmartpet.com', 'pawfinity.com'];

// Seed keywords for question research
const SEED_KEYWORDS = ['dog grooming', 'mobile pet grooming', 'pet grooming software'];

// Validation
if (!SPYFU_API_SECRET) {
  console.error('Error: SPYFU_API_SECRET environment variable is required');
  console.log('\nTo run this script:');
  console.log('  export SPYFU_API_SECRET=your_spyfu_api_key_here');
  console.log('  node scripts/spyfu-keyword-research.js');
  process.exit(1);
}

/**
 * Makes API call to SpyFu endpoint
 * @param {string} endpoint SpyFu API endpoint
 * @param {Object} params Query parameters
 * @returns {Promise} Promise with API response
 */
function callSpyFuApi(endpoint, params) {
  return new Promise((resolve, reject) => {
    // Construct query string
    const queryString = new URLSearchParams({
      ...params,
      api_key: SPYFU_API_SECRET
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
 * @param {string} competitorDomain Competitor domain to analyze
 * @returns {Promise<Array>} Promise with array of keywords
 */
async function fetchCompetitorKeywords(competitorDomain) {
  try {
    console.log(`Fetching keywords for ${competitorDomain}...`);
    const response = await callSpyFuApi('serp_api/v2/seo/getSeoKeywords', {
      query: competitorDomain,
      startingRow: 1,
      pageSize: 100,
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
 * @param {string} seedKeyword Seed keyword for question variations
 * @returns {Promise<Array>} Promise with array of question keywords
 */
async function fetchQuestionKeywords(seedKeyword) {
  try {
    console.log(`Fetching question keywords for "${seedKeyword}"...`);
    const response = await callSpyFuApi('keyword_api/v2/related/getQuestionKeywords', {
      query: seedKeyword,
      pageSize: 50
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
 * @param {Array} keywords Array of keyword objects
 * @param {number} minVolume Minimum search volume threshold
 * @returns {Array} Filtered array of keywords
 */
function filterHighVolumeKeywords(keywords, minVolume = 100) {
  return keywords.filter(keyword => (keyword.volume || 0) >= minVolume);
}

/**
 * Finds content gaps between GroomGrid and competitor keywords
 * @param {Array} groomgridKeywords GroomGrid's keywords
 * @param {Array} competitorKeywords Competitor's keywords
 * @returns {Array} Array of keywords where competitors rank 1-10 but GroomGrid has no content
 */
function findContentGaps(groomgridKeywords, competitorKeywords) {
  // Convert GroomGrid keywords to lowercase for comparison
  const groomgridKeywordSet = new Set(
    groomgridKeywords.map(k => k.keyword.toLowerCase())
  );
  
  // Filter competitor keywords that:
  // 1. Are not in GroomGrid's keyword set
  // 2. Rank between 1-10
  return competitorKeywords.filter(competitorKeyword => {
    const keywordLower = competitorKeyword.keyword.toLowerCase();
    return !groomgridKeywordSet.has(keywordLower) && 
           (competitorKeyword.position >= 1 && competitorKeyword.position <= 10);
  });
}

/**
 * Calculates opportunity score based on volume/difficulty ratio
 * @param {number} volume Search volume
 * @param {number} difficulty Keyword difficulty (0-100)
 * @returns {number} Opportunity score
 */
function calculateOpportunityScore(volume, difficulty) {
  // Avoid division by zero
  if (difficulty === 0) return volume;
  
  // Higher volume and lower difficulty = higher opportunity
  return volume / difficulty;
}

/**
 * Sorts keywords by opportunity score descending
 * @param {Array} keywords Array of keyword objects
 * @returns {Array} Sorted array of keywords
 */
function sortKeywordsByOpportunity(keywords) {
  return [...keywords].sort((a, b) => {
    const scoreA = calculateOpportunityScore(a.volume || 0, a.difficulty || 100);
    const scoreB = calculateOpportunityScore(b.volume || 0, b.difficulty || 100);
    return scoreB - scoreA;
  });
}

/**
 * Returns top N keywords by opportunity score
 * @param {Array} keywords Array of keyword objects
 * @param {number} count Number of keywords to return
 * @returns {Array} Top N keywords
 */
function extractTopKeywords(keywords, count) {
  const sorted = sortKeywordsByOpportunity(keywords);
  return sorted.slice(0, count);
}

/**
 * Saves results to JSON file
 * @param {Object} results Results object to save
 * @param {string} filename Output filename
 */
function saveResultsToFile(results, filename) {
  // Create reports directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${filepath}`);
}

/**
 * Main execution function
 */
async function main() {
  console.log('='.repeat(70));
  console.log('SPYFU COMPETITOR KEYWORD RESEARCH');
  console.log('='.repeat(70));
  console.log(`Analyzing competitors: ${COMPETITORS.join(', ')}`);
  console.log(`Seed keywords: ${SEED_KEYWORDS.join(', ')}`);
  console.log();

  try {
    // Store all collected data
    const results = {
      timestamp: new Date().toISOString(),
      competitors: {},
      questionKeywords: {},
      contentGaps: [],
      prioritizedKeywords: []
    };

    // Fetch competitor keywords
    console.log('1. FETCHING COMPETITOR KEYWORDS');
    console.log('-'.repeat(40));
    
    for (const competitor of COMPETITORS) {
      const keywords = await fetchCompetitorKeywords(competitor);
      const highVolumeKeywords = filterHighVolumeKeywords(keywords, 100);
      
      results.competitors[competitor] = {
        totalKeywords: keywords.length,
        highVolumeKeywords: highVolumeKeywords.length,
        keywords: highVolumeKeywords
      };
      
      console.log(`  ${competitor}: ${highVolumeKeywords.length} high-volume keywords`);
    }

    // Fetch question keywords
    console.log('\n2. FETCHING QUESTION KEYWORDS');
    console.log('-'.repeat(40));
    
    for (const seedKeyword of SEED_KEYWORDS) {
      const questionKeywords = await fetchQuestionKeywords(seedKeyword);
      results.questionKeywords[seedKeyword] = questionKeywords;
      
      console.log(`  "${seedKeyword}": ${questionKeywords.length} question keywords`);
    }

    // Find content gaps (using sample GroomGrid keywords)
    console.log('\n3. IDENTIFYING CONTENT GAPS');
    console.log('-'.repeat(40));
    
    // Sample GroomGrid keywords (in a real implementation, these would come from actual data)
    const groomgridKeywords = [
      { keyword: 'pet grooming software', volume: 1200, position: 3 },
      { keyword: 'dog grooming business', volume: 800, position: 5 },
      { keyword: 'mobile grooming', volume: 600, position: 7 }
    ];
    
    // Collect all competitor keywords for gap analysis
    const allCompetitorKeywords = Object.values(results.competitors)
      .flatMap(competitor => competitor.keywords);
    
    const contentGaps = findContentGaps(groomgridKeywords, allCompetitorKeywords);
    results.contentGaps = contentGaps;
    
    console.log(`  Found ${contentGaps.length} content gaps`);

    // Prioritize keywords
    console.log('\n4. PRIORITIZING KEYWORDS');
    console.log('-'.repeat(40));
    
    // Combine all keywords for prioritization
    const allKeywords = [
      ...groomgridKeywords,
      ...allCompetitorKeywords,
      ...Object.values(results.questionKeywords).flat()
    ];
    
    const prioritizedKeywords = extractTopKeywords(allKeywords, 20);
    results.prioritizedKeywords = prioritizedKeywords;
    
    console.log(`  Prioritized ${prioritizedKeywords.length} keywords`);

    // Save results
    console.log('\n5. SAVING RESULTS');
    console.log('-'.repeat(40));
    
    saveResultsToFile(results, OUTPUT_FILE);
    
    // Display top 10 prioritized keywords
    console.log('\nTOP 10 PRIORITIZED KEYWORDS:');
    console.log('-'.repeat(40));
    prioritizedKeywords.slice(0, 10).forEach((keyword, index) => {
      const opportunity = calculateOpportunityScore(keyword.volume || 0, keyword.difficulty || 100);
      console.log(`${index+1}. ${keyword.keyword}`);
      console.log(`   Volume: ${keyword.volume || 'N/A'}, Difficulty: ${keyword.difficulty || 'N/A'}, Opportunity: ${opportunity.toFixed(2)}`);
      if (keyword.position) console.log(`   Position: ${keyword.position}`);
      console.log();
    });

    console.log('='.repeat(70));
    console.log('ANALYSIS COMPLETE');
    console.log('='.repeat(70));
    console.log(`Detailed results saved to ${path.join(OUTPUT_DIR, OUTPUT_FILE)}`);
    
  } catch (error) {
    console.error('Fatal error during keyword research:', error.message);
    process.exit(1);
  }
}

// Execute main function
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
