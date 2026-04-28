import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Best Dog Grooming Software for 2026: Full Comparison | GroomGrid',
  description:
    'Comparing the best dog grooming software of 2026? We review GroomGrid, MoeGo, DaySmart, and Pawfinity on pricing, AI features, scheduling, and ease of use for solo and salon groomers.',
  alternates: {
    canonical: 'https://getgroomgrid.com/best-dog-grooming-software',
  },
  openGraph: {
    title: 'Best Dog Grooming Software for 2026: Full Comparison',
    description:
      'Full comparison of the best dog grooming software — GroomGrid, MoeGo, DaySmart, Pawfinity. Find the right fit for solo groomers, mobile operators, and salons.',
    url: 'https://getgroomgrid.com/best-dog-grooming-software',
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
      name: 'Best Dog Grooming Software',
      item: 'https://getgroomgrid.com/best-dog-grooming-software',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Dog Grooming Software for 2026: Full Comparison',
  description:
    'We compare the top dog grooming software platforms — GroomGrid, MoeGo, DaySmart, and Pawfinity — on pricing, features, AI tools, and use case fit.',
  url: 'https://getgroomgrid.com/best-dog-grooming-software',
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
    '@id': 'https://getgroomgrid.com/best-dog-grooming-software',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best dog grooming software for solo groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid is the best dog grooming software for solo groomers in 2026. It is mobile-first, starts at $29/month, includes AI scheduling and breed detection, and offers automated SMS reminders to prevent no-shows — all critical features for an independent groomer working alone. There is also a 14-day free trial with no credit card required.',
      },
    },
    {
      '@type': 'Question',
      name: 'What dog grooming software is best for mobile groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mobile groomers need software that works on any device without a laptop. GroomGrid is designed mobile-first — every feature works from a smartphone. It also includes SMS reminders to reduce costly no-shows (wasted drive time), integrated payments so clients can pay before you leave, and a daily schedule view that is easy to read on a small screen.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does dog grooming software cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dog grooming software typically costs between $29 and $149 per month depending on the platform and plan tier. GroomGrid starts at $29/month for solo groomers, $79/month for salons, and $149/month for enterprise (multi-location). MoeGo starts at $49+/month. DaySmart starts at $49–$79/month. Pawfinity starts around $40/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does dog grooming software help reduce no-shows?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — automated appointment reminders are one of the biggest ROI features in grooming software. A 3-touch reminder sequence (48 hours, 24 hours, and 2 hours before) can reduce no-shows by 30–40%. For mobile groomers, every no-show wastes drive time and fuel — so reminder automation pays for the software subscription very quickly.',
      },
    },
    {
      '@type': 'Question',
      name: 'What features should I look for in dog grooming software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The essential features for any grooming business: (1) Online scheduling with a client-facing booking page. (2) Automated SMS/email reminders to prevent no-shows. (3) Client and pet profiles with breed notes, allergy info, and grooming history. (4) Integrated payments so you can collect before the client leaves. (5) Mobile-friendly design that works from a phone. For mobile groomers, add route management. For salons, add staff scheduling and multi-groomer calendars.',
      },
    },
  ],
};

const comparisonRows = [
  { feature: 'Starting price (1 groomer)', groomgrid: '$29/mo', moego: '$49+/mo', daysmart: '$49+/mo', pawfinity: '$40/mo' },
  { feature: 'AI scheduling assistant', groomgrid: '✓', moego: '—', daysmart: '—', pawfinity: '—' },
  { feature: 'AI breed detection', groomgrid: '✓', moego: '—', daysmart: '—', pawfinity: '—' },
  { feature: 'Automated SMS reminders', groomgrid: 'Included', moego: 'Included', daysmart: 'Add-on', pawfinity: 'Included' },
  { feature: 'Mobile-first design', groomgrid: '✓', moego: '✓', daysmart: '—', pawfinity: 'Partial' },
  { feature: 'Client + pet profiles', groomgrid: '✓', moego: '✓', daysmart: '✓', pawfinity: '✓' },
  { feature: 'Online booking page', groomgrid: '✓', moego: '✓', daysmart: '✓', pawfinity: '✓' },
  { feature: 'Integrated payments', groomgrid: '✓', moego: '✓', daysmart: '✓', pawfinity: 'Partial' },
  { feature: 'Free trial (no credit card)', groomgrid: '14 days', moego: '—', daysmart: '—', pawfinity: '7 days' },
  { feature: 'Multi-location support', groomgrid: '✓', moego: '✓', daysmart: '✓', pawfinity: '—' },
  { feature: 'Setup difficulty', groomgrid: 'Easy', moego: 'Moderate', daysmart: 'Complex', pawfinity: 'Easy' },
];

const platforms = [
  {
    name: 'GroomGrid',
    tagline: 'Best for: Solo groomers, mobile operators, small salons',
    price: 'From $29/mo',
    highlight: true,
    pros: [
      'Lowest starting price at $29/month',
      'AI scheduling assistant + breed detection',
      'Built mobile-first — works on any device',
      'Automated 3-touch reminders included',
      '14-day free trial, no credit card',
    ],
    cons: [
      'Newer platform — fewer third-party integrations than legacy tools',
      'Enterprise tier required for large multi-location chains',
    ],
    verdict:
      'The best choice for independent groomers and small salons that want modern AI tools without the enterprise price tag.',
  },
  {
    name: 'MoeGo',
    tagline: 'Best for: Established salons, franchise operations',
    price: 'From $49/mo',
    highlight: false,
    pros: [
      'Market leader with extensive features',
      'Strong multi-location and franchise support',
      'Large user community and integrations',
      'Mobile app with booking management',
    ],
    cons: [
      'Higher starting price — $49+/mo before add-ons',
      'No AI scheduling or breed detection',
      'No free trial period',
      'Complexity can overwhelm solo operators',
    ],
    verdict:
      'Solid platform for salons and franchises with larger budgets. Overkill for solo and mobile groomers.',
  },
  {
    name: 'DaySmart Pet',
    tagline: 'Best for: Multi-location enterprises, legacy POS users',
    price: 'From $49/mo',
    highlight: false,
    pros: [
      'Long-established platform with deep reporting',
      'Multi-location management and advanced analytics',
      'Windows desktop app for POS integration',
      'Extensive customization options',
    ],
    cons: [
      'Desktop-first — not optimized for mobile use in the field',
      'Dated interface compared to modern competitors',
      'No AI features',
      'Reminders are an add-on, not included',
    ],
    verdict:
      'Best for established salons with legacy POS hardware or enterprise-scale reporting needs. Not ideal for mobile-first operations.',
  },
  {
    name: 'Pawfinity',
    tagline: 'Best for: Small indie salons on a budget',
    price: 'From $40/mo',
    highlight: false,
    pros: [
      'Affordable starting price',
      '7-day free trial available',
      'Simple, clean interface',
      'Adequate core features for basic operations',
    ],
    cons: [
      'Limited mobile experience',
      'No multi-location support',
      'Payments are partial/limited',
      'Smaller support team and slower roadmap',
    ],
    verdict:
      'A budget option for small salons that just need the basics. Lacks the mobile-first design and AI tools that modern groomers benefit from.',
  },
];

export default function BestDogGroomingSoftwarePage() {
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
                Best Dog Grooming Software
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Buyer&apos;s Guide · Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Best Dog Grooming Software<br className="hidden sm:block" /> for 2026: Full Comparison
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            We compared the four leading dog grooming software platforms on what actually matters:
            pricing, mobile access, scheduling tools, no-show prevention, and ease of setup. Whether
            you run a van or a multi-groomer salon, here is the unbiased breakdown.
          </p>
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl text-stone-700 text-sm">
            <strong className="text-green-700">Bottom line up front:</strong> For solo and mobile
            groomers, <strong>GroomGrid</strong> is the best option in 2026 — lowest price,
            AI-powered, mobile-first, with a 14-day free trial and no credit card required.
          </div>
        </header>

        {/* ── What to Look For ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              What to Look for in Dog Grooming Software
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Not all grooming software is built the same. Before you commit, make sure your chosen
              platform covers these five essentials:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '📅', title: 'Online scheduling', body: 'Clients should be able to book 24/7 without calling you. Look for a client-facing booking page that syncs with your calendar automatically.' },
                { icon: '🔔', title: 'Automated reminders', body: 'No-shows kill margins. A 3-touch reminder sequence (48h, 24h, 2h before) is the single highest-ROI feature in grooming software. Make sure it is included, not an add-on.' },
                { icon: '🐾', title: 'Client + pet profiles', body: 'Every dog in your book should have breed, size, grooming notes, allergy info, and vaccination status stored — accessible instantly from your phone or tablet.' },
                { icon: '💳', title: 'Integrated payments', body: 'Collecting payment should not require a separate app. Look for built-in credit card processing with automatic receipts and optional tipping.' },
                { icon: '📱', title: 'Mobile-first design', body: 'If the software is not optimized for a 6-inch screen, you will hate using it from a van. Test the mobile view before committing — not just the desktop demo.' },
              ].map((item) => (
                <div key={item.title} className="p-5 bg-white border border-stone-200 rounded-xl">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-stone-800 mb-1 text-sm">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Side-by-Side Feature Comparison
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            The four platforms groomers compare most in 2026:
          </p>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-700">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold">Feature</th>
                  <th className="text-center px-5 py-4 font-semibold text-green-600">GroomGrid</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">MoeGo</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">DaySmart</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">Pawfinity</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                    <td className="px-5 py-3 text-stone-700 font-medium">{row.feature}</td>
                    <td className="px-5 py-3 text-center text-green-600 font-semibold">{row.groomgrid}</td>
                    <td className="px-5 py-3 text-center text-stone-500">{row.moego}</td>
                    <td className="px-5 py-3 text-center text-stone-500">{row.daysmart}</td>
                    <td className="px-5 py-3 text-center text-stone-500">{row.pawfinity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-stone-500 text-xs mt-3">
            Based on published feature pages and pricing as of April 2026. Features subject to change.
          </p>
        </section>

        {/* ── Platform Reviews ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-8">
              Platform Reviews: Pros, Cons, and Verdict
            </h2>
            <div className="space-y-6">
              {platforms.map((p) => (
                <div
                  key={p.name}
                  className={`p-6 rounded-xl border-2 bg-white ${p.highlight ? 'border-green-400' : 'border-stone-200'}`}
                >
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <h3 className={`text-xl font-bold ${p.highlight ? 'text-green-600' : 'text-stone-800'}`}>
                        {p.name}
                        {p.highlight && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            Editor&apos;s Pick
                          </span>
                        )}
                      </h3>
                      <p className="text-stone-500 text-sm">{p.tagline}</p>
                    </div>
                    <span className="text-stone-700 font-semibold text-sm">{p.price}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-bold text-stone-500 uppercase mb-2">Pros</p>
                      <ul className="space-y-1">
                        {p.pros.map((pro) => (
                          <li key={pro} className="flex items-start gap-2 text-stone-600 text-sm">
                            <span className="text-green-500 font-bold mt-0.5">+</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-500 uppercase mb-2">Cons</p>
                      <ul className="space-y-1">
                        {p.cons.map((con) => (
                          <li key={con} className="flex items-start gap-2 text-stone-600 text-sm">
                            <span className="text-red-400 font-bold mt-0.5">−</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <p className="text-stone-600 text-sm">
                      <strong className="text-stone-700">Verdict: </strong>
                      {p.verdict}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Use Case Matching ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Which Software Is Right for Your Situation?
          </h2>
          <div className="space-y-4">
            {[
              { situation: 'I\'m a solo mobile groomer (van-based, 4–8 dogs/day)', winner: 'GroomGrid', reason: 'Mobile-first, $29/mo, AI scheduling, automated reminders. Built for exactly this use case.' },
              { situation: 'I just started my grooming business and need something simple', winner: 'GroomGrid', reason: 'Easiest setup, 14-day free trial to learn without pressure, and all core features included from day one.' },
              { situation: 'I own a 3-groomer salon and need team scheduling', winner: 'GroomGrid Salon', reason: '$79/mo tier handles multi-staff scheduling, team calendars, and client retention features.' },
              { situation: 'I run multiple salon locations across cities', winner: 'MoeGo or DaySmart', reason: 'Both offer mature multi-location infrastructure. Enterprise-tier GroomGrid ($149/mo) covers this too.' },
              { situation: 'I need to replace DaySmart and modernize my salon', winner: 'GroomGrid', reason: 'Modern UI, AI tools DaySmart lacks, and significantly lower starting price. Migration takes 1–2 hours.' },
              { situation: 'I specialize in cats and need detailed temperament tracking', winner: 'GroomGrid', reason: 'Pet profiles support cat-specific fields: temperament, stress notes, sedation flags, and extended appointment slots.' },
            ].map((item) => (
              <div key={item.situation} className="p-5 border border-stone-200 rounded-xl bg-white">
                <p className="text-stone-500 text-sm mb-1 italic">&ldquo;{item.situation}&rdquo;</p>
                <p className="text-stone-800 text-sm">
                  <strong className="text-green-600">→ {item.winner}:</strong> {item.reason}
                </p>
              </div>
            ))}
          </div>
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
          heading="The best dog grooming software for groomers who are serious about their business"
          links={[
          { href: '/signup?coupon=BETA50', category: 'Alternatives', title: 'MoeGo Alternatives: Best Pet Grooming Software for 2026' },
          { href: '/daysmart-alternatives', category: 'Alternatives', title: 'DaySmart Alternatives: Best Pet Grooming Software for 2026' },
          { href: '/mobile-grooming-software', category: 'Mobile Groomers', title: 'Mobile Grooming Software: The Van Groomer\'s Complete Guide' }
          ]}
          columns={3}
        />

        {/* ── Footer ── */}
        <SiteFooter />
      </div>
    </>
  );
}
