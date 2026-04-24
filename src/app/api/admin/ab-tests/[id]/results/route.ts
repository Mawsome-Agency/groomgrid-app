import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { getTestResults } from '@/lib/ab-test-metrics';

// GET - Get test results
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // ── Auth guard ──────────────────────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  try {
    const results = await getTestResults(params.id);

    if (!results) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('[Admin AB Test Results] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test results' },
      { status: 500 }
    );
  }
}
