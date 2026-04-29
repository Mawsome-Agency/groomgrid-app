import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Dog Grooming Scheduling Software — Easy Booking & Reminders | GroomGrid',
  description:
    'Grooming scheduling software that auto-sends reminders, blocks double bookings, and works from your phone. Try free 14 days.',
  alternates: {
    canonical: 'https://getgroomgrid.com/dog-grooming-scheduling-software',
  },
  openGraph: {
    title: 'Dog Grooming Scheduling Software — Easy Booking & Reminders',
    description:
      'Grooming scheduling software that auto-sends reminders, blocks double bookings, and works from your phone. Try free 14 days.',
    url: 'https://getgroomgrid.com/dog-grooming-scheduling-software',
    type: 'article',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'GroomGrid Dog Grooming Scheduling Software',
  description:
    'AI-powered scheduling software for dog grooming businesses. Auto-reminders, conflict blocking, 2-tap booking, and mobile-first design.',
  provider: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
  },
  serviceType: 'Dog Grooming Scheduling Software',
  areaServed: 'United States',
  url: 'https://getgroomgrid.com/dog-grooming-scheduling-software',
  offers: [
    {
      '@type': 'Offer',
      name: 'Solo Plan',
      price: '29',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
      description: 'Scheduling software for solo groomers — 2-tap booking, auto reminders, conflict blocking, and mobile access.',
    },
    {
      '@type': 'Offer',
      name: 'Salon Plan',
      price: '79',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
      description: 'Scheduling software for salons — multi-staff calendars, team scheduling, and advanced booking management.',
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://getgroomgrid.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Dog Grooming Scheduling Software',
      item: 'https://getgroomgrid.com/dog-grooming-scheduling-software',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best scheduling software for dog groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid is the best scheduling software for dog groomers in 2026. It offers 2-tap booking, automated SMS/email reminders, smart conflict blocking to prevent double bookings, and a mobile-first design that works perfectly from any phone. Solo plans start at $29/month with a 14-day free trial.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does grooming scheduling software prevent double bookings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Grooming scheduling software prevents double bookings through real-time conflict detection. When a client books online or you add an appointment manually, the system instantly checks for overlapping time slots and blocks the booking if there is a conflict. GroomGrid also shows a visual calendar view that makes scheduling conflicts immediately obvious.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can clients book appointments online with grooming scheduling software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — GroomGrid includes a branded online booking page that clients can access 24/7. They select their preferred service, choose from available time slots, enter their pet information, and receive instant confirmation. The booking syncs directly to your calendar, and automated reminders fire without any manual work from you.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does dog grooming scheduling software cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dog grooming scheduling software typically costs $29–$79 per month. GroomGrid starts at $29/month for solo groomers (includes unlimited appointments, auto reminders, and online booking) and $79/month for salons with team scheduling. Use code BETA50 for 50% off your first month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do automated reminders really reduce no-shows?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — automated reminders reduce no-shows by 30–40% on average. GroomGrid sends a 3-touch reminder sequence: SMS and email 48 hours before, another 24 hours before, and a final SMS 2 hours before the appointment. Clients can confirm, reschedule, or cancel with one tap, giving you time to fill any open slots.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I manage my schedule from my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. GroomGrid is built mobile-first, meaning every feature works perfectly from a smartphone. You can view your daily schedule, add new appointments, check pet profiles before arrival, and send reminders — all without touching a laptop. This is essential for mobile groomers working from vans.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does scheduling software handle different appointment lengths?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid lets you set default durations for each service type (e.g., 45 min for a bath, 90 min for a full groom, 120 min for a large breed). When booking, the system automatically reserves the correct amount of time and prevents appointments from being scheduled too close together. You can also customize durations for individual appointments.',
      },
    },
  ],
};

export default function DogGroomingSchedulingSoftwarePage() {
  const painPoints = [
    {
      icon: '📅',
      problem: 'Double bookings wreck your day',
      solution:
        'GroomGrid blocks conflicts before they happen. When you try to book an overlapping slot, the system warns you instantly. Visual calendar view makes overlaps obvious at a glance.',
    },
    {
      icon: '🚫',
      problem: 'No-shows cost you $75-120 each',
      solution:
        'Automated 3-touch reminder sequence (48h, 24h, 2h before) cuts no-shows by 30-40%. Clients can confirm, reschedule, or cancel with one tap. You get notified immediately so you can fill the slot.',
    },
    {
      icon: '📱',
      problem: 'Desktop scheduling apps do not work on the road',
      solution:
        'GroomGrid is built mobile-first. Check your schedule, book appointments, and send reminders from any phone. Works perfectly on a 6-inch screen — no pinching and zooming required.',
    },
    {
      icon: '✍️',
      problem: 'Clients texting "any openings this week?"',
      solution:
        'Give clients a branded online booking page (yourname.getgroomgrid.com). They book themselves 24/7, see only available slots, and get instant confirmation. You stop being the scheduling secretary.',
    },
    {
      icon: '⏰',
      problem: 'Manual scheduling eats your evenings',
      solution:
        'AI scheduling assistant builds your week for you. Set your working hours, services, and travel zones — GroomGrid suggests optimal appointment placement to minimize gaps and drive time.',
    },
  ];

  const features = [
    {
      title: '2-Tap Booking',
      description:
        'Book appointments in literally two taps. Select the client, pick a time slot, done. The system auto-fills pet details, service history, and preferred durations.',
      badge: 'Fastest',
    },
    {
      title: 'Conflict Blocking',
      description:
        'Try to double-book yourself and GroomGrid stops you. Real-time overlap detection prevents scheduling conflicts before they become angry client conversations.',
      badge: 'Smart',
    },
    {
      title: 'Auto 3-Touch Reminders',
      description:
        'SMS and email reminders fire automatically at 48 hours, 24 hours, and 2 hours before each appointment. Clients confirm with one tap. No-shows drop 30-40%.',
      badge: 'Included',
    },
    {
      title: 'Online Booking Page',
      description:
        'Your branded booking page (yourname.getgroomgrid.com) lets clients self-schedule 24/7. They see only available slots — no more "are you free Thursday?" texts.',
      badge: 'Revenue Tool',
    },
    {
      title: 'Mobile-First Design',
      description:
        'Every screen is optimized for your phone. Large tap targets, swipe-friendly navigation, and offline access so you can check schedules without cellular service.',
      badge: 'Van-Ready',
    },
    {
      title: 'AI Scheduling Assistant',
      description:
        'Tell GroomGrid your service area and working hours. The AI suggests efficient daily routes that minimize drive time and maximize appointment density.',
      badge: 'AI-Powered',
    },
    {
      title: 'Custom Durations by Service',
      description:
        'Set default appointment lengths for each service type — bath (45 min), full groom (90 min), large breed (120 min). No more manual time calculations.',
      badge: 'Flexible',
    },
    {
      title: 'Buffer Time Controls',
      description:
        'Automatically build buffer time between appointments — for cleanup, travel, or just catching your breath. Set custom buffers by service type.',
      badge: 'Sanity-Saving',
    },
  ];

  const comparisonRows = [
    { feature: 'Starting price', groomgrid: '$29/mo', moego: '$49+/mo', daysmart: '$49+/mo', pawfinity: '$40/mo' },
    { feature: '2-tap booking', groomgrid: '✓', moego: '✓', daysmart: '—', pawfinity: '✓' },
    { feature: 'Conflict blocking', groomgrid: '✓', moego: '✓', daysmart: '✓', pawfinity: '✓' },
    { feature: 'Automated SMS reminders', groomgrid: 'Included', moego: 'Included', daysmart: 'Add-on', pawfinity: 'Included' },
    { feature: 'Online booking page', groomgrid: '✓', moego: '✓', daysmart: '✓', pawfinity: '✓' },
    { feature: 'Mobile-first design', groomgrid: '✓', moego: '✓', daysmart: '—', pawfinity: 'Partial' },
    { feature: 'AI scheduling assistant', groomgrid: '✓', moego: '—', daysmart: '—', pawfinity: '—' },
    { feature: 'Custom appointment durations', groomgrid: '✓', moego: '✓', daysmart: '✓', pawfinity: '✓' },
    { feature: 'Free trial', groomgrid: '14 days', moego: '—', daysmart: '—', pawfinity: '7 days' },
  ];

  return (
    <>
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
          <PageBreadcrumbs slug="dog-grooming-scheduling-software" />
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Scheduling Software · Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Dog Grooming Scheduling Software<br className="hidden sm:block" /> — Book Appointments in 2 Taps
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Stop double bookings, eliminate no-shows, and let clients book themselves 24/7. 
            GroomGrid is the scheduling software built for dog groomers — mobile-first, 
            AI-powered, and ridiculously easy to use.
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
          <p className="text-stone-400 text-sm mt-3">
            No credit card required · Solo tier from $29/mo · Use code BETA50 for 50% off
          </p>
        </header>

        {/* ── Pain Points + Solutions ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-3">
              The Scheduling Chaos — and How Software Fixes It
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Every groomer knows the pain of manual scheduling. Here is how GroomGrid 
              replaces chaos with calm:
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
            Scheduling Features That Actually Save Time
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            Every feature is designed around how groomers actually work — 
            not how software engineers think you should work.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-5 border border-stone-200 rounded-xl bg-white hover:border-green-300 hover:shadow-sm transition-all"
              >
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

        {/* ── Feature Comparison Table ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">
              GroomGrid vs MoeGo vs DaySmart: Scheduling Features
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              How the top grooming software platforms compare on scheduling capabilities:
            </p>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-sm">
                <thead className="bg-stone-100 text-stone-700">
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
          </div>
        </section>

        {/* ── Mobile-First Focus ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Built for Groomers Who Book Between Dogs
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            Most scheduling software is designed for receptionists sitting at desks. 
            GroomGrid is designed for groomers standing in vans, holding phones with one hand:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '📱',
                title: 'Large tap targets',
                detail: 'Buttons sized for thumbs, not mouse cursors. No accidental taps, no frustration.',
              },
              {
                icon: '⚡',
                title: 'One-handed booking',
                detail: 'Book an appointment in 10 seconds with one hand while holding a leash with the other.',
              },
              {
                icon: '🌐',
                title: 'Works offline',
                detail: 'Check your schedule even without cellular service. Updates sync when you are back online.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-stone-200 rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-bold text-stone-800 mb-2">{item.title}</p>
                <p className="text-stone-500 text-sm leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ROI Section ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              The Real ROI of Grooming Scheduling Software
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              At $29/month, GroomGrid pays for itself the first time it prevents a no-show. 
              Here is the math for a typical groomer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                {
                  number: '2–3',
                  unit: 'no-shows prevented per month',
                  detail: 'Average grooming revenue: $65–$90/dog. That is $130–$270 recovered monthly from reminder automation alone.',
                },
                {
                  number: '5+',
                  unit: 'hours saved per week',
                  detail: 'No more back-and-forth scheduling texts, manual calendar management, or chasing confirmations.',
                },
                {
                  number: '$240',
                  unit: 'saved vs. MoeGo annually',
                  detail: "GroomGrid Solo at $29/mo vs. MoeGo's $49+/mo starting price. Same scheduling features, lower price.",
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
                <strong className="text-green-600">Conservative estimate:</strong> A groomer
                preventing 2 no-shows per month at $75 average = <strong>$150 recovered</strong>.
                GroomGrid costs $29/month. Net gain: <strong>$121/month, $1,452/year</strong> — and
                that is just from reminder automation. The time savings and reduced stress are bonus.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 py-16 bg-stone-50">
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

        {/* ── Final CTA ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Stop Juggling Calendars. Start Grooming Dogs.
          </h2>
          <p className="text-stone-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of groomers who have replaced scheduling stress with software that just works. 
            14-day free trial, no credit card required.
          </p>
          <Link
            href="/signup?coupon=BETA50"
            className="inline-block px-10 py-4 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors shadow-lg"
          >
            Start Free Trial — $29/mo after
          </Link>
          <p className="text-stone-400 text-sm mt-4">
            Use code <strong className="text-green-600">BETA50</strong> for 50% off your first month
          </p>
        </section>

        {/* ── Related Links ── */}
        <PageRelatedLinks 
          slug="dog-grooming-scheduling-software" 
          variant="landing" 
          heading="Scheduling software that works as hard as you do" 
        />

        {/* ── Footer ── */}
        <SiteFooter slug="dog-grooming-scheduling-software" />
      </div>
    </>
  );
}
