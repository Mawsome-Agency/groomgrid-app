'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Plus, Mail, Phone, MapPin, Edit2, Calendar, Scissors } from 'lucide-react';
import { trackPageView } from '@/lib/ga4';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  pets: Pet[];
}

interface Pet {
  id: string;
  name: string;
  breed?: string;
  size?: string;
  age?: string;
  specialNotes?: string;
}

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [client, setClient] = useState<Client | null>(null);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView(`/clients/${params.id}`, 'Client Detail');
  }, [params.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchClient();
    }
  }, [session, params.id]);

  const fetchClient = async () => {
    try {
      const res = await fetch('/api/clients');
      if (res.ok) {
        const data = await res.json();
        const found = data.clients.find((c: Client) => c.id === params.id);
        setClient(found || null);
      }
    } catch (err) {
      console.error('Failed to fetch client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = async (formData: FormData) => {
    try {
      const name = formData.get('name') as string;
      const breed = formData.get('breed') as string;
      const size = formData.get('size') as string;
      const age = formData.get('age') as string;
      const specialNotes = formData.get('specialNotes') as string;

      const res = await fetch(`/api/clients/${params.id}/pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, breed, size, age, specialNotes }),
      });

      if (res.ok) {
        await fetchClient();
        setShowAddPetModal(false);
      }
    } catch (err) {
      console.error('Failed to create pet:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Client not found</p>
          <button
            onClick={() => router.push('/clients')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/clients')}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <h1 className="text-2xl font-bold text-stone-900 flex-1">
            {client.name}
          </h1>
          <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <Edit2 className="w-5 h-5 text-stone-600" />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Client Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Client Information</h2>
          <div className="space-y-3">
            {client.email && (
              <div className="flex items-center gap-3 text-stone-600">
                <Mail className="w-5 h-5 text-stone-400" />
                <span>{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-3 text-stone-600">
                <Phone className="w-5 h-5 text-stone-400" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.address && (
              <div className="flex items-center gap-3 text-stone-600">
                <MapPin className="w-5 h-5 text-stone-400" />
                <span>{client.address}</span>
              </div>
            )}
            {client.notes && (
              <div className="pt-3 border-t border-stone-200">
                <p className="text-sm text-stone-600">{client.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pets Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-900">Pets</h2>
            <button
              onClick={() => setShowAddPetModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Pet
            </button>
          </div>

          {client.pets.length === 0 ? (
            <p className="text-stone-500 text-center py-8">No pets added yet</p>
          ) : (
            <div className="space-y-3">
              {client.pets.map((pet) => (
                <div key={pet.id} className="border border-stone-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-stone-900">{pet.name}</h3>
                      {pet.breed && (
                        <p className="text-sm text-stone-600">{pet.breed}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        {pet.size && (
                          <span className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded">
                            {pet.size}
                          </span>
                        )}
                        {pet.age && (
                          <span className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded">
                            {pet.age}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {pet.specialNotes && (
                    <p className="text-sm text-stone-600 mt-2">{pet.specialNotes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push(`/schedule?clientId=${client.id}`)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              <Calendar className="w-5 h-5" /> Book Appointment
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-colors">
              <Scissors className="w-5 h-5" /> Service History
            </button>
          </div>
        </div>
      </div>

      {/* Add Pet Modal */}
      {showAddPetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Add Pet</h2>
              
              <form action={handleAddPet} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g., Bailey"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    placeholder="e.g., Labrador"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Size
                    </label>
                    <select
                      name="size"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select size</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="giant">Giant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Age
                    </label>
                    <input
                      type="text"
                      name="age"
                      placeholder="e.g., 3 years"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Special Notes
                  </label>
                  <textarea
                    name="specialNotes"
                    placeholder="Any special needs or notes..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPetModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    Add Pet
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
