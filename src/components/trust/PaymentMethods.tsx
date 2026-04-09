"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Stripe hosted payment method icons
const PAYMENT_LOGOS = [
  {
    name: "Visa",
    url: "https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03e81dadd4c125.svg",
    alt: "Visa",
    width: 40,
    height: 26,
  },
  {
    name: "Mastercard",
    url: "https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711886b5e72523a6d83.svg",
    alt: "Mastercard",
    width: 40,
    height: 26,
  },
  {
    name: "American Express",
    url: "https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c70e8f7d24e9e669c9c4e79.svg",
    alt: "American Express",
    width: 40,
    height: 26,
  },
  {
    name: "Discover",
    url: "https://js.stripe.com/v3/fingerprinted/img/discover-4734d70a7d9617b9c289d33e1d2af9b3.svg",
    alt: "Discover",
    width: 40,
    height: 26,
  },
];

interface PaymentMethodsProps {
  className?: string;
  compact?: boolean;  // Show fewer logos on mobile
}

export default function PaymentMethods({ className, compact = false }: PaymentMethodsProps) {
  const [loadedLogos, setLoadedLogos] = useState<Set<string>>(new Set());
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());

  const handleImageLoad = (name: string) => {
    setLoadedLogos((prev) => new Set(prev).add(name));
  };

  const handleImageError = (name: string) => {
    setFailedLogos((prev) => new Set(prev).add(name));
  };

  // On mobile, show only Visa and Mastercard if compact mode
  const visibleLogos = compact ? PAYMENT_LOGOS.slice(0, 2) : PAYMENT_LOGOS;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {visibleLogos.map((logo) => {
        const isLoaded = loadedLogos.has(logo.name);
        const isFailed = failedLogos.has(logo.name);
        const showSkeleton = !isLoaded && !isFailed;

        return (
          <div key={logo.name} className="relative">
            {/* Loading skeleton */}
            {showSkeleton && (
              <div
                className={cn(
                  "bg-stone-200 rounded animate-pulse",
                  compact ? "w-10 h-6.5" : "w-10 h-6.5"
                )}
                aria-hidden="true"
              />
            )}

            {/* Logo image */}
            <img
              src={logo.url}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              loading="lazy"
              onLoad={() => handleImageLoad(logo.name)}
              onError={() => handleImageError(logo.name)}
              className={cn(
                "h-6.5 w-10 transition-opacity",
                !isLoaded && "opacity-0",
                isLoaded && "opacity-100"
              )}
              style={{ display: isFailed ? "none" : "block" }}
            />

            {/* Fallback text if image fails */}
            {isFailed && (
              <span className="text-xs text-stone-600 font-medium">
                {logo.name}
              </span>
            )}
          </div>
        );
      })}

      {/* "Powered by Stripe" text */}
      <span className="text-xs text-stone-500">
        Powered by{" "}
        <a
          href="https://stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-700 font-medium hover:underline"
        >
          Stripe
        </a>
      </span>
    </div>
  );
}
