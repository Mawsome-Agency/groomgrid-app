import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoHiddenFeesSealProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function NoHiddenFeesSeal({ className, size = "md" }: NoHiddenFeesSealProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("inline-flex items-center gap-2 text-green-600", className)}>
      <CheckCircle 
        className={cn("flex-shrink-0", size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5")} 
        aria-hidden="true" 
      />
      <span className={cn("font-medium", sizeClasses[size])}>No hidden fees</span>
    </div>
  );
}
