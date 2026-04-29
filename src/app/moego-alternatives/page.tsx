import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'MoeGo Alternatives: Best Pet Grooming Software for 2026 | GroomGrid',
  description:
    'Looking for MoeGo alternatives? Compare GroomGrid, DaySmart, and Pawfinity on pricing, features, AI tools, and mobile access — and see why groomers are making the switch.',
  alternates: {
    canonical: 'https://getgroomgrid.com/moego-alternatives',
  },
  openGraph: {
    title: 'MoeGo Alternatives: Best Pet Grooming Software for 2026',
    description:
      'Looking for MoeGo alternatives? Compare GroomGrid, DaySmart, and Pawfinity on pricing, features, and mobile access.',
    url: 'https://getgroomgrid.com/moego-alternatives',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'MoeGo Alternatives: Best Pet Grooming Software for 2026',
  description:
    'Looking for MoeGo alternatives? Compare GroomGrid, DaySmart, and Pawfinity on pricing, features, AI tools, and mobile access.',
  url: 'https://getgroomgrid.com/moego-alternatives',
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
    '@id': 'https://getgroomgrid.com/moego-alternatives',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is MoeGo worth the price for solo groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MoeGo is a capable platform, but at $49+/month it can feel expensive for solo groomers running 4–8 dogs per day. If you do not need MoeGo\'s enterprise features — multi-location management, franchise tools, advanced analytics — there are alternatives that deliver the core features (scheduling, reminders, payments) at a lower price point. GroomGrid starts at $29/month with AI scheduling included.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best MoeGo alternative for mobile groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid is the best MoeGo alternative for mobile groomers. It is designed mobile-first — so it works on any device, van or salon. It includes automated SMS reminders to cut no-shows, AI scheduling to pack your day efficiently, and integrated payments so clients can pay before you pull away. Starts at $29/month with a 14-day free trial.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does MoeGo pricing compare to alternatives?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MoeGo starts around $49/month for a solo groomer and increases with additional staff and features. GroomGrid starts at $29/month for the Solo tier. DaySmart starts at $49–$79/month. Pawfinity starts around $40/month. For the core features most groomers need — scheduling, reminders, and payments — GroomGrid offers the best value with AI tools included.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does GroomGrid have AI features that MoeGo does not?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. GroomGrid includes an AI scheduling assistant that helps you build an efficient daily schedule and an AI breed detection tool that auto-populates breed-specific care notes. MoeGo does not currently offer AI scheduling or breed detection. GroomGrid also includes a 14-day free trial with no credit card required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I import my data from MoeGo to GroomGrid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Export your client list and pet records from MoeGo as a CSV file, then import them into GroomGrid during onboarding. The process takes 1–2 hours. GroomGrid\'s onboarding flow walks you through it step by step — or you can contact support for migration assistance.',
      },
    },
  ],
};

const comparisonRows = [
  { feature: 'Starting price (1 groomer)', groomgrid: '$29/mo', moego: '$49+/mo', daysmart: '$49+/mo', pawfinity: '$40/mo' },
  { feature: 'AI scheduling assistant', groomgrid: '✓', moego: '—', daysmart: '—', pawfinity: '—' },
  { feature: 'AI breed detection', groomgrid: '✓', moego: '—', daysmart: '—', pawfinity: '—' },
  { feature: 'Automated 3-touch reminders', groomgrid: 'Included', moego: 'Included', daysmart: 'Add-on', pawfinity: 'Included' },
  { feature: 'Mobile-first design', groomgrid: '✓', moego: '✓', daysmart: '—', pawfinity: 'Partial' },
  { feature: 'Online booking page', groomgrid: '✓', moego: '✓', daysmart: '✓', pawfinity: '✓' },
  { feature: 'Integrated payments', groomgrid: '✓', moego: '✓', daysmart: '✓', pawfinity: 'Partial' },
  { feature: 'Free trial (no credit card)', groomgrid: '14 days', moego: '—', daysmart: '—', pawfinity: '7 days' },
  { feature: 'Multi-location support', groomgrid: '✓', moego: '✓', daysmart: '✓', pawfinity: '—' },
  { feature: 'Abandoned booking recovery', groomgrid: '✓', moego: '✓', daysmart: '—', pawfinity: '—' },
];

export default function MoeGoAlternativesPage() {
  return (
    <>      <Script
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
          <PageBreadcrumbs slug="moego-alternatives" />
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Software Comparison · Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            MoeGo Alternatives:<br className="hidden sm:block" /> Best Pet Grooming Software for 2026
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            MoeGo is the market leader in grooming software — and it shows in the price tag. If you
            are a solo groomer or mobile operator who does not need enterprise features, there are
            MoeGo alternatives that give you the core tools for significantly less. Here is the
            honest comparison.
          </p>
        </header>

        {/* ── Why Switch ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Why Groomers Look for MoeGo Alternatives
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              MoeGo works well — that is not the question. The question is whether you are paying for
              features you will never use. Here is what groomers say when they start shopping around:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Price creep — MoeGo starts at $49+/month and the cost rises quickly with add-ons, additional staff logins, and processing fees. Solo groomers on tight margins feel this most.',
                'Complexity for solo operators — MoeGo was built with salons and franchises in mind. The feature set can feel overwhelming if you are running 6 dogs a day out of your van.',
                'No AI features — MoeGo does not offer AI scheduling, breed detection, or smart automation. Newer platforms are beginning to close the gap meaningfully.',
                'No free trial with credit card removal — MoeGo does not offer a no-credit-card trial period, making it harder to evaluate before committing.',
                'Support response times — some groomers report slower-than-expected response from MoeGo support during peak periods.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-red-400 font-bold mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed">
              None of these are dealbreakers for every groomer — but if you recognize yourself in
              this list, a MoeGo alternative might save you money and reduce daily friction.
            </p>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            MoeGo Alternatives: Feature Comparison
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            The four platforms groomers compare most when evaluating MoeGo alternatives:
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
            Based on published feature pages as of April 2026. Features subject to change.
          </p>
        </section>

        {/* ── GroomGrid vs MoeGo ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              GroomGrid vs. MoeGo: Who Should Choose What?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border-2 border-green-400 bg-white">
                <h3 className="font-bold text-green-600 text-lg mb-3">Choose GroomGrid if:</h3>
                <ul className="space-y-2 text-stone-600 text-sm">
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You are a solo or mobile groomer</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Budget matters — starting at $29/month</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You want AI scheduling + breed detection built in</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You want a 14-day free trial, no credit card needed</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You are scaling from 1–5 groomers and need simplicity</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-white">
                <h3 className="font-bold text-stone-500 text-lg mb-3">Stick with MoeGo if:</h3>
                <ul className="space-y-2 text-stone-600 text-sm">
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You run a multi-location franchise operation</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You need advanced enterprise analytics and reporting</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> Your team is already trained on MoeGo and switching costs are high</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You need dedicated enterprise-tier support SLAs</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pain Points Section ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            What GroomGrid Solves That MoeGo Does Not
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: '🤖',
                title: 'AI Scheduling',
                body: 'GroomGrid\'s AI assistant helps you build an efficient daily schedule — filling gaps, balancing appointment times, and flagging conflicts before they become problems. MoeGo has no comparable AI scheduling feature.',
              },
              {
                icon: '📱',
                title: 'True Mobile-First',
                body: 'GroomGrid was designed for groomers working from a van or on the go. Every screen works on a phone without pinching and zooming. Check-in, collect payment, send a reminder — all from your phone without switching tabs.',
              },
              {
                icon: '💸',
                title: '$20/mo Savings Minimum',
                body: 'GroomGrid Solo tier is $29/mo versus MoeGo\'s $49+ starting price. That is $240/year back in your pocket — enough to cover fuel for multiple weeks.',
              },
              {
                icon: '🐾',
                title: 'AI Breed Detection',
                body: 'Photograph the dog on arrival and GroomGrid auto-fills the breed, suggesting grooming notes and typical service times. This alone saves 2–3 minutes per appointment — adding up to 30+ minutes per day.',
              },
              {
                icon: '🔔',
                title: 'No-Show Prevention',
                body: 'Automated 3-touch SMS and email reminders are included in every GroomGrid plan — not a paid add-on. Mobile groomers report that reminders cut no-shows by 30–40%, saving wasted drive time and gas.',
              },
              {
                icon: '🎁',
                title: '14-Day Free Trial',
                body: 'Try GroomGrid free for 14 days — no credit card required. MoeGo does not offer a free trial period. You can run GroomGrid in parallel with your current setup to evaluate it without any risk.',
              },
            ].map((item) => (
              <div key={item.title} className="p-6 border border-stone-200 rounded-xl bg-white hover:border-green-300 hover:shadow-sm transition-all">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Migrating ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              How to Switch from MoeGo to GroomGrid
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Most groomers complete the migration in under two hours:
            </p>
            <div className="space-y-4 mb-6">
              {[
                'Export your client list and pet records from MoeGo — go to Settings → Data Export → CSV',
                'Sign up for GroomGrid free trial — no credit card required at getgroomgrid.com',
                'Import your CSV during onboarding — GroomGrid maps the fields automatically',
                'Set up your services, pricing, and business hours (takes 10–15 minutes)',
                'Connect Stripe for payments — setup takes about 5 minutes',
                'Run both systems side-by-side for 1–2 weeks if you want a safety net',
                'Cancel MoeGo once you confirm everything transferred correctly',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold text-lg">{i + 1}.</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-stone-600 leading-relaxed">
              Your clients will not notice a thing — they will just keep getting their appointment
              reminders, which now arrive from GroomGrid.
            </p>
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
        <PageRelatedLinks slug="moego-alternatives" variant="landing" heading="The MoeGo alternative built for groomers who do not need enterprise pricing" />

        {/* ── Footer ── */}
        <SiteFooter slug="moego-alternatives" />
      </div>
    </>
  );
}
