"use client";

import { Lock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/use-analytics";

export default function SecureHeader({ className }: { className?: string }) {
  const { track } = useAnalytics();

  const handleClick = () => {
    track("trust_badge_interacted", { badge_type: "secure_header", location: "plans" });
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Animated lock icon */}
      <button
        type="button"
        onClick={handleClick}
        className="relative group min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Secure checkout"
      >
        <Lock className="w-5 h-5 text-green-600" aria-hidden="true" />
        {/* Animated key icon on hover */}
        <div 
          className="absolute -right-1 -top-1 w-3 h-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            animation: "spin 2s linear infinite",
            animationPlayState: "paused"
          }}
          onMouseEnter={(e) => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion) {
              (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 2l-2 2m-7.61 7.61a4 4 0 0 1 1.41-1.41L4 18l-2 2 9 9 5 5 1.41-1.41 4-4L21 2z" />
          </svg>
        </div>
      </button>
      
      {/* Encryption note */}
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm font-medium text-stone-700">
          256-bit SSL encryption
        </span>
      </div>
    </div>
  );
}
