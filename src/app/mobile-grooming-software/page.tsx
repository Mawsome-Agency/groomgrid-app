import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Mobile Grooming Software: Best Tools for On-the-Go Groomers | GroomGrid',
  description:
    'Find the best mobile grooming software for your business. Route optimization, GPS tracking, mobile payments, and tools designed specifically for mobile groomers.',
  alternates: {
    canonical: 'https://getgroomgrid.com/mobile-grooming-software/',
  },
  openGraph: {
    title: 'Mobile Grooming Software: Best Tools for On-the-Go Groomers',
    description:
      'Find the best mobile grooming software for your business. Route optimization, GPS tracking, mobile payments, and tools designed specifically for mobile groomers.',
    url: 'https://getgroomgrid.com/mobile-grooming-software/',
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
      name: 'Mobile Grooming Software',
      item: 'https://getgroomgrid.com/mobile-grooming-software/',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Mobile Grooming Software: Best Tools for On-the-Go Groomers',
  description:
    'Find the best mobile grooming software for your business. Route optimization, GPS tracking, mobile payments, and tools designed specifically for mobile groomers.',
  url: 'https://getgroomgrid.com/mobile-grooming-software/',
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
    '@id': 'https://getgroomgrid.com/mobile-grooming-software/',
  },
};

const mobileFeatures = [
  {
    title: 'Route Optimization',
    description:
      'Smart geographic clustering that groups clients by neighborhood, minimizing drive time and maximizing dogs per day.',
    icon: '🗺️',
  },
  {
    title: 'Mobile-First Design',
    description:
      'Fully responsive interface that works perfectly on phones and tablets - no separate app download required.',
    icon: '📱',
  },
  {
    title: 'GPS Check-In',
    description:
      'Track arrival times and automatically notify clients when you\'re on your way, reducing no-shows and wait times.',
    icon: '📍',
  },
  {
    title: 'Mobile Payments',
    description:
      'Collect payments on the spot with integrated Stripe - deposits, tips, and final payments all handled seamlessly.',
    icon: '💳',
  },
  {
    title: 'Offline Mode',
    description:
      'Access client info and appointment details even without internet - syncs automatically when connection returns.',
    icon: '📶',
  },
  {
    title: 'Quick Notes',
    description:
      'Add pet notes and grooming instructions on the go - everything syncs to your client database instantly.',
    icon: '📝',
  },
];

const whyMobileGroomersNeedSoftware = [
  {
    title: 'Stop Wasting Time on Routes',
    description:
      'Without smart routing, mobile groomers can waste 1-2 hours daily driving between appointments. That\'s lost revenue and added stress.',
    icon: '⏰',
  },
  {
    title: 'Eliminate Payment Chasing',
    description:
      'Mobile groomers often struggle to collect payments after the groom. Built-in payment processing means you get paid before you leave.',
    icon: '💰',
  },
  {
    title: 'Reduce No-Shows',
    description:
      'When you drive 20 minutes to a client who doesn\'t show up, you lose significant time and money. Automated reminders prevent this.',
    icon: '🚫',
  },
  {
    title: 'Manage Everything from the Van',
    description:
      'You don\'t have time to sit at a computer. Mobile software lets you handle bookings, payments, and client management from anywhere.',
    icon: '🚐',
  },
];

const comparisonTable = [
  {
    feature: 'Route Optimization',
    groomgrid: 'Smart geographic clustering',
    moego: 'Available on higher tiers',
    daysmart: 'Limited functionality',
    pawfinity: 'Not available',
  },
  {
    feature: 'Mobile-First Design',
    groomgrid: 'Fully responsive web app',
    moego: 'Separate mobile app',
    daysmart: 'Desktop-focused',
    pawfinity: 'Basic mobile support',
  },
  {
    feature: 'GPS Check-In',
    groomgrid: 'Built-in client notifications',
    moego: 'Available with add-on',
    daysmart: 'Not available',
    pawfinity: 'Not available',
  },
  {
    feature: 'Mobile Payments',
    groomgrid: 'Integrated Stripe',
    moego: 'Available with higher fees',
    daysmart: 'Available',
    pawfinity: 'Basic processing',
  },
  {
    feature: 'Offline Mode',
    groomgrid: 'Full offline access',
    moego: 'Limited offline',
    daysmart: 'Not available',
    pawfinity: 'Not available',
  },
  {
    feature: 'Pricing',
    groomgrid: '$29/mo Solo, $79/mo Salon',
    moego: 'Custom, often higher',
    daysmart: 'Enterprise pricing',
    pawfinity: '$19/mo basic',
  },
];

export default function MobileGroomingSoftwarePage() {
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
              <li className="text-stone-700 font-medium" aria-current="page">
                Mobile Grooming Software
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            For Mobile Groomers
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Mobile Grooming Software:<br className="hidden sm:block" /> Tools Built for the Road
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Mobile grooming has unique challenges that salon software doesn&apos;t address. You need
            route optimization, GPS tracking, mobile payments, and tools that work from your van.
            Discover the software designed specifically for on-the-go groomers.
          </p>
        </header>

        {/* ── Why Mobile Groomers Need Specialized Software ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">
              Why Mobile Groomers Need Specialized Software
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyMobileGroomersNeedSoftware.map((item) => (
                <div key={item.title} className="bg-white border border-stone-200 rounded-xl p-6">
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h3 className="font-bold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mobile Features ── */}
        <section className="px-6 py-14 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-3 text-center">
            Essential Features for Mobile Groomers
          </h2>
          <p className="text-center text-stone-500 mb-10">
            These are the must-have features that make mobile grooming software actually useful on the road.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mobileFeatures.map((feature) => (
              <div key={feature.title} className="border border-stone-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <span className="text-3xl mb-3 block">{feature.icon}</span>
                <h3 className="font-bold text-stone-800 mb-2">{feature.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="px-6 py-12 bg-stone-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Mobile Software Comparison</h2>
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-green-50 text-left">
                    <th className="px-4 py-3 font-semibold text-stone-700 border border-stone-200">
                      Feature
                    </th>
                    <th className="px-4 py-3 font-semibold text-green-700 border border-stone-200">
                      GroomGrid
                    </th>
                    <th className="px-4 py-3 font-semibold text-stone-700 border border-stone-200">
                      MoeGo
                    </th>
                    <th className="px-4 py-3 font-semibold text-stone-700 border border-stone-200">
                      DaySmart
                    </th>
                    <th className="px-4 py-3 font-semibold text-stone-700 border border-stone-200">
                      Pawfinity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}
                    >
                      <td className="px-4 py-3 border border-stone-200 text-stone-700 font-medium">
                        {row.feature}
                      </td>
                      <td className="px-4 py-3 border border-stone-200 text-stone-600">
                        {row.groomgrid}
                      </td>
                      <td className="px-4 py-3 border border-stone-200 text-stone-600">
                        {row.moego}
                      </td>
                      <td className="px-4 py-3 border border-stone-200 text-stone-600">
                        {row.daysmart}
                      </td>
                      <td className="px-4 py-3 border border-stone-200 text-stone-600">
                        {row.pawfinity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Why GroomGrid for Mobile Groomers ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Why GroomGrid is Perfect for Mobile Groomers</h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <p className="text-stone-600 leading-relaxed mb-4">
              GroomGrid was built with mobile groomers in mind. We understand the unique challenges of
              running a grooming business from a van, and every feature is designed to make your life
              easier on the road.
            </p>
            <ul className="space-y-3">
              {[
                'Route optimization that actually saves you time and gas money',
                'Fully responsive design that works perfectly on your phone',
                'GPS check-in that automatically notifies clients when you\'re arriving',
                'Mobile payments so you get paid before you leave each appointment',
                'Offline mode so you can access client info even without internet',
                'Affordable pricing that doesn\'t eat into your margins',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-stone-600">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-stone-500 text-sm">
            Ready to streamline your mobile grooming business?{' '}
            <Link href="/signup" className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2">
              Start your free 14-day trial
            </Link>{' '}
            today.
          </p>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Built for Mobile Groomers, By People Who Get It
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              Stop wasting time on inefficient routes and payment chases. GroomGrid gives you the tools
              to run your mobile grooming business smoothly from anywhere. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors shadow-md"
              >
                Start Free Trial →
              </Link>
              <Link
                href="/mobile-grooming-business"
                className="px-8 py-4 rounded-xl border-2 border-white text-white font-bold text-lg hover:bg-green-700 transition-colors"
              >
                Mobile Grooming Guide
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-6 py-8 max-w-5xl mx-auto border-t border-stone-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
            <Link href="/" className="font-bold text-green-600">
              GroomGrid 🐾
            </Link>
            <div className="flex gap-6">
              <Link href="/best-dog-grooming-software" className="hover:text-stone-600 transition-colors">
                Best Grooming Software
              </Link>
              <Link href="/compare" className="hover:text-stone-600 transition-colors">
                Compare All Software
              </Link>
              <Link href="/plans" className="hover:text-stone-600 transition-colors">
                Pricing
              </Link>
            </div>
            <p>© {new Date().getFullYear()} GroomGrid. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
