import Link from 'next/link';
import type { BreadcrumbItem } from '@/lib/seo/internal-links';

const SITE_URL = 'https://getgroomgrid.com';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return <nav aria-label="Breadcrumb" className="text-sm text-stone-500 mb-6" />;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <>
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-stone-500 mb-6">
        <ol
          className="flex items-center gap-1.5 flex-wrap"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={`breadcrumb-${index}`}
                className="flex items-center gap-1.5"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {index > 0 && (
                  <span className="text-stone-400" aria-hidden="true">
                    ›
                  </span>
                )}
                {isLast ? (
                  <span
                    className="font-medium text-stone-800"
                    itemProp="name"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-green-600 transition-colors text-stone-500"
                    itemProp="item"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                )}
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
