/**
 * Gap Analysis API Route
 *
 * POST /api/seo/gap-analysis
 * Body: {
 *   competitors: string[],
 *   ourDomain: string,
 *   minVolume?: number,
 *   maxPosition?: number
 * }
 *
 * Identifies keywords competitors rank for that we don't have content for.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  fetchCompetitorKeywords,
  analyzeContentGaps,
  isValidDomain,
  KeywordData,
  SpyFuError,
} from '@/lib/seo/spyfu';

const MAX_COMPETITORS = 3;
const RATE_LIMIT = { limit: 5, windowMs: 60 * 1000 }; // 5 requests/minute

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
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `seo-gap-analysis:${ip}`;
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
      competitors,
      ourDomain,
      minVolume = 10,
      maxPosition = 10,
    } = body;

    // Validation
    if (!Array.isArray(competitors) || competitors.length === 0) {
      return NextResponse.json(
        { success: false, error: 'competitors array required' },
        { status: 400 }
      );
    }

    if (competitors.length > MAX_COMPETITORS) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_COMPETITORS} competitors allowed` },
        { status: 400 }
      );
    }

    if (!ourDomain || !isValidDomain(ourDomain)) {
      return NextResponse.json(
        { success: false, error: 'Valid ourDomain required' },
        { status: 400 }
      );
    }

    // Validate competitor domains
    const validCompetitors = competitors.filter(isValidDomain);
    if (validCompetitors.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid competitor domains provided' },
        { status: 400 }
      );
    }

    // Fetch our keywords
    let ourKeywords: KeywordData[] = [];
    try {
      ourKeywords = await fetchCompetitorKeywords(ourDomain, { minVolume: 0 });
    } catch (e) {
      // It's okay if we can't fetch our own keywords, continue with empty set
      console.warn('Could not fetch our own keywords:', e);
    }

    // Fetch competitor keywords
    const competitorKeywordsMap: Record<string, KeywordData[]> = {};
    const errors: string[] = [];

    for (const domain of validCompetitors) {
      try {
        const keywords = await fetchCompetitorKeywords(domain, { minVolume: 0 });
        competitorKeywordsMap[domain] = keywords;
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Failed to fetch';
        errors.push(`${domain}: ${errorMessage}`);
      }
    }

    // Combine all competitor keywords
    const allCompetitorKeywords = Object.values(competitorKeywordsMap).flat();

    // Analyze gaps
    const gapResult = await analyzeContentGaps(
      ourKeywords,
      allCompetitorKeywords,
      {
        minVolume,
        maxPosition,
        excludeBranded: true,
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        gaps: gapResult.gaps.slice(0, 50), // Limit to top 50
        metadata: {
          ...gapResult.metadata,
          ourDomain,
          competitorsAnalyzed: validCompetitors.length,
          competitorDomains: validCompetitors,
        },
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Gap Analysis API error:', error);

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
