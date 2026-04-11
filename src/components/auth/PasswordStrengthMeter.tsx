'use client';

interface PasswordStrengthMeterProps {
  password: string;
}

function getStrength(password: string): 0 | 1 | 2 | 3 {
  if (password.length < 8) return 0;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  if (password.length >= 12 && hasNumber && hasSpecial) return 3;
  if (hasNumber && hasSpecial) return 2;
  return 1;
}

const STRENGTH_CONFIG = [
  { label: 'Weak', color: 'bg-red-500' },
  { label: 'Fair', color: 'bg-orange-400' },
  { label: 'Strong', color: 'bg-green-500' },
  { label: 'Very Strong', color: 'bg-green-700' },
] as const;

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const strength = getStrength(password);
  const config = STRENGTH_CONFIG[strength];

  return (
    <div className="mt-2" aria-label={`Password strength: ${config.label}`}>
      <div className="flex gap-1 mb-1">
        {STRENGTH_CONFIG.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              index <= strength ? config.color : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        strength === 0 ? 'text-red-600' :
        strength === 1 ? 'text-orange-500' :
        strength === 2 ? 'text-green-600' :
        'text-green-700'
      }`}>
        {config.label}
      </p>
    </div>
  );
}
