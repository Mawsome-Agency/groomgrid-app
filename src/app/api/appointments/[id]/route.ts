import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Service definitions with duration in minutes and price in cents
const SERVICES: Record<string, { duration: number; price: number }> = {
  'Full Groom': { duration: 120, price: 6500 },
  'Bath + Brush': { duration: 60, price: 4000 },
  'Nail Trim': { duration: 15, price: 2000 },
  'Teeth Brushing': { duration: 10, price: 1500 },
};

// PATCH /api/appointments/[id] - Update an appointment
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointmentId = params.id;
    const updates = await req.json();

    // Get the existing appointment
    const existing = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    if (updates.status) {
      // Validate status
      const validStatuses = ['scheduled', 'completed', 'cancelled', 'no_show'];
      if (!validStatuses.includes(updates.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updateData.status = updates.status;
    }

    if (updates.date || updates.time) {
      const date = updates.date || new Date(existing.startTime).toISOString().split('T')[0];
      const time = updates.time || '';
      const service = updates.service || existing.service;

      // Calculate new start and end times
      const serviceInfo = SERVICES[service];
      if (!serviceInfo) {
        return NextResponse.json({ error: 'Invalid service' }, { status: 400 });
      }

      // Parse time (format: "10:00 AM")
      const [hours, minutes] = time.split(':').map((v: string) => parseInt(v.split(' ')[0]));
      const isPm = time.includes('PM');
      const adjustedHours = isPm && hours !== 12 ? hours + 12 : hours === 12 && !isPm ? 0 : hours;

      const startTime = new Date(date);
      startTime.setHours(adjustedHours, minutes, 0, 0);

      const endTime = new Date(startTime.getTime() + serviceInfo.duration * 60 * 1000);

      // Check for conflicts (excluding this appointment)
      const conflicts = await prisma.appointment.findMany({
        where: {
          userId: userId,
          status: { in: ['scheduled', 'confirmed'] },
          id: { not: appointmentId },
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

      updateData.startTime = startTime;
      updateData.endTime = endTime;
    }

    if (updates.service) {
      const serviceInfo = SERVICES[updates.service];
      if (!serviceInfo) {
        return NextResponse.json({ error: 'Invalid service' }, { status: 400 });
      }
      updateData.service = updates.service;
      updateData.price = serviceInfo.price;
    }

    if (updates.notes !== undefined) {
      updateData.notes = updates.notes;
    }

    if (updates.reminderSent !== undefined) {
      updateData.reminderSent = updates.reminderSent;
    }

    if (updates.noShowCharged !== undefined) {
      updateData.noShowCharged = updates.noShowCharged;
    }

    if (updates.invoiceId !== undefined) {
      updateData.invoiceId = updates.invoiceId;
    }

    // Update the appointment
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        client: true,
        pet: true,
      },
    });

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Failed to update appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
