import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: '123Pet Grooming Software Alternatives: Best Pet Grooming Software for 2026 | GroomGrid',
  description:
    'Looking for 123Pet grooming software alternatives? 123Pet is now DaySmart Pet — compare GroomGrid, MoeGo, and Pawfinity on pricing, features, AI tools, and mobile access.',
  alternates: {
    canonical: 'https://getgroomgrid.com/123-pet-grooming-software-alternatives',
  },
  openGraph: {
    title: '123Pet Grooming Software Alternatives: Best Pet Grooming Software for 2026',
    description:
      'Looking for 123Pet grooming software alternatives? Compare GroomGrid, MoeGo, and Pawfinity on pricing, features, and mobile access.',
    url: 'https://getgroomgrid.com/123-pet-grooming-software-alternatives',
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
      name: '123Pet Grooming Software Alternatives',
      item: 'https://getgroomgrid.com/123-pet-grooming-software-alternatives',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '123Pet Grooming Software Alternatives: Best Pet Grooming Software for 2026',
  description:
    'Looking for 123Pet grooming software alternatives? 123Pet is now DaySmart Pet — compare GroomGrid, MoeGo, and Pawfinity on pricing, features, and mobile access.',
  url: 'https://getgroomgrid.com/123-pet-grooming-software-alternatives',
  datePublished: '2026-04-28',
  dateModified: '2026-04-28',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/123-pet-grooming-software-alternatives',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is 123Pet the same as DaySmart Pet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. 123Pet was rebranded to DaySmart Pet. The software is the same product under a new name. If you are searching for 123Pet grooming software, you are looking for DaySmart Pet — and there are now newer alternatives like GroomGrid that offer AI scheduling, mobile-first design, and lower pricing starting at $29/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best 123Pet alternative for mobile groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid is the best 123Pet alternative for mobile groomers. It is built mobile-first, meaning every screen works on your phone without pinching and zooming. It includes AI scheduling to pack your day efficiently, automated SMS reminders to cut no-shows, and integrated payments starting at $29/month with a 14-day free trial.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does 123Pet pricing compare to alternatives?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '123Pet (now DaySmart Pet) starts around $49–$79/month for a single user and requires a Windows desktop for full functionality. GroomGrid starts at $29/month and works on any device — phone, tablet, or computer. MoeGo starts around $49/month. Pawfinity starts around $40/month. For the core features most groomers need, GroomGrid offers the best value with AI tools included.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I switch from 123Pet to another grooming software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Export your client list, pet records, and appointment history from 123Pet (DaySmart) as CSV files, then import them into your new platform. GroomGrid provides a step-by-step import wizard that walks you through the process. Most groomers complete the migration in 1–2 hours, and you can run both systems in parallel during the transition.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does 123Pet have AI features?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. 123Pet (DaySmart Pet) does not offer AI scheduling, breed detection, or smart automation. It is a traditional desktop-first grooming management tool. GroomGrid includes an AI scheduling assistant that optimizes your daily schedule and AI breed detection that auto-populates breed-specific care notes — both included in the $29/month Solo tier.',
      },
    },
  ],
};

const comparisonRows = [
  { feature: 'Starting price (1 groomer)', groomgrid: '$29/mo', onetwothreepet: '$49+/mo', moego: '$49+/mo', pawfinity: '$40/mo' },
  { feature: 'AI scheduling assistant', groomgrid: '✓', onetwothreepet: '—', moego: '—', pawfinity: '—' },
  { feature: 'AI breed detection', groomgrid: '✓', onetwothreepet: '—', moego: '—', pawfinity: '—' },
  { feature: 'Mobile-first design', groomgrid: '✓', onetwothreepet: '—', moego: '✓', pawfinity: 'Partial' },
  { feature: 'Automated 3-touch reminders', groomgrid: 'Included', onetwothreepet: 'Add-on', moego: 'Included', pawfinity: 'Included' },
  { feature: 'Online booking page', groomgrid: '✓', onetwothreepet: '✓', moego: '✓', pawfinity: '✓' },
  { feature: 'Integrated payments', groomgrid: '✓', onetwothreepet: '✓', moego: '✓', pawfinity: 'Partial' },
  { feature: 'Free trial (no credit card)', groomgrid: '14 days', onetwothreepet: '—', moego: '—', pawfinity: '7 days' },
  { feature: 'Desktop app required', groomgrid: 'No', onetwothreepet: 'Yes (Windows)', moego: 'No', pawfinity: 'No' },
  { feature: 'Modern web interface', groomgrid: '✓', onetwothreepet: '—', moego: '✓', pawfinity: 'Partial' },
];

export default function Pet123GroomingSoftwareAlternativesPage() {
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
            data-cta="nav-start-trial"
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
                123Pet Alternatives
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
            123Pet Grooming Software Alternatives:<br className="hidden sm:block" /> Best Pet Grooming Software for 2026
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            123Pet is now DaySmart Pet — and while the name changed, the desktop-first design
            and premium pricing stayed the same. If you are comparing 123Pet alternatives,
            here is how the top options stack up on pricing, features, and the things that
            matter most when you are running dogs through your schedule every day.
          </p>
        </header>

        {/* ── Why Switch ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Why Groomers Look for 123Pet Alternatives
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              123Pet (now DaySmart Pet) has been around for years — but the grooming industry
              has moved on. Here is what drives groomers to search for alternatives:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Desktop-first design — 123Pet was built for Windows desktops. The web version exists but does not match the mobile-first experience newer platforms offer. Groomers working from a van or on the floor need software that works on a phone.',
                'Higher starting price — at $49+/month for a single groomer, 123Pet costs significantly more than mobile-first alternatives that start at $29/month. For solo groomers on tight margins, that difference adds up to $240/year.',
                'Feature add-ons — automated reminders, online booking customization, and other core features cost extra on some 123Pet tiers. Competitors like GroomGrid include these in base pricing.',
                'Dated interface — the UI works, but it feels like software from 2015. Groomers used to modern app design find the learning curve steeper than it needs to be.',
                'No AI features — 123Pet has not added AI scheduling, breed detection, or intelligent automation. Newer platforms are closing the gap with tools that save real time every day.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-red-400 font-bold mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed">
              If 123Pet covers everything you need and the desktop workflow suits you, there is
              no reason to switch. But if you are a solo groomer or mobile operator who lives on
              your phone, an alternative built for how you actually work will save you money
              and daily frustration.
            </p>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            123Pet Alternatives: Feature Comparison
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            The top platforms groomers compare when looking beyond 123Pet (DaySmart Pet):
          </p>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-700">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold">Feature</th>
                  <th className="text-center px-5 py-4 font-semibold text-green-600">GroomGrid</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">123Pet</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">MoeGo</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">Pawfinity</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                    <td className="px-5 py-3 text-stone-700 font-medium">{row.feature}</td>
                    <td className="px-5 py-3 text-center text-green-600 font-semibold">{row.groomgrid}</td>
                    <td className="px-5 py-3 text-center text-stone-500">{row.onetwothreepet}</td>
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

        {/* ── GroomGrid vs 123Pet ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              GroomGrid vs. 123Pet: Who Should Choose What?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border-2 border-green-400 bg-white">
                <h3 className="font-bold text-green-600 text-lg mb-3">Choose GroomGrid if:</h3>
                <ul className="space-y-2 text-stone-600 text-sm">
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You are a solo or mobile groomer</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You need software that works on your phone, not just a desktop</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You want AI scheduling and breed detection built in</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Price matters — starting at $29/month vs $49+</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span> You want a 14-day free trial, no credit card needed</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-white">
                <h3 className="font-bold text-stone-500 text-lg mb-3">Stick with 123Pet if:</h3>
                <ul className="space-y-2 text-stone-600 text-sm">
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You run a multi-location salon enterprise</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You need Windows desktop integration</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> Your team is already trained on 123Pet and migration costs are too high</li>
                  <li className="flex items-start gap-2"><span className="text-stone-400">→</span> You need legacy POS hardware integration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pain Points / Advantages Section ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            What GroomGrid Solves That 123Pet Does Not
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: '🤖',
                title: 'AI Scheduling',
                body: 'GroomGrid\'s AI assistant helps you build an efficient daily schedule — filling gaps, balancing appointment times, and flagging conflicts before they become problems. 123Pet has no comparable AI scheduling feature.',
              },
              {
                icon: '📱',
                title: 'True Mobile-First',
                body: 'GroomGrid was designed for groomers working from a van or on the go. Every screen works on a phone without pinching and zooming. Check in, collect payment, send a reminder — all from your phone. 123Pet requires a Windows desktop for full functionality.',
              },
              {
                icon: '💸',
                title: '$20/mo Savings Minimum',
                body: 'GroomGrid Solo tier is $29/mo versus 123Pet\'s $49+ starting price. That is $240/year back in your pocket — enough to cover grooming supplies for weeks.',
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
                body: 'Try GroomGrid free for 14 days — no credit card required. 123Pet does not offer a no-credit-card trial. Run GroomGrid in parallel with your current setup to evaluate it without any risk.',
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
              How to Switch from 123Pet to GroomGrid
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Switching from 123Pet (DaySmart Pet) is simpler than most groomers expect:
            </p>
            <div className="space-y-4 mb-6">
              {[
                'Export your client list and pet records from 123Pet — go to Settings → Data Export → CSV',
                'Sign up for a GroomGrid free trial — no credit card required at getgroomgrid.com',
                'Import your CSV during onboarding — GroomGrid maps the fields automatically',
                'Set up your services, pricing, and business hours (takes 10–15 minutes)',
                'Connect Stripe for payments — setup takes about 5 minutes',
                'Run both systems side-by-side for 1–2 weeks if you want a safety net',
                'Cancel 123Pet once you confirm everything transferred correctly',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold text-lg">{i + 1}.</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-stone-600 leading-relaxed">
              Your clients will not notice a thing — they will just keep getting their appointment
              reminders, which now arrive from GroomGrid. Total migration time: 1–2 hours for data
              import, plus 1–2 weeks of parallel running if you want it.
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

        {/* ── CTA ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Ready to Try a 123Pet Alternative?
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            GroomGrid gives you AI scheduling, mobile-first design, automated reminders, and
            integrated payments — all starting at $29/month. Start your 14-day free trial today,
            no credit card required.
          </p>
          <Link
            href="/signup?coupon=BETA50"
            className="inline-block px-8 py-4 rounded-xl bg-green-500 text-white text-lg font-bold hover:bg-green-600 transition-colors"
            data-cta="bottom-start-trial"
          >
            Start Your 14-Day Free Trial
          </Link>
        </section>

        {/* ── Related Links ── */}
        <RelatedLinks
          heading="The 123Pet alternative built for how groomers actually work"
          links={[
            { href: '/blog/pet-grooming-software', category: 'Software Guide', title: 'Pet Grooming Software: The 2026 Buyer\'s Guide' },
            { href: '/plans', category: 'Pricing', title: 'GroomGrid Plans — Starting at $29/month' },
            { href: '/blog/free-dog-grooming-software', category: 'Free Options', title: 'Free Dog Grooming Software: What Actually Works in 2026' },
          ]}
          columns={3}
        />

        {/* ── Footer ── */}
        <SiteFooter />
      </div>
    </>
  );
}
