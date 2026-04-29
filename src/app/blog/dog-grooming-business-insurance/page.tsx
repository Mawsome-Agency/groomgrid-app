import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Dog Grooming Business Insurance: What You Need & What It Costs (2026) | GroomGrid',
  description:
    'Complete guide to dog grooming business insurance — general liability, professional liability, commercial auto, workers comp, and how much you should expect to pay.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/dog-grooming-business-insurance',
  },
  openGraph: {
    title: 'Dog Grooming Business Insurance: What You Need & What It Costs (2026)',
    description:
      'Complete guide to dog grooming business insurance — coverage types, costs, and what you actually need to protect your business.',
    url: 'https://getgroomgrid.com/blog/dog-grooming-business-insurance',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dog Grooming Business Insurance: What You Need & What It Costs (2026)',
  description: 'Complete guide to dog grooming business insurance — general liability, professional liability, commercial auto, workers comp, and costs.',
  url: 'https://getgroomgrid.com/blog/dog-grooming-business-insurance',
  datePublished: '2026-04-27',
  dateModified: '2026-04-27',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://getgroomgrid.com/blog/dog-grooming-business-insurance' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does dog grooming business insurance cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dog grooming business insurance costs $400–$1,200 per year for a basic general liability policy. A comprehensive policy including professional liability, commercial auto (for mobile groomers), and property coverage runs $800–$2,500 per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'What insurance does a mobile dog groomer need?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mobile dog groomers need general liability insurance, professional liability (care, custody, and control), commercial auto insurance for the grooming van, and possibly inland marine coverage for grooming equipment. Expect to pay $800–$2,000/year for full mobile coverage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need insurance if I groom dogs from home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Your homeowner\'s insurance typically excludes business activities. You need at minimum general liability and professional liability coverage. A home-based groomer policy costs $400–$800/year.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does care, custody, and control insurance cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CCC insurance covers injuries to or death of an animal in your care. This includes accidental cuts, allergic reactions to products, heat stress, or escape. It is the single most important coverage for a dog groomer.',
      },
    },
  ],
};

const insuranceTypes = [
  {
    icon: '🛡️',
    name: 'General Liability',
    cost: '$400–$900/yr',
    coverage: '$1M–$2M per occurrence',
    desc: 'Covers third-party bodily injury and property damage. A client trips over your equipment, or a dog bites someone in your waiting area. This is the foundation — most landlords and mobile van lessors require it.',
    required: true,
  },
  {
    icon: '🐾',
    name: 'Professional Liability (CCC)',
    cost: '$200–$600/yr',
    coverage: '$10K–$100K per animal',
    desc: 'Care, Custody, and Control coverage protects you if a dog is injured, becomes ill, or dies while in your care. Covers accidental nicks, allergic reactions, heatstroke, and escape.',
    required: true,
  },
  {
    icon: '🚐',
    name: 'Commercial Auto',
    cost: '$800–$2,000/yr',
    coverage: 'State minimums + cargo',
    desc: 'Required for mobile groomers. Covers accidents in your grooming van. Personal auto insurance will not cover business use. Also covers theft of equipment from the vehicle.',
    required: false,
  },
  {
    icon: '👨‍🔧',
    name: 'Workers Compensation',
    cost: '$500–$2,500/yr',
    coverage: 'State-mandated limits',
    desc: 'Required in most states if you have employees. Covers groomer injuries (bite wounds, repetitive strain, slip-and-fall). Even solo groomers should consider occupational accident coverage.',
    required: false,
  },
  {
    icon: '🏢',
    name: 'Commercial Property',
    cost: '$300–$800/yr',
    coverage: 'Replacement value',
    desc: 'Covers your grooming equipment, tables, tubs, dryers, and salon buildout against fire, theft, and natural disasters. Essential for salon owners with significant equipment investment.',
    required: false,
  },
  {
    icon: '⚖️',
    name: 'Business Owner\'s Policy (BOP)',
    cost: '$600–$1,500/yr',
    coverage: 'General liability + property',
    desc: 'Bundles general liability and commercial property at a discount. The best value for salon owners who need both. Most insurance companies offer pet grooming-specific BOP packages.',
    required: false,
  },
];

export default function DogGroomingBusinessInsurance() {
  return (
    <>      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-stone-50">
        <header className="bg-gradient-to-br from-green-600 to-green-700 text-white">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <nav className="text-sm text-green-200 mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-white transition-colors">Home</Link><span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link><span>/</span>
              <span className="text-white">Dog Grooming Insurance</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Dog Grooming Business Insurance: What You Need &amp; What It Costs (2026)
            </h1>
            <p className="text-lg text-green-100 max-w-3xl">
              Every type of insurance a dog grooming business needs — what it covers, what it costs,
              and how to get the right coverage without overpaying.
            </p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Quick Answer */}
          <section className="mb-12">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-green-800 mb-3">Quick Answer</h2>
              <p className="text-green-900 text-lg leading-relaxed">
                You need <strong>general liability + professional liability (care, custody, and control)</strong> at minimum.
                For a solo groomer, expect to pay <strong>$400–$1,200/year</strong> for basic coverage.
                Mobile groomers need additional commercial auto insurance, bringing total costs to{' '}
                <strong>$800–$2,500/year</strong>.
              </p>
            </div>
          </section>

          {/* Insurance Types */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Types of Insurance for Dog Grooming Businesses</h2>
            <div className="space-y-4">
              {insuranceTypes.map((item) => (
                <div key={item.name} className={`bg-white border rounded-xl p-6 ${item.required ? 'border-green-200 border-l-4 border-l-green-500' : 'border-stone-200'}`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="text-3xl">{item.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-stone-800 text-lg">{item.name}</h3>
                        {item.required && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">ESSENTIAL</span>}
                      </div>
                      <p className="text-stone-600 mb-3">{item.desc}</p>
                      <div className="flex gap-6 text-sm">
                        <span className="text-green-700 font-semibold">Cost: {item.cost}</span>
                        <span className="text-stone-500">Coverage: {item.coverage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* By Business Type */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">What You Need by Business Type</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h3 className="font-bold text-stone-800 mb-4">🏠 Home-Based Groomer</h3>
                <ul className="space-y-2 text-stone-600 text-sm">
                  <li>✓ General Liability</li>
                  <li>✓ Professional Liability (CCC)</li>
                  <li className="text-stone-400">○ Commercial Auto (if no mobile unit)</li>
                  <li className="text-stone-400">○ Workers Comp (solo only)</li>
                </ul>
                <p className="mt-4 font-bold text-green-700">$400–$800/yr</p>
              </div>
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-green-700 mb-4">🚐 Mobile Groomer</h3>
                <ul className="space-y-2 text-stone-600 text-sm">
                  <li>✓ General Liability</li>
                  <li>✓ Professional Liability (CCC)</li>
                  <li className="font-bold text-green-700">✓ Commercial Auto (required)</li>
                  <li className="text-stone-400">○ Workers Comp (solo only)</li>
                </ul>
                <p className="mt-4 font-bold text-green-700">$800–$2,000/yr</p>
              </div>
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h3 className="font-bold text-stone-800 mb-4">🏪 Salon Owner</h3>
                <ul className="space-y-2 text-stone-600 text-sm">
                  <li>✓ General Liability</li>
                  <li>✓ Professional Liability (CCC)</li>
                  <li>✓ Commercial Property / BOP</li>
                  <li className="font-bold text-green-700">✓ Workers Comp (with employees)</li>
                </ul>
                <p className="mt-4 font-bold text-green-700">$1,200–$2,500/yr</p>
              </div>
            </div>
          </section>

          {/* Common Claims */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Common Insurance Claims in Dog Grooming</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { claim: 'Accidental cut or nick during grooming', type: 'Professional Liability', cost: '$200–$2,000' },
                { claim: 'Dog bites another dog or a person', type: 'General Liability', cost: '$500–$5,000' },
                { claim: 'Dog escapes from mobile van', type: 'CCC / General Liability', cost: '$1,000–$10,000+' },
                { claim: 'Client slips on wet floor', type: 'General Liability', cost: '$5,000–$50,000' },
                { claim: 'Groomer develops repetitive strain injury', type: 'Workers Comp', cost: '$10,000–$100,000+' },
                { claim: 'Equipment stolen from van or salon', type: 'Property / Commercial Auto', cost: '$500–$5,000' },
              ].map((item) => (
                <div key={item.claim} className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <p className="font-medium text-stone-800 text-sm mb-1">{item.claim}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-600">{item.type}</span>
                    <span className="text-stone-500">{item.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How to Get Coverage */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">How to Get Dog Grooming Insurance</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Get quotes from pet grooming specialists', desc: 'Companies like Pet Care Insurance, Pet Sitters Associates, and Insureon specialize in pet care businesses and understand the unique risks. They are often cheaper than general commercial policies.' },
                { step: '2', title: 'Compare at least 3 quotes', desc: 'Coverage limits and exclusions vary significantly between carriers. A cheaper policy may exclude CCC coverage or have a very low per-animal limit.' },
                { step: '3', title: 'Check for grooming-specific exclusions', desc: 'Some general liability policies exclude professional services, meaning they will not cover accidental injuries to animals. Make sure CCC is explicitly included.' },
                { step: '4', title: 'Review annually', desc: 'As your business grows (more employees, mobile unit, higher revenue), your coverage needs change. Review your policy each renewal period.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">{item.step}</div>
                  <div>
                    <h3 className="font-bold text-stone-800 mb-1">{item.title}</h3>
                    <p className="text-stone-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">Protect Your Business — and Your Revenue</h2>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Insurance protects you from the unexpected. GroomGrid protects your revenue from no-shows,
                missed appointments, and lost clients. Run your business with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors">
                  Start Free Trial
                </Link>
                <Link href="/plans" className="inline-block border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-green-500 transition-colors">
                  See Pricing
                </Link>
              </div>
            </div>
          </section>

          {/* Related */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Related Guides</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/blog/dog-grooming-business-management" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                <p className="text-sm text-green-600 font-semibold mb-1">Management</p>
                <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">Dog Grooming Business Management: Complete Guide</h3>
              </Link>
              <Link href="/blog/how-to-start-mobile-grooming-business" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                <p className="text-sm text-green-600 font-semibold mb-1">Startup</p>
                <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">How to Start a Mobile Grooming Business</h3>
              </Link>
              <Link href="/blog/how-much-to-start-dog-grooming-business" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                <p className="text-sm text-green-600 font-semibold mb-1">Costs</p>
                <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">How Much Does It Cost to Start a Dog Grooming Business?</h3>
              </Link>
            </div>
          </section>
        </main>

        <SiteFooter slug="blog/dog-grooming-business-insurance" />
      </div>
    </>
  );
}
