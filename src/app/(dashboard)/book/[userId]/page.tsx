'use client';

import { useState, useEffect, useMemo } from 'react';
import { notFound } from 'next/navigation';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ServiceInfo {
  name: string;
  duration: number;
  price: number;
}

interface BookingData {
  groomer: { businessName: string; timezone: string };
  services: ServiceInfo[];
  slots: Record<string, string[]>;
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  petName: string;
  petBreed: string;
  petSize: string;
  service: string;
  date: string;
  time: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(cents: number): string {
  return `$${Math.round(cents / 100)}`;
}

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function BookingPage({ params }: { params: { userId: string } }) {
  const { userId } = params;

  const [data, setData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [is404, setIs404] = useState(false);

  const [form, setForm] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    petName: '',
    petBreed: '',
    petSize: '',
    service: '',
    date: '',
    time: '',
  });

  // Fetch groomer data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/book/${userId}`);
        if (res.status === 404) {
          setIs404(true);
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to load booking data');
        }
        const json = await res.json();
        setData(json);

        // Pre-select first service
        if (json.services?.length > 0) {
          setForm((prev) => ({ ...prev, service: json.services[0].name }));
        }

        // Pre-select first date with available slots
        if (json.slots) {
          const firstDateWithSlots = Object.entries(json.slots).find(
            ([, slots]) => (slots as string[]).length > 0,
          );
          if (firstDateWithSlots) {
            setForm((prev) => ({ ...prev, date: firstDateWithSlots[0] }));
          }
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  // If 404, use Next.js notFound
  useEffect(() => {
    if (is404) notFound();
  }, [is404]);

  // Available dates (those with slots defined)
  const availableDates = useMemo(() => {
    if (!data?.slots) return [];
    return Object.keys(data.slots).sort();
  }, [data]);

  // Slots for selected date
  const slotsForDate = useMemo(() => {
    if (!data?.slots || !form.date) return [];
    return data.slots[form.date] || [];
  }, [data, form.date]);

  // Today string for min date
  const today = new Date().toISOString().split('T')[0];

  // Form validation
  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.petName.trim() &&
    form.service &&
    form.date &&
    form.time;

  // Handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitError('');
    setSubmitting(true);

    try {
      const res = await fetch(`/api/book/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (res.status === 409) {
        setSubmitError(
          'This time slot is no longer available. Please select a different time.',
        );
        return;
      }

      if (res.status === 429) {
        setSubmitError('Too many requests. Please wait a few minutes and try again.');
        return;
      }

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors = Object.values(json.fields).join(', ');
          setSubmitError(fieldErrors);
        } else {
          setSubmitError(json.error || 'Failed to create booking');
        }
        return;
      }

      setStep('success');
    } catch (err: any) {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading booking page...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">:(</div>
          <h1 className="text-xl font-bold text-stone-900 mb-2">Something went wrong</h1>
          <p className="text-stone-600">{error}</p>
        </div>
      </div>
    );
  }

  // Success state
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-stone-600 mb-6">
            Your appointment for <strong>{form.petName}</strong> has been booked
            with <strong>{data?.groomer.businessName}</strong>.
          </p>
          <div className="bg-stone-50 rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-stone-500 text-sm">Service</span>
              <span className="text-stone-900 font-medium text-sm">{form.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 text-sm">Date</span>
              <span className="text-stone-900 font-medium text-sm">
                {new Date(form.date + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 text-sm">Time</span>
              <span className="text-stone-900 font-medium text-sm">{form.time}</span>
            </div>
          </div>
          <p className="text-sm text-stone-500">
            A confirmation email has been sent to <strong>{form.email}</strong>.
            Need to make changes? Contact your groomer directly.
          </p>
        </div>
      </div>
    );
  }

  // ─── Booking Form ───────────────────────────────────────────────────────────

  const hasAnySlots = Object.values(data?.slots || {}).some(
    (s) => s.length > 0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
            <span className="text-2xl">🐾</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1">
            {data?.groomer.businessName}
          </h1>
          <p className="text-stone-600">Book your grooming appointment</p>
        </div>

        {!hasAnySlots ? (
          /* No availability message */
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              No Availability
            </h2>
            <p className="text-stone-600">
              There are no open time slots right now. Please contact the groomer
              directly to schedule your appointment.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error banner */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            )}

            {/* Your Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">
                Your Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Smith"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Pet Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">
                Pet Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    value={form.petName}
                    onChange={(e) => setForm({ ...form, petName: e.target.value })}
                    placeholder="Buddy"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Breed
                    </label>
                    <input
                      type="text"
                      value={form.petBreed}
                      onChange={(e) => setForm({ ...form, petBreed: e.target.value })}
                      placeholder="Golden Retriever"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Size
                    </label>
                    <select
                      value={form.petSize}
                      onChange={(e) => setForm({ ...form, petSize: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="">Select size</option>
                      <option value="small">Small (under 25 lbs)</option>
                      <option value="medium">Medium (25-50 lbs)</option>
                      <option value="large">Large (50-90 lbs)</option>
                      <option value="giant">Giant (90+ lbs)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">
                Select Service *
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {data?.services.map((svc) => (
                  <button
                    key={svc.name}
                    type="button"
                    onClick={() => setForm({ ...form, service: svc.name })}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      form.service === svc.name
                        ? 'border-green-500 bg-green-50'
                        : 'border-stone-200 bg-white hover:border-green-300',
                    )}
                  >
                    <span className="font-semibold text-stone-900 text-sm block">
                      {svc.name}
                    </span>
                    <div className="flex justify-between text-xs text-stone-500 mt-1">
                      <span>{formatDuration(svc.duration)}</span>
                      <span>{formatPrice(svc.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">
                Select Date & Time *
              </h2>

              {/* Date picker */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  min={today}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value, time: '' })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Time slots */}
              {form.date && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Available Times
                  </label>
                  {slotsForDate.length === 0 ? (
                    <p className="text-stone-500 text-sm py-4 text-center bg-stone-50 rounded-xl">
                      No available times on this date. Please select a different day.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slotsForDate.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setForm({ ...form, time: slot })}
                          className={cn(
                            'py-2.5 px-3 rounded-lg text-sm font-medium transition-all',
                            form.time === slot
                              ? 'bg-green-500 text-white'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-500 text-white font-semibold text-lg hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>

            <p className="text-center text-xs text-stone-400">
              Powered by GroomGrid
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
