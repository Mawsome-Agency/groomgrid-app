import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Pawfinity Alternatives: Best Pet Grooming Software for 2026 | GroomGrid',
  description:
    'Looking for Pawfinity alternatives? Compare GroomGrid, MoeGo, and DaySmart on pricing, features, mobile access, and ease of use — and see why groomers are making the switch.',
  alternates: {
    canonical: 'https://getgroomgrid.com/pawfinity-alternatives',
  },
  openGraph: {
    title: 'Pawfinity Alternatives: Best Pet Grooming Software for 2026',
    description:
      'Looking for Pawfinity alternatives? Compare GroomGrid, MoeGo, and DaySmart on pricing, features, mobile access, and ease of use.',
    url: 'https://getgroomgrid.com/pawfinity-alternatives',
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
      name: 'Pawfinity Alternatives',
      item: 'https://getgroomgrid.com/pawfinity-alternatives',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pawfinity Alternatives: Best Pet Grooming Software for 2026',
  description:
    'Looking for Pawfinity alternatives? Compare GroomGrid, MoeGo, and DaySmart on pricing, features, mobile access, and ease of use — and see why groomers are making the switch.',
  url: 'https://getgroomgrid.com/pawfinity-alternatives',
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
    '@id': 'https://getgroomgrid.com/pawfinity-alternatives',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Pawfinity good grooming software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pawfinity is a solid entry-level grooming software, particularly popular with indie groomers and small operations. It covers scheduling, client records, and basic reminders. However, it lacks AI features, has limited mobile functionality, and its payment processing is less integrated than newer competitors. It works well for groomers who want simplicity, but those needing more automation and mobile access typically outgrow it.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best Pawfinity alternative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid is the best Pawfinity alternative for groomers who need mobile-first design, AI scheduling, automated 3-touch reminders, and fully integrated payments — all starting at $29/month. For groomers who prefer a larger established platform, MoeGo is a strong alternative starting around $49/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does Pawfinity cost compared to alternatives?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pawfinity starts around $40/month for a single user. GroomGrid starts at $29/month with more features included (AI scheduling, breed detection, automated reminders). MoeGo starts around $49/month. DaySmart starts around $49+/month. GroomGrid offers the lowest entry price with the most complete feature set for solo and mobile groomers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I migrate from Pawfinity to GroomGrid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Export your client and pet data from Pawfinity as CSV, then import into GroomGrid. The import process takes 30–60 minutes for most groomers. GroomGrid provides step-by-step guidance, and you can run both systems in parallel during the transition to ensure nothing is lost.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Pawfinity have mobile access?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pawfinity offers a web-based interface that works on mobile browsers, but it is not optimized for mobile use — the experience is closer to a desktop app squeezed onto a phone screen. GroomGrid and MoeGo are both built mobile-first, meaning the interface is designed specifically for the phone or tablet you use in the grooming area or on the road.',
      },
    },
  ],
};

const comparisonRows = [
  { feature: 'Starting price (1 groomer)', groomgrid: '$29/mo', pawfinity: '$40/mo', moego: '$49+/mo', daysmart: '$49+/mo' },
  { feature: 'AI scheduling assistant', groomgrid: '✓', pawfinity: '—', moego: '—', daysmart: '—' },
  { feature: 'AI breed detection', groomgrid: '✓', pawfinity: '—', moego: '—', daysmart: '—' },
  { feature: 'Mobile-first design', groomgrid: '✓', pawfinity: 'Partial', moego: '✓', daysmart: '—' },
  { feature: 'Automated 3-touch reminders', groomgrid: 'Included', pawfinity: 'Included', moego: 'Included', daysmart: 'Add-on' },
  { feature: 'Online booking page', groomgrid: '✓', pawfinity: '✓', moego: '✓', daysmart: '✓' },
  { feature: 'Integrated payments', groomgrid: '✓', pawfinity: 'Partial', moego: '✓', daysmart: '✓' },
  { feature: 'Free trial (no credit card)', groomgrid: '14 days', pawfinity: '7 days', moego: '—', daysmart: '—' },
  { feature: 'Multi-groomer scheduling', groomgrid: '✓', pawfinity: 'Limited', moego: '✓', daysmart: '✓' },
  { feature: 'Business reporting', groomgrid: '✓', pawfinity: 'Basic', moego: '✓', daysmart: '✓' },
];

export default function PawfinityAlternativesPage() {
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
                Pawfinity Alternatives
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
            Pawfinity Alternatives:<br className="hidden sm:block" /> Best Pet Grooming Software for 2026
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Pawfinity is a popular choice for indie groomers — affordable and simple. But
            simplicity has limits. If you have outgrown basic scheduling or need mobile-first
            access, AI features, and fully integrated payments, here is how the top Pawfinity
            alternatives compare.
          </p>
        </header>

        {/* ── Why Look Beyond Pawfinity ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Why Groomers Look for Pawfinity Alternatives
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Pawfinity works well for what it does — basic scheduling, client records, and
              reminders for small operations. But groomers typically start looking for alternatives
              when they hit these walls:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Not truly mobile-first — Pawfinity works in a mobile browser, but the interface was designed for desktop. Using it on a phone while standing at the grooming table is clunky.',
                'Limited payment integration — Pawfinity supports payments, but the integration is less seamless than platforms built with Stripe from the ground up. Deposits and checkout can feel bolted on.',
                'No AI features — as grooming software evolves toward AI scheduling, breed detection, and intelligent automation, Pawfinity remains a manual system. That works, but it does not scale.',
                'Basic reporting — you get appointment history and basic revenue numbers. For groomers who want client retention metrics, no-show analytics, and growth tracking, the reporting is thin.',
                'Limited multi-groomer support — Pawfinity works for one or two groomers. Beyond that, the scheduling and reporting do not handle team complexity well.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-red-400 font-bold mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed">
              If Pawfinity covers everything you need, there is no reason to switch. But if you
              are doing 5+ dogs per day, working from a mobile device, or thinking about adding a
              second groomer — the alternatives below deserve a look.
            </p>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Pawfinity Alternatives: Feature Comparison
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            The four platforms groomers compare when looking beyond Pawfinity:
          </p>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-700">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold">Feature</th>
                  <th className="text-center px-5 py-4 font-semibold text-green-600">GroomGrid</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">Pawfinity</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">MoeGo</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">DaySmart</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                    <td className="px-5 py-3 text-stone-700 font-medium">{row.feature}</td>
                    <td className="px-5 py-3 text-center text-green-600 font-semibold">{row.groomgrid}</td>
                    <td className="px-5 py-3 text-center text-stone-500">{row.pawfinity}</td>
                    <td className="px-5 py-3 text-center text-stone-500">{row.moego}</td>
                    <td className="px-5 py-3 text-center text-stone-500">{row.daysmart}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-stone-500 text-xs mt-3">
            Based on published feature pages as of April 2026. Features subject to change.
          </p>
        </section>

        {/* ── GroomGrid vs Pawfinity ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              GroomGrid vs. Pawfinity: Who Should Choose What?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border-2 border-green-400 bg-white">
                <h3 className="font-bold text-green-600 text-lg mb-3">Choose GroomGrid if:</h3>
                <ul className="space-y-2 text-stone-600 text-sm">
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You need mobile-first software that works on any device</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You want AI scheduling and breed detection</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Fully integrated payments with deposits matter to you</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You want the lowest starting price — $29/month</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You plan to grow beyond solo grooming</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-white">
                <h3 className="font-bold text-stone-500 text-lg mb-3">Choose Pawfinity if:</h3>
                <ul className="space-y-2 text-stone-600 text-sm">
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You want the simplest possible interface</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You are a solo groomer doing under 5 dogs per day</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You do not need AI features or advanced reporting</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You are comfortable with basic mobile access</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Migrating ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            How to Switch from Pawfinity to GroomGrid
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            The switch is straightforward — most groomers complete it in under an hour:
          </p>
          <div className="space-y-4 mb-6">
            {[
              'Export your client list, pet records, and appointment history from Pawfinity as CSV',
              'Start a GroomGrid free trial — 14 days, full access, no credit card',
              'Import your CSV data through GroomGrid\'s setup wizard',
              'Configure your services, pricing, business hours, and reminder schedule',
              'Connect Stripe for payments (5-minute setup)',
              'Test with a few real appointments in both systems',
              'Cancel Pawfinity once everything runs smoothly',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold text-lg">{i + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-stone-600 leading-relaxed">
            Your client data is your most valuable business asset. GroomGrid lets you export
            everything as CSV at any time — no lock-in, no hassle.
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
          heading="The Pawfinity alternative with more features and a lower price"
          links={[
          { href: '/signup?coupon=BETA50', category: 'Alternatives', title: 'DaySmart Alternatives: Best Pet Grooming Software for 2026' },
          { href: '/blog/groomgrid-vs-moego', category: 'Comparison', title: 'GroomGrid vs MoeGo: Which Dog Grooming Software is Right for You?' },
          { href: '/blog/dog-grooming-software', category: 'Software Guide', title: 'Dog Grooming Software: The 2026 Buyer\'s Guide' }
          ]}
          columns={3}
        />

        {/* ── Footer ── */}
        <SiteFooter />
      </div>
    </>
  );
}
