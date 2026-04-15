'use client';

import { Plan } from '@/types';
import PlanCard from './PlanCard';
import { useRouter } from 'next/navigation';

interface PlanCardWrapperProps {
  plan: Plan;
}

export default function PlanCardWrapper({ plan }: PlanCardWrapperProps) {
  const router = useRouter();

  const handleSelect = () => {
    router.push('/signup');
  };

  return (
    <PlanCard
      plan={plan}
      selected={false}
      onSelect={handleSelect}
    />
  );
}
