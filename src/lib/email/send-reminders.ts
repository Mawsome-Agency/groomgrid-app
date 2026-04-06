import { Resend } from 'resend'
import prisma from '@/lib/prisma'
import { appointmentReminderEmail } from './templates/appointment-reminder'
import { FROM_EMAIL } from './resend'

// Send reminder email for a single appointment
async function sendReminderForAppointment(appointment: any) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const emailContent = appointmentReminderEmail({
      clientName: appointment.client.name,
      petName: appointment.pet?.name || null,
      service: appointment.service,
      date: appointment.startTime,
      time: appointment.startTime,
      businessName: appointment.user.businessName || 'GroomGrid',
    })

    if (!appointment.client.email) {
      console.log(`No email address for client ${appointment.client.id} - skipping reminder`)
      return { skipped: true, reason: 'no_email' }
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: appointment.client.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    })

    // Mark the reminder as sent
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { reminderSent: true },
    })

    console.log(`✓ Reminder sent for appointment ${appointment.id}`)
    return { sent: true, appointmentId: appointment.id }
  } catch (error) {
    console.error(`✗ Failed to send reminder for appointment ${appointment.id}:`, error)
    return { sent: false, appointmentId: appointment.id, error: String(error) }
  }
}

// Main function to check and send reminders
export async function sendAppointmentReminders() {
  console.log('🔄 Checking for appointments in next 24 hours...')

  try {
    // Get current time and time 24 hours from now
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    // Find appointments in the next 24 hours that haven't had reminders sent
    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: now,
          lte: tomorrow,
        },
        reminderSent: false,
        status: 'scheduled',
      },
      include: {
        user: true,
        client: true,
        pet: true,
      },
    })

    console.log(`Found ${appointments.length} appointments needing reminders`)

    const results = {
      total: appointments.length,
      sent: 0,
      skipped: 0,
      failed: 0,
      errors: [] as any[],
    }

    // Send reminders for each appointment
    for (const appointment of appointments) {
      const result = await sendReminderForAppointment(appointment)

      if (result.sent) {
        results.sent++
      } else if (result.skipped) {
        results.skipped++
      } else {
        results.failed++
        if (result.error) {
          results.errors.push({
            appointmentId: result.appointmentId,
            error: result.error,
          })
        }
      }
    }

    console.log('Reminder job completed:', JSON.stringify(results, null, 2))
    return results
  } catch (error) {
    console.error('Fatal error in reminder job:', error)
    throw error
  }
}
