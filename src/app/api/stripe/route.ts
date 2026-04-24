import { NextResponse } from 'next/server';

/**
 * POST /api/stripe — DEPRECATED
 *
 * This endpoint is dead code: the frontend exclusively calls POST /api/checkout
 * (confirmed in src/app/plans/page.tsx). Returning 405 here documents the move
 * and prevents silent success if this route is accidentally hit.
 */
export function POST() {
  return NextResponse.json(
    { error: 'This endpoint has moved. Use POST /api/checkout instead.' },
    { status: 405, headers: { Location: '/api/checkout' } },
  );
}
