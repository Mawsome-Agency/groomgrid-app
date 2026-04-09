"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ content, children, className, position = "top" }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Handle tooltip open/close
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Small delay before closing to prevent flickering
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 100);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, isMobile]);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  const arrowClasses = {
    top: "bottom-[-6px] left-1/2 -translate-x-1/2 border-t-0 border-b border-l border-r",
    bottom: "top-[-6px] left-1/2 -translate-x-1/2 border-b-0 border-t border-l border-r",
    left: "right-[-6px] top-1/2 -translate-y-1/2 border-l-0 border-r border-t border-b",
    right: "left-[-6px] top-1/2 -translate-y-1/2 border-r-0 border-l border-t border-b",
  };

  return (
    <div className={cn("relative inline-block", className)} ref={tooltipRef}>
      {/* Tooltip trigger */}
      <button
        type="button"
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full hover:bg-stone-100 transition-colors"
        aria-label={isMobile ? "Show more information" : undefined}
        aria-expanded={isOpen}
      >
        {children}
      </button>

      {/* Tooltip content */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-64 p-4 bg-stone-900 text-white text-sm rounded-lg shadow-xl",
            positionClasses[position]
          )}
          role="tooltip"
          aria-live="polite"
        >
          <div className="relative">
            {/* Arrow */}
            <div
              className={cn(
                "absolute w-3 h-3 bg-stone-900 border-8 border-white rotate-45",
                arrowClasses[position]
              )}
              aria-hidden="true"
            />
            {/* Content */}
            <div className="relative z-10 bg-stone-900">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
