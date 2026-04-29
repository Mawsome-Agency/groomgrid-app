import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Best Pet Grooming Software in 2026: Top Picks for Professional Groomers | GroomGrid',
  description:
    'The best pet grooming software for 2026 — reviewed and compared. Find the right platform for solo groomers, mobile businesses, and small salons based on features, pricing, and ease of use.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/best-pet-grooming-software',
  },
  openGraph: {
    title: 'Best Pet Grooming Software in 2026: Top Picks for Professional Groomers',
    description:
      'The best pet grooming software for 2026 — reviewed and compared. Find the right platform for solo groomers, mobile businesses, and small salons based on features, pricing, and ease of use.',
    url: 'https://getgroomgrid.com/blog/best-pet-grooming-software',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Pet Grooming Software in 2026: Top Picks for Professional Groomers',
  description:
    'The best pet grooming software for 2026 — reviewed and compared. Find the right platform for solo groomers, mobile businesses, and small salons based on features, pricing, and ease of use.',
  url: 'https://getgroomgrid.com/blog/best-pet-grooming-software',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/best-pet-grooming-software',
  },
};

export default function BestPetGroomingSoftwarePage() {
  return (
    <>      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-white text-stone-900">
        {/* ── Nav ── */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-stone-100">
          <Link href="/" className="text-xl font-bold text-green-600">
            GroomGrid 🐾
          </Link>
          <Link
            href="/signup?coupon=BETA50"
            className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
          >
            Start Free Trial
          </Link>
        </nav>

        {/* ── Breadcrumb ── */}
        <div className="px-6 py-3 max-w-5xl mx-auto">
          <PageBreadcrumbs slug="blog/best-pet-grooming-software" />
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Top Picks 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Best Pet Grooming Software in 2026:<br className="hidden sm:block" /> Ranked for Independent Groomers
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            There are more pet grooming software options than ever in 2026 — and not all of them are
            worth your time or money. This guide cuts through the noise with honest assessments of the
            top platforms, with specific recommendations based on your business type.
          </p>
        </header>

        {/* ── What Makes Software &quot;Best&quot; ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">What Makes Grooming Software &ldquo;Best&rdquo;?</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              The best software isn&apos;t necessarily the one with the most features — it&apos;s the
              one you&apos;ll actually use consistently. We evaluated platforms on five criteria:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['Ease of setup', 'How fast can you go from signup to first booking?'],
                ['Core features', 'Scheduling, reminders, client records, deposits, payments'],
                ['Mobile experience', 'Can you manage your business from your phone?'],
                ['Pricing transparency', 'What does it actually cost with all the features you need?'],
                ['Support quality', 'When something breaks, can you get help quickly?'],
              ].map(([label, desc]) => (
                <div key={label} className="p-4 bg-white rounded-lg border border-stone-200">
                  <p className="font-semibold text-stone-800 mb-1">{label}</p>
                  <p className="text-sm text-stone-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Top Picks ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-8">Top Pet Grooming Software Platforms</h2>

          {/* GroomGrid */}
          <div className="mb-10 p-6 bg-green-50 rounded-xl border-2 border-green-300">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">OUR PICK</span>
              <h3 className="text-2xl font-bold text-stone-800">GroomGrid</h3>
            </div>
            <p className="text-stone-600 leading-relaxed mb-4">
              Built specifically for independent groomers and small teams. GroomGrid handles everything
              from online booking to automated reminders to deposit collection in one straightforward
              platform. Setup takes under 30 minutes, pricing is flat (no add-on fees), and the mobile
              experience is genuinely designed for groomers who work from their phones.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                ['Best for', 'Solo groomers, small salons, mobile operators'],
                ['Standout feature', 'Automated rebooking reminders + easy deposit setup'],
                ['Pricing', 'Simple flat rate, 50% off first month'],
                ['Free trial', 'Yes'],
              ].map(([label, val]) => (
                <div key={label} className="text-sm">
                  <span className="font-semibold text-stone-700">{label}: </span>
                  <span className="text-stone-600">{val}</span>
                </div>
              ))}
            </div>
            <Link
              href="/signup?coupon=BETA50"
              className="inline-block px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Try GroomGrid Free →
            </Link>
          </div>

          {/* MoeGo */}
          <div className="mb-10 p-6 bg-white rounded-xl border border-stone-200">
            <h3 className="text-2xl font-bold text-stone-800 mb-3">MoeGo</h3>
            <p className="text-stone-600 leading-relaxed mb-4">
              MoeGo is a feature-rich platform with a strong following in the grooming industry.
              It&apos;s best suited for larger operations with multiple groomers, complex scheduling
              needs, or dedicated admin staff to handle setup and configuration. The feature depth is
              impressive but comes with a steeper learning curve and higher costs as you add features.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Best for', 'Multi-groomer salons, enterprise operations'],
                ['Standout feature', 'Deep customization options'],
                ['Pricing', 'Tiered; costs increase with features/team size'],
                ['Free trial', 'Limited free tier'],
              ].map(([label, val]) => (
                <div key={label} className="text-sm">
                  <span className="font-semibold text-stone-700">{label}: </span>
                  <span className="text-stone-600">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gingr */}
          <div className="mb-10 p-6 bg-white rounded-xl border border-stone-200">
            <h3 className="text-2xl font-bold text-stone-800 mb-3">Gingr</h3>
            <p className="text-stone-600 leading-relaxed mb-4">
              Gingr is designed for full-service pet businesses — grooming, boarding, daycare, training —
              all in one. If you only do grooming, you&apos;re paying for features you won&apos;t use.
              For multi-service pet businesses, the integrated approach saves time. Pricing is on the
              higher end and setup complexity reflects the broader scope.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Best for', 'Multi-service pet businesses (boarding + grooming)'],
                ['Standout feature', 'Integrated daycare and boarding management'],
                ['Pricing', 'Higher; contact for quote'],
                ['Free trial', 'Demo available'],
              ].map(([label, val]) => (
                <div key={label} className="text-sm">
                  <span className="font-semibold text-stone-700">{label}: </span>
                  <span className="text-stone-600">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Decision Guide ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Which One Should You Choose?</h2>
            <div className="space-y-4">
              {[
                {
                  scenario: "You're a solo groomer or running a small team",
                  pick: 'GroomGrid — simple, fast setup, everything you need without paying for features you don\'t',
                },
                {
                  scenario: "You're running a large salon with 10+ groomers",
                  pick: 'MoeGo — the feature depth and customization suits complex multi-staff operations',
                },
                {
                  scenario: "You offer boarding, daycare, AND grooming",
                  pick: 'Gingr — the integrated multi-service approach will save you from juggling multiple tools',
                },
                {
                  scenario: "You're just starting out and not sure",
                  pick: 'GroomGrid — lowest barrier to entry, free trial, and you can switch later as your needs evolve',
                },
              ].map(({ scenario, pick }) => (
                <div key={scenario} className="p-5 bg-white rounded-xl border border-stone-200">
                  <p className="font-semibold text-stone-800 mb-1">If: {scenario}</p>
                  <p className="text-stone-600 text-sm">Pick: {pick}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Conclusion ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">The Bottom Line</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            The best pet grooming software is the one that fits how your business actually works — not
            the one with the longest feature list. For most independent groomers, that means something
            that gets you operational quickly, prevents no-shows automatically, and doesn&apos;t require
            a manual every time you want to change something.
          </p>
          <p className="text-stone-600 leading-relaxed">
            You can also read our complete overview of{' '}
            <Link
              href="/blog/pet-grooming-software"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              what pet grooming software is and how it works
            </Link>
            , or compare specific options in our{' '}
            <Link
              href="/blog/groomgrid-vs-moego"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              GroomGrid vs MoeGo comparison
            </Link>
            .
          </p>
        </section>

        {/* ── Related Links ── */}
        <PageRelatedLinks slug="blog/best-pet-grooming-software" variant="blog" heading="Start with the best-rated option for independent groomers" />

        {/* ── Footer ── */}
        <SiteFooter slug="blog/best-pet-grooming-software" />
      </div>
    </>
  );
}
