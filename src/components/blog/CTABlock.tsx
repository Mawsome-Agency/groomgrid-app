'use client';

import Link from 'next/link';
import clsx from 'clsx';

interface CTABlockProps {
  title?: string;
  headline?: string;
  ctaPrimaryText?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryText?: string;
  ctaSecondaryHref?: string;
  className?: string;
}

export default function CTABlock({
  title,
  headline = "Ready to transform your grooming business?",
  ctaPrimaryText = "Start Free Trial",
  ctaPrimaryHref = "/signup",
  ctaSecondaryText = "View Plans",
  ctaSecondaryHref = "/plans",
  className,
}: CTABlockProps) {
  return (
    <div className={clsx("bg-brand-50 rounded-xl p-6 md:p-8 my-8 border border-brand-200", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-brand-900 mb-2">{title}</h3>
      )}
      <p className="text-brand-800 mb-4">{headline}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={ctaPrimaryHref}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
        >
          {ctaPrimaryText}
        </Link>
        <Link
          href={ctaSecondaryHref}
          className="inline-flex items-center justify-center px-6 py-3 border border-brand-300 text-base font-medium rounded-md text-brand-700 bg-white hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
        >
          {ctaSecondaryText}
        </Link>
      </div>
    </div>
  );
}