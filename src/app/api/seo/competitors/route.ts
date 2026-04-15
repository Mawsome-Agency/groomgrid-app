/**
 * Competitors Analysis API Route
 *
 * POST /api/seo/competitors
 * Body: { domains: string[], minVolume?: number }
 *
 * Analyzes multiple competitor domains and returns their keywords.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  fetchCompetitorKeywords,
  isValidDomain,
  KeywordData,
  SpyFuError,
} from '@/lib/seo/spyfu';

const MAX_DOMAINS = 5;
const RATE_LIMIT = { limit: 10, windowMs: 60 * 1000 }; // 10 requests/minute

interface CompetitorResult {
  domain: string;
  keywords: KeywordData[];
  error?: string;
  keywordCount: number;
}

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
    const rateLimitKey = `seo-competitors:${ip}`;
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
    const { domains, minVolume = 0 } = body;

    // Validate domains
    if (!Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json(
        { success: false, error: 'domains array required' },
        { status: 400 }
      );
    }

    if (domains.length > MAX_DOMAINS) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_DOMAINS} domains allowed` },
        { status: 400 }
      );
    }

    // Validate and clean domains
    const validDomains = domains.filter(isValidDomain);
    if (validDomains.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid domains provided' },
        { status: 400 }
      );
    }

    // Analyze each competitor
    const results: CompetitorResult[] = [];
    const errors: string[] = [];

    for (const domain of validDomains) {
      try {
        const keywords = await fetchCompetitorKeywords(domain, { minVolume });
        results.push({
          domain,
          keywords,
          keywordCount: keywords.length,
        });
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Failed to fetch';
        errors.push(`${domain}: ${errorMessage}`);
        results.push({
          domain,
          keywords: [],
          error: errorMessage,
          keywordCount: 0,
        });
      }
    }

    // Aggregate all keywords
    const allKeywords = results.flatMap(r => r.keywords);

    return NextResponse.json({
      success: true,
      data: {
        competitors: results,
        summary: {
          totalCompetitors: results.length,
          successfulFetches: results.filter(r => !r.error).length,
          totalKeywords: allKeywords.length,
          uniqueKeywords: new Set(allKeywords.map(k => k.keyword)).size,
        },
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Competitors API error:', error);

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
