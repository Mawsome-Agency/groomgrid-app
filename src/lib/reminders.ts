import prisma from '@/lib/prisma'
import { send24hReminder, sendDayOfReminder } from '@/lib/email/reminder-templates'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://getgroomgrid.com'

// Window for 24h reminders: appointments starting between 23h and 25h from now
const REMIND_24H_WINDOW_START_HOURS = 23
const REMIND_24H_WINDOW_END_HOURS = 25

// Window for day-of reminders: appointments starting between 0h and 12h from now
// The cron should be called in the early morning (e.g. 7–8 AM) to target today's appointments
const REMIND_DAY_OF_WINDOW_END_HOURS = 12

export interface ReminderResult {
  appointmentId: string
  clientName: string
  type: '24h' | 'day_of'
  status: 'sent' | 'failed' | 'skipped'
  error?: string
}

// ─── Find appointments needing 24h reminders ─────────────────────────────────

export async function findAppointmentsFor24hReminder() {
  const now = new Date()
  const windowStart = new Date(now.getTime() + REMIND_24H_WINDOW_START_HOURS * 60 * 60 * 1000)
  const windowEnd = new Date(now.getTime() + REMIND_24H_WINDOW_END_HOURS * 60 * 60 * 1000)

  return prisma.appointment.findMany({
    where: {
      status: 'scheduled',
      reminderSent: false,
      startTime: {
        gte: windowStart,
        lte: windowEnd,
      },
    },
    include: {
      client: true,
      pet: true,
      user: {
        select: { email: true, businessName: true, profile: true },
      },
    },
  })
}

// ─── Find appointments needing day-of reminders ──────────────────────────────

export async function findAppointmentsForDayOfReminder() {
  const now = new Date()
  const windowEnd = new Date(now.getTime() + REMIND_DAY_OF_WINDOW_END_HOURS * 60 * 60 * 1000)

  return prisma.appointment.findMany({
    where: {
      status: 'scheduled',
      dayOfReminderSent: false,
      startTime: {
        gte: now,
        lte: windowEnd,
      },
    },
    include: {
      client: true,
      pet: true,
      user: {
        select: { email: true, businessName: true, profile: true },
      },
    },
  })
}

// ─── Process a single 24h reminder ───────────────────────────────────────────

export async function process24hReminder(appointmentId: string): Promise<ReminderResult> {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      client: true,
      pet: true,
      user: {
        select: { email: true, businessName: true, profile: true },
      },
    },
  })

  if (!appointment) {
    throw new Error(`Appointment ${appointmentId} not found`)
  }

  // Skip if already sent, cancelled, or completed
  if (appointment.reminderSent || appointment.status !== 'scheduled') {
    return {
      appointmentId,
      clientName: appointment.client.name,
      type: '24h',
      status: 'skipped',
    }
  }

  // Mark sent first to prevent double-send on concurrent runs
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { reminderSent: true },
  })

  const groomerEmail = appointment.user.email
  const groomerName =
    appointment.user.profile?.businessName ?? appointment.user.businessName ?? groomerEmail

  try {
    await send24hReminder({
      groomerEmail,
      groomerName,
      appointment: {
        clientName: appointment.client.name,
        petName: appointment.pet?.name,
        service: appointment.service,
        startTime: appointment.startTime,
        price: appointment.price,
        clientAddress: appointment.client.address ?? undefined,
        clientPhone: appointment.client.phone ?? undefined,
        notes: appointment.notes ?? undefined,
      },
      appUrl: APP_URL,
    })

    console.log(`[reminders] 24h reminder sent for appointment ${appointmentId} — ${appointment.client.name}`)

    return {
      appointmentId,
      clientName: appointment.client.name,
      type: '24h',
      status: 'sent',
    }
  } catch (err: any) {
    // Roll back the flag so it can be retried
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { reminderSent: false },
    }).catch(() => {/* best effort */})

    console.error(`[reminders] Failed to send 24h reminder for ${appointmentId}:`, err)

    return {
      appointmentId,
      clientName: appointment.client.name,
      type: '24h',
      status: 'failed',
      error: err?.message ?? 'Unknown error',
    }
  }
}

// ─── Process a single day-of reminder ────────────────────────────────────────

export async function processDayOfReminder(appointmentId: string): Promise<ReminderResult> {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      client: true,
      pet: true,
      user: {
        select: { email: true, businessName: true, profile: true },
      },
    },
  })

  if (!appointment) {
    throw new Error(`Appointment ${appointmentId} not found`)
  }

  // Skip if already sent, cancelled, or completed
  if (appointment.dayOfReminderSent || appointment.status !== 'scheduled') {
    return {
      appointmentId,
      clientName: appointment.client.name,
      type: 'day_of',
      status: 'skipped',
    }
  }

  // Mark sent first to prevent double-send on concurrent runs
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { dayOfReminderSent: true },
  })

  const groomerEmail = appointment.user.email
  const groomerName =
    appointment.user.profile?.businessName ?? appointment.user.businessName ?? groomerEmail

  try {
    await sendDayOfReminder({
      groomerEmail,
      groomerName,
      appointment: {
        clientName: appointment.client.name,
        petName: appointment.pet?.name,
        service: appointment.service,
        startTime: appointment.startTime,
        price: appointment.price,
        clientAddress: appointment.client.address ?? undefined,
        clientPhone: appointment.client.phone ?? undefined,
        notes: appointment.notes ?? undefined,
      },
      appUrl: APP_URL,
    })

    console.log(`[reminders] Day-of reminder sent for appointment ${appointmentId} — ${appointment.client.name}`)

    return {
      appointmentId,
      clientName: appointment.client.name,
      type: 'day_of',
      status: 'sent',
    }
  } catch (err: any) {
    // Roll back the flag so it can be retried
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { dayOfReminderSent: false },
    }).catch(() => {/* best effort */})

    console.error(`[reminders] Failed to send day-of reminder for ${appointmentId}:`, err)

    return {
      appointmentId,
      clientName: appointment.client.name,
      type: 'day_of',
      status: 'failed',
      error: err?.message ?? 'Unknown error',
    }
  }
}
