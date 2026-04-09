import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface BookFirstAppointmentRequest {
  petName: string;
  breed: string;
  appointmentDatetime: string;
  clientName?: string;
  duration?: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: BookFirstAppointmentRequest = await req.json();
    const { petName, breed, appointmentDatetime, clientName, duration = 60 } = body;

    // Validate required fields
    if (!petName || !breed || !appointmentDatetime) {
      return NextResponse.json(
        { error: 'Missing required fields: petName, breed, and appointmentDatetime are required' },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const appointmentDate = new Date(appointmentDatetime);

    // Validate appointment date
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid appointment datetime' },
        { status: 400 }
      );
    }

    // Get user profile for default client name
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    const defaultClientName = profile?.businessName || clientName || 'First Client';

    // Atomic transaction: Create Client → Pet → Appointment
    const result = await prisma.$transaction(async (tx: any) => {
      // Check for time conflicts
      const existingAppointment = await tx.appointment.findFirst({
        where: {
          userId,
          status: { in: ['scheduled', 'confirmed'] },
          startTime: {
            lte: new Date(appointmentDate.getTime() + duration * 60 * 1000),
          },
          endTime: {
            gte: appointmentDate,
          },
        },
      });

      if (existingAppointment) {
        throw new Error('TIME_SLOT_CONFLICT');
      }

      // Create client
      const client = await tx.client.create({
        data: {
          userId,
          name: clientName || defaultClientName,
          email: null,
          phone: null,
          address: null,
          notes: null,
        },
      });

      // Create pet
      const pet = await tx.pet.create({
        data: {
          clientId: client.id,
          name: petName,
          breed,
          size: null,
          age: null,
          specialNotes: null,
        },
      });

      // Calculate end time
      const endTime = new Date(appointmentDate.getTime() + duration * 60 * 1000);

      // Create appointment
      const appointment = await tx.appointment.create({
        data: {
          userId,
          clientId: client.id,
          petId: pet.id,
          service: 'Full Groom', // Default service for onboarding
          startTime: appointmentDate,
          endTime,
          price: 6500, // Default $65.00 in cents
          status: 'scheduled',
          notes: null,
          reminderSent: false,
          noShowCharged: false,
        },
      });

      return {
        clientId: client.id,
        petId: pet.id,
        appointmentId: appointment.id,
        appointment,
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Book first appointment error:', error);

    if (error.message === 'TIME_SLOT_CONFLICT') {
      return NextResponse.json(
        { error: 'Time slot conflict: This time is already booked' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}
