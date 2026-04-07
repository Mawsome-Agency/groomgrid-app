import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/business-hours - Get business hours for current user
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const businessHours = await prisma.businessHours.findMany({
      where: { userId: user.id },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json({ businessHours });
  } catch (error) {
    console.error('Failed to fetch business hours:', error);
    return NextResponse.json({ error: 'Failed to fetch business hours' }, { status: 500 });
  }
}

// POST /api/business-hours - Save business hours for current user
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { hours } = await req.json();

    if (!hours || !Array.isArray(hours)) {
      return NextResponse.json({ error: 'Invalid hours data' }, { status: 400 });
    }

    // Validate hours format
    const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < hours.length; i++) {
      const day = hours[i];
      if (!day || typeof day !== 'object') continue;
      
      if (day.enabled && (!day.open || !day.close)) {
        return NextResponse.json(
          { error: `Open and close times required for ${DAYS[i]}` },
          { status: 400 }
        );
      }
    }

    // Delete existing hours for this user
    await prisma.businessHours.deleteMany({
      where: { userId: user.id },
    });

    // Create new hours
    const businessHours = await Promise.all(
      hours.map((hour: any, index: number) =>
        prisma.businessHours.create({
          data: {
            userId: user.id,
            dayOfWeek: index,
            openTime: hour.open || '09:00',
            closeTime: hour.close || '17:00',
            enabled: hour.enabled ?? false,
          },
        })
      )
    );

    return NextResponse.json({ businessHours });
  } catch (error) {
    console.error('Failed to save business hours:', error);
    return NextResponse.json({ error: 'Failed to save business hours' }, { status: 500 });
  }
}
