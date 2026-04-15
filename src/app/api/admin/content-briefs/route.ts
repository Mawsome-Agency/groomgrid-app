import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import * as db from '@/lib/content-briefs/db'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(request.url)
  const skip = Number(url.searchParams.get('skip') || '0')
  const take = Number(url.searchParams.get('take') || '10')
  const result = await db.listContentBriefs({ skip, take })
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { title, slug, summary, keywords, body: contentBody } = body
  if (!title || !slug || !contentBody) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const newBrief = await db.createContentBrief({
    title,
    slug,
    summary,
    keywords,
    body: contentBody,
    createdBy: session.user.id,
  })
  return NextResponse.json({ brief: newBrief }, { status: 201 })
}
