'use client';

import { Calendar, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MiniCalendarProps {
  appointmentDate: Date;
  petName: string;
  breed: string;
  duration: number;
  clientName?: string | null;
  className?: string;
}

export default function MiniCalendar({
  appointmentDate,
  petName,
  breed,
  duration,
  clientName,
  className,
}: MiniCalendarProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const month = monthNames[appointmentDate.getMonth()];
  const year = appointmentDate.getFullYear();
  const day = appointmentDate.getDate();
  const dayName = dayNames[appointmentDate.getDay()];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTimeRange = (startDate: Date, durationMinutes: number) => {
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
    return `${formatTime(startDate)} - ${formatTime(endDate)}`;
  };

  return (
    <div className={cn("bg-white rounded-2xl shadow-lg p-6 space-y-6", className)}>
      {/* Calendar Header */}
      <div className="text-center pb-4 border-b border-stone-100">
        <h3 className="text-xl font-bold text-stone-900">{month} {year}</h3>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {dayNames.map((day) => (
          <div key={day} className="font-medium text-stone-500 py-2 text-xs">
            {day}
          </div>
        ))}
        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: new Date(year, appointmentDate.getMonth(), 1).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {/* Days of the month */}
        {Array.from({ length: new Date(year, appointmentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
          const isAppointmentDay = i + 1 === day;
          return (
            <div
              key={i}
              className={cn(
                "p-2 rounded-lg min-h-[40px] flex items-center justify-center",
                isAppointmentDay && "bg-green-500 text-white font-bold"
              )}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* Appointment Card */}
      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
        <div className="flex items-start gap-4">
          {/* Pet Icon */}
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl">🐕</span>
          </div>

          {/* Appointment Details */}
          <div className="flex-1 space-y-2">
            <div>
              <h4 className="font-bold text-stone-900 text-lg">{petName}</h4>
              <p className="text-sm text-stone-600">{breed}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1 text-stone-600">
                <Calendar className="w-4 h-4" />
                <span>{dayName}, {month} {day}</span>
              </div>
              <div className="flex items-center gap-1 text-stone-600">
                <Clock className="w-4 h-4" />
                <span>{formatTimeRange(appointmentDate, duration)}</span>
              </div>
            </div>

            {clientName && (
              <div className="flex items-center gap-1 text-sm text-stone-600 pt-2 border-t border-green-200">
                <User className="w-4 h-4" />
                <span>{clientName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
