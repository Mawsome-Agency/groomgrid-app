'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ConfettiAnimationProps {
  active: boolean;
  className?: string;
}

export default function ConfettiAnimation({ active, className }: ConfettiAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (!active) return;

    // Generate confetti particles
    const colors = [
      '#22c55e', // green-500
      '#eab308', // yellow-500
      '#ef4444', // red-500
      '#3b82f6', // blue-500
      '#a855f7', // purple-500
    ];

    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
    }));

    setParticles(newParticles);

    // Clear after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, [active]);

  if (!active || particles.length === 0) {
    return null;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return (
      <div className={cn("sr-only", className)} role="status" aria-live="polite">
        🎉 Welcome to GroomGrid!
      </div>
    );
  }

  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden z-50", className)} aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animation: `fall ${3 + Math.random() * 2}s ease-in ${particle.delay}s forwards`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(120vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
