'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus,
  Clock, User, Scissors, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { trackPageView, trackEmptyStateCta } from '@/lib/ga4';
import { EmptyState } from '@/components/ui/EmptyState';
import { SleepingDogIllustration } from '@/components/illustrations/SleepingDogIllustration';

interface Appointment {
  id: string;
  service: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  client: { name: string; email?: string; phone?: string };
  pet?: { name: string; breed?: string };
}

interface Client {
  id: string;
  name: string;
}

const SERVICES = [
  { name: 'Full Groom', duration: 120, price: 65 },
  { name: 'Bath + Brush', duration: 60, price: 40 },
  { name: 'Nail Trim', duration: 15, price: 20 },
  { name: 'Teeth Brushing', duration: 10, price: 15 },
];

const TIME_SLOTS = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
];

export default function SchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookFormData, setBookFormData] = useState({
    clientId: searchParams.get('clientId') || '',
    petId: '',
    service: 'Full Groom',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView('/schedule', 'Schedule');
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchAppointments();
      fetchClients();
    }
  }, [session, currentDate]);

  const fetchAppointments = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const res = await fetch(
        `/api/appointments?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`
      );
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients);
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appt) => {
      const apptDate = new Date(appt.startTime);
      return (
        apptDate.getDate() === date.getDate() &&
        apptDate.getMonth() === date.getMonth() &&
        apptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookFormData),
      });

      if (res.ok) {
        await fetchAppointments();
        setShowBookModal(false);
        setBookFormData({
          clientId: '',
          petId: '',
          service: 'Full Groom',
          date: new Date().toISOString().split('T')[0],
          time: '',
          notes: '',
        });
      }
    } catch (err) {
      console.error('Failed to book appointment:', err);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchAppointments();
    } catch (err) {
      console.error('Failed to update appointment:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-stone-400" />;
      case 'no_show':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-900">Schedule</h1>
          <button
            onClick={() => setShowBookModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-5 h-5" /> Book Appointment
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-stone-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-stone-500 py-2">
                {day}
              </div>
            ))}
            
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="h-24" />;
              }

              const dayAppointments = getAppointmentsForDate(day);
              const isToday = 
                day.getDate() === today.getDate() &&
                day.getMonth() === today.getMonth() &&
                day.getFullYear() === today.getFullYear();

              return (
                <div
                  key={day.toISOString()}
                  className={`h-24 border border-stone-200 rounded-lg p-2 hover:bg-stone-50 transition-colors ${
                    isToday ? 'bg-green-50 border-green-300' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-green-700' : 'text-stone-900'
                    }`}>
                      {day.getDate()}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="text-xs text-stone-500">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    {dayAppointments.slice(0, 2).map((appt) => (
                      <div
                        key={appt.id}
                        className={`text-xs px-1.5 py-0.5 rounded truncate ${
                          appt.status === 'completed' ? 'bg-green-100 text-green-700' :
                          appt.status === 'cancelled' ? 'bg-stone-100 text-stone-500' :
                          appt.status === 'no_show' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {new Date(appt.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} {appt.client.name}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-stone-500">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-stone-600">Loading...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-4">
              {monthNames[currentDate.getMonth()]}'s Appointments
            </h3>
            {appointments.length === 0 ? (
              <EmptyState
                illustration={<SleepingDogIllustration />}
                headline="No appointments yet"
                subcopy="Your first client is out there"
                primaryCta={{
                  label: 'Schedule Appointment',
                  onClick: () => {
                    setShowBookModal(true);
                    trackEmptyStateCta('schedule', 'Schedule Appointment');
                  },
                }}
              />
            ) : (
              <div className="space-y-3">
                {appointments
                  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                  .map((appt) => (
                    <div
                      key={appt.id}
                      className={`border rounded-xl p-4 ${
                        appt.status === 'completed' ? 'border-green-200 bg-green-50' :
                        appt.status === 'cancelled' ? 'border-stone-200 bg-stone-50' :
                        appt.status === 'no_show' ? 'border-red-200 bg-red-50' :
                        'border-stone-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(appt.status)}
                            <span className="font-semibold text-stone-900">
                              {appt.service}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-stone-600">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {new Date(appt.startTime).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(appt.startTime).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {appt.client.name}
                              {appt.pet && <span>({appt.pet.name})</span>}
                            </span>
                          </div>
                          {appt.notes && (
                            <p className="text-sm text-stone-600 mt-2">{appt.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {appt.status === 'scheduled' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(appt.id, 'completed')}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                title="Mark as complete"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(appt.id, 'cancelled')}
                                className="p-2 text-stone-400 hover:bg-stone-100 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Book Appointment</h2>
              
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Client *
                  </label>
                  <select
                    name="clientId"
                    value={bookFormData.clientId}
                    onChange={(e) => setBookFormData({ ...bookFormData, clientId: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Service *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {SERVICES.map((service) => (
                      <button
                        key={service.name}
                        type="button"
                        onClick={() => setBookFormData({ ...bookFormData, service: service.name })}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          bookFormData.service === service.name
                            ? 'border-green-500 bg-green-50'
                            : 'border-stone-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Scissors className={`w-4 h-4 ${
                            bookFormData.service === service.name ? 'text-green-600' : 'text-stone-400'
                          }`} />
                          <span className="font-semibold text-stone-900">{service.name}</span>
                        </div>
                        <div className="flex justify-between text-xs text-stone-500">
                          <span>{service.duration} min</span>
                          <span>${service.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={bookFormData.date}
                    onChange={(e) => setBookFormData({ ...bookFormData, date: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Time *
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookFormData({ ...bookFormData, time: slot })}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                          bookFormData.time === slot
                            ? 'bg-green-500 text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={bookFormData.notes}
                    onChange={(e) => setBookFormData({ ...bookFormData, notes: e.target.value })}
                    placeholder="Any special instructions..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!bookFormData.clientId || !bookFormData.time}
                    className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
