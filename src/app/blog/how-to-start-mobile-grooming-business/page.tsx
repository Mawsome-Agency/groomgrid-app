import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'How to Start a Mobile Dog Grooming Business: Step-by-Step Guide | GroomGrid',
  description:
    'Everything you need to launch a mobile dog grooming business — licensing, equipment, pricing, finding first clients, and the tools that run it all.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/how-to-start-mobile-grooming-business/',
  },
  openGraph: {
    title: 'How to Start a Mobile Dog Grooming Business: Step-by-Step Guide',
    description:
      'Everything you need to launch a mobile dog grooming business — licensing, equipment, pricing, and finding your first clients.',
    url: 'https://getgroomgrid.com/blog/how-to-start-mobile-grooming-business/',
    type: 'article',
  },
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
      name: 'Mobile Grooming',
      item: 'https://getgroomgrid.com/mobile-grooming-business/',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'How to Start a Mobile Grooming Business',
      item: 'https://getgroomgrid.com/blog/how-to-start-mobile-grooming-business/',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Start a Mobile Dog Grooming Business: Step-by-Step Guide',
  description:
    'Everything you need to launch a mobile dog grooming business — licensing, equipment, pricing, and finding your first clients.',
  url: 'https://getgroomgrid.com/blog/how-to-start-mobile-grooming-business/',
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
    '@id': 'https://getgroomgrid.com/blog/how-to-start-mobile-grooming-business/',
  },
};

export default function HowToStartMobileGroomingBusinessPage() {
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
          <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-green-600 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/mobile-grooming-business/" className="hover:text-green-600 transition-colors">
                  Mobile Grooming
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">
                How to Start
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Getting Started
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            How to Start a Mobile Dog<br className="hidden sm:block" /> Grooming Business
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Mobile grooming is one of the most accessible ways to own a grooming business — lower
            overhead than a salon, flexible hours, and clients who pay a premium for convenience.
            Here&apos;s everything you need to launch correctly from day one.
          </p>
        </header>

        {/* ── Is It Right For You? ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Is Mobile Grooming the Right Path?
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Mobile grooming is a great fit if you want to be your own boss, don&apos;t want to
              manage staff (at least to start), and prefer working directly with pets and their
              owners rather than inside a salon environment.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              The trade-offs are real: you&apos;re driving every day, managing a vehicle (which
              will break down), and limited to the number of dogs one person can groom in a day.
              Most mobile groomers max out at 6–8 dogs per day.
            </p>
            <p className="text-stone-600 leading-relaxed">
              If those trade-offs work for you, mobile grooming can be extremely profitable — solo
              mobile groomers commonly net $60,000–$100,000 per year once established.
            </p>
          </div>
        </section>

        {/* ── Step 1: Licensing ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Step 1: Get Licensed and Insured
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Requirements vary by state, but most mobile groomers need:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Business license — register in your state/county ($50–$500)',
              'General liability insurance — protects you if a dog is injured ($500–$1,500/year)',
              'Commercial vehicle insurance — your personal auto policy won\'t cover a grooming van',
              'Grooming certification — not legally required in most states, but builds client trust',
              'Water discharge permit — required in some municipalities for mobile grooming waste',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-stone-600 leading-relaxed">
            Check your local county website for specific requirements. Getting insurance before you
            take your first client is non-negotiable — one incident without coverage can end your
            business.
          </p>
        </section>

        {/* ── Step 2: Equipment ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Step 2: Get the Right Vehicle and Equipment
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Your van is your biggest investment and your daily workspace. It needs to be reliable,
              purpose-built for grooming (or properly converted), and big enough to work comfortably
              with large breeds.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Essential equipment checklist:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Hydraulic or electric grooming table (you\'ll do this 30+ times a day)',
                'Professional-grade tub with water heating and containment',
                'High-velocity dryer — speeds up drying significantly',
                'Full clipping kit: clippers, blades, scissors in multiple sizes',
                'Fresh water tank (50–100 gallons) and wastewater tank',
                'Generator or shore power hookup for electrical tools',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed">
              Buy quality tools from the start — cheap clippers and dryers fail constantly under
              daily professional use. Budget $1,500–$4,000 for a complete tool kit.
            </p>
          </div>
        </section>

        {/* ── Step 3: Pricing ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Step 3: Set Your Prices
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Price from your costs, not from what seems &quot;reasonable.&quot; Calculate your
            monthly fixed costs (van payment, insurance, fuel, supplies) and divide by the number
            of clients you can serve per month to find your break-even price per groom.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            Mobile grooming is a premium service. Don&apos;t undercut salon prices — you should
            be charging 20–40% more for the convenience you&apos;re providing.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4">
            <p className="text-stone-800 font-semibold mb-2">Typical mobile grooming price ranges:</p>
            <ul className="space-y-1 text-stone-600 text-sm">
              <li>Small breeds (under 20 lbs): $70–$90</li>
              <li>Medium breeds (20–50 lbs): $85–$110</li>
              <li>Large breeds (50–80 lbs): $100–$140</li>
              <li>Giant breeds (80+ lbs): $130–$180+</li>
            </ul>
          </div>
          <p className="text-stone-600 leading-relaxed">
            These are starting points. Research what other mobile groomers in your market charge and
            price competitively — but don&apos;t race to the bottom.
          </p>
        </section>

        {/* ── Step 4: First Clients ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Step 4: Get Your First 20 Clients
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              The first 20 clients are the hardest. After that, word-of-mouth does most of the work.
              Here&apos;s where new mobile groomers consistently find clients:
            </p>
            <ol className="space-y-4">
              {[
                {
                  step: 'Post in neighborhood Facebook groups and Nextdoor',
                  detail: 'Introduce yourself, your services, and offer a launch discount for first-time bookings',
                },
                {
                  step: 'Visit local vet offices and pet stores',
                  detail: 'Leave cards, introduce yourself, and ask to be their recommended mobile groomer',
                },
                {
                  step: 'Set up Google Business Profile',
                  detail: 'Free and drives local search traffic — fill out every field and ask early clients for reviews',
                },
                {
                  step: 'Post on Instagram',
                  detail: 'Before/after groom photos with location tags attract local pet owners',
                },
                {
                  step: 'Build a referral program',
                  detail: '"Refer a friend, get $20 off your next groom" — activates your existing clients as salespeople',
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-stone-600">
                  <span className="text-green-600 font-extrabold text-lg w-7 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <div>
                    <p className="font-semibold text-stone-800">{item.step}</p>
                    <p className="text-sm mt-1">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Step 5: Systems ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Step 5: Set Up Your Business Systems
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            The admin side of mobile grooming — scheduling, reminders, payments, client notes — can
            eat hours every week if you&apos;re doing it manually. Set up systems before you get
            busy, not after.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            At minimum, you need:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Online booking — so clients can book without calling you',
              'Automated reminders — so you stop chasing no-shows manually',
              'Digital payment collection — so you\'re not handling cash or chasing checks',
              'Client and pet profiles — so you remember every dog\'s quirks before they arrive',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-stone-600 leading-relaxed">
            The more of this you automate early, the more time you spend grooming (and earning)
            instead of doing admin.
          </p>
        </section>

        {/* ── Signup CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Built for mobile groomers from day one
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              GroomGrid gives you online booking, automated reminders, mobile payments, and client
              notes — all from your phone. No laptop, no paper, no chasing clients. Start free
              for 14 days.
            </p>
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors shadow-md inline-block"
            >
              Try GroomGrid Free →
            </Link>
          </div>
        </section>

        {/* ── Related Articles ── */}
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-stone-800 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/blog/mobile-dog-grooming-business-plan"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Business Planning</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors">
                Mobile Dog Grooming Business Plan: The Complete Template
              </h3>
            </Link>
            <Link
              href="/blog/reduce-no-shows-dog-grooming"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Operations</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors">
                How to Reduce No-Shows in Your Dog Grooming Business
              </h3>
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-6 py-8 max-w-5xl mx-auto border-t border-stone-100 mt-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
            <Link href="/" className="font-bold text-green-600">
              GroomGrid 🐾
            </Link>
            <div className="flex gap-6">
              <Link href="/mobile-grooming-business/" className="hover:text-stone-600 transition-colors">
                Mobile Grooming
              </Link>
              <Link href="/grooming-business-operations/" className="hover:text-stone-600 transition-colors">
                Operations Hub
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
