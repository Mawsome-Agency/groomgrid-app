import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/clients/[id]/pets - Add a pet to a client
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = params.id;

    // Verify the client belongs to the current user
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client || client.userId !== user.id) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const { name, breed, size, age, specialNotes } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Pet name is required' }, { status: 400 });
    }

    const pet = await prisma.pet.create({
      data: {
        clientId,
        name,
        breed,
        size,
        age,
        specialNotes,
      },
    });

    return NextResponse.json({ pet });
  } catch (error) {
    console.error('Failed to create pet:', error);
    return NextResponse.json({ error: 'Failed to create pet' }, { status: 500 });
  }
}
