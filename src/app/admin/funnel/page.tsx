import { Users, TrendingDown, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

async function getFunnelData(days: number = 30) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/admin/funnel?days=${days}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch funnel data');
  }

  return res.json();
}

function FunnelStepIndicator({ stage, label, users, conversionRate, isLast }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-stone-700 truncate">{label}</span>
          <span className="text-xs text-stone-500">{users} users</span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${conversionRate}%` }}
          />
        </div>
        <div className="text-xs text-stone-500 mt-1">{conversionRate}% conversion</div>
      </div>
      {!isLast && <ArrowRight className="w-5 h-5 text-stone-300 flex-shrink-0" />}
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-stone-800">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default async function FunnelAnalyticsPage() {
  let data: any = null;
  let error: string | null = null;

  try {
    data = await getFunnelData(30);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-800">Signup Funnel Analytics</h1>
          <p className="mt-1 text-sm text-stone-500">
            Track user journey from signup to dashboard activation
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load funnel data: {error}
          </div>
        )}

        {data && (
          <>
            {/* Summary Metrics */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <MetricCard
                title="Total Started"
                value={data.metrics.totalUsers}
                icon={Users}
                color="bg-blue-100 text-blue-600"
              />
              <MetricCard
                title="Overall Conversion"
                value={`${data.metrics.overallConversion}%`}
                icon={TrendingDown}
                color="bg-green-100 text-green-600"
              />
              <MetricCard
                title="Drop-off Points"
                value={data.dropOffs.length}
                icon={AlertTriangle}
                color="bg-amber-100 text-amber-600"
              />
              <MetricCard
                title="Data Period"
                value={`${data.period.days} days`}
                icon={Clock}
                color="bg-purple-100 text-purple-600"
              />
            </div>

            {/* Funnel Overview */}
            <div className="mb-8 rounded-xl border border-stone-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-stone-800 mb-6">Funnel Overview</h2>
              <div className="space-y-4">
                {data.metrics.stages.map((stage: any, index: number) => (
                  <FunnelStepIndicator
                    key={stage.stage}
                    {...stage}
                    isLast={index === data.metrics.stages.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Drop-off Points */}
            {data.dropOffs.length > 0 && (
              <div className="mb-8 rounded-xl border border-stone-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-stone-800 mb-4">Drop-off Points</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone-100">
                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                          Stage
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                          Exit Point
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.dropOffs.map((dropOff: any, index: number) => (
                        <tr
                          key={index}
                          className="border-b border-stone-50 hover:bg-stone-50"
                        >
                          <td className="px-4 py-3 font-medium text-stone-800">{dropOff.stage}</td>
                          <td className="px-4 py-3 text-stone-600">{dropOff.exitPoint}</td>
                          <td className="px-4 py-3 text-right text-stone-700">{dropOff.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Error Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Field Validation Errors */}
              {data.errors.fieldValidationErrors.length > 0 && (
                <div className="rounded-xl border border-stone-200 bg-white p-6">
                  <h3 className="text-sm font-semibold text-stone-800 mb-4">Field Validation Errors</h3>
                  <div className="space-y-2">
                    {data.errors.fieldValidationErrors.map((error: any, index: number) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-stone-600">
                          {error.fieldName}: {error.errorType}
                        </span>
                        <span className="font-medium text-stone-800">{error.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* API Errors */}
              {data.errors.apiErrors.length > 0 && (
                <div className="rounded-xl border border-stone-200 bg-white p-6">
                  <h3 className="text-sm font-semibold text-stone-800 mb-4">API Errors</h3>
                  <div className="space-y-2">
                    {data.errors.apiErrors.map((error: any, index: number) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-stone-600">
                          {error.endpoint}: {error.errorType}
                        </span>
                        <span className="font-medium text-stone-800">{error.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Errors */}
              {data.errors.paymentErrors.length > 0 && (
                <div className="rounded-xl border border-stone-200 bg-white p-6">
                  <h3 className="text-sm font-semibold text-stone-800 mb-4">Payment Errors</h3>
                  <div className="space-y-2">
                    {data.errors.paymentErrors.map((error: any, index: number) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-stone-600">
                          {error.errorType}: {error.declineCode}
                        </span>
                        <span className="font-medium text-stone-800">{error.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* No Data Message */}
            {data.dropOffs.length === 0 &&
              data.errors.fieldValidationErrors.length === 0 &&
              data.errors.apiErrors.length === 0 &&
              data.errors.paymentErrors.length === 0 && (
                <div className="text-center py-12 text-stone-400">
                  No funnel data available for the selected period.
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
