/**
 * Question Keywords API Route
 *
 * GET /api/seo/questions?keyword=...
 *
 * Returns question-based keyword variations for content ideas.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  fetchQuestionKeywords,
  isValidKeyword,
  getLastRateLimitStatus,
  SpyFuError,
} from '@/lib/seo/spyfu';

const RATE_LIMIT = { limit: 30, windowMs: 60 * 1000 }; // 30 requests/minute (more lenient)

export async function GET(req: NextRequest) {
  try {
    // Authentication check - optional for this endpoint
    const session = await getServerSession(authOptions);

    // Rate limiting by IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rateLimitKey = `seo-questions:${ip}`;
    const { allowed, retryAfter } = checkRateLimit(rateLimitKey, RATE_LIMIT.limit, RATE_LIMIT.windowMs);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', errorType: 'generic' },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfter) },
        }
      );
    }

    // Get keyword from query
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword');

    if (!keyword || !isValidKeyword(keyword)) {
      return NextResponse.json(
        { error: 'Valid keyword required (2-100 characters)', errorType: 'generic' },
        { status: 400 }
      );
    }

    // Fetch question keywords
    const questions = await fetchQuestionKeywords(keyword);

    // Group by question type
    const grouped = groupByQuestionType(questions);

    // Get rate limit info
    const rateLimitStatus = getLastRateLimitStatus();

    return NextResponse.json({
      success: true,
      data: {
        seedKeyword: keyword,
        totalQuestions: questions.length,
        questions: questions.slice(0, 20), // Top 20
        grouped,
      },
      meta: {
        rateLimit: rateLimitStatus,
        authenticated: !!session?.user,
      },
    });
  } catch (error) {
    console.error('Questions API error:', error);

    if (error instanceof SpyFuError) {
      return NextResponse.json(
        { error: error.message, errorType: 'generic' },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', errorType: 'generic' },
      { status: 500 }
    );
  }
}

/**
 * Group questions by type (how, what, why, etc.)
 */
function groupByQuestionType(questions: Array<{ keyword: string }>): Record<string, string[]> {
  const groups: Record<string, string[]> = {
    how: [],
    what: [],
    why: [],
    when: [],
    where: [],
    who: [],
    which: [],
    other: [],
  };

  for (const q of questions) {
    const lower = q.keyword.toLowerCase();
    const firstWord = lower.split(/\s+/)[0];

    if (groups[firstWord]) {
      groups[firstWord].push(q.keyword);
    } else {
      groups.other.push(q.keyword);
    }
  }

  // Remove empty groups
  for (const key of Object.keys(groups)) {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  }

  return groups;
}
