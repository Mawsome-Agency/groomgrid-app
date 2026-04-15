import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'MoeGo Alternatives: Why Groomers Are Switching to GroomGrid | GroomGrid',
  description:
    'Looking for MoeGo alternatives? Compare GroomGrid vs MoeGo. AI-powered scheduling, better pricing, and simpler setup. See why groomers are making the switch.',
  alternates: {
    canonical: 'https://getgroomgrid.com/moego-alternatives/',
  },
  openGraph: {
    title: 'MoeGo Alternatives: Why Groomers Are Switching to GroomGrid',
    description:
      'Looking for MoeGo alternatives? Compare GroomGrid vs MoeGo. AI-powered scheduling, better pricing, and simpler setup. See why groomers are making the switch.',
    url: 'https://getgroomgrid.com/moego-alternatives/',
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
      name: 'MoeGo Alternatives',
      item: 'https://getgroomgrid.com/moego-alternatives/',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'MoeGo Alternatives: Why Groomers Are Switching to GroomGrid',
  description:
    'Looking for MoeGo alternatives? Compare GroomGrid vs MoeGo. AI-powered scheduling, better pricing, and simpler setup. See why groomers are making the switch.',
  url: 'https://getgroomgrid.com/moego-alternatives/',
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
    '@id': 'https://getgroomgrid.com/moego-alternatives/',
  },
};

const comparisonFeatures = [
  {
    feature: 'AI-Powered Scheduling',
    groomgrid: 'Smart scheduling with breed intelligence and optimal time suggestions',
    moego: 'Basic calendar with manual time slots',
    winner: 'groomgrid',
  },
  {
    feature: 'Pricing',
    groomgrid: '$29/mo Solo, $79/mo Salon - No hidden fees',
    moego: 'Custom pricing, often higher for similar features',
    winner: 'groomgrid',
  },
  {
    feature: 'Setup Time',
    groomgrid: '5 minutes - Start booking immediately',
    moego: 'Complex onboarding, can take hours or days',
    winner: 'groomgrid',
  },
  {
    feature: 'Mobile App',
    groomgrid: 'Fully responsive web app works on any device',
    moego: 'Mobile app available but requires separate download',
    winner: 'tie',
  },
  {
    feature: 'Automated Reminders',
    groomgrid: 'Built-in SMS and email reminders at 48h and 2h',
    moego: 'Available but often requires paid add-on',
    winner: 'groomgrid',
  },
  {
    feature: 'Payment Processing',
    groomgrid: 'Integrated Stripe with deposits and online payments',
    moego: 'Available but with higher transaction fees',
    winner: 'groomgrid',
  },
  {
    feature: 'Client Management',
    groomgrid: 'Unlimited clients with pet profiles and history',
    moego: 'Limited clients on lower tiers',
    winner: 'groomgrid',
  },
  {
    feature: 'No-Show Protection',
    groomgrid: 'Deposit collection and automated rescheduling',
    moego: 'Basic no-show tracking, limited protection',
    winner: 'groomgrid',
  },
  {
    feature: 'Route Optimization',
    groomgrid: 'Smart geographic clustering for mobile groomers',
    moego: 'Available on higher tiers only',
    winner: 'groomgrid',
  },
  {
    feature: 'Customer Support',
    groomgrid: 'Email support with fast response times',
    moego: 'Phone and email, but longer wait times',
    winner: 'groomgrid',
  },
];

const whySwitchReasons = [
  {
    title: 'Better Value for Money',
    description:
      'GroomGrid offers all the essential features at a fraction of the cost. Solo groomers pay just $29/month compared to MoeGo\'s often higher pricing for similar functionality.',
    icon: '💰',
  },
  {
    title: 'Faster Setup',
    description:
      'Get up and running in 5 minutes, not hours. Our streamlined onboarding means you can start booking clients the same day you sign up.',
    icon: '⚡',
  },
  {
    title: 'AI-Powered Features',
    description:
      'Breed intelligence automatically suggests optimal grooming times based on pet size and coat type. MoeGo lacks this smart scheduling capability.',
    icon: '🤖',
  },
  {
    title: 'No Hidden Fees',
    description:
      'Transparent pricing with no surprise add-ons. What you see is what you pay - no extra charges for reminders, payments, or client management.',
    icon: '✅',
  },
];

export default function MoeGoAlternativesPage() {
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
                MoeGo Alternatives
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Software Comparison
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            MoeGo Alternatives:<br className="hidden sm:block" /> Why Groomers Switch to GroomGrid
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            If you&apos;re looking for MoeGo alternatives, you&apos;re not alone. Many groomers are
            making the switch to GroomGrid for better pricing, faster setup, and AI-powered features
            that actually save time. See the side-by-side comparison and discover why GroomGrid is the
            smart choice for modern grooming businesses.
          </p>
        </header>

        {/* ── Quick Summary ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Quick Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-green-700 text-lg mb-3">GroomGrid</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>AI-powered scheduling with breed intelligence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Transparent pricing from $29/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>5-minute setup, start booking immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Built-in reminders and payment processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Unlimited clients and appointments</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h3 className="font-bold text-stone-700 text-lg mb-3">MoeGo</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400 mt-0.5">○</span>
                    <span>Basic calendar scheduling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400 mt-0.5">○</span>
                    <span>Higher pricing, custom quotes required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400 mt-0.5">○</span>
                    <span>Complex onboarding process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400 mt-0.5">○</span>
                    <span>Reminders often require paid add-ons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-stone-400 mt-0.5">○</span>
                    <span>Limited clients on lower tiers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature Comparison Table ── */}
        <section className="px-6 py-14 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-3 text-center">
            Feature-by-Feature Comparison
          </h2>
          <p className="text-center text-stone-500 mb-10">
            See how GroomGrid stacks up against MoeGo across the features that matter most to groomers.
          </p>
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
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}
                  >
                    <td className="px-4 py-3 border border-stone-200 text-stone-700 font-medium">
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 border border-stone-200 text-stone-600">
                      {row.groomgrid}
                      {row.winner === 'groomgrid' && (
                        <span className="ml-2 text-green-500 font-bold">✓</span>
                      )}
                    </td>
                    <td className="px-4 py-3 border border-stone-200 text-stone-600">
                      {row.moego}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Why Switch to GroomGrid ── */}
        <section className="px-6 py-12 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">
              Why Groomers Are Switching to GroomGrid
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whySwitchReasons.map((reason) => (
                <div key={reason.title} className="bg-white border border-stone-200 rounded-xl p-6">
                  <span className="text-3xl mb-3 block">{reason.icon}</span>
                  <h3 className="font-bold text-stone-800 mb-2">{reason.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing Comparison ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Pricing Comparison</h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-green-700 text-lg mb-3">GroomGrid Pricing</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-stone-700">Solo Plan</span>
                <span className="text-green-600 font-bold">$29/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-stone-700">Salon Plan</span>
                <span className="text-green-600 font-bold">$79/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-stone-700">Enterprise Plan</span>
                <span className="text-green-600 font-bold">$149/month</span>
              </div>
            </div>
            <p className="text-stone-500 text-sm mt-4">
              All plans include unlimited clients, appointments, automated reminders, and payment processing.
            </p>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
            <h3 className="font-bold text-stone-700 text-lg mb-3">MoeGo Pricing</h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-3">
              MoeGo uses custom pricing that varies based on your business size and needs. Many groomers
              report paying significantly more than GroomGrid for similar features, especially when adding
              essential tools like automated reminders and payment processing.
            </p>
            <p className="text-stone-500 text-sm">
              Contact MoeGo directly for a custom quote based on your specific requirements.
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Ready to Make the Switch?
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              Join hundreds of groomers who&apos;ve already switched to GroomGrid. Start your free 14-day
              trial today and see the difference for yourself. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors shadow-md"
              >
                Start Free Trial →
              </Link>
              <Link
                href="/plans"
                className="px-8 py-4 rounded-xl border-2 border-white text-white font-bold text-lg hover:bg-green-700 transition-colors"
              >
                View Pricing
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
              <Link href="/compare" className="hover:text-stone-600 transition-colors">
                Compare All Software
              </Link>
              <Link href="/best-dog-grooming-software" className="hover:text-stone-600 transition-colors">
                Best Grooming Software
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
