import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SERVICES, SERVICE_MAP } from '@/lib/services';
import { estimateGroomingTime } from '@/lib/breed-intelligence';
import { checkRateLimit } from '@/lib/rate-limit';
import { getBookingConfirmationEmail } from '@/lib/email/booking-confirmation';
import { getResend, FROM_EMAIL } from '@/lib/email/resend';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Parse a time string like "9:00 AM" into { hours24, minutes }.
 */
function parseTimeString(time: string): { hours24: number; minutes: number } {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    throw new Error(`Invalid time format: ${time}`);
  }
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return { hours24: hours, minutes };
}

/**
 * Build a Date object in the groomer's timezone for a given date + time string.
 * Uses Intl.DateTimeFormat to resolve the correct UTC offset for that tz + date.
 */
function buildDateInTimezone(
  dateStr: string, // "2026-04-10"
  timeStr: string, // "9:00 AM"
  timezone: string,
): Date {
  const { hours24, minutes } = parseTimeString(timeStr);
  const [year, month, day] = dateStr.split('-').map(Number);

  // Create a rough UTC date to probe the timezone offset
  const probe = new Date(Date.UTC(year, month - 1, day, hours24, minutes));

  // Use Intl to find the UTC offset for this timezone at this point in time
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(probe);
  const getPart = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value || '0', 10);

  const localYear = getPart('year');
  const localMonth = getPart('month');
  const localDay = getPart('day');
  const localHour = getPart('hour');
  const localMinute = getPart('minute');

  // Calculate offset: difference between probe UTC and what the tz reports
  const localAsUtc = Date.UTC(localYear, localMonth - 1, localDay, localHour, localMinute);
  const offsetMs = localAsUtc - probe.getTime();

  // Build the actual intended time: we want year-month-day hours24:minutes in tz
  // So the UTC time is (intended local time) - offset
  const intendedLocalUtc = Date.UTC(year, month - 1, day, hours24, minutes);
  return new Date(intendedLocalUtc - offsetMs);
}

/**
 * Generate time slots for a given day based on business hours.
 * Slots are generated at 30-minute intervals.
 */
function generateTimeSlots(openTime: string, closeTime: string): string[] {
  const slots: string[] = [];
  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);

  let current = openH * 60 + openM;
  const end = closeH * 60 + closeM;

  while (current < end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    slots.push(`${displayH}:${m.toString().padStart(2, '0')} ${period}`);
    current += 30;
  }

  return slots;
}

/**
 * Check if a time slot conflicts with any existing appointment.
 */
function isSlotTaken(
  slotStart: Date,
  slotEnd: Date,
  appointments: { startTime: Date; endTime: Date }[],
): boolean {
  return appointments.some(
    (appt) => slotStart < appt.endTime && slotEnd > appt.startTime,
  );
}

// ─── GET: Fetch groomer info + available slots ──────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`book-get:${ip}`, 30, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: rateCheck.retryAfter },
        { status: 429 },
      );
    }

    const { userId } = params;

    // Fetch user — 404 only for truly invalid userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        businessName: true,
        timezone: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Groomer not found' }, { status: 404 });
    }

    const timezone = user.timezone || 'America/New_York';

    // Fetch business hours
    const businessHours = await prisma.businessHours.findMany({
      where: { userId, enabled: true },
      orderBy: { dayOfWeek: 'asc' },
    });

    // Determine date range: next 30 days
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    // Fetch existing appointments in the window
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        userId,
        status: { in: ['scheduled', 'confirmed'] },
        startTime: { gte: startDate },
        endTime: { lte: endDate },
      },
      select: { startTime: true, endTime: true },
    });

    // Build available slots by date
    // C5: Always return 200 with same shape — empty slots is fine
    const slots: Record<string, string[]> = {};
    const bhMap = new Map<number, { openTime: string; closeTime: string }>();
    for (const bh of businessHours) {
      bhMap.set(bh.dayOfWeek, { openTime: bh.openTime, closeTime: bh.closeTime });
    }

    // Use the default service duration (Full Groom = 120 min) for slot blocking
    const defaultDuration = 60; // use 60 min as reasonable default slot block

    for (let d = 0; d < 30; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + d);
      const dayOfWeek = date.getDay();
      const bh = bhMap.get(dayOfWeek);
      if (!bh) continue;

      const dateStr = date.toISOString().split('T')[0];
      const timeSlots = generateTimeSlots(bh.openTime, bh.closeTime);
      const available: string[] = [];

      for (const slot of timeSlots) {
        const slotStart = buildDateInTimezone(dateStr, slot, timezone);
        const slotEnd = new Date(slotStart.getTime() + defaultDuration * 60 * 1000);

        // Skip past slots
        if (slotStart <= now) continue;

        if (!isSlotTaken(slotStart, slotEnd, existingAppointments)) {
          available.push(slot);
        }
      }

      // Include all dates that have business hours, even if no slots available
      slots[dateStr] = available;
    }

    // Services list for display
    const services = SERVICES.map((s) => ({
      name: s.name,
      duration: s.baseDuration,
      price: s.basePrice,
    }));

    return NextResponse.json({
      groomer: {
        businessName: user.businessName || 'Pet Grooming',
        timezone,
      },
      services,
      slots,
    });
  } catch (error) {
    console.error('Failed to fetch booking data:', error);
    return NextResponse.json(
      { error: 'Failed to load booking information' },
      { status: 500 },
    );
  }
}

// ─── POST: Create a booking ─────────────────────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    // C2: Rate limit
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`book-post:${ip}`, 10, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: rateCheck.retryAfter },
        { status: 429 },
      );
    }

    const { userId } = params;

    const body = await req.json();
    const { name, email, phone, petName, petBreed, petSize, service, date, time } = body;

    // Validate required fields
    const missing: string[] = [];
    if (!name) missing.push('name');
    if (!email) missing.push('email');
    if (!petName) missing.push('petName');
    if (!service) missing.push('service');
    if (!date) missing.push('date');
    if (!time) missing.push('time');

    if (missing.length > 0) {
      return NextResponse.json(
        { error: 'Validation error', fields: Object.fromEntries(missing.map((f) => [f, 'Required'])) },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Validation error', fields: { email: 'Invalid email address' } },
        { status: 400 },
      );
    }

    // Validate service
    const serviceInfo = SERVICE_MAP[service];
    if (!serviceInfo) {
      return NextResponse.json(
        { error: 'Validation error', fields: { service: 'Invalid service' } },
        { status: 400 },
      );
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(date + 'T00:00:00');
    if (bookingDate < today) {
      return NextResponse.json(
        { error: 'Validation error', fields: { date: 'Cannot book in the past' } },
        { status: 400 },
      );
    }

    // Verify groomer exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, businessName: true, timezone: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Groomer not found' }, { status: 404 });
    }

    const timezone = user.timezone || 'America/New_York';

    // Calculate duration using breed intelligence
    const estimate = estimateGroomingTime(service, petBreed, petSize);
    const durationMinutes = estimate.duration;

    // Build precise start/end times in groomer's timezone
    const startTime = buildDateInTimezone(date, time, timezone);
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    // C1: Transaction with conflict check — race condition protection
    const result = await prisma.$transaction(async (tx) => {
      // Check for conflicts within the transaction
      const conflicts = await tx.appointment.findMany({
        where: {
          userId,
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
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } },
              ],
            },
          ],
        },
      });

      if (conflicts.length > 0) {
        throw new Error('SLOT_TAKEN');
      }

      // C3: Upsert client with unique constraint on userId+email
      const client = await tx.client.upsert({
        where: {
          userId_email: { userId, email },
        },
        update: {
          name,
          phone: phone || undefined,
        },
        create: {
          userId,
          name,
          email,
          phone: phone || null,
        },
      });

      // Create pet record
      const pet = await tx.pet.create({
        data: {
          clientId: client.id,
          name: petName,
          breed: petBreed || null,
          size: petSize || null,
        },
      });

      // Create the appointment
      const appointment = await tx.appointment.create({
        data: {
          userId,
          clientId: client.id,
          petId: pet.id,
          service,
          startTime,
          endTime,
          price: serviceInfo.basePrice,
          status: 'scheduled',
        },
      });

      return { appointment, client, pet };
    });

    // Send confirmation email (non-blocking — don't fail the booking if email fails)
    let emailSent = false;
    try {
      const resend = getResend();
      const emailContent = getBookingConfirmationEmail(
        name,
        petName,
        service,
        date,
        time,
        user.businessName || 'Your Groomer',
      );

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
    }

    return NextResponse.json({
      appointmentId: result.appointment.id,
      client: {
        name: result.client.name,
        email: result.client.email,
        emailSent,
      },
    });
  } catch (error: any) {
    if (error.message === 'SLOT_TAKEN') {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 },
      );
    }

    console.error('Failed to create booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 },
    );
  }
}
