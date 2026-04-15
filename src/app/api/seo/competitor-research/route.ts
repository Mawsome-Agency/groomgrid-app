import { NextRequest, NextResponse } from 'next/server';
import { getCompetitorKeywords, performGapAnalysis, getQuestionKeywords, prioritizeKeywords, SpyFuKeyword } from '../../../../lib/spyfu';

// Define our main competitors
const COMPETITORS = ['moego.com', 'daysmart.com', 'pawfinity.com'];
const SEED_KEYWORDS = ['dog grooming', 'pet grooming', 'mobile grooming'];

export async function GET(request: NextRequest) {
  try {
    // Get SpyFu API key from environment variables
    const apiKey = process.env.SPYFU_API_SECRET;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'SpyFu API key not configured' },
        { status: 500 }
      );
    }

    // Fetch competitor keywords
    const competitorKeywords = await getCompetitorKeywords(COMPETITORS, apiKey);

    // Perform gap analysis
    const gapKeywords = performGapAnalysis(competitorKeywords);
    
    // Get question keywords for content ideas
    const questionKeywords = await getQuestionKeywords(SEED_KEYWORDS, apiKey);
    
    // Prioritize keywords for quick wins
    const prioritizedKeywords = prioritizeKeywords(gapKeywords);
    
    // Prepare response data
    const responseData = {
      competitors: COMPETITORS,
      competitorKeywords,
      gapAnalysis: {
        totalOpportunities: gapKeywords.length,
        keywords: gapKeywords.slice(0, 50) // Limit to top 50 for response size
      },
      questionKeywords: questionKeywords.slice(0, 30), // Limit to top 30 questions
      prioritizedKeywords: prioritizedKeywords
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in competitor research:', error);
    return NextResponse.json(
      { error: 'Failed to perform competitor research' },
      { status: 500 }
    );
  }
}