import Link from 'next/link';

interface EmptyStateProps {
  illustration?: React.ReactNode;
  headline: string;
  subcopy: string;
  primaryCta: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryCta?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  illustration,
  headline,
  subcopy,
  primaryCta,
  secondaryCta,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {illustration && (
        <div className="mb-6">
          {illustration}
        </div>
      )}
      <h2 className="text-xl font-semibold text-stone-900 mb-2">
        {headline}
      </h2>
      <p className="text-stone-600 mb-6 max-w-md mx-auto">
        {subcopy}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {primaryCta.href ? (
          <Link
            href={primaryCta.href}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            onClick={primaryCta.onClick}
          >
            {primaryCta.label}
          </Link>
        ) : (
          <button
            onClick={primaryCta.onClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            {primaryCta.label}
          </button>
        )}
        {secondaryCta && (
          <>
            {secondaryCta.href ? (
              <Link
                href={secondaryCta.href}
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                {secondaryCta.label}
              </Link>
            ) : (
              <button
                onClick={secondaryCta.onClick}
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                {secondaryCta.label}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
