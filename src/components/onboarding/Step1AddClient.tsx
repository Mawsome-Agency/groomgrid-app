import { useState } from 'react';
import { ArrowRight, Phone, Mail } from 'lucide-react';

interface ClientForm {
  name: string;
  phone: string;
  email: string;
  petName: string;
  breed: string;
}

export default function Step1AddClient({ onNext, onSkip }: { onNext: (client: ClientForm) => void; onSkip: () => void }) {
  const [client, setClient] = useState<ClientForm>({
    name: '',
    phone: '',
    email: '',
    petName: '',
    breed: '',
  });

  const isValid = client.name && client.petName;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Add Your First Client</h2>
        <p className="text-stone-600">Let's add a client so you can see how it works</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Client Name *</label>
          <input
            type="text"
            value={client.name}
            onChange={(e) => setClient({ ...client, name: e.target.value })}
            placeholder="e.g., Sarah Cooper"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="tel"
                value={client.phone}
                onChange={(e) => setClient({ ...client, phone: e.target.value })}
                placeholder="(505) 555-0192"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="email"
                value={client.email}
                onChange={(e) => setClient({ ...client, email: e.target.value })}
                placeholder="sarah@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200">
          <label className="block text-sm font-medium text-stone-700 mb-2">Pet Information</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Pet Name *</label>
              <input
                type="text"
                value={client.petName}
                onChange={(e) => setClient({ ...client, petName: e.target.value })}
                placeholder="e.g., Bailey"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Breed</label>
              <input
                type="text"
                value={client.breed}
                onChange={(e) => setClient({ ...client, breed: e.target.value })}
                placeholder="e.g., Labrador"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="px-6 py-3 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
        >
          Skip for now
        </button>
        <button
          onClick={() => isValid && onNext(client)}
          disabled={!isValid}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
        >
          Add Client <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
