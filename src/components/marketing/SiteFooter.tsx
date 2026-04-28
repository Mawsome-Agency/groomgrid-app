import Link from 'next/link';

interface FooterLink {
  href: string;
  label: string;
}

const DEFAULT_LINKS: FooterLink[] = [
  { href: '/grooming-business-operations/', label: 'Operations Hub' },
  { href: '/mobile-grooming-business/', label: 'Mobile Grooming' },
  { href: '/plans', label: 'Pricing' },
  { href: '/signup', label: 'Sign Up' },
];

interface SiteFooterProps {
  links?: FooterLink[];
  className?: string;
}

export default function SiteFooter({ links = DEFAULT_LINKS, className }: SiteFooterProps) {
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
