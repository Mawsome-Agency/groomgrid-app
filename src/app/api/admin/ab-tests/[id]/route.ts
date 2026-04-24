import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { prisma } from '@/lib/prisma';
import { updateTestStatus, deleteTest } from '@/lib/ab-test-metrics';

// ── Auth helper ───────────────────────────────────────────────────────
async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }
  return null;
}

// GET - Get single test
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    const test = await prisma.aBTest.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            assignments: true,
            conversions: true,
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    return NextResponse.json({ test });
  } catch (error) {
    console.error('[Admin AB Test] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test' },
      { status: 500 }
    );
  }
}

// PATCH - Update test status or split ratio
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    const body = await req.json();
    const { active, splitRatio, endedAt } = body;

    // Update test
    const updateData: any = {};
    if (typeof active === 'boolean') {
      updateData.active = active;
      updateData.endedAt = active ? null : endedAt || new Date();
    }
    if (typeof splitRatio === 'number') {
      updateData.splitRatio = splitRatio;
    }

    const test = await prisma.aBTest.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ test });
  } catch (error) {
    console.error('[Admin AB Test] PATCH Error:', error);
    return NextResponse.json(
      { error: 'Failed to update test' },
      { status: 500 }
    );
  }
}

// DELETE - Delete test
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    await deleteTest(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Admin AB Test] DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete test' },
      { status: 500 }
    );
  }
}
