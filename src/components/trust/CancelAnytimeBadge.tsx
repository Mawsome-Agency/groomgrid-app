"use client";

import { useState } from "react";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/use-analytics";

interface CancelAnytimeBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CancelAnytimeBadge({ className, size = "md" }: CancelAnytimeBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { trackEvent } = useAnalytics();

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
    trackEvent("faq_opened", { faq_type: "cancel_anytime" });
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Badge */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full min-w-[44px] min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="cancel-faq-content"
      >
        <Shield className={cn("flex-shrink-0", size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5")} aria-hidden="true" />
        <span className={cn("font-medium", sizeClasses[size])}>Cancel anytime</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        )}
      </button>

      {/* FAQ content */}
      {isExpanded && (
        <div
          id="cancel-faq-content"
          className="mt-3 bg-white border border-stone-200 rounded-lg p-4 space-y-3"
          role="region"
          aria-live="polite"
        >
          <div className="text-sm text-stone-700">
            <p className="font-medium mb-1">How do I cancel?</p>
            <p className="text-stone-600">
              Go to Settings → Billing and click "Cancel subscription" at any time.
            </p>
          </div>
          <div className="text-sm text-stone-700">
            <p className="font-medium mb-1">Will I lose my data?</p>
            <p className="text-stone-600">
              No, your clients and appointments are preserved for 30 days.
            </p>
          </div>
          <div className="text-sm text-stone-700">
            <p className="font-medium mb-1">Is there a cancellation fee?</p>
            <p className="text-stone-600">
              No, cancel anytime with no penalties.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
