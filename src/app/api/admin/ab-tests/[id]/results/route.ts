import { NextRequest, NextResponse } from 'next/server';
import { getTestResults } from '@/lib/ab-test-metrics';

// GET - Get test results
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
