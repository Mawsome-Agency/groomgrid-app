import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'DaySmart Alternatives: Best Pet Grooming Software for 2026 | GroomGrid',
  description:
    'Comparing DaySmart Pet alternatives? See how GroomGrid, MoeGo, and Pawfinity stack up on pricing, features, ease of use, and mobile access — and why groomers are switching.',
  alternates: {
    canonical: 'https://getgroomgrid.com/daysmart-alternatives',
  },
  openGraph: {
    title: 'DaySmart Alternatives: Best Pet Grooming Software for 2026',
    description:
      'Comparing DaySmart Pet alternatives? See how GroomGrid, MoeGo, and Pawfinity stack up on pricing, features, ease of use, and mobile access.',
    url: 'https://getgroomgrid.com/daysmart-alternatives',
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://getgroomgrid.com' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'DaySmart Alternatives',
      item: 'https://getgroomgrid.com/daysmart-alternatives',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'DaySmart Alternatives: Best Pet Grooming Software for 2026',
  description:
    'Comparing DaySmart Pet alternatives? See how GroomGrid, MoeGo, and Pawfinity stack up on pricing, features, ease of use, and mobile access — and why groomers are switching.',
  url: 'https://getgroomgrid.com/daysmart-alternatives',
  datePublished: '2026-04-23',
  dateModified: '2026-04-23',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/daysmart-alternatives',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is DaySmart Pet grooming software worth it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DaySmart Pet (formerly 123Pet) is a solid choice for established salons that need multi-location management and detailed reporting. However, it is desktop-first, has a dated interface, and pricing starts higher than newer competitors. Solo groomers and mobile operators often find it overkill — and overpriced — for their needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best DaySmart alternative for solo groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid is the best DaySmart alternative for solo groomers — it offers AI scheduling, automated reminders, mobile-first design, and integrated payments starting at $29/month. DaySmart\'s lowest tier is more expensive and lacks the mobile-first experience that independent groomers need.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does DaySmart pricing compare to alternatives?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DaySmart Pet pricing starts around $49–$79/month for a single user and increases with add-ons. GroomGrid starts at $29/month for the Solo tier. MoeGo starts around $49/month. Pawfinity starts around $40/month. For the feature set most solo and small salon groomers need, GroomGrid and Pawfinity offer the best value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I switch from DaySmart to another grooming software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — most grooming software platforms, including GroomGrid, allow you to import client data via CSV. Export your client list, pet records, and appointment history from DaySmart, then import into your new platform. The process typically takes 1–2 hours. Ask your new provider about migration support.',
      },
    },
    {
      '@type': 'Question',
      name: 'What features does GroomGrid have that DaySmart doesn\'t?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid offers AI scheduling assistance, AI breed detection, mobile-first design that works on any device in the field, automated 3-touch reminders included in every plan, and a 14-day free trial without a credit card. DaySmart is desktop-focused, requires a Windows install for full functionality, and charges extra for features like automated reminders on some tiers.',
      },
    },
  ],
};

const comparisonRows = [
  { feature: 'Starting price (1 groomer)', groomgrid: '$29/mo', daysmart: '$49+/mo', moego: '$49+/mo', pawfinity: '$40/mo' },
  { feature: 'AI scheduling assistant', groomgrid: '✓', daysmart: '—', moego: '—', pawfinity: '—' },
  { feature: 'AI breed detection', groomgrid: '✓', daysmart: '—', moego: '—', pawfinity: '—' },
  { feature: 'Mobile-first design', groomgrid: '✓', daysmart: '—', moego: '✓', pawfinity: 'Partial' },
  { feature: 'Automated 3-touch reminders', groomgrid: 'Included', daysmart: 'Add-on', moego: 'Included', pawfinity: 'Included' },
  { feature: 'Online booking page', groomgrid: '✓', daysmart: '✓', moego: '✓', pawfinity: '✓' },
  { feature: 'Integrated payments', groomgrid: '✓', daysmart: '✓', moego: '✓', pawfinity: 'Partial' },
  { feature: 'Free trial (no credit card)', groomgrid: '14 days', daysmart: '—', moego: '—', pawfinity: '7 days' },
  { feature: 'Multi-location support', groomgrid: '✓', daysmart: '✓', moego: '✓', pawfinity: '—' },
  { feature: 'Desktop app required', groomgrid: 'No', daysmart: 'Yes (Windows)', moego: 'No', pawfinity: 'No' },
];

export default function DaySmartAlternativesPage() {
  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
          <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">
                DaySmart Alternatives
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Software Comparison · Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            DaySmart Alternatives:<br className="hidden sm:block" /> Best Pet Grooming Software for 2026
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            DaySmart Pet has been around for years — but that longevity comes with legacy design
            decisions that do not work for every groomer. If you are comparing DaySmart
            alternatives, here is how the top options stack up on pricing, features, and the things
            that actually matter when you are running dogs through your schedule every day.
          </p>
        </header>

        {/* ── Why Switch ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Why Groomers Look for DaySmart Alternatives
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              DaySmart Pet (formerly 123Pet) is a capable platform — especially for multi-location
              salons. But groomers switch for consistent reasons:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Desktop-first design — DaySmart was built for Windows desktops. The web version exists but lags behind native mobile-first tools in responsiveness and ease of use.',
                'Higher starting price — at $49+/month for a single groomer, DaySmart costs significantly more than mobile-first alternatives that start at $29/month.',
                'Feature add-ons — automated reminders, online booking, and other core features cost extra on some DaySmart tiers, while competitors include them in base pricing.',
                'Dated interface — the UI works, but it feels like software from 2015. For groomers used to modern app design, the learning curve is steeper than it needs to be.',
                'No AI features — DaySmart has not added AI scheduling, breed detection, or any of the intelligent automation that newer platforms offer.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-red-400 font-bold mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed">
              None of this means DaySmart is bad — it means it is built for a specific type of
              business. If you are a solo groomer or mobile operator, a DaySmart alternative built
              for how you actually work will save you money and frustration.
            </p>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            DaySmart Alternatives: Feature Comparison
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            The four platforms groomers compare most often when leaving DaySmart:
          </p>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-700">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold">Feature</th>
                  <th className="text-center px-5 py-4 font-semibold text-green-600">GroomGrid</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">DaySmart</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">MoeGo</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">Pawfinity</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                    <td className="px-5 py-3 text-stone-700 font-medium">{row.feature}</td>
                    <td className="px-5 py-3 text-center text-green-600 font-semibold">{row.groomgrid}</td>
                    <td className="px-5 py-3 text-center text-stone-500">{row.daysmart}</td>
                    <td className="px-5 py-3 text-center text-stone-500">{row.moego}</td>
                    <td className="px-5 py-3 text-center text-stone-500">{row.pawfinity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-stone-500 text-xs mt-3">
            Based on published feature pages as of April 2026. Features subject to change.
          </p>
        </section>

        {/* ── GroomGrid vs DaySmart ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              GroomGrid vs. DaySmart: Who Should Choose What?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border-2 border-green-400 bg-white">
                <h3 className="font-bold text-green-600 text-lg mb-3">Choose GroomGrid if:</h3>
                <ul className="space-y-2 text-stone-600 text-sm">
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You are a solo or mobile groomer</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You need mobile-first software that works on any device</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You want AI scheduling and breed detection</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Price matters — starting at $29/month</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You want a free trial without a credit card</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-white">
                <h3 className="font-bold text-stone-500 text-lg mb-3">Choose DaySmart if:</h3>
                <ul className="space-y-2 text-stone-600 text-sm">
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You run a multi-location salon enterprise</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You need Windows desktop integration</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You are already using DaySmart and migration cost is too high</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You need legacy POS hardware integration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Migrating ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            How to Switch from DaySmart to GroomGrid
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Switching is simpler than most groomers expect:
          </p>
          <div className="space-y-4 mb-6">
            {[
              'Export your client list and pet records from DaySmart as CSV files',
              'Sign up for a GroomGrid free trial — no credit card required',
              'Import your CSV data — GroomGrid walks you through it',
              'Set up your services, pricing, and business hours',
              'Connect your payment processor (Stripe setup takes 5 minutes)',
              'Run both systems in parallel for 1–2 weeks if you want a safety net',
              'Cancel DaySmart once you are confident everything works',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold text-lg">{i + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-stone-600 leading-relaxed">
            Total migration time: 1–2 hours for data import, plus 1–2 weeks of parallel running if
            you want it. Most groomers are fully switched over within a day.
          </p>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 py-16 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqSchema.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => (
                <div key={item.name} className="border border-stone-200 rounded-xl p-6 bg-white">
                  <h3 className="font-bold text-stone-800 mb-3">{item.name}</h3>
                  <p className="text-stone-600 leading-relaxed text-sm">
                    {item.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Links ── */}
        <RelatedLinks
          heading="The DaySmart alternative built for how groomers actually work"
          links={[
          { href: '/signup?coupon=BETA50', category: 'Comparison', title: 'GroomGrid vs MoeGo: Which Dog Grooming Software is Right for You?' },
          { href: '/pawfinity-alternatives', category: 'Alternatives', title: 'Pawfinity Alternatives: Best Pet Grooming Software for 2026' },
          { href: '/blog/dog-grooming-software', category: 'Software Guide', title: 'Dog Grooming Software: The 2026 Buyer's Guide' }
          ]}
          columns={3}
        />

        {/* ── Footer ── */}
        <SiteFooter />
      </div>
    </>
  );
}
