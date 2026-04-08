import { useState } from 'react';
import { ArrowRight, Clock, Scissors, Loader2 } from 'lucide-react';
import { SERVICES, formatPrice, formatDuration } from '@/lib/services';

interface AppointmentForm {
  service: string;
  date: string;
  time: string;
  notes: string;
}

const TIME_SLOTS = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
];

export default function Step2Appointment({
  clientName,
  petName,
  onNext,
  onSkip,
  isLoading = false,
}: {
  clientName: string;
  petName: string;
  onNext: (appointment: AppointmentForm) => void;
  onSkip: () => void;
  isLoading?: boolean;
}) {
  const [appointment, setAppointment] = useState<AppointmentForm>({
    service: 'Full Groom',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: '',
  });

  const isValid = appointment.time;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Create First Appointment</h2>
        <p className="text-stone-600">
          Book an appointment for <span className="font-semibold text-green-600">{petName}</span> ({clientName})
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Select Service</label>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((service) => (
              <button
                key={service.name}
                onClick={() => !isLoading && setAppointment({ ...appointment, service: service.name })}
                disabled={isLoading}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all disabled:cursor-not-allowed",
                  appointment.service === service.name
                    ? "border-green-500 bg-green-50"
                    : "border-stone-200 bg-white hover:border-green-300"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Scissors className={cn("w-4 h-4", appointment.service === service.name ? "text-green-600" : "text-stone-400")} />
                  <span className="font-semibold text-stone-900">{service.name}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-500">
                  <span>{formatDuration(service.baseDuration)}</span>
                  <span>{formatPrice(service.basePrice)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Select Date & Time</label>
          <div className="flex gap-3 mb-3">
            <input
              type="date"
              value={appointment.date}
              onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-stone-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => !isLoading && setAppointment({ ...appointment, time: slot })}
                disabled={isLoading}
                className={cn(
                  "py-2 px-3 rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed",
                  appointment.time === slot
                    ? "bg-green-500 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
          <textarea
            value={appointment.notes}
            onChange={(e) => setAppointment({ ...appointment, notes: e.target.value })}
            placeholder="Any special instructions..."
            rows={3}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none disabled:bg-stone-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSkip}
          disabled={isLoading}
          className="px-6 py-3 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Skip for now
        </button>
        <button
          onClick={() => isValid && !isLoading && onNext(appointment)}
          disabled={!isValid || isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              Book Appointment <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
