import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Mobile Grooming Software for Van Groomers: 2026 Guide | GroomGrid',
  description:
    'The best mobile grooming software built for van and mobile groomers. Scheduling, SMS reminders, payments, and pet profiles — all optimized for working on the road.',
  alternates: {
    canonical: 'https://getgroomgrid.com/mobile-grooming-software',
  },
  openGraph: {
    title: 'Mobile Grooming Software for Van Groomers: 2026 Guide',
    description:
      'Mobile grooming software built for van operators. Scheduling, no-show prevention, payments from the road, and pet profiles — all on your phone.',
    url: 'https://getgroomgrid.com/mobile-grooming-software',
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
      name: 'Mobile Grooming Software',
      item: 'https://getgroomgrid.com/mobile-grooming-software',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Mobile Grooming Software for Van Groomers: 2026 Guide',
  description:
    'The complete guide to mobile grooming software — what to look for, how it helps van groomers prevent no-shows, collect payment, and manage clients on the road.',
  url: 'https://getgroomgrid.com/mobile-grooming-software',
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
    '@id': 'https://getgroomgrid.com/mobile-grooming-software',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best software for mobile dog groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid is the best software for mobile dog groomers in 2026. It was built mobile-first, so every feature works perfectly from a phone or tablet — no laptop required. It includes AI scheduling to build efficient daily routes, automated SMS reminders to prevent no-shows, and integrated payments so clients can pay before you drive away. Starts at $29/month with a 14-day free trial.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does mobile grooming software help prevent no-shows?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mobile grooming software prevents no-shows through automated reminder sequences — typically an SMS and email reminder 48 hours before the appointment, another 24 hours before, and a final reminder 2 hours before. For mobile groomers, a single no-show wastes 30–60 minutes of drive time plus fuel cost. Studies show automated reminders reduce no-show rates by 30–40%.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I manage my grooming schedule from my phone while driving?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — with mobile-first grooming software like GroomGrid, your full schedule is accessible from any smartphone. You can check your day, view pet profiles and notes before arrival, mark appointments complete, and send receipt messages — all without a laptop. Voice-enabled assistants on iOS and Android let you check your schedule hands-free.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do mobile groomers collect payment on the road?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mobile grooming software with integrated payments (like GroomGrid) lets you send a payment link via SMS before you finish the appointment, accept credit and debit cards via a mobile card reader or tap-to-pay, and automatically generate receipts. Many mobile groomers require prepayment to eliminate chase-for-payment situations after the groom.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I look for in mobile grooming software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The five must-haves for mobile grooming software: (1) Designed for phones — test the mobile experience, not just the desktop. (2) Automated SMS reminders — no-shows are more costly for mobile groomers who drive between clients. (3) Integrated payments — collect before you drive away. (4) Detailed pet profiles — breed, size, temperament, allergies, accessible from your phone. (5) Simple scheduling — a daily calendar view that is fast to scan before each stop.',
      },
    },
  ],
};

export default function MobileGroomingSoftwarePage() {
  const painPoints = [
    {
      icon: '🚗',
      problem: 'No-shows waste drive time and gas',
      solution: 'Automated 3-touch SMS reminders (48h, 24h, 2h before) cut no-show rates by 30–40%. When a van groomer skips one wasted trip, the software pays for itself.',
    },
    {
      icon: '📱',
      problem: 'Desktop software does not work from a van',
      solution: 'GroomGrid is built mobile-first — every screen is optimized for a 6-inch display. Check your schedule, pull up pet profiles, and collect payment without touching a laptop.',
    },
    {
      icon: '💸',
      problem: 'Chasing payments after the groom',
      solution: 'Send a payment link via SMS before you finish — clients pay from their phone while you finish the final brush-out. No awkward conversations, no unpaid invoices.',
    },
    {
      icon: '🐾',
      problem: 'Breed notes and pet history scattered across texts and paper',
      solution: 'Every dog in GroomGrid has a profile with breed, size, temperament, allergies, vaccination records, and grooming history. Accessible from your phone 30 seconds before you knock.',
    },
    {
      icon: '📅',
      problem: 'Double bookings and missed appointments',
      solution: 'AI scheduling assistant flags conflicts before they happen and helps you build a tight daily route — so you are not criss-crossing town between appointments.',
    },
    {
      icon: '✍️',
      problem: 'Manual intake forms and paper contracts',
      solution: 'Digital client intake forms, service agreements, and vaccination waivers are collected online — before the first appointment. No clipboards, no lost paperwork.',
    },
  ];

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
                Mobile Grooming Software
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Mobile Groomers Guide · Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Mobile Grooming Software<br className="hidden sm:block" /> Built for the Van
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Most grooming software was designed for a front desk, not a van. GroomGrid is different
            — it was built from scratch for mobile groomers who work on the road, manage 4–8 dogs a
            day, and need every tool to work perfectly from a phone.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup?coupon=BETA50"
              className="px-7 py-3.5 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors shadow-sm text-center"
            >
              Start Free 14-Day Trial →
            </Link>
            <Link
              href="/plans"
              className="px-7 py-3.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-lg hover:border-stone-400 transition-colors text-center"
            >
              See Pricing
            </Link>
          </div>
          <p className="text-stone-400 text-sm mt-3">No credit card required · Solo tier from $29/mo</p>
        </header>

        {/* ── Pain Points + Solutions ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-3">
              The 6 Problems Mobile Groomers Face — and How Software Solves Them
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Running a mobile grooming business means juggling logistics that salon groomers never
              deal with. Here is how the right software changes each one:
            </p>
            <div className="grid grid-cols-1 gap-6">
              {painPoints.map((item) => (
                <div key={item.problem} className="bg-white border border-stone-200 rounded-xl p-6 flex gap-5">
                  <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <p className="font-bold text-stone-800 mb-1">{item.problem}</p>
                    <p className="text-stone-600 text-sm leading-relaxed">{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature Breakdown ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            GroomGrid Features Built for Mobile Groomers
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            Every feature is designed around how mobile groomers actually work — not how salon
            software expects you to work.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'AI Daily Scheduling',
                description: 'Tell GroomGrid your service area and working hours. The AI scheduling assistant builds a tight, efficient daily route — minimizing drive time between stops and flagging conflicts automatically.',
                badge: 'AI-Powered',
              },
              {
                title: 'Automated 3-Touch Reminders',
                description: 'Every appointment gets an SMS reminder 48 hours, 24 hours, and 2 hours before. Clients can confirm, reschedule, or cancel — giving you time to fill the slot. Included in every plan.',
                badge: 'Included',
              },
              {
                title: 'Mobile-First Interface',
                description: 'Designed for your phone screen — not a 27-inch monitor. Large tap targets, swipe-friendly navigation, and offline access so you can pull up a pet profile even without cellular service.',
                badge: 'Mobile-First',
              },
              {
                title: 'AI Breed Detection',
                description: 'Photograph the dog on arrival. GroomGrid identifies the breed, pulls breed-specific grooming notes, and pre-fills the service record. Saves 2–3 minutes per appointment.',
                badge: 'AI-Powered',
              },
              {
                title: 'Payment Anywhere',
                description: 'Send a payment link via SMS mid-appointment. Accept cards via tap-to-pay, card reader, or digital invoice. Automatic receipts emailed to clients. No awkward payment follow-ups.',
                badge: 'Integrated',
              },
              {
                title: 'Digital Intake + Waivers',
                description: 'New clients complete their intake form and service waiver online before the first appointment. Pet profiles arrive pre-filled — breed, size, vaccination status, behavioral notes.',
                badge: 'Automated',
              },
              {
                title: 'Pet History Access',
                description: 'Pull up any dog\'s full grooming history, preferred cuts, allergies, and temperament notes from your phone in 10 seconds. No binder, no texting yourself notes.',
                badge: 'Instant',
              },
              {
                title: 'Abandoned Booking Recovery',
                description: 'When a client starts a booking but does not finish, GroomGrid sends a recovery reminder automatically — recovering appointments that would have otherwise been lost.',
                badge: 'Auto',
              },
            ].map((feature) => (
              <div key={feature.title} className="p-5 border border-stone-200 rounded-xl bg-white hover:border-green-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="font-bold text-stone-800 text-sm">{feature.title}</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0">
                    {feature.badge}
                  </span>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ROI Section ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              The Real ROI of Mobile Grooming Software
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              At $29/month, GroomGrid pays for itself the first time it prevents a no-show. Here is
              the math for a typical mobile groomer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                {
                  number: '2–3',
                  unit: 'no-shows prevented per month',
                  detail: 'Average grooming revenue: $65–$90/dog. That is $130–$270 recovered monthly from reminder automation alone.',
                },
                {
                  number: '30–60',
                  unit: 'minutes saved per day',
                  detail: 'AI scheduling and breed detection shave time from every appointment — compounding to hours per week.',
                },
                {
                  number: '$240',
                  unit: 'saved vs. MoeGo annually',
                  detail: 'GroomGrid Solo at $29/mo vs. MoeGo\'s $49+/mo starting price. Same core features, lower price.',
                },
              ].map((stat) => (
                <div key={stat.unit} className="bg-white border border-stone-200 rounded-xl p-6 text-center">
                  <p className="text-4xl font-extrabold text-green-600 mb-1">{stat.number}</p>
                  <p className="text-stone-700 font-semibold text-sm mb-2">{stat.unit}</p>
                  <p className="text-stone-500 text-xs leading-relaxed">{stat.detail}</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-green-300 rounded-xl p-6">
              <p className="text-stone-700 text-sm leading-relaxed">
                <strong className="text-green-600">Conservative estimate:</strong> A mobile groomer
                preventing 2 no-shows per month at $75 average = <strong>$150 recovered</strong>.
                GroomGrid costs $29/month. Net gain: <strong>$121/month, $1,452/year</strong> — and
                that is just from reminder automation.
              </p>
            </div>
          </div>
        </section>

        {/* ── Getting Started ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Set Up Mobile Grooming Software in Under 30 Minutes
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            GroomGrid is designed to get you running fast — no onboarding calls, no IT setup:
          </p>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Sign up for free', body: 'Create your account at getgroomgrid.com. No credit card required — your 14-day trial starts immediately.' },
              { step: '2', title: 'Set up your services and pricing', body: 'Add your service menu (bath, full groom, nail trim, etc.), pricing, and appointment durations. Takes 10 minutes.' },
              { step: '3', title: 'Import your existing clients', body: 'Have a client list in Google Contacts, a spreadsheet, or another grooming app? Import via CSV in minutes.' },
              { step: '4', title: 'Share your booking link', body: 'You get a personalized booking page (yourname.getgroomgrid.com) immediately. Share it via text, Instagram bio, or Facebook.' },
              { step: '5', title: 'Connect Stripe for payments', body: 'Link your bank account via Stripe — takes about 5 minutes. You can start accepting digital payments for your next appointment.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-5 border border-stone-200 rounded-xl bg-white">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <p className="font-bold text-stone-800 mb-1">{item.title}</p>
                  <p className="text-stone-600 text-sm leading-relaxed">{item.body}</p>
                </div>
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
          heading="Mobile grooming software that works as hard as you do"
          links={[
          { href: '/signup?coupon=BETA50', category: "Buyer\'s Guide", title: 'Best Dog Grooming Software for 2026: Full Comparison' },
          { href: '/blog/how-to-start-a-mobile-dog-grooming-business', category: 'Business Guide', title: 'How to Start a Mobile Dog Grooming Business' },
          { href: '/features/mobile-groomer', category: 'Feature Spotlight', title: 'See GroomGrid Mobile Groomer Tools in Action' },
          { href: '/blog/reduce-no-shows-dog-grooming', category: 'Operations', title: 'How to Reduce No-Shows in Your Dog Grooming Business' }
          ]}
          columns={3}
        />

        {/* ── Footer ── */}
        <SiteFooter />
      </div>
    </>
  );
}
