/**
 * Quick Wins API Route
 *
 * POST /api/seo/quick-wins
 * Body: {
 *   keywords: KeywordData[],
 *   maxDifficulty?: number,
 *   minVolume?: number,
 *   limit?: number
 * }
 *
 * Identifies quick-win keywords (low difficulty, high intent).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  identifyQuickWins,
  KeywordData,
  SpyFuError,
} from '@/lib/seo/spyfu';
import { calculateOpportunityScore, getIntentCategory } from '@/lib/seo/utils';

const RATE_LIMIT = { limit: 20, windowMs: 60 * 1000 }; // 20 requests/minute

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rateLimitKey = `seo-quick-wins:${ip}`;
    const { allowed, retryAfter } = checkRateLimit(rateLimitKey, RATE_LIMIT.limit, RATE_LIMIT.windowMs);

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfter) },
        }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      keywords,
      maxDifficulty = 40,
      minVolume = 50,
      limit = 20,
    } = body;

    // Validate keywords array
    if (!Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'keywords array required' },
        { status: 400 }
      );
    }

    // Validate keyword objects
    const validKeywords = keywords.filter((k): k is KeywordData =>
      k &&
      typeof k.keyword === 'string' &&
      typeof k.searchVolume === 'number' &&
      typeof k.difficulty === 'number'
    );

    if (validKeywords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid keywords provided' },
        { status: 400 }
      );
    }

    // Identify quick wins
    const quickWins = identifyQuickWins(validKeywords, {
      maxDifficulty,
      minVolume,
      limit,
    });

    // Add intent categorization
    const quickWinsWithIntent = quickWins.map(k => ({
      ...k,
      intent: getIntentCategory(k.keyword),
      opportunityScore: calculateOpportunityScore(k),
    }));

    // Group by difficulty tier
    const grouped = groupByDifficulty(quickWinsWithIntent);

    return NextResponse.json({
      success: true,
      data: {
        quickWins: quickWinsWithIntent,
        grouped,
        summary: {
          totalAnalyzed: validKeywords.length,
          quickWinsFound: quickWins.length,
          avgDifficulty: quickWins.length > 0
            ? Math.round(quickWins.reduce((sum, k) => sum + k.difficulty, 0) / quickWins.length)
            : 0,
          avgVolume: quickWins.length > 0
            ? Math.round(quickWins.reduce((sum, k) => sum + k.searchVolume, 0) / quickWins.length)
            : 0,
        },
      },
    });
  } catch (error) {
    console.error('Quick Wins API error:', error);

    if (error instanceof SpyFuError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Group keywords by difficulty tier
 */
function groupByDifficulty(keywords: Array<KeywordData & { intent: string }>): Record<string, typeof keywords> {
  return {
    easy: keywords.filter(k => k.difficulty < 30),
    medium: keywords.filter(k => k.difficulty >= 30 && k.difficulty < 50),
  };
}
