import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'How to Build a Mobile Grooming Trailer: Complete Guide (2026 Costs & Tips) | GroomGrid',
  description:
    'Building a mobile grooming trailer? Compare van vs trailer, get equipment lists, plumbing and electrical setup guides, $10K–$50K budgets, and layouts for your mobile pet spa.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/how-to-build-mobile-grooming-trailer',
  },
  openGraph: {
    title: 'How to Build a Mobile Grooming Trailer: Complete Guide (2026)',
    description: 'Van vs trailer, equipment, plumbing, electrical, costs, and licensing — everything to build your mobile grooming setup.',
    url: 'https://getgroomgrid.com/blog/how-to-build-mobile-grooming-trailer',
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
      name: 'How to Build a Mobile Grooming Trailer',
      item: 'https://getgroomgrid.com/blog/how-to-build-mobile-grooming-trailer',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Build a Mobile Grooming Trailer: Complete Guide (2026 Costs & Tips)',
  description:
    'Compare van vs trailer, get equipment lists, plumbing and electrical guides, $10K–$50K budgets, and mobile grooming layouts.',
  url: 'https://getgroomgrid.com/blog/how-to-build-mobile-grooming-trailer',
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
    '@id': 'https://getgroomgrid.com/blog/how-to-build-mobile-grooming-trailer',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does it cost to build a mobile grooming trailer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Budget builds run $10,000–$20,000. Mid-range setups cost $20,000–$35,000. Luxury trailers with dual tubs and full electrical run $35,000–$50,000. These totals include the base trailer, plumbing, electrical, and all equipment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Van or trailer — which is better for mobile dog grooming?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vans are more maneuverable and easier to park in urban areas. Trailers offer more space (200+ sq ft) and stability, ideal for groomers scaling to 8+ dogs/day or specialty breeds. Most beginners start with a van and upgrade to a trailer as volume grows.',
      },
    },
    {
      '@type': 'Question',
      name: 'What plumbing do I need for a grooming trailer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You need a 40–60 gallon fresh water tank, a gray waste tank of equal or larger size, a 12V pump, and a 6-gallon water heater (propane or electric). Add backflow preventers and test for leaks before your first appointment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need special insurance for a mobile grooming trailer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — you need commercial auto insurance, general liability ($1M+ coverage), and trailer-specific coverage. Budget $2,000–$5,000/year. Bundle with your business policy to save 15–20%.',
      },
    },
  ],
};

const vanVsTrailer = [
  { factor: 'Cost', van: '$15K–$40K built', trailer: '$10K–$50K (cheaper base)' },
  { factor: 'Maneuverability', van: 'Excellent — park anywhere', trailer: 'Needs truck, harder in cities' },
  { factor: 'Space', van: 'Limited (~100–150 sq ft)', trailer: 'Expandable (200+ sq ft)' },
  { factor: 'Stability', van: 'Good', trailer: 'Better (lower center of gravity)' },
  { factor: 'Maintenance', van: 'Integrated with vehicle wear', trailer: 'Separate from tow vehicle' },
  { factor: 'Best for', van: 'Solo, urban, budget-conscious', trailer: 'Scaling, large breeds, luxury' },
];

const equipment = [
  { item: 'Grooming table (hydraulic)', cost: '$400–$1,200', brand: 'Flying Pig, Reaper' },
  { item: 'High-velocity dryer', cost: '$300–$800', brand: 'K-9 Dryers' },
  { item: 'Clippers + vacuum', cost: '$500–$1,500', brand: 'Andis, Laube' },
  { item: 'Tub/sink (custom FRP)', cost: '$800–$2,000', brand: 'Custom or RV-style' },
  { item: 'Shampoos and conditioners', cost: '$200/month', brand: 'Chris Christensen' },
];

const budgets = [
  { tier: 'Budget ($10K–$20K)', base: '$8K', buildOut: '$5K', total: '~$15K' },
  { tier: 'Mid-range ($20K–$35K)', base: '$15K', buildOut: '$12K', total: '~$28K' },
  { tier: 'Luxury ($35K–$50K)', base: '$25K', buildOut: '$18K', total: '~$45K' },
];

export default function HowToBuildMobileGroomingTrailerPage() {
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
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-stone-100">
          <Link href="/" className="text-xl font-bold text-green-600">GroomGrid 🐾</Link>
          <Link href="/signup?coupon=BETA50" className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors">
            Start Free Trial
          </Link>
        </nav>

        {/* Breadcrumb */}
        <div className="px-6 py-3 max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-green-600 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog/" className="hover:text-green-600 transition-colors">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">How to Build a Mobile Grooming Trailer</li>
            </ol>
          </nav>
        </div>

        {/* Hero */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Mobile Grooming Build Guide · Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            How to Build a Mobile Grooming<br className="hidden sm:block" /> Trailer: The 2026 Guide
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Van or trailer? 12 feet or 20? Solar or generator? This 3,000-word guide covers
            everything you need to build your mobile grooming setup — from van vs. trailer comparisons
            and equipment lists to plumbing, electrical, budgets ($10K–$50K), and licensing. Let&apos;s
            build your mobile pet spa.
          </p>
        </header>

        {/* Van vs Trailer */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">Van vs. Trailer: Which Wins for Mobile Groomers?</h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              The eternal debate: cargo van (Ford Transit, Ram ProMaster) or bumper-pull trailer?
              Your choice depends on your budget, towing vehicle, client volume, and whether you&apos;re
              working urban neighborhoods or suburban routes.
            </p>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-sm">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-stone-700">Factor</th>
                    <th className="text-left px-5 py-3 font-semibold text-stone-700">Van</th>
                    <th className="text-left px-5 py-3 font-semibold text-stone-700">Trailer</th>
                  </tr>
                </thead>
                <tbody>
                  {vanVsTrailer.map((row, i) => (
                    <tr key={row.factor} className={i % 2 === 0 ? 'bg-white border-t border-stone-100' : 'bg-stone-50 border-t border-stone-100'}>
                      <td className="px-5 py-3 font-semibold text-stone-800">{row.factor}</td>
                      <td className="px-5 py-3 text-stone-600">{row.van}</td>
                      <td className="px-5 py-3 text-stone-600">{row.trailer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-stone-500 text-sm mt-4">
              Recommendation: Start with a van to keep costs low and maneuverability high. Upgrade
              to a trailer once you&apos;re consistently booking 8+ dogs/day and need the extra space.
            </p>
          </div>
        </section>

        {/* Sizing and Layout */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Sizing and Layout: Getting It Right</h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            Too small and you&apos;re cramped with wet Labradors splashing everywhere. Too big and
            you&apos;re paying gas penalties and fighting parking. Aim for 12–20 feet in length with
            standard 7×8 foot width.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Solo (4–6 dogs/day)', size: '12–14 ft', cost: '$10K–$25K', note: 'Fits table, tub, dryer' },
              { label: 'Scaling (8+ dogs/day)', size: '16–20 ft', cost: '$25K–$50K', note: 'Dual tubs, extra storage' },
              { label: 'Cat/puppy specialist', size: '14–16 ft', cost: '$15K–$35K', note: 'Taller ceiling (7+ ft) for calm spaces' },
            ].map((option) => (
              <div key={option.label} className="p-5 rounded-xl border border-stone-200 bg-white">
                <p className="font-bold text-stone-800 mb-1">{option.label}</p>
                <p className="text-green-600 font-bold text-lg mb-1">{option.size}</p>
                <p className="text-stone-500 text-sm mb-2">{option.cost}</p>
                <p className="text-stone-600 text-sm">{option.note}</p>
              </div>
            ))}
          </div>
          <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
            <h3 className="font-bold text-stone-800 mb-3">Optimal Layout Flow</h3>
            <ol className="space-y-2 text-stone-600 text-sm">
              <li className="flex gap-3"><span className="font-bold text-green-600">Front:</span> Client greeting area and storage cabinets</li>
              <li className="flex gap-3"><span className="font-bold text-green-600">Middle:</span> Grooming table (hydraulic, $500–$1,000) — center of the workspace</li>
              <li className="flex gap-3"><span className="font-bold text-green-600">Rear:</span> Tub, waste system, ventilation — dirty work zone</li>
            </ol>
            <p className="text-stone-500 text-sm mt-3">Sketch your layout with free tools like SketchUp or Floorplanner before you start building.</p>
          </div>
        </section>

        {/* Equipment */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Essential Equipment List ($3K–$8K)</h2>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-sm">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-stone-700">Item</th>
                    <th className="text-left px-5 py-3 font-semibold text-stone-700">Cost</th>
                    <th className="text-left px-5 py-3 font-semibold text-stone-700">Top Brands</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((row, i) => (
                    <tr key={row.item} className={i % 2 === 0 ? 'bg-white border-t border-stone-100' : 'bg-stone-50 border-t border-stone-100'}>
                      <td className="px-5 py-3 font-medium text-stone-800">{row.item}</td>
                      <td className="px-5 py-3 text-green-700 font-medium">{row.cost}</td>
                      <td className="px-5 py-3 text-stone-500">{row.brand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Plumbing and Electrical */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-4">Plumbing Setup ($1.5K–$4K)</h2>
              <ul className="space-y-3 text-stone-600">
                {[
                  '40–60 gallon fresh water tank (install underfloor)',
                  'Equal or larger gray waste tank',
                  '12V pump (quiet, ~$150) with PEX water lines',
                  '6-gallon water heater (propane or electric, ~$400)',
                  'Backflow preventers (mandatory for safety)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-stone-500 text-xs mt-4">Map dump station routes before your first route day.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-4">Electrical System ($2K–$5K)</h2>
              <ul className="space-y-3 text-stone-600">
                {[
                  '2,000W inverter for clippers and dryers',
                  '300Ah lithium battery bank (lasts 5× longer than lead-acid)',
                  '200W solar panels (reduces generator dependency)',
                  'Shore power hookup for overnight charging',
                  'LED lighting throughout (low power draw)',
                  'Generator backup — Honda EU2200i (~$1,000)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-stone-500 text-xs mt-4">Always consult a licensed electrician — sparks near fur and shampoo are a serious fire risk.</p>
            </div>
          </div>
        </section>

        {/* Budget */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Realistic Budget Breakdown: $10K–$50K</h2>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-sm">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-stone-700">Tier</th>
                    <th className="text-left px-5 py-3 font-semibold text-stone-700">Base Trailer</th>
                    <th className="text-left px-5 py-3 font-semibold text-stone-700">Build-Out</th>
                    <th className="text-left px-5 py-3 font-semibold text-stone-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((row, i) => (
                    <tr key={row.tier} className={i % 2 === 0 ? 'bg-white border-t border-stone-100' : 'bg-stone-50 border-t border-stone-100'}>
                      <td className="px-5 py-3 font-semibold text-stone-800">{row.tier}</td>
                      <td className="px-5 py-3 text-stone-600">{row.base}</td>
                      <td className="px-5 py-3 text-stone-600">{row.buildOut}</td>
                      <td className="px-5 py-3 text-green-700 font-bold">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-stone-500 text-sm mt-4">DIY saves 25–30%. Finance via RV loans (5–7% APR at most credit unions).</p>
          </div>
        </section>

        {/* Licensing */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Licensing, Permits, and Insurance</h2>
          <div className="space-y-4">
            {[
              { label: 'Business license', detail: '$50–$500, from city or county clerk' },
              { label: 'DOT number', detail: 'Free from FMCSA — required for commercial trailers over 10,000 lbs GVWR' },
              { label: 'Commercial auto insurance', detail: '$2,000–$5,000/year, covers van and trailer' },
              { label: 'General liability', detail: '$1M+ coverage, covers pet injuries and client accidents' },
              { label: 'Trailer registration and title', detail: 'Required in all states' },
              { label: 'Local zoning approval', detail: 'For storage at home — call city hall before parking commercially' },
            ].map((item) => (
              <div key={item.label} className="border-l-4 border-green-400 pl-5 py-1">
                <p className="font-semibold text-stone-800">{item.label}</p>
                <p className="text-stone-500 text-sm">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GroomGrid CTA */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-green-200">
              <h2 className="text-2xl font-bold text-stone-800 mb-4">Run Your Mobile Empire with GroomGrid</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Your trailer handles the grooming. GroomGrid handles everything else: AI-powered
                scheduling, route-optimized booking clusters, client and pet profiles with breed
                and allergy notes, automated SMS reminders that recover no-shows, and integrated
                Stripe payments. All in a mobile-first app designed for van and trailer life.
              </p>
              <ul className="space-y-2 mb-6 text-stone-600 text-sm">
                {[
                  'Route optimizer clusters appointments to cut drive time',
                  'Automated reminders recover 30%+ of abandoned bookings',
                  '"Fido hates clippers" pet notes at your fingertips',
                  'Solo tier: $29/month — no contracts',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup?coupon=BETA50" className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">
                  Start Free Trial →
                </Link>
                <Link href="/mobile-grooming-business/" className="px-6 py-3 rounded-lg border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition-colors">
                  Mobile Grooming Hub
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-16 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqSchema.mainEntity.map((item) => (
                <div key={item.name} className="border border-stone-200 bg-white rounded-xl p-6">
                  <h3 className="font-bold text-stone-800 mb-3">{item.name}</h3>
                  <p className="text-stone-600 leading-relaxed text-sm">{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">Ready to hit the road?</h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed max-w-xl mx-auto">
              Build the trailer. Fill it with happy dogs. Let GroomGrid handle the scheduling,
              reminders, and payments so you can focus on the grooms that matter.
            </p>
            <Link href="/signup?coupon=BETA50" className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors shadow-md inline-block">
              Try GroomGrid Free →
            </Link>
            <p className="text-green-200 text-sm mt-4">14-day free trial · No credit card required</p>
          </div>
        </section>

        {/* Related Articles */}
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-stone-800 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/blog/mobile-dog-grooming-business-tips" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
              <p className="text-sm text-green-600 font-semibold mb-1">Mobile</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">Mobile Dog Grooming Business Tips</h3>
            </Link>
            <Link href="/blog/mobile-dog-grooming-business-plan" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
              <p className="text-sm text-green-600 font-semibold mb-1">Planning</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">Mobile Dog Grooming Business Plan: Free Template</h3>
            </Link>
            <Link href="/blog/how-to-open-a-pet-grooming-business" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
              <p className="text-sm text-green-600 font-semibold mb-1">Business</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">How to Open a Pet Grooming Business: Complete Guide</h3>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 max-w-5xl mx-auto border-t border-stone-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
            <Link href="/" className="font-bold text-green-600">GroomGrid 🐾</Link>
            <div className="flex gap-6">
              <Link href="/grooming-business-operations/" className="hover:text-stone-600 transition-colors">Operations Hub</Link>
              <Link href="/mobile-grooming-business/" className="hover:text-stone-600 transition-colors">Mobile Grooming</Link>
              <Link href="/plans" className="hover:text-stone-600 transition-colors">Pricing</Link>
              <Link href="/signup" className="hover:text-stone-600 transition-colors">Sign Up</Link>
            </div>
            <p>© {new Date().getFullYear()} GroomGrid. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
