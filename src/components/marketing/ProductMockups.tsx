'use client';

import { cn } from '@/lib/utils';

/**
 * Shared wrapper that gives every mockup a consistent phone/laptop frame.
 * The "screen" area uses the actual GroomGrid green palette.
 */
function DeviceFrame({
  children,
  className,
  variant = 'desktop',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'desktop' | 'mobile';
}) {
  if (variant === 'mobile') {
    return (
      <div
        className={cn(
          'relative mx-auto max-w-[280px] rounded-[2rem] border-[6px] border-stone-800 bg-stone-800 shadow-2xl overflow-hidden',
          className,
        )}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-stone-800 rounded-b-xl z-10" />
        <div className="bg-white overflow-hidden">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-xl border border-stone-200 bg-white shadow-2xl overflow-hidden',
        className,
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 border-b border-stone-200">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <div className="flex-1 mx-4">
          <div className="bg-white rounded-md px-3 py-0.5 text-xs text-stone-400 border border-stone-200 max-w-xs truncate">
            app.getgroomgrid.com
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── Dashboard Mockup (hero) ─────────────────────────────────────────────── */

export function DashboardMockup({ className }: { className?: string }) {
  return (
    <DeviceFrame className={className} variant="desktop">
      <div className="min-h-[340px] bg-stone-50">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-stone-100">
          <div className="flex items-center gap-3">
            <span className="text-green-600 font-bold text-sm">GroomGrid</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <span>Today</span>
            <span>Schedule</span>
            <span>Clients</span>
            <div className="w-6 h-6 rounded-full bg-green-500" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 p-4">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-[10px]">📅</div>
              <span className="text-[10px] text-stone-400">Today</span>
            </div>
            <p className="text-lg font-bold text-stone-900">6</p>
            <p className="text-[9px] text-stone-400">appointments</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-[10px]">👥</div>
              <span className="text-[10px] text-stone-400">Clients</span>
            </div>
            <p className="text-lg font-bold text-stone-900">47</p>
            <p className="text-[9px] text-stone-400">total</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-[10px]">$</div>
              <span className="text-[10px] text-stone-400">Revenue</span>
            </div>
            <p className="text-lg font-bold text-stone-900">$1,240</p>
            <p className="text-[9px] text-stone-400">this week</p>
          </div>
        </div>

        {/* Appointment list */}
        <div className="px-4 pb-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-3 py-2 border-b border-stone-100">
              <span className="text-xs font-semibold text-stone-700">Today&apos;s Appointments</span>
            </div>
            {[
              { time: '9:00 AM', dog: 'Biscuit', breed: 'Golden Retriever', service: 'Full Groom', status: 'completed' },
              { time: '10:30 AM', dog: 'Luna', breed: 'Labradoodle', service: 'Bath + Brush', status: 'in-progress' },
              { time: '12:00 PM', dog: 'Mr. Whiskers', breed: 'Persian Cat', service: 'Full Groom', status: 'upcoming' },
            ].map((appt) => (
              <div key={appt.dog} className="flex items-center gap-3 px-3 py-2 border-b border-stone-50 last:border-0">
                <span className="text-[10px] text-stone-400 w-16">{appt.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-800 truncate">{appt.dog} · {appt.breed}</p>
                  <p className="text-[10px] text-stone-400">{appt.service}</p>
                </div>
                <span className={cn(
                  'text-[9px] px-2 py-0.5 rounded-full font-medium',
                  appt.status === 'completed' && 'bg-green-100 text-green-700',
                  appt.status === 'in-progress' && 'bg-blue-100 text-blue-700',
                  appt.status === 'upcoming' && 'bg-stone-100 text-stone-500',
                )}>
                  {appt.status === 'completed' ? '✓ Done' : appt.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DeviceFrame>
  );
}

/* ─── Calendar Mockup ─────────────────────────────────────────────────────── */

export function CalendarMockup({ className }: { className?: string }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const appointments = [
    { day: 1, slots: 3 },
    { day: 2, slots: 5 },
    { day: 3, slots: 4 },
    { day: 4, slots: 6 },
    { day: 5, slots: 2 },
    { day: 6, slots: 1 },
    { day: 7, slots: 0 },
  ];

  return (
    <DeviceFrame className={className} variant="desktop">
      <div className="p-4 bg-white">
        {/* Calendar header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-stone-900">May 2026</p>
            <p className="text-[10px] text-stone-400">Week view</p>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center text-[10px] text-stone-400">←</div>
            <div className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center text-[10px] text-stone-400">→</div>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((d) => (
            <div key={d} className="text-center text-[9px] text-stone-400 font-medium">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {appointments.map((appt) => (
            <div
              key={appt.day}
              className={cn(
                'rounded-lg p-1.5 text-center min-h-[48px] flex flex-col items-center justify-center',
                appt.day === 4 ? 'bg-green-500 text-white' : 'bg-stone-50',
              )}
            >
              <span className={cn(
                'text-xs font-semibold',
                appt.day === 4 ? 'text-white' : 'text-stone-700',
              )}>
                {appt.day}
              </span>
              {appt.slots > 0 && (
                <span className={cn(
                  'text-[8px] mt-0.5',
                  appt.day === 4 ? 'text-green-100' : 'text-stone-400',
                )}>
                  {appt.slots} appt{appt.slots !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <div className="mt-3 space-y-1.5">
          {[
            { time: '10:30 AM', name: 'Biscuit', service: 'Full Groom' },
            { time: '1:00 PM', name: 'Luna', service: 'Bath + Brush' },
          ].map((appt) => (
            <div key={appt.time} className="flex items-center gap-2 bg-green-50 rounded-lg px-2.5 py-1.5">
              <div className="w-1 h-6 bg-green-500 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-stone-800">{appt.name}</p>
                <p className="text-[8px] text-stone-400">{appt.service}</p>
              </div>
              <span className="text-[9px] text-stone-500">{appt.time}</span>
            </div>
          ))}
        </div>
      </div>
    </DeviceFrame>
  );
}

/* ─── Pet Profile Mockup ────────────────────────────────────────────────────── */

export function PetProfileMockup({ className }: { className?: string }) {
  return (
    <DeviceFrame className={className} variant="mobile">
      <div className="p-3 bg-white">
        {/* Profile header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
            🐕
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-stone-900">Biscuit</p>
            <p className="text-[10px] text-stone-500">Golden Retriever · 65 lbs</p>
            <div className="flex gap-1 mt-1">
              <span className="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Up to date</span>
              <span className="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">Friendly</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          {[
            { label: 'Allergies', value: 'Chicken, wheat', icon: '⚠️' },
            { label: 'Coat type', value: 'Double coat, medium', icon: '✂️' },
            { label: 'Last groom', value: 'Apr 28, 2026', icon: '📅' },
            { label: 'Preferred style', value: 'Teddy bear cut', icon: '🐾' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 bg-stone-50 rounded-lg px-2.5 py-2">
              <span className="text-xs">{item.icon}</span>
              <div className="flex-1">
                <p className="text-[9px] text-stone-400">{item.label}</p>
                <p className="text-[10px] font-medium text-stone-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
          <p className="text-[9px] font-semibold text-yellow-800 mb-0.5">⚠ Groomer notes</p>
          <p className="text-[10px] text-yellow-700">Sensitive around ears. Use snood. Prefers warm water. Owner likes face trimmed short.</p>
        </div>
      </div>
    </DeviceFrame>
  );
}

/* ─── Payment Mockup ──────────────────────────────────────────────────────── */

export function PaymentMockup({ className }: { className?: string }) {
  return (
    <DeviceFrame className={className} variant="mobile">
      <div className="p-3 bg-white">
        {/* Payment status */}
        <div className="text-center mb-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2 text-lg">
            ✓
          </div>
          <p className="text-sm font-bold text-stone-900">Payment Received</p>
          <p className="text-[10px] text-stone-400">Just now</p>
        </div>

        {/* Amount */}
        <div className="bg-green-50 rounded-xl p-3 text-center mb-3">
          <p className="text-2xl font-extrabold text-green-600">$85.00</p>
          <p className="text-[10px] text-stone-500">Full Groom · Biscuit</p>
        </div>

        {/* Transaction details */}
        <div className="space-y-1.5">
          {[
            { label: 'Client', value: 'Sarah M.' },
            { label: 'Service', value: 'Full Groom' },
            { label: 'Payment', value: '•••• 4242' },
            { label: 'Status', value: 'Completed ✓' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-[10px] px-1 py-1 border-b border-stone-50">
              <span className="text-stone-400">{item.label}</span>
              <span className="font-medium text-stone-700">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mt-3 flex gap-2">
          <div className="flex-1 bg-stone-50 rounded-lg p-2 text-center">
            <p className="text-[9px] text-stone-400">Receipt</p>
            <p className="text-[10px] font-medium text-stone-700">Send →</p>
          </div>
          <div className="flex-1 bg-stone-50 rounded-lg p-2 text-center">
            <p className="text-[9px] text-stone-400">Rebook</p>
            <p className="text-[10px] font-medium text-stone-700">4 wks</p>
          </div>
        </div>
      </div>
    </DeviceFrame>
  );
}

/* ─── Feature Row Mockup (side-by-side calendar + pet profile) ─────────────── */

export function FeatureRowMockup({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6', className)}>
      <CalendarMockup />
      <PetProfileMockup />
    </div>
  );
}

/* ─── Reminder Mockup ───────────────────────────────────────────────────────── */

export function ReminderMockup({ className }: { className?: string }) {
  return (
    <DeviceFrame className={className} variant="mobile">
      <div className="p-3 bg-white">
        {/* SMS preview */}
        <div className="bg-stone-50 rounded-xl p-3 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-bold">GG</div>
            <div>
              <p className="text-[10px] font-bold text-stone-800">GroomGrid</p>
              <p className="text-[8px] text-stone-400">SMS · 2h before</p>
            </div>
          </div>
          <div className="bg-white rounded-xl rounded-tl-sm p-2.5 shadow-sm">
            <p className="text-[10px] text-stone-700 leading-relaxed">
              Hi Sarah! 👋 Your appointment for Biscuit is today at 10:30 AM — Full Groom. Reply C to confirm or R to reschedule.
            </p>
          </div>
        </div>

        {/* Confirmation */}
        <div className="bg-green-50 rounded-xl p-2.5 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">✓</div>
          <div>
            <p className="text-[10px] font-medium text-green-800">Client confirmed ✓</p>
            <p className="text-[8px] text-green-600">Sarah confirmed · 8:47 AM</p>
          </div>
        </div>
      </div>
    </DeviceFrame>
  );
}

/* ─── Three-up feature showcase ────────────────────────────────────────────── */

export function FeatureShowcase({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6', className)}>
      <div className="space-y-3">
        <div className="text-center">
          <span className="text-2xl">📅</span>
          <p className="text-sm font-bold text-stone-800 mt-1">Smart Scheduling</p>
        </div>
        <CalendarMockup />
        <p className="text-xs text-stone-500 text-center">
          See your whole week at a glance. Conflicts flagged before they happen.
        </p>
      </div>
      <div className="space-y-3">
        <div className="text-center">
          <span className="text-2xl">🐾</span>
          <p className="text-sm font-bold text-stone-800 mt-1">Pet Profiles</p>
        </div>
        <PetProfileMockup />
        <p className="text-xs text-stone-500 text-center">
          Allergies, breed notes, preferences — everything in one place.
        </p>
      </div>
      <div className="space-y-3">
        <div className="text-center">
          <span className="text-2xl">💳</span>
          <p className="text-sm font-bold text-stone-800 mt-1">Instant Payments</p>
        </div>
        <PaymentMockup />
        <p className="text-xs text-stone-500 text-center">
          Get paid at booking. No chasing invoices. Money hits your account fast.
        </p>
      </div>
    </div>
  );
}
