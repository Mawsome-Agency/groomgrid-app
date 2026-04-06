import { useState } from 'react';
import { Check, ArrowRight, Clock, Loader2 } from 'lucide-react';

export interface DayHours {
  enabled: boolean;
  open: string;
  close: string;
}

export interface BusinessHoursForm {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

const TIME_OPTIONS = [
  '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
  '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM',
  '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
  '6:30 PM', '7:00 PM',
];

export default function Step3BusinessHours({
  onNext,
  onSkip,
  isLoading = false,
}: {
  onNext: (hours: BusinessHoursForm) => Promise<void> | void;
  onSkip: () => void;
  isLoading?: boolean;
}) {
  const [hours, setHours] = useState<BusinessHoursForm>({
    monday: { enabled: true, open: '8:00 AM', close: '6:00 PM' },
    tuesday: { enabled: true, open: '8:00 AM', close: '6:00 PM' },
    wednesday: { enabled: true, open: '8:00 AM', close: '6:00 PM' },
    thursday: { enabled: true, open: '8:00 AM', close: '6:00 PM' },
    friday: { enabled: true, open: '8:00 AM', close: '6:00 PM' },
    saturday: { enabled: true, open: '9:00 AM', close: '3:00 PM' },
    sunday: { enabled: false, open: '9:00 AM', close: '3:00 PM' },
  });

  const [isSaving, setIsSaving] = useState(false);

  const hasEnabledDays = Object.values(hours).some(day => day.enabled);

  const toggleDay = (day: keyof BusinessHoursForm) => {
    setHours({
      ...hours,
      [day]: {
        ...hours[day],
        enabled: !hours[day].enabled,
      },
    });
  };

  const updateTime = (day: keyof BusinessHoursForm, field: 'open' | 'close', value: string) => {
    setHours({
      ...hours,
      [day]: {
        ...hours[day],
        [field]: value,
      },
    });
  };

  const handleNext = async () => {
    if (!hasEnabledDays) return;
    setIsSaving(true);
    await onNext(hours);
    setIsSaving(false);
  };

  const DAYS = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Set Business Hours</h2>
        <p className="text-stone-600">Configure when clients can book appointments</p>
      </div>

      <div className="space-y-3">
        {DAYS.map((day) => (
          <div
            key={day.key}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              hours[day.key].enabled ? "bg-white border-stone-200" : "bg-stone-50 border-stone-100 opacity-60"
            }`}
          >
            <div className="flex-shrink-0 w-20">
              <span className="text-sm font-semibold text-stone-900">{day.label}</span>
            </div>
            
            <button
              onClick={() => toggleDay(day.key as keyof BusinessHoursForm)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                hours[day.key].enabled ? "bg-green-500" : "bg-stone-300"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  hours[day.key].enabled ? "left-6" : "left-1"
                }`}
              />
            </button>

            {hours[day.key].enabled && (
              <div className="flex items-center gap-2 flex-1">
                <Clock className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <select
                  value={hours[day.key].open}
                  onChange={(e) => updateTime(day.key as keyof BusinessHoursForm, 'open', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                <span className="text-stone-400">—</span>
                <select
                  value={hours[day.key].close}
                  onChange={(e) => updateTime(day.key as keyof BusinessHoursForm, 'close', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="px-6 py-3 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
        >
          Skip for now
        </button>
        <button
          onClick={handleNext}
          disabled={!hasEnabledDays || isLoading || isSaving}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading || isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving...
            </>
          ) : (
            <>
              Complete Setup <Check className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
