import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Mobile Grooming Features Built for Van Life | GroomGrid',
  description:
    'Scheduling, automated reminders, mobile payments, and pet profiles — all designed for mobile groomers working from a van. Start your free trial.',
  alternates: {
    canonical: 'https://getgroomgrid.com/features/mobile-groomer',
  },
  openGraph: {
    title: 'Mobile Grooming Features Built for Van Life | GroomGrid',
    description:
      'Scheduling, automated reminders, mobile payments, and pet profiles — all designed for mobile groomers working from a van. Start your free trial.',
    url: 'https://getgroomgrid.com/features/mobile-groomer',
    type: 'website',
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
      name: 'Features',
      item: 'https://getgroomgrid.com/features',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Mobile Groomer',
      item: 'https://getgroomgrid.com/features/mobile-groomer',
    },
  ],
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'GroomGrid',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, Mobile',
  description:
    'AI-powered mobile grooming business management — scheduling, automated reminders, payments, and pet profiles designed for van-based groomers.',
  url: 'https://getgroomgrid.com/features/mobile-groomer',
  offers: {
    '@type': 'Offer',
    price: '29',
    priceCurrency: 'USD',
    priceValidUntil: '2026-12-31',
    description: 'Solo plan for independent mobile groomers',
  },
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
};

const faqData = [
  {
    question: 'Is GroomGrid really built for mobile groomers?',
    answer:
      'Yes. Every feature is designed for van-based groomers — mobile-first interface, offline access, GPS-aware scheduling, and quick actions between stops. No desktop-only features pretending to work on mobile.',
  },
  {
    question: 'How much does GroomGrid cost?',
    answer:
      'The Solo plan starts at $29/month for independent mobile groomers. That includes scheduling, reminders, payments, and unlimited client/pet profiles. Use code BETA50 for 50% off your first month.',
  },
  {
    question: 'Can I import my existing clients from another system?',
    answer:
      'Yes. GroomGrid supports easy import of your client and pet data. If you\'re coming from paper, Google Calendar, or another grooming app, we\'ll help you get set up in minutes.',
  },
  {
    question: 'Does it work on Android and iPhone?',
    answer:
      'Both. GroomGrid runs in your phone\'s browser and is optimized for mobile screens. No app download required — just log in and go.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

const testimonials = [
  {
    quote:
      'I was losing $200 a month to no-shows. The automated reminders alone paid for GroomGrid in the first week.',
    name: 'Sarah M.',
    title: 'Mobile Groomer, Phoenix AZ',
  },
  {
    quote:
      'Finally an app that doesn\'t feel like it was built for salons and slapped "mobile" on it. This is actually designed for van life.',
    name: 'Jessica R.',
    title: 'Independent Groomer, Austin TX',
  },
  {
    quote:
      'I used to spend 2 hours a night on admin. Now it\'s 20 minutes and my calendar actually makes sense.',
    name: 'Maria K.',
    title: 'Mobile Groomer, Denver CO',
  },
];

const features = [
  {
    icon: '📅',
    title: 'Intelligent Daily Scheduling',
    description:
      'See your whole day at a glance — appointments, drive times, and breaks between stops. Drag-and-drop to rearrange when a client reschedules. No more double-booking yourself across town.',
  },
  {
    icon: '🗺️',
    title: 'Route-Aware Appointment Management',
    description:
      'Your day flows logically, not randomly. GroomGrid groups nearby appointments together so you\'re not driving 40 minutes between stops. More dogs groomed, less gas burned.',
  },
  {
    icon: '👆',
    title: 'One-Tap Rescheduling',
    description:
      'Client needs to move their appointment? One tap sends them available times. They pick, your calendar updates. No text thread required.',
  },
];

const reminderSteps = [
  { time: '48 hours before', detail: 'Gentle reminder with appointment details' },
  { time: '24 hours before', detail: 'Confirmation request — client taps to confirm or reschedule' },
  { time: '2 hours before', detail: 'Final reminder with your ETA' },
];

const trustSignals = [
  'No credit card required',
  'Set up in under 5 minutes',
  'Cancel anytime',
  'Import your existing client data easily',
];

export default function MobileGroomerFeaturePage() {
  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
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
                <Link href="/" className="hover:text-green-600 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/mobile-grooming-software" className="hover:text-green-600 transition-colors">
                  Features
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">
                Mobile Groomer
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero Section ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Built for Mobile Groomers
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Stop Losing Money to<br className="hidden sm:block" /> No-Shows and Scheduling Chaos
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            The all-in-one mobile grooming app that handles your calendar, client reminders, payments,
            and pet profiles — so you can focus on the dogs, not the admin.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup?coupon=BETA50"
              data-cta-type="primary"
              data-cta-location="hero"
              className="px-7 py-3.5 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors shadow-sm text-center"
            >
              Start Your Free Trial →
            </Link>
            <Link
              href="/plans"
              className="px-7 py-3.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-lg hover:border-stone-400 transition-colors text-center"
            >
              See Pricing
            </Link>
          </div>
          <p className="text-stone-400 text-sm mt-3">
            No credit card required · Solo tier from $29/mo · Code BETA50 for 50% off
          </p>
        </header>

        {/* ── Problem Section ── */}
        <section data-section="problem" className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-3">
              You didn&apos;t start grooming to become a full-time admin.
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              But here you are — juggling a paper calendar, 47 text threads, a spreadsheet for payments,
              and sticky notes with vaccine dates. Sound familiar?
            </p>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: '🚗',
                  problem: 'No-shows',
                  detail: 'Cost you $50-100 per missed appointment in gas, time, and lost revenue',
                },
                {
                  icon: '📅',
                  problem: 'Double bookings',
                  detail: 'Happen when your paper calendar and Google Cal don\'t sync',
                },
                {
                  icon: '💸',
                  problem: 'Chasing payments',
                  detail: 'Awkward follow-up texts and checks that never arrive',
                },
                {
                  icon: '🐾',
                  problem: 'Scattered pet info',
                  detail: 'Allergies, behavior notes, breed-specific needs buried in your phone notes',
                },
              ].map((item) => (
                <div
                  key={item.problem}
                  className="bg-white border border-stone-200 rounded-xl p-5 flex gap-4"
                >
                  <div className="text-2xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-bold text-stone-800">{item.problem}</p>
                    <p className="text-stone-600 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-stone-600 leading-relaxed mt-6">
              Mobile groomers like you lose <strong>3-5 hours every week</strong> to admin that should
              take 30 minutes. GroomGrid gives those hours back.
            </p>
          </div>
        </section>

        {/* ── Smart Scheduling ── */}
        <section data-section="smart-scheduling" className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-2">
            Your Calendar, Finally Under Control
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            Intelligent scheduling that understands how mobile groomers actually work.
          </p>
          <div className="grid grid-cols-1 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 border border-stone-200 rounded-xl bg-white hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="font-bold text-stone-800 mb-2">{feature.title}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Automated Reminders ── */}
        <section data-section="automated-reminders" className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-2">No-Shows? Not Anymore.</h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Automated SMS reminders that actually work. Your clients get a friendly text before their
              appointment — and you stop driving to empty driveways.
            </p>
            <div className="space-y-4 mb-8">
              {reminderSteps.map((step, i) => (
                <div key={step.time} className="flex gap-4 p-5 bg-white border border-stone-200 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-stone-800 text-sm">{step.time}</p>
                    <p className="text-stone-600 text-sm leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-green-300 rounded-xl p-6">
              <p className="text-stone-700 text-sm leading-relaxed">
                <strong className="text-green-600">The result:</strong> Groomers using automated
                reminders see no-show rates drop by <strong>30-40%</strong>. For a mobile groomer doing
                6 dogs a day, that&apos;s <strong>$200-400/month in recovered revenue</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* ── Client & Pet Profiles ── */}
        <section data-section="pet-profiles" className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-2">
            Every Dog, Every Detail — At Your Fingertips
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            Complete pet profiles that travel with you. No more digging through old texts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '📋',
                title: 'Complete Pet Profiles',
                detail:
                  'Breed, coat type, vaccination history, allergy notes, behavior flags, grooming preferences, and your own custom notes. Everything in one place.',
              },
              {
                icon: '📱',
                title: 'Quick-Access in the Field',
                detail:
                  'Pull up any client\'s info in 2 seconds. "Does Bella have the flea treatment done?" You\'ll know without digging through old texts.',
              },
              {
                icon: '📝',
                title: 'Client History at a Glance',
                detail:
                  'See every appointment, every note, every preference. Your clients feel like you remember everything — because now you actually do.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 border border-stone-200 rounded-xl bg-white hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-stone-800 text-sm mb-2">{item.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mobile Payments ── */}
        <section data-section="mobile-payments" className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-2">
              Get Paid Before You Leave the Driveway
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              No more &quot;I&apos;ll mail you a check&quot; or &quot;Can I Venmo you next week?&quot;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: '💳',
                  title: 'Instant Payment Collection',
                  detail:
                    'Send an invoice, client pays from their phone. Done. The money hits your account fast.',
                },
                {
                  icon: '📊',
                  title: 'Built-In Payment Tracking',
                  detail:
                    'See who\'s paid, who hasn\'t, and who needs a nudge — without the awkward follow-up texts.',
                },
                {
                  icon: '🧾',
                  title: 'No More Paper Invoices',
                  detail:
                    'Professional, branded invoices sent automatically after every groom. Your clients get a clean record.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5 border border-stone-200 rounded-xl bg-white hover:border-green-300 hover:shadow-sm transition-all"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-stone-800 text-sm mb-2">{item.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Van Life Friendly ── */}
        <section data-section="van-life" className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-2">
            Built for the Road, Not the Desk
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            GroomGrid works the way you work — from a van, on your phone, between stops.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '📱',
                title: 'Mobile-First Design',
                detail:
                  'Works perfectly on your phone — because that\'s what you have in the van. No laptop required, no clunky desktop interfaces to pinch-zoom through.',
              },
              {
                icon: '📶',
                title: 'Works Offline',
                detail:
                  'Dead zone between stops? No problem. Your schedule and client info stay accessible. Changes sync automatically when you\'re back in range.',
              },
              {
                icon: '⚡',
                title: 'Quick-Add Between Grooms',
                detail:
                  'Finished with Bella early? Add a walk-in note, update the next client\'s ETA, or check tomorrow\'s schedule — all in under 10 seconds.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 border border-stone-200 rounded-xl bg-white hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-stone-800 text-sm mb-2">{item.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Social Proof ── */}
        <section data-section="social-proof" className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">
              Groomers Like You, Loving GroomGrid
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="bg-white border border-stone-200 rounded-xl p-6"
                >
                  <p className="text-stone-700 text-sm leading-relaxed italic mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <p className="text-stone-800 font-bold text-sm">— {testimonial.name}</p>
                  <p className="text-stone-500 text-xs">{testimonial.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section data-section="final-cta" className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Ready to Spend Less Time on Admin and More Time with Dogs?
            </h2>
            <p className="text-green-100 text-lg mb-6 leading-relaxed max-w-xl mx-auto">
              Start your free trial today. No credit card required. Set up in under 5 minutes.
            </p>
            <Link
              href="/signup?coupon=BETA50"
              data-cta-type="primary"
              data-cta-location="bottom-cta"
              className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors shadow-md inline-block"
            >
              Start Your Free Trial →
            </Link>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-green-200 text-sm">
              {trustSignals.map((signal) => (
                <span key={signal} className="flex items-center gap-1">
                  ✅ {signal}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Bar ── */}
        <section className="px-6 py-8 bg-stone-900 text-stone-300 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="font-semibold text-white mb-2">GroomGrid includes:</p>
            <p className="text-sm">
              📅 Smart Scheduling · 💬 Automated Reminders · 💳 Mobile Payments · 🐾 Pet Profiles · 📱
              Works on Any Phone · 🔄 Offline Mode
            </p>
            <p className="text-xs text-stone-400 mt-3">
              Starting at $29/month for solo groomers. Use code{' '}
              <strong className="text-green-400">BETA50</strong> for 50% off your first month.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section data-section="faq" className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((item) => (
              <div key={item.question} className="border border-stone-200 rounded-xl p-6 bg-white">
                <h3 className="font-bold text-stone-800 mb-3">{item.question}</h3>
                <p className="text-stone-600 leading-relaxed text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Related Articles ── */}
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-stone-800 mb-6">Related Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/mobile-grooming-software"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Overview</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">
                Mobile Grooming Software Built for the Van
              </h3>
            </Link>
            <Link
              href="/blog/how-to-start-a-mobile-dog-grooming-business"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Business Guide</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">
                How to Start a Mobile Dog Grooming Business
              </h3>
            </Link>
            <Link
              href="/best-dog-grooming-software"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Comparison</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">
                Best Dog Grooming Software for 2026
              </h3>
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-6 py-8 max-w-5xl mx-auto border-t border-stone-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
            <Link href="/" className="font-bold text-green-600">
              GroomGrid 🐾
            </Link>
            <div className="flex gap-6">
              <Link href="/mobile-grooming-software" className="hover:text-stone-600 transition-colors">
                Mobile Software
              </Link>
              <Link href="/plans" className="hover:text-stone-600 transition-colors">
                Pricing
              </Link>
              <Link href="/signup" className="hover:text-stone-600 transition-colors">
                Sign Up
              </Link>
            </div>
            <p>© {new Date().getFullYear()} GroomGrid. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
