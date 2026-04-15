import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Grooming Software Comparison: GroomGrid vs MoeGo vs DaySmart vs Pawfinity | GroomGrid',
  description:
    'Compare top grooming software side-by-side. GroomGrid, MoeGo, DaySmart Pet, and Pawfinity compared on features, pricing, and value. Find the best fit for your business.',
  alternates: {
    canonical: 'https://getgroomgrid.com/compare/',
  },
  openGraph: {
    title: 'Grooming Software Comparison: GroomGrid vs MoeGo vs DaySmart vs Pawfinity',
    description:
      'Compare top grooming software side-by-side. GroomGrid, MoeGo, DaySmart Pet, and Pawfinity compared on features, pricing, and value. Find the best fit for your business.',
    url: 'https://getgroomgrid.com/compare/',
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
      name: 'Compare Software',
      item: 'https://getgroomgrid.com/compare/',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Grooming Software Comparison: GroomGrid vs MoeGo vs DaySmart vs Pawfinity',
  description:
    'Compare top grooming software side-by-side. GroomGrid, MoeGo, DaySmart Pet, and Pawfinity compared on features, pricing, and value. Find the best fit for your business.',
  url: 'https://getgroomgrid.com/compare/',
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
    '@id': 'https://getgroomgrid.com/compare/',
  },
};

const comparisonData = [
  {
    category: 'Pricing',
    features: [
      {
        feature: 'Starting Price',
        groomgrid: '$29/month',
        moego: 'Custom pricing',
        daysmart: 'Enterprise pricing',
        pawfinity: '$19/month',
      },
      {
        feature: 'Hidden Fees',
        groomgrid: 'None',
        moego: 'Add-ons for reminders',
        daysmart: 'Various fees',
        pawfinity: 'Limited features',
      },
      {
        feature: 'Free Trial',
        groomgrid: '14 days',
        moego: 'Limited',
        daysmart: 'Contact sales',
        pawfinity: '7 days',
      },
    ],
  },
  {
    category: 'Core Features',
    features: [
      {
        feature: 'Online Booking',
        groomgrid: '✓ Built-in',
        moego: '✓ Available',
        daysmart: '✓ Available',
        pawfinity: '✓ Basic',
      },
      {
        feature: 'Automated Reminders',
        groomgrid: '✓ SMS & Email',
        moego: '✓ Paid add-on',
        daysmart: '✓ Available',
        pawfinity: '✓ Limited',
      },
      {
        feature: 'Payment Processing',
        groomgrid: '✓ Integrated Stripe',
        moego: '✓ Higher fees',
        daysmart: '✓ Available',
        pawfinity: '✓ Basic',
      },
      {
        feature: 'Client Management',
        groomgrid: '✓ Unlimited',
        moego: '✓ Limited tiers',
        daysmart: '✓ Available',
        pawfinity: '✓ Limited',
      },
      {
        feature: 'Pet Profiles',
        groomgrid: '✓ Full history',
        moego: '✓ Available',
        daysmart: '✓ Available',
        pawfinity: '✓ Basic',
      },
    ],
  },
  {
    category: 'Advanced Features',
    features: [
      {
        feature: 'AI Scheduling',
        groomgrid: '✓ Breed intelligence',
        moego: '✗ Not available',
        daysmart: '✗ Not available',
        pawfinity: '✗ Not available',
      },
      {
        feature: 'Route Optimization',
        groomgrid: '✓ Smart clustering',
        moego: '✓ Higher tiers',
        daysmart: '✗ Limited',
        pawfinity: '✗ Not available',
      },
      {
        feature: 'GPS Check-In',
        groomgrid: '✓ Built-in',
        moego: '✓ Add-on',
        daysmart: '✗ Not available',
        pawfinity: '✗ Not available',
      },
      {
        feature: 'Offline Mode',
        groomgrid: '✓ Full access',
        moego: '✓ Limited',
        daysmart: '✗ Not available',
        pawfinity: '✗ Not available',
      },
      {
        feature: 'No-Show Protection',
        groomgrid: '✓ Deposits',
        moego: '✓ Basic',
        daysmart: '✓ Available',
        pawfinity: '✗ Not available',
      },
    ],
  },
  {
    category: 'User Experience',
    features: [
      {
        feature: 'Setup Time',
        groomgrid: '5 minutes',
        moego: 'Hours/Days',
        daysmart: 'Days',
        pawfinity: '30 minutes',
      },
      {
        feature: 'Mobile App',
        groomgrid: '✓ Responsive web',
        moego: '✓ Separate app',
        daysmart: '✓ Available',
        pawfinity: '✓ Basic',
      },
      {
        feature: 'Learning Curve',
        groomgrid: 'Easy',
        moego: 'Moderate',
        daysmart: 'Steep',
        pawfinity: 'Easy',
      },
      {
        feature: 'Customer Support',
        groomgrid: '✓ Fast email',
        moego: '✓ Phone & email',
        daysmart: '✓ Enterprise',
        pawfinity: '✓ Limited',
      },
    ],
  },
];

const softwareSummaries = [
  {
    name: 'GroomGrid',
    description: 'AI-powered grooming software with transparent pricing and smart features. Best for solo groomers and small salons.',
    strengths: ['AI scheduling', 'Best value', 'Fast setup', 'No hidden fees'],
    weaknesses: ['Newer platform'],
    verdict: 'Best overall value for most groomers',
  },
  {
    name: 'MoeGo',
    description: 'Established platform with comprehensive features. Good for larger salons with complex needs.',
    strengths: ['Established', 'Comprehensive', 'Mobile app'],
    weaknesses: ['Higher pricing', 'Complex setup', 'Add-on fees'],
    verdict: 'Good for larger operations with budget',
  },
  {
    name: 'DaySmart Pet',
    description: 'Enterprise-grade solution for multi-location businesses. Highly customizable but expensive.',
    strengths: ['Enterprise features', 'Customizable', 'Multi-location'],
    weaknesses: ['Very expensive', 'Steep learning curve', 'Overkill for small biz'],
    verdict: 'Best for enterprise/multi-location',
  },
  {
    name: 'Pawfinity',
    description: 'Simple, affordable option for basic grooming needs. Good for very small operations.',
    strengths: ['Affordable', 'Simple', 'Easy to use'],
    weaknesses: ['Limited features', 'No AI', 'Basic automation'],
    verdict: 'Good for hobbyists or very small operations',
  },
];

export default function ComparePage() {
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
                Compare Software
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Side-by-Side Comparison
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Grooming Software Comparison:<br className="hidden sm:block" /> Find Your Perfect Match
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            We&apos;ve compared the top grooming software options side-by-side so you can make an informed
            decision. See how GroomGrid stacks up against MoeGo, DaySmart Pet, and Pawfinity across
            pricing, features, and user experience.
          </p>
        </header>

        {/* ── Quick Summary Cards ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">At a Glance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {softwareSummaries.map((software) => (
                <div
                  key={software.name}
                  className="bg-white border border-stone-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-stone-800 mb-2">{software.name}</h3>
                  <p className="text-stone-500 text-sm mb-3 leading-relaxed">
                    {software.description}
                  </p>
                  <div className="text-xs">
                    <p className="font-semibold text-green-700 mb-1">Verdict:</p>
                    <p className="text-stone-600">{software.verdict}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Detailed Comparison Tables ── */}
        <section className="px-6 py-14 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-3 text-center">
            Feature-by-Feature Comparison
          </h2>
          <p className="text-center text-stone-500 mb-10">
            Detailed breakdown of features across all four platforms.
          </p>
          <div className="space-y-10">
            {comparisonData.map((category) => (
              <div key={category.category}>
                <h3 className="text-xl font-bold text-stone-800 mb-4">{category.category}</h3>
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
                      {category.features.map((row, i) => (
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
            ))}
          </div>
        </section>

        {/* ── Software Summaries ── */}
        <section className="px-6 py-12 bg-stone-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Detailed Software Summaries</h2>
            <div className="space-y-6">
              {softwareSummaries.map((software) => (
                <div
                  key={software.name}
                  className="bg-white border border-stone-200 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold text-stone-800 mb-2">{software.name}</h3>
                  <p className="text-stone-600 mb-4">{software.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-green-700 text-sm mb-2">Strengths</h4>
                      <ul className="space-y-1 text-sm">
                        {software.strengths.map((strength) => (
                          <li key={strength} className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span className="text-stone-600">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600 text-sm mb-2">Weaknesses</h4>
                      <ul className="space-y-1 text-sm">
                        {software.weaknesses.map((weakness) => (
                          <li key={weakness} className="flex items-start gap-2">
                            <span className="text-red-400 mt-0.5">✗</span>
                            <span className="text-stone-600">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-stone-50 rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-semibold">Verdict:</span> {software.verdict}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Which One is Right for You? ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Which One is Right for You?</h2>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h3 className="font-bold text-green-700 mb-2">Choose GroomGrid if you want:</h3>
              <ul className="space-y-1 text-sm text-stone-600">
                <li>• AI-powered features that save time</li>
                <li>• Transparent pricing with no hidden fees</li>
                <li>• Fast setup and easy to use</li>
                <li>• Great value for solo groomers and small salons</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-bold text-blue-700 mb-2">Choose MoeGo if you want:</h3>
              <ul className="space-y-1 text-sm text-stone-600">
                <li>• An established platform with many users</li>
                <li>• Comprehensive features for larger operations</li>
                <li>• A dedicated mobile app</li>
                <li>• Budget for premium pricing</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <h3 className="font-bold text-purple-700 mb-2">Choose DaySmart if you want:</h3>
              <ul className="space-y-1 text-sm text-stone-600">
                <li>• Enterprise-grade features</li>
                <li>• Highly customizable solution</li>
                <li>• Multi-location management</li>
                <li>• Budget for enterprise pricing</li>
              </ul>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
              <h3 className="font-bold text-orange-700 mb-2">Choose Pawfinity if you want:</h3>
              <ul className="space-y-1 text-sm text-stone-600">
                <li>• Simple, affordable software</li>
                <li>• Basic scheduling features</li>
                <li>• Easy to use with minimal learning curve</li>
                <li>• Very small operation or hobby grooming</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Ready to Choose the Best Software for Your Business?
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              GroomGrid offers the best combination of features, pricing, and ease of use for most
              grooming businesses. Start your free 14-day trial today and see the difference for yourself.
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
              <Link href="/moego-alternatives" className="hover:text-stone-600 transition-colors">
                MoeGo Alternatives
              </Link>
              <Link href="/best-dog-grooming-software" className="hover:text-stone-600 transition-colors">
                Best Grooming Software
              </Link>
              <Link href="/mobile-grooming-software" className="hover:text-stone-600 transition-colors">
                Mobile Grooming Software
              </Link>
            </div>
            <p>© {new Date().getFullYear()} GroomGrid. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
