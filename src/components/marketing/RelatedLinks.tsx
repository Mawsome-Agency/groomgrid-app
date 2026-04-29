import Link from 'next/link';

interface LinkItem {
  href: string;
  category?: string;
  title: string;
  description?: string;
}

interface RelatedLinksProps {
  heading?: string;
  links: LinkItem[];
  columns?: 2 | 3 | 4;
  variant?: 'landing' | 'blog';
}

export default function RelatedLinks({
  heading = 'Related Articles',
  links,
  columns = 3,
  variant = 'landing',
}: RelatedLinksProps) {
  if (variant === 'blog') {
    const blogGridCols = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    }[columns];

    return (
      <section className="mt-12 pt-8 border-t border-stone-200">
        <h2 className="text-lg font-bold text-stone-900 mb-4">{heading}</h2>
        <div className={`grid ${blogGridCols} gap-4`}>
          {links.map(({ href, title, description }) => (
            <Link
              key={href}
              href={href}
              className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors"
            >
              <h3 className="font-semibold text-stone-900 text-sm mb-1">{title}</h3>
              {description && <p className="text-stone-500 text-xs">{description}</p>}
            </Link>
          ))}
        </div>
      </section>
    );
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <section className="px-6 py-12 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-stone-800 mb-6">{heading}</h2>
      <div className={`grid ${gridCols} gap-4`}>
        {links.map(({ href, category, title }) => (
          <Link
            key={href}
            href={href}
            className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
          >
            <p className="text-sm text-green-600 font-semibold mb-1">{category}</p>
            <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">
              {title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
