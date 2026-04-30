import Link from 'next/link';
import { getFooterColumns, type FooterColumn, type FooterColumnLink } from '@/lib/seo/internal-links';

interface FooterLink {
  href: string;
  label: string;
}

interface SiteFooterProps {
  slug?: string;
  links?: FooterLink[];
  className?: string;
}

export default function SiteFooter({ slug, links, className }: SiteFooterProps) {
  // Backward compatibility: if links prop provided, render old simple flat footer
  if (links) {
    return (
      <footer className={`px-6 py-8 max-w-5xl mx-auto border-t border-stone-100 ${className ?? ''}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <Link href="/" className="font-bold text-green-600">
            GroomGrid 🐾
          </Link>
          <div className="flex gap-6">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-stone-600 transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <p>© {new Date().getFullYear()} GroomGrid. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  // New 4-column SEO footer
  const columns = getFooterColumns(slug);

  return (
    <footer className={`bg-white border-t border-stone-100 ${className ?? ''}`}>
      {/* Top section: Brand + CTA */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <Link href="/" className="text-xl font-bold text-green-600 hover:text-green-700 transition-colors">
              GroomGrid 🐾
            </Link>
            <p className="text-stone-400 text-sm mt-1">
              AI-powered grooming business management
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 active:scale-[0.98] transition-all focus:ring-2 ring-green-500 ring-offset-2 outline-none"
          >
            Start Free Trial
          </Link>
        </div>

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-green-600 font-semibold text-sm mb-4 uppercase tracking-wider">
                {column.heading}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-stone-400 text-sm hover:text-green-600 transition-colors active:scale-[0.98] focus:ring-2 ring-green-500 ring-offset-2 outline-none rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section: Copyright + legal */}
      <div className="max-w-6xl mx-auto px-6 py-6 border-t border-stone-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <p>© {new Date().getFullYear()} GroomGrid. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-green-600 transition-colors active:scale-[0.98] focus:ring-2 ring-green-500 ring-offset-2 outline-none rounded">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-green-600 transition-colors active:scale-[0.98] focus:ring-2 ring-green-500 ring-offset-2 outline-none rounded">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
