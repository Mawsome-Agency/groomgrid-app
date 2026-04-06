import prisma from '@/lib/prisma'

function PlanBadge({ plan }: { plan: string }) {
  const isTrialPlan = plan === 'trial'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isTrialPlan
          ? 'bg-amber-100 text-amber-800'
          : 'bg-green-100 text-green-800'
      }`}
    >
      {plan}
    </span>
  )
}

function ScoreBadge({ score }: { score: number }) {
  let colorClass: string
  if (score > 50) {
    colorClass = 'bg-green-100 text-green-800'
  } else if (score >= 20) {
    colorClass = 'bg-amber-100 text-amber-800'
  } else {
    colorClass = 'bg-red-100 text-red-800'
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}
    >
      {score}
    </span>
  )
}

function formatDate(date: Date | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

async function getEngagementData() {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      _count: { select: { analyticsEvents: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return users.map((u) => ({
    userId: u.id,
    email: u.email,
    businessName: u.profile?.businessName ?? null,
    plan: u.profile?.subscriptionStatus ?? 'trial',
    trialEndsAt: u.profile?.trialEndsAt ?? null,
    signedUpAt: u.createdAt,
    eventCount: u._count.analyticsEvents,
    engagementScore: u._count.analyticsEvents,
  }))
}

export default async function EngagementPage() {
  let rows: Awaited<ReturnType<typeof getEngagementData>> = []
  let fetchError: string | null = null

  try {
    rows = await getEngagementData()
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Unknown error'
  }

  const total = rows.length
  const avgScore =
    rows.length > 0
      ? Math.round(rows.reduce((sum, r) => sum + r.engagementScore, 0) / rows.length)
      : 0

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-800">
            User Engagement Dashboard
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Sorted by signup date. Engagement score = total analytics events.
          </p>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Total Users</p>
            <p className="mt-1 text-2xl font-bold text-stone-800">{total}</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Avg Engagement</p>
            <p className="mt-1 text-2xl font-bold text-stone-800">{avgScore}</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">High Engagement</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {rows.filter((r) => r.engagementScore > 50).length}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">At Risk</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {rows.filter((r) => r.engagementScore < 20).length}
            </p>
          </div>
        </div>

        {fetchError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load engagement data: {fetchError}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Business
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Signed Up
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Trial Ends
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Events
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rows.length === 0 && !fetchError && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-stone-400"
                    >
                      No users yet.
                    </td>
                  </tr>
                )}
                {rows.map((row) => (
                  <tr
                    key={row.userId}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-stone-800">
                      {row.email}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {row.businessName ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <PlanBadge plan={row.plan} />
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {formatDate(row.signedUpAt)}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {formatDate(row.trialEndsAt)}
                    </td>
                    <td className="px-4 py-3 text-center text-stone-700">
                      {row.eventCount}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ScoreBadge score={row.engagementScore} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
