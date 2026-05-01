/**
 * SEO Keywords API Route
 *
 * GET /api/seo/keywords?type=competitor|related|competitors&domain=...|keyword=...
 *
 * Supports:
 * - type=competitor: Fetch keywords for a competitor domain
 * - type=related: Fetch related keywords for a seed term
 * - type=competitors: Batch fetch for multiple domains
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  fetchCompetitorKeywords,
  fetchRelatedKeywords,
  isValidDomain,
  isValidKeyword,
  SpyFuError,
} from '@/lib/seo/spyfu';

// Rate limit config per endpoint type
const RATE_LIMITS = {
  competitor: { limit: 10, windowMs: 60 * 1000 }, // 10/min
  related: { limit: 20, windowMs: 60 * 1000 },    // 20/min
  competitors: { limit: 5, windowMs: 60 * 1000 }, // 5/min
};

export async function GET(req: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request params
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'competitor';
    const domain = searchParams.get('domain');
    const keyword = searchParams.get('keyword');
    const minVolume = parseInt(searchParams.get('minVolume') || '0', 10);

    // Rate limiting based on IP and type
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rateLimitKey = `seo-keywords:${type}:${ip}`;
    const rateLimit = RATE_LIMITS[type as keyof typeof RATE_LIMITS] || RATE_LIMITS.competitor;
    const { allowed, retryAfter } = checkRateLimit(rateLimitKey, rateLimit.limit, rateLimit.windowMs);

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfter) },
        }
      );
    }

    // Handle different request types
    if (type === 'competitor') {
      if (!domain || !isValidDomain(domain)) {
        return NextResponse.json(
          { success: false, error: 'Valid domain required' },
          { status: 400 }
        );
      }

      const keywords = await fetchCompetitorKeywords(domain, { minVolume });
      return NextResponse.json({ success: true, data: keywords });
    }

    if (type === 'related') {
      if (!keyword || !isValidKeyword(keyword)) {
        return NextResponse.json(
          { success: false, error: 'Valid keyword required' },
          { status: 400 }
        );
      }

      const keywords = await fetchRelatedKeywords(keyword);
      return NextResponse.json({ success: true, data: keywords });
    }

    if (type === 'competitors') {
      const domainsParam = searchParams.get('domains');
      if (!domainsParam) {
        return NextResponse.json(
          { success: false, error: 'domains parameter required' },
          { status: 400 }
        );
      }

      const domains = domainsParam.split(',').map(d => d.trim()).filter(Boolean);
      const results: Record<string, any> = {};

      for (const d of domains) {
        if (isValidDomain(d)) {
          try {
            results[d] = await fetchCompetitorKeywords(d, { minVolume });
          } catch (e) {
            results[d] = { error: e instanceof Error ? e.message : 'Failed to fetch' };
          }
        }
      }

      return NextResponse.json({ success: true, data: results });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('SEO Keywords API error:', error);

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
