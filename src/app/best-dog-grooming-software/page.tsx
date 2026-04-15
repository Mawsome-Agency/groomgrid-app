import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Best Dog Grooming Software 2025: Top Picks & Reviews | GroomGrid',
  description:
    'Looking for the best dog grooming software? Compare top options including GroomGrid, MoeGo, DaySmart, and Pawfinity. Find the perfect fit for your grooming business.',
  alternates: {
    canonical: 'https://getgroomgrid.com/best-dog-grooming-software/',
  },
  openGraph: {
    title: 'Best Dog Grooming Software 2025: Top Picks & Reviews',
    description:
      'Looking for the best dog grooming software? Compare top options including GroomGrid, MoeGo, DaySmart, and Pawfinity. Find the perfect fit for your grooming business.',
    url: 'https://getgroomgrid.com/best-dog-grooming-software/',
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
      name: 'Best Dog Grooming Software',
      item: 'https://getgroomgrid.com/best-dog-grooming-software/',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Dog Grooming Software 2025: Top Picks & Reviews',
  description:
    'Looking for the best dog grooming software? Compare top options including GroomGrid, MoeGo, DaySmart, and Pawfinity. Find the perfect fit for your grooming business.',
  url: 'https://getgroomgrid.com/best-dog-grooming-software/',
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
    '@id': 'https://getgroomgrid.com/best-dog-grooming-software/',
  },
};

const softwareOptions = [
  {
    name: 'GroomGrid',
    badge: 'Best Overall',
    badgeColor: 'green',
    rating: 5,
    price: '$29/mo',
    description: 'AI-powered scheduling, automated reminders, and payment processing. Perfect for solo groomers and growing salons.',
    pros: [
      'AI-powered breed intelligence',
      'Transparent pricing, no hidden fees',
      '5-minute setup',
      'Built-in reminders and payments',
      'Unlimited clients and appointments',
    ],
    cons: [
      'Newer platform (but rapidly improving)',
    ],
    bestFor: 'Solo groomers and small salons who want powerful features without the complexity',
    ctaText: 'Start Free Trial',
    ctaHref: '/signup',
  },
  {
    name: 'MoeGo',
    badge: 'Established Player',
    badgeColor: 'blue',
    rating: 4,
    price: 'Custom pricing',
    description: 'Comprehensive grooming software with mobile app and extensive features. Good for larger operations.',
    pros: [
      'Established platform with many users',
      'Mobile app available',
      'Comprehensive feature set',
      'Good for multi-groomer salons',
    ],
    cons: [
      'Higher pricing',
      'Complex onboarding',
      'Reminders often require add-ons',
      'Limited clients on lower tiers',
    ],
    bestFor: 'Larger salons with complex needs and budget for premium software',
    ctaText: 'Learn More',
    ctaHref: 'https://moego.com',
  },
  {
    name: 'DaySmart Pet',
    badge: 'Enterprise Solution',
    badgeColor: 'purple',
    rating: 3.5,
    price: 'Custom pricing',
    description: 'Legacy enterprise solution with extensive customization. Best for very large operations.',
    pros: [
      'Highly customizable',
      'Enterprise-grade features',
      'Established in the industry',
      'Good for multi-location businesses',
    ],
    cons: [
      'Expensive',
      'Steep learning curve',
      'Outdated interface',
      'Overkill for small businesses',
    ],
    bestFor: 'Multi-location enterprises with complex requirements',
    ctaText: 'Request Demo',
    ctaHref: 'https://daysmartpet.com',
  },
  {
    name: 'Pawfinity',
    badge: 'Budget Option',
    badgeColor: 'orange',
    rating: 3,
    price: '$19/mo',
    description: 'Simple, affordable grooming software for basic needs. Good for very small operations.',
    pros: [
      'Affordable pricing',
      'Simple to use',
      'Good for basic scheduling',
      'Low learning curve',
    ],
    cons: [
      'Limited features',
      'No AI capabilities',
      'Basic payment processing',
      'Limited automation',
    ],
    bestFor: 'Hobby groomers or very small operations with minimal needs',
    ctaText: 'Learn More',
    ctaHref: 'https://pawfinity.com',
  },
];

const comparisonCriteria = [
  {
    criterion: 'Ease of Use',
    description: 'How intuitive is the software? Can you get started quickly?',
  },
  {
    criterion: 'Features',
    description: 'Does it have the tools you need: scheduling, reminders, payments, client management?',
  },
  {
    criterion: 'Pricing',
    description: 'Is the pricing transparent? Are there hidden fees or add-ons?',
  },
  {
    criterion: 'Support',
    description: 'How responsive is customer support when you need help?',
  },
  {
    criterion: 'Mobile Experience',
    description: 'Does it work well on mobile devices? Is there a dedicated app?',
  },
];

export default function BestDogGroomingSoftwarePage() {
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
                Best Dog Grooming Software
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Software Guide 2025
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Best Dog Grooming Software:<br className="hidden sm:block" /> Top Picks & Reviews
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Finding the right grooming software can transform your business. We&apos;ve reviewed the top
            options on the market to help you make an informed decision. From AI-powered scheduling to
            simple booking tools, discover which software fits your needs and budget.
          </p>
        </header>

        {/* ── Quick Comparison Table ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Quick Comparison</h2>
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-green-50 text-left">
                    <th className="px-4 py-3 font-semibold text-stone-700 border border-stone-200">
                      Software
                    </th>
                    <th className="px-4 py-3 font-semibold text-stone-700 border border-stone-200">
                      Rating
                    </th>
                    <th className="px-4 py-3 font-semibold text-stone-700 border border-stone-200">
                      Starting Price
                    </th>
                    <th className="px-4 py-3 font-semibold text-stone-700 border border-stone-200">
                      Best For
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {softwareOptions.map((software, i) => (
                    <tr
                      key={software.name}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}
                    >
                      <td className="px-4 py-3 border border-stone-200 text-stone-700 font-medium">
                        {software.name}
                        {software.badge && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            {software.badge}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 border border-stone-200 text-stone-600">
                        {'★'.repeat(Math.floor(software.rating))}
                        {software.rating % 1 !== 0 && '½'}
                      </td>
                      <td className="px-4 py-3 border border-stone-200 text-stone-600">
                        {software.price}
                      </td>
                      <td className="px-4 py-3 border border-stone-200 text-stone-600 text-xs">
                        {software.bestFor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Software Reviews ── */}
        <section className="px-6 py-14 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-3 text-center">
            In-Depth Reviews
          </h2>
          <p className="text-center text-stone-500 mb-10">
            Detailed breakdown of each software option to help you make the right choice.
          </p>
          <div className="space-y-8">
            {softwareOptions.map((software) => (
              <div
                key={software.name}
                className="border border-stone-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-1">
                      {software.name}
                      {software.badge && (
                        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {software.badge}
                        </span>
                      )}
                    </h3>
                    <p className="text-stone-500 text-sm">{software.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-bold text-lg">{software.price}</div>
                    <div className="text-stone-400 text-sm">
                      {'★'.repeat(Math.floor(software.rating))}
                      {software.rating % 1 !== 0 && '½'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-green-700 text-sm mb-2">Pros</h4>
                    <ul className="space-y-1 text-sm">
                      {software.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span className="text-stone-600">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 text-sm mb-2">Cons</h4>
                    <ul className="space-y-1 text-sm">
                      {software.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">✗</span>
                          <span className="text-stone-600">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-stone-600">
                    <span className="font-semibold">Best for:</span> {software.bestFor}
                  </p>
                </div>

                <Link
                  href={software.ctaHref}
                  className="inline-block px-6 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
                >
                  {software.ctaText} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── How to Choose ── */}
        <section className="px-6 py-12 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">How to Choose the Right Software</h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              With so many options available, it can be overwhelming to choose the right grooming software
              for your business. Here are the key factors to consider:
            </p>
            <div className="space-y-4">
              {comparisonCriteria.map((item) => (
                <div key={item.criterion} className="bg-white border border-stone-200 rounded-xl p-5">
                  <h3 className="font-bold text-stone-800 mb-2">{item.criterion}</h3>
                  <p className="text-stone-500 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why GroomGrid #1 ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Why GroomGrid is Our Top Pick</h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <p className="text-stone-600 leading-relaxed mb-4">
              GroomGrid stands out as the best overall choice for most grooming businesses because it
              combines powerful features with simplicity and affordability. Here&apos;s why it earns our
              top recommendation:
            </p>
            <ul className="space-y-3">
              {[
                'AI-powered breed intelligence automatically suggests optimal grooming times',
                'Transparent pricing with no hidden fees or surprise add-ons',
                'Get started in 5 minutes with streamlined onboarding',
                'Built-in automated reminders and payment processing',
                'Unlimited clients and appointments on all plans',
                'Responsive customer support with fast response times',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-stone-600">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-stone-500 text-sm">
            Ready to see why GroomGrid is the best choice for your grooming business?{' '}
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
              Ready to Transform Your Grooming Business?
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              Join hundreds of groomers who&apos;ve already switched to GroomGrid. Start your free 14-day
              trial today and experience the difference. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors shadow-md"
              >
                Start Free Trial →
              </Link>
              <Link
                href="/compare"
                className="px-8 py-4 rounded-xl border-2 border-white text-white font-bold text-lg hover:bg-green-700 transition-colors"
              >
                Compare All Options
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
              <Link href="/mobile-grooming-software" className="hover:text-stone-600 transition-colors">
                Mobile Grooming Software
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
