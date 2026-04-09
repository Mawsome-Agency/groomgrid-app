'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import BreedSearchDropdown from '@/components/onboarding/BreedSearchDropdown';
import { trackOnboardingStepViewed, trackOnboardingStep } from '@/lib/ga4';
import { useOnboardingState } from '@/hooks/use-onboarding-state';
import { BreedTiming } from '@/types';

export default function FirstAppointmentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { state, updateState } = useOnboardingState();
  
  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState<string | null>(null);
  const [breedTiming, setBreedTiming] = useState<BreedTiming | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick time slots
  const quickSlots = [
    { label: 'Tomorrow 9am', value: 'tomorrow-09:00' },
    { label: 'Tomorrow 2pm', value: 'tomorrow-14:00' },
    { label: 'Next Mon 10am', value: 'next-mon-10:00' },
  ];

  useEffect(() => {
    trackOnboardingStepViewed(3);
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleBreedChange = (breedName: string, timing: BreedTiming) => {
    setBreed(breedName);
    setBreedTiming(timing);
  };

  const handleQuickSlot = (slotValue: string) => {
    const [day, timeValue] = slotValue.split('-');
    
    const selectedDate = new Date(date);
    
    if (day === 'tomorrow') {
      // Already set to tomorrow
    } else if (day === 'next-mon') {
      // Find next Monday
      const currentDay = selectedDate.getDay();
      const daysUntilMonday = (1 - currentDay + 7) % 7 || 7;
      selectedDate.setDate(selectedDate.getDate() + daysUntilMonday);
    }
    
    setTime(timeValue);
    setDate(selectedDate.toISOString().split('T')[0]);
  };

  const handleContinue = async () => {
    if (!petName || !breed || !date || !time) return;
    
    setIsSubmitting(true);

    // Combine date and time
    const appointmentDatetime = new Date(`${date}T${time}`);

    // Update state
    updateState({
      petName,
      breed,
      appointmentDatetime: appointmentDatetime.toISOString(),
      clientName: clientName || null,
      currentStep: 3,
    });

    // Track completion
    trackOnboardingStep(3);

    // Navigate to AI magic page
    trackOnboardingStepViewed(4);
    router.push('/onboarding/ai-magic');
  };

  const handleSkip = async () => {
    trackOnboardingStep(3);
    router.push('/onboarding/ai-magic');
  };

  const isValid = petName && breed && date && time;

  return (
    <div className="space-y-6 py-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
          Let's book your first appointment
        </h2>
        <p className="text-stone-600">
          Add a pet and we'll show you our AI in action
        </p>
      </div>

      <div className="space-y-5">
        {/* Pet Name */}
        <div>
          <label htmlFor="pet-name" className="block text-sm font-medium text-stone-700 mb-1">
            Pet Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              id="pet-name"
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g., Max"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* Breed Search */}
        <BreedSearchDropdown
          value={breed}
          onChange={handleBreedChange}
        />

        {/* Breed Timing Preview */}
        {breedTiming && (
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Perfect!</span> {breed} typically takes{' '}
              <span className="font-bold">{breedTiming.minMin}-{breedTiming.maxMin} minutes</span>
            </p>
          </div>
        )}

        {/* Date Selection */}
        <div>
          <label htmlFor="appointment-date" className="block text-sm font-medium text-stone-700 mb-1">
            Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              id="appointment-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Time Slots */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Quick Slots *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickSlots.map((slot) => (
              <button
                key={slot.value}
                onClick={() => handleQuickSlot(slot.value)}
                className={`
                  px-4 py-3 rounded-xl border-2 text-left transition-all
                  ${time === slot.value.split('-')[1]
                    ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                    : 'border-stone-200 hover:border-green-300 text-stone-700'
                  }
                `}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Time Input */}
        <div>
          <label htmlFor="appointment-time" className="block text-sm font-medium text-stone-700 mb-1">
            Or select specific time *
          </label>
          <input
            id="appointment-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Client Name (Optional) */}
        <div>
          <label htmlFor="client-name" className="block text-sm font-medium text-stone-700 mb-1">
            Client Name <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <input
            id="client-name"
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="We'll create a client profile automatically"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-stone-500 mt-1">
            Leave blank to use your business name
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSkip}
          className="px-6 py-3 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
        >
          Skip for now
        </button>
        <button
          onClick={handleContinue}
          disabled={!isValid || isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmitting ? 'Processing...' : 'Continue'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
