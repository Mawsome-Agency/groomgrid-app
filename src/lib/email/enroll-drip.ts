import { createAdminClient } from '@/lib/supabase/admin'

const DRIP_DAYS = [0, 1, 3, 7, 14]

export async function enrollUserInDrip(
  userId: string,
  email: string,
  signupDate: Date = new Date()
): Promise<void> {
  const supabase = createAdminClient()

  const rows = DRIP_DAYS.map((day) => ({
    user_id: userId,
    email,
    sequence_step: day,
    scheduled_at: new Date(
      signupDate.getTime() + day * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: 'pending',
  }))

  const { error } = await supabase.from('drip_email_queue').insert(rows)
  if (error) throw new Error(`Failed to enroll user in drip: ${error.message}`)
}
