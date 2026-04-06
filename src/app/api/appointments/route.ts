import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Service definitions with duration in minutes and price in cents
const SERVICES: Record<string, { duration: number; price: number }> = {
  'Full Groom': { duration: 120, price: 6500 },
  'Bath + Brush': { duration: 60, price: 4000 },
  'Nail Trim': { duration: 15, price: 2000 },
  'Teeth Brushing': { duration: 10, price: 1500 },
};

// GET /api/appointments - List appointments with optional date filtering
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const whereClause: any = { userId: user.id };

    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        client: true,
        pet: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clientId, petId, service, date, time, notes } = await req.json();

    if (!clientId || !service || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: clientId, service, date, time' },
        { status: 400 }
      );
    }

    // Verify the client belongs to the current user
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client || client.userId !== user.id) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Verify the pet belongs to the client (if provided)
    if (petId) {
      const pet = await prisma.pet.findUnique({
        where: { id: petId },
      });

      if (!pet || pet.clientId !== clientId) {
        return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
      }
    }

    // Calculate start and end times
    const serviceInfo = SERVICES[service];
    if (!serviceInfo) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 });
    }

    // Parse date and time (format: "2024-04-06", "10:00 AM")
    const [hours, minutes] = time.split(':').map((v: string) => parseInt(v.split(' ')[0]));
    const isPm = time.includes('PM');
    const adjustedHours = isPm && hours !== 12 ? hours + 12 : hours === 12 && !isPm ? 0 : hours;

    const startTime = new Date(date);
    startTime.setHours(adjustedHours, minutes, 0, 0);

    const endTime = new Date(startTime.getTime() + serviceInfo.duration * 60 * 1000);

    // Check for conflicts with existing appointments
    const conflicts = await prisma.appointment.findMany({
      where: {
        userId: user.id,
        status: { in: ['scheduled', 'confirmed'] },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        clientId,
        petId,
        service,
        startTime,
        endTime,
        price: serviceInfo.price,
        status: 'scheduled',
        notes,
      },
      include: {
        client: true,
        pet: true,
      },
    });

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
