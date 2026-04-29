import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Dog Grooming Software: The 2026 Buyer\'s Guide for Professional Groomers | GroomGrid',
  description:
    'Compare the best dog grooming software for 2026. Covers scheduling, client records, automated reminders, payments, and what to look for before you buy.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/dog-grooming-software',
  },
  openGraph: {
    title: 'Dog Grooming Software: The 2026 Buyer\'s Guide for Professional Groomers',
    description:
      'Compare the best dog grooming software for 2026. Covers scheduling, client records, automated reminders, and payments.',
    url: 'https://getgroomgrid.com/blog/dog-grooming-software',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dog Grooming Software: The 2026 Buyer\'s Guide for Professional Groomers',
  description:
    'Compare the best dog grooming software for 2026. Covers scheduling, client records, automated reminders, payments, and what to look for before you buy.',
  url: 'https://getgroomgrid.com/blog/dog-grooming-software',
  datePublished: '2026-04-17',
  dateModified: '2026-04-17',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://getgroomgrid.com/favicon.ico',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/dog-grooming-software',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is dog grooming software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dog grooming software is a business management tool that handles appointment scheduling, client and pet profiles, automated reminders, and payment processing for grooming businesses. It replaces paper appointment books, spreadsheets, and manual reminder texts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there free dog grooming software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Some tools offer free tiers, but they typically limit the number of clients, appointments, or features available. For most working groomers, a paid plan — typically $29–$79/month — is necessary to get automated reminders, online payments, and full client management.',
      },
    },
    {
      '@type': 'Question',
      name: 'What features should I look for in dog grooming software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The five must-have features are: appointment scheduling with calendar management, client and pet profiles with breed and service history, automated SMS/email reminders, integrated payment processing with deposits, and reporting on revenue and client activity.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best dog grooming software for a solo groomer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Solo groomers need software that is simple to set up, mobile-friendly, and handles reminders automatically. GroomGrid is built specifically for independent groomers — it runs on any device, includes AI-powered scheduling, and starts at $29/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does dog grooming software cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dog grooming software typically costs $29–$149/month depending on the number of groomers and features. Solo plans start around $29/month. Salon plans with multi-groomer scheduling run $79–$149/month. Enterprise pricing varies.',
      },
    },
  ],
};

const coreFeatures = [
  {
    icon: '📅',
    title: 'Appointment Scheduling',
    description:
      'A visual calendar where you can book, move, and track appointments across multiple days and groomers. Should support recurring bookings, buffer time between appointments, and mobile access.',
  },
  {
    icon: '🐕',
    title: 'Client & Pet Profiles',
    description:
      'Persistent records for every client and their pets — breed, size, service history, grooming notes, vaccination status, and behavioral flags. This is institutional memory for your business.',
  },
  {
    icon: '🔔',
    title: 'Automated Reminders',
    description:
      'SMS and email reminders sent automatically before each appointment. The best systems send at 72 hours, 24 hours, and 2 hours — without you touching anything.',
  },
  {
    icon: '💳',
    title: 'Payments & Deposits',
    description:
      'Integrated payment processing so clients can pay or leave a deposit online at booking. Eliminates cash handling, speeds up checkout, and creates a natural paper trail.',
  },
  {
    icon: '📊',
    title: 'Business Reporting',
    description:
      'Revenue summaries, appointment history, no-show tracking, and client retention metrics. The numbers you need to actually run — and grow — your business.',
  },
];

const comparisonRows = [
  { feature: 'AI scheduling assistant', groomgrid: true, moego: false, daysmart: false },
  { feature: 'Automated 3-touch reminders', groomgrid: true, moego: true, daysmart: true },
  { feature: 'Online booking with deposits', groomgrid: true, moego: true, daysmart: true },
  { feature: 'AI breed detection', groomgrid: true, moego: false, daysmart: false },
  { feature: 'Mobile-first design', groomgrid: true, moego: true, daysmart: false },
  { feature: 'Solo plan under $35/mo', groomgrid: true, moego: false, daysmart: false },
  { feature: '14-day free trial', groomgrid: true, moego: false, daysmart: false },
];

export default function DogGroomingSoftwarePage() {
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
            href="/signup"
            className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
          >
            Start Free Trial
          </Link>
        </nav>

        {/* ── Breadcrumb ── */}
        <div className="px-6 py-3 max-w-5xl mx-auto">
          <PageBreadcrumbs slug="blog/dog-grooming-software" />
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Software Guide · Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Dog Grooming Software:<br className="hidden sm:block" /> The 2026 Buyer&apos;s Guide
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            The right grooming software pays for itself in recovered no-shows alone. The wrong one
            adds friction to every appointment. This guide covers what dog grooming software actually
            does, the features that matter, and how to choose the right tool for your business —
            whether you&apos;re a solo mobile groomer or running a multi-groomer salon.
          </p>
        </header>

        {/* ── What Is It ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              What Is Dog Grooming Software?
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Dog grooming software is a business management platform built specifically for pet
              grooming businesses. It replaces the paper appointment book, the manual reminder text,
              the handwritten client card, and the end-of-day cash count — all in one place.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              At the core, grooming software handles four things: scheduling appointments, storing
              client and pet records, sending automated reminders, and processing payments. More
              advanced platforms add AI features like breed detection, rebooking suggestions, and
              revenue forecasting.
            </p>
            <p className="text-stone-600 leading-relaxed">
              The primary value isn&apos;t the features themselves — it&apos;s what they eliminate.
              Groomers who switch to dedicated software spend 3–5 fewer hours per week on
              administrative work, and typically cut their no-show rate by 40–60% within the first
              month.
            </p>
          </div>
        </section>

        {/* ── Core Features ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            5 Features Every Dog Grooming Software Must Have
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            Not all grooming software is equal. Some tools are glorified contact managers. Others
            are enterprise platforms with more buttons than you&apos;ll ever use. Here&apos;s the
            core feature set that every professional groomer should require before signing up for
            anything.
          </p>
          <div className="space-y-8">
            {coreFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-5 p-6 rounded-xl border border-stone-200 hover:border-green-300 transition-all"
              >
                <span className="text-3xl flex-shrink-0">{feature.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Scheduling Deep-Dive ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Why Scheduling Is the Make-or-Break Feature
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Scheduling is where most grooming software either earns its keep or reveals its
              limits. You need a calendar that handles real-world complexity: back-to-back
              appointments with realistic buffer time, multi-groomer visibility, recurring clients
              who book every 6–8 weeks, and the ability to block time for lunch, travel, or
              equipment maintenance.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              For mobile groomers, routing matters. Your schedule isn&apos;t just about time —
              it&apos;s about geography. Good dog grooming software for mobile businesses clusters
              appointments by neighborhood to reduce drive time, which directly affects how many
              dogs you can groom per day.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              For salon owners, multi-groomer scheduling is non-negotiable. You need to see
              who&apos;s booked, who has a gap, and where you can fit a same-day appointment without
              creating a bottleneck at the bathing station.
            </p>
            <p className="text-stone-600 leading-relaxed">
              AI scheduling — which analyzes your historical booking patterns and suggests optimal
              appointment slots — is an emerging feature in newer platforms like GroomGrid that
              meaningfully reduces scheduling friction for high-volume groomers.
            </p>
          </div>
        </section>

        {/* ── Free vs Paid ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Free Dog Grooming Software: What You Actually Get
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Free dog grooming software exists, but it comes with real limitations. The most common:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Client cap — usually 20–50 active clients, which you\'ll outgrow quickly',
              'No automated reminders — the highest-value feature is paywalled on every platform',
              'No integrated payments — you\'re still collecting cash or Venmo',
              'No custom branding — your clients see generic booking pages',
              'Limited or no customer support',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-red-400 font-bold mt-0.5">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-stone-600 leading-relaxed mb-4">
            The math on paid software is straightforward: if a $29/month plan prevents even one
            no-show per month (worth $50–$100 in revenue), it&apos;s already paid for itself. The
            reminder system alone typically prevents 3–5 no-shows per month for an active groomer.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Free tools are useful for groomers just starting out with fewer than 20 clients. Once
            you&apos;re booking 4+ dogs per day, the cost of not having automated reminders and
            integrated payments exceeds the cost of any reasonable software subscription.
          </p>
        </section>

        {/* ── Pricing Section ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              How Much Does Dog Grooming Software Cost?
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Pricing varies significantly based on the number of groomers and feature set. Here
              is the realistic range for 2026:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  tier: 'Solo',
                  price: '$29–$39/mo',
                  description: 'One groomer, full features. Right for independent and mobile groomers.',
                  highlight: false,
                },
                {
                  tier: 'Salon',
                  price: '$79–$99/mo',
                  description: '2–5 groomers. Multi-calendar, staff scheduling, advanced reporting.',
                  highlight: true,
                },
                {
                  tier: 'Enterprise',
                  price: '$149+/mo',
                  description: 'Unlimited groomers, multi-location, custom integrations.',
                  highlight: false,
                },
              ].map((tier) => (
                <div
                  key={tier.tier}
                  className={`p-5 rounded-xl border ${
                    tier.highlight
                      ? 'border-green-400 bg-white shadow-md'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <p className="font-bold text-stone-800 text-lg mb-1">{tier.tier}</p>
                  <p className="text-green-600 font-bold text-xl mb-3">{tier.price}</p>
                  <p className="text-stone-500 text-sm leading-relaxed">{tier.description}</p>
                </div>
              ))}
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">
              Most groomers find the Solo tier more than sufficient. The jump to Salon pricing
              makes sense once you have a second groomer on staff. Avoid paying for features you
              won&apos;t use — the right tool is the simplest one that handles your actual volume.
            </p>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Dog Grooming Software Comparison: 2026
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            The three platforms groomers compare most often are GroomGrid, MoeGo, and DaySmart Pet.
            Here&apos;s how they stack up on the features that matter most.
          </p>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-700">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold">Feature</th>
                  <th className="text-center px-5 py-4 font-semibold text-green-600">GroomGrid</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">MoeGo</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">DaySmart</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}
                  >
                    <td className="px-5 py-3 text-stone-700">{row.feature}</td>
                    <td className="px-5 py-3 text-center">
                      {row.groomgrid ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : (
                        <span className="text-stone-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {row.moego ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : (
                        <span className="text-stone-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {row.daysmart ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : (
                        <span className="text-stone-300 font-bold">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-stone-500 text-xs mt-3">
            Based on published feature pages as of April 2026. Features subject to change.
          </p>
        </section>

        {/* ── How to Choose ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              How to Choose Dog Grooming Software: 4 Questions to Ask
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: '1. Does it work on my device?',
                  a: 'Many older grooming platforms are desktop-only or require a Windows install. If you\'re working from a tablet, phone, or Mac, verify the software is browser-based or has a native iOS/Android app before you sign up.',
                },
                {
                  q: '2. Can I test it without a credit card?',
                  a: 'A free trial without a credit card requirement signals confidence in the product. Software that requires payment before you\'ve seen the interface is a yellow flag.',
                },
                {
                  q: '3. What does onboarding look like?',
                  a: 'The best tools let you import existing client data via CSV and get to a working calendar in under an hour. Ask whether there\'s live support during setup, and whether client records can be migrated from your previous system.',
                },
                {
                  q: '4. What happens to your data if you cancel?',
                  a: 'Your client list is one of your most valuable business assets. Make sure you can export all client and pet records as a CSV at any time — not just when you\'re canceling.',
                },
              ].map((item) => (
                <div key={item.q} className="border-l-4 border-green-400 pl-5">
                  <p className="font-bold text-stone-800 mb-2">{item.q}</p>
                  <p className="text-stone-600 leading-relaxed text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} className="border border-stone-200 rounded-xl p-6">
                <h3 className="font-bold text-stone-800 mb-3">{item.name}</h3>
                <p className="text-stone-600 leading-relaxed text-sm">
                  {item.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Related Links ── */}
        <PageRelatedLinks slug="blog/dog-grooming-software" variant="blog" heading="The dog grooming software built for how groomers actually work" />

        {/* ── Footer ── */}
        <SiteFooter slug="blog/dog-grooming-software" />
      </div>
    </>
  );
}
