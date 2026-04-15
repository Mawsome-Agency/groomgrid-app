import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import * as db from '@/lib/content-briefs/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const brief = await db.getContentBrief(params.id)
  if (!brief) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ brief })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await request.json()
  const updated = await db.updateContentBrief(params.id, data)
  return NextResponse.json({ brief: updated })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await db.deleteContentBrief(params.id)
  return NextResponse.json({ success: true })
}
