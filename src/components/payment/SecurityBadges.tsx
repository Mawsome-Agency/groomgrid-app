import { ShieldCheck, Lock, CreditCard } from 'lucide-react';

export default function SecurityBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      <div className="flex items-center gap-1.5 text-stone-500 text-sm">
        <ShieldCheck className="w-4 h-4 text-green-500" />
        <span>SSL Encrypted</span>
      </div>
      <div className="flex items-center gap-1.5 text-stone-500 text-sm">
        <Lock className="w-4 h-4 text-green-500" />
        <span>Secured by Stripe</span>
      </div>
      <div className="flex items-center gap-1.5 text-stone-500 text-sm">
        <CreditCard className="w-4 h-4 text-green-500" />
        <span>Cancel anytime</span>
      </div>
    </div>
  );
}
