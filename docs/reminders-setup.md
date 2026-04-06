# Appointment Reminder System Setup

This document describes how the automated appointment reminder system works.

## Overview

The reminder system sends email notifications to clients 24 hours before their scheduled appointment. It uses:
- **Resend API** for email delivery
- **Background job** to check for appointments
- **reminder_sent flag** to prevent duplicate emails

## Files

1. **Email Template**: `src/lib/email/templates/appointment-reminder.ts`
   - Generates personalized reminder emails with appointment details
   - Includes client name, pet name, service, date, and time

2. **Reminder Worker**: `src/lib/email/send-reminders.ts`
   - Queries database for appointments in next 24 hours
   - Filters out appointments where reminder_sent = true
   - Sends emails and marks reminder_sent = true

3. **Cron Endpoint**: `src/app/api/cron/send-reminders/route.ts`
   - Protected by CRON_SECRET environment variable
   - Triggers the reminder worker
   - Returns detailed results

## Cron Job Setup

To automate the reminder system, set up a cron job on the production server:

```bash
# Edit crontab
crontab -e

# Add this line to run every hour
0 * * * * curl -s "https://getgroomgrid.com/api/cron/send-reminders?secret=YOUR_CRON_SECRET" >> /var/log/groomgrid-reminders.log 2>&1
```

Replace `YOUR_CRON_SECRET` with the actual CRON_SECRET from your environment.

## Manual Testing

Test the reminder system manually:

```bash
curl "https://getgroomgrid.com/api/cron/send-reminders?secret=YOUR_CRON_SECRET"
```

Expected response:
```json
{
  "success": true,
  "message": "Reminder job completed",
  "results": {
    "total": 3,
    "sent": 3,
    "skipped": 0,
    "failed": 0,
    "errors": []
  }
}
```

## Environment Variables Required

- `RESEND_API_KEY`: Your Resend API key
- `CRON_SECRET`: Secret to protect cron endpoints
- `DATABASE_URL`: PostgreSQL connection string

## How It Works

1. Cron job calls `/api/cron/send-reminders` endpoint hourly
2. Endpoint verifies CRON_SECRET
3. Worker queries appointments where:
   - `start_time` is between now and 24 hours from now
   - `reminder_sent` is false
   - `status` is 'scheduled'
4. For each appointment:
   - Generate personalized email
   - Send via Resend API
   - Update `reminder_sent` to true
   - Log success/failure
5. Return summary of results

## Error Handling

- If client has no email: skip and log
- If Resend API fails: log error, don't mark sent
- All errors are captured and reported in results

## Database Schema

The appointments table already includes these fields:
- `reminder_sent` (boolean, default false)
- `no_show_charged` (boolean, default false)

These are defined in the Prisma schema at `prisma/schema.prisma`.
