"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Tooltip from "@/components/ui/Tooltip";
import { useAnalytics } from "@/hooks/use-analytics";

export default function PciBadge({ className, location = "plans" }: { className?: string; location?: "plans" | "success" | "billing" }) {
  const { track } = useAnalytics();

  const handleClick = () => {
    track("trust_badge_interacted", { badge_type: "pci", location });
  };

  return (
    <Tooltip
      content="PCI DSS Level 1 Compliant. We meet the highest security standards for payment processing, ensuring your card data is always protected."
      position="top"
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 text-stone-700 rounded-full text-xs font-medium hover:bg-stone-200 transition-colors min-w-[44px] min-h-[44px]",
          className
        )}
      >
        <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
        <span>PCI Compliant</span>
      </button>
    </Tooltip>
  );
}
