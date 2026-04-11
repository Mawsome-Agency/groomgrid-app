import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateTestStatus, deleteTest } from '@/lib/ab-test-metrics';

// GET - Get single test
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
