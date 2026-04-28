import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'GroomGrid vs DaySmart Pet: Which Grooming Software is Right for You? | GroomGrid',
  description:
    'Comparing GroomGrid vs DaySmart Pet for your grooming business? See how pricing, AI features, mobile-first design, and ease of onboarding stack up — and why independent groomers are switching.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/groomgrid-vs-daysmart',
  },
  openGraph: {
    title: 'GroomGrid vs DaySmart Pet: Which Grooming Software is Right for You?',
    description:
      'Comparing GroomGrid vs DaySmart Pet for your grooming business? See how pricing, AI features, mobile-first design, and ease of onboarding stack up.',
    url: 'https://getgroomgrid.com/blog/groomgrid-vs-daysmart',
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://getgroomgrid.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://getgroomgrid.com/blog' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'GroomGrid vs DaySmart',
      item: 'https://getgroomgrid.com/blog/groomgrid-vs-daysmart',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'GroomGrid vs DaySmart Pet: Which Grooming Software is Right for You?',
  description:
    'Comparing GroomGrid vs DaySmart Pet for your grooming business? See how pricing, AI features, mobile-first design, and ease of onboarding stack up — and why independent groomers are switching.',
  url: 'https://getgroomgrid.com/blog/groomgrid-vs-daysmart',
  datePublished: '2026-04-24',
  dateModified: '2026-04-24',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/groomgrid-vs-daysmart',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is GroomGrid cheaper than DaySmart Pet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid starts at $29/month for the Solo tier with all core features included. DaySmart Pet pricing typically starts higher and is tiered — advanced features like detailed reporting and multi-location management require higher plans. For independent groomers and small salons, GroomGrid is generally more affordable with simpler, predictable pricing.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does DaySmart Pet do well?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DaySmart Pet (formerly 123Pet) is a mature platform with deep reporting, multi-location support, and a long track record in the grooming industry. It works well for established salons that need granular control over operations and have staff dedicated to managing the software.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is DaySmart Pet mobile-friendly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DaySmart Pet was originally built as desktop software and has added mobile access over time. However, it is not mobile-first — the interface can feel cramped on phones and is not optimized for groomers working in the field. GroomGrid was designed mobile-first from the ground up.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does GroomGrid have AI features that DaySmart lacks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. GroomGrid includes AI-powered scheduling suggestions, AI breed detection from pet photos, and automated 3-touch reminder sequences. DaySmart Pet does not currently offer AI-driven features.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I switch from DaySmart Pet to GroomGrid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can export your client list and pet records from DaySmart Pet as a CSV and import them into GroomGrid. The process typically takes under an hour. GroomGrid support can assist with data migration.',
      },
    },
  ],
};

export default function GroomGridVsDaySmartPage() {
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
              <li>
                <Link href="/blog" className="hover:text-green-600 transition-colors">Blog</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">GroomGrid vs DaySmart</li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Software Comparison
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            GroomGrid vs DaySmart Pet:<br className="hidden sm:block" /> An Honest Comparison for Groomers
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            DaySmart Pet (formerly 123Pet) has been around for years and is a familiar name in the
            grooming industry. But familiar doesn&apos;t mean it&apos;s the right fit for every
            groomer. Here&apos;s an honest, feature-by-feature look at how it compares to GroomGrid.
          </p>
        </header>

        {/* ── Why This Comparison Matters ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Why Your Software Choice Matters More Than You Think</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Your grooming software is the backbone of your daily operations. It handles
              scheduling, client communication, payments, and pet records. If it&apos;s slow on
              your phone, confusing to set up, or charging you for features you don&apos;t use,
              that friction adds up — lost time, missed appointments, frustrated clients.
            </p>
            <p className="text-stone-600 leading-relaxed">
              DaySmart Pet and GroomGrid both serve the grooming industry, but they were built for
              very different eras and very different types of businesses. DaySmart was designed in
              the desktop era for salons with dedicated front-desk staff. GroomGrid was built for
              the mobile-first reality of today&apos;s independent groomers. Let&apos;s see how
              they compare where it counts.
            </p>
          </div>
        </section>

        {/* ── Feature Comparison ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Feature-by-Feature Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-stone-100">
                  <th className="text-left p-4 font-semibold text-stone-700 border border-stone-200">Feature</th>
                  <th className="text-left p-4 font-semibold text-green-700 border border-stone-200">GroomGrid</th>
                  <th className="text-left p-4 font-semibold text-stone-700 border border-stone-200">DaySmart Pet</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Online booking page', 'Included', 'Included'],
                  ['Automated reminders (SMS + email)', 'Included', 'Included'],
                  ['Client & pet profiles', 'Included', 'Included'],
                  ['AI scheduling suggestions', 'Included', 'Not available'],
                  ['AI breed detection', 'Included', 'Not available'],
                  ['Mobile-first design', 'Yes — built for phones', 'Desktop-first, mobile access added'],
                  ['Setup time', 'Under 30 minutes', 'Longer setup, more configuration'],
                  ['Deposit collection', 'Built-in', 'Add-on or manual'],
                  ['No-show protection', 'Built-in 3-touch reminders', 'Manual setup required'],
                  ['Integrated payments', 'Included', 'Third-party integration'],
                  ['Pricing model', 'Simple flat rate', 'Tiered plans, add-on fees'],
                  ['Free trial', 'Yes — 50% off first month', 'Limited free tier'],
                ].map(([feature, gg, ds]) => (
                  <tr key={feature} className="even:bg-stone-50">
                    <td className="p-4 border border-stone-200 font-medium text-stone-700">{feature}</td>
                    <td className="p-4 border border-stone-200 text-green-700 font-medium">{gg}</td>
                    <td className="p-4 border border-stone-200 text-stone-600">{ds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Pricing Deep Dive ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Pricing: What You Actually Pay</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              DaySmart Pet uses a tiered pricing model where you pay more as you unlock additional
              features. Multi-location support, advanced reporting, and payment integrations often
              require higher-tier plans. For a solo groomer or small salon, the monthly cost can
              climb quickly once you add the features you actually need.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              GroomGrid keeps it simple: one flat rate per tier, everything included. The Solo plan
              at $29/month covers scheduling, reminders, client and pet profiles, deposits, and
              integrated payments. No surprise add-ons. No paying extra for features that should
              be standard.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="font-semibold text-stone-800 mb-2">Think about it this way:</p>
              <p className="text-stone-600">
                If your software prevents just one no-show per week — through automated reminders
                and deposit policies — it pays for itself. The question isn&apos;t really
                &ldquo;how much does it cost?&rdquo; It&apos;s &ldquo;how much is it costing me to
                not have the right system in place?&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* ── Mobile-First Design ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Mobile-First vs Desktop-First: A Real Difference</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            This is where the comparison gets stark. DaySmart Pet was originally built as desktop
            software — think Windows applications and office computers. Over the years, they&apos;ve
            added web access and mobile-friendly views, but the core experience still feels like a
            desktop app squeezed onto a phone screen.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            For a salon with a front desk and a dedicated computer, that works fine. But if
            you&apos;re a mobile groomer checking your schedule between appointments, or a solo
            operator managing everything from your phone in the van, a desktop-first interface
            slows you down every single day.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            GroomGrid was designed for the phone in your pocket first. Every screen — scheduling,
            client lookup, appointment details, payment collection — works cleanly on mobile. No
            pinching, no squinting, no &ldquo;I&apos;ll do that when I get back to the office.&rdquo;
          </p>
          <ul className="space-y-3">
            {[
              'Book, reschedule, and cancel appointments from your phone',
              'Pull up client and pet details between groom sessions',
              'Send deposit requests and collect payments in the field',
              'Get real-time booking notifications wherever you are',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── AI Features ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">AI Features: Where GroomGrid Pulls Ahead</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              DaySmart Pet is a solid, traditional grooming management tool. It does what grooming
              software has done for years: scheduling, records, and basic communication. There&apos;s
              nothing wrong with that — but there&apos;s nothing that gives you an edge, either.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              GroomGrid brings AI-powered features that actively save you time and reduce mistakes:
            </p>
            <ul className="space-y-3">
              {[
                'AI scheduling that suggests optimal appointment times based on your history and preferences',
                'AI breed detection from pet photos — no more guessing breed-specific grooming needs',
                'Automated 3-touch reminder sequences that dramatically reduce no-shows without manual follow-up',
                'Smart client insights that flag overdue pets and suggest rebooking timing',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed mt-4">
              These aren&apos;t gimmicks — they&apos;re features built to solve the real problems
              groomers face every day: scheduling gaps, forgotten rebooks, and clients who fall
              through the cracks.
            </p>
          </div>
        </section>

        {/* ── Ease of Onboarding ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Setup and Onboarding: How Fast Can You Start?</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            DaySmart Pet is a mature platform with a lot of configuration options. That depth is
            powerful — if you have the time and technical patience to set it all up. For many
            groomers, the onboarding process involves multiple calls with support, reading through
            documentation, and tweaking settings over days or even weeks before everything runs
            smoothly.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            GroomGrid was designed so you can be fully operational in under 30 minutes. The
            onboarding flow guides you step by step: add your services, set your availability,
            configure your reminders, and share your booking link. No support calls needed.
          </p>
          <ul className="space-y-3">
            {[
              'Guided setup walks you through every step',
              'Import clients from a CSV in under a minute',
              'Reminders start working the moment you enable them',
              'Your booking page is live as soon as you set your hours',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Who Each is For ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Who Each Platform is Built For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-green-200">
                <p className="text-green-600 font-bold text-lg mb-3">GroomGrid is best for:</p>
                <ul className="space-y-2 text-stone-600 text-sm">
                  {[
                    'Solo groomers and small teams (1-5 groomers)',
                    'Mobile groomers who manage everything from their phone',
                    'Groomers switching from paper, spreadsheets, or generic tools',
                    'Anyone who values simple pricing with no surprise add-ons',
                    'Businesses that want AI to handle scheduling and reminders automatically',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-white rounded-xl border border-stone-200">
                <p className="text-stone-700 font-bold text-lg mb-3">DaySmart Pet may suit you if:</p>
                <ul className="space-y-2 text-stone-600 text-sm">
                  {[
                    'You run a large salon with dedicated front-desk staff',
                    'You need multi-location management across several shops',
                    'You want highly detailed, customizable reporting',
                    'You have time for a longer setup and configuration process',
                    'You prefer desktop-first software and rarely work from your phone',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-stone-400 font-bold">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom Line ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">The Bottom Line</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            DaySmart Pet is a capable, established platform — no question about that. For large
            salons with dedicated administrative staff and complex multi-location needs, it&apos;s
            a reasonable choice. It has the depth and history to support enterprise-scale grooming
            operations.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            But the reality is that most grooming businesses aren&apos;t enterprises. They&apos;re
            one to five hardworking groomers who need software that works on their phone, sets up
            in minutes, and handles the essentials — reminders, deposits, scheduling, payments —
            without a bunch of configuration.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            That&apos;s what GroomGrid was built for. Mobile-first. AI-powered. Simple pricing.
            Fast onboarding. It&apos;s grooming software that fits the way most groomers actually
            work today.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Looking at the broader landscape? Read our guide to{' '}
            <Link
              href="/blog/dog-grooming-software"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              dog grooming software in 2026
            </Link>{' '}
            or see how GroomGrid compares to{' '}
            <Link
              href="/blog/groomgrid-vs-moego"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              MoeGo
            </Link>{' '}
            and{' '}
            <Link
              href="/blog/groomgrid-vs-pawfinity"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              Pawfinity
            </Link>
            .
          </p>
        </section>

        {/* ── Related Links ── */}
        <RelatedLinks
          heading="Try GroomGrid free — 50% off your first month"
          links={[
          { href: '/signup?coupon=BETA50', category: 'Comparison', title: 'GroomGrid vs MoeGo: Which is Right for You?' },
          { href: '/blog/dog-grooming-software', category: 'Software', title: 'Dog Grooming Software: The 2026 Buyer's Guide' }
          ]}
          columns={3}
        />

        {/* ── Footer ── */}
        <SiteFooter links={[{ href: '/grooming-business-operations/', label: 'Operations Hub' }, { href: '/mobile-grooming-business/', label: 'Mobile Grooming' }, { href: '/plans', label: 'Pricing' }, { href: '/signup?coupon=BETA50', label: 'Sign Up' }]} />
      </div>
    </>
  );
}