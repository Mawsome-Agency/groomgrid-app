import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  const supabase = createAdminClient()

  const { data, error, count } = await supabase
    .from('user_engagement_scores')
    .select('*', { count: 'exact' })
    .order('engagement_score', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json(
      { error: `Failed to fetch engagement data: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({
    data: data ?? [],
    total: count ?? 0,
    limit,
    offset,
  })
}
