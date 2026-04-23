import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'How to Open a Pet Grooming Business: Complete Guide for 2026 | GroomGrid',
  description:
    'Everything you need to open a pet grooming business — business plans, licensing, location, equipment, staffing, pricing, and the software that ties it all together.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/how-to-open-a-pet-grooming-business',
  },
  openGraph: {
    title: 'How to Open a Pet Grooming Business: Complete Guide for 2026',
    description:
      'Everything you need to open a pet grooming business — business plans, licensing, location, equipment, staffing, pricing, and the software that ties it all together.',
    url: 'https://getgroomgrid.com/blog/how-to-open-a-pet-grooming-business',
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
      name: 'How to Open a Pet Grooming Business',
      item: 'https://getgroomgrid.com/blog/how-to-open-a-pet-grooming-business',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Open a Pet Grooming Business: Complete Guide for 2026',
  description:
    'Everything you need to open a pet grooming business — business plans, licensing, location, equipment, staffing, pricing, and the software that ties it all together.',
  url: 'https://getgroomgrid.com/blog/how-to-open-a-pet-grooming-business',
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
    '@id': 'https://getgroomgrid.com/blog/how-to-open-a-pet-grooming-business',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does it cost to open a pet grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on the model. A home-based setup costs $2,000–$8,000. A mobile grooming van runs $30,000–$80,000 (including the vehicle and conversion). A retail salon location costs $50,000–$150,000+ for build-out, equipment, signage, and initial inventory. Most new owners start home-based or mobile to minimize upfront investment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a grooming certification to open a pet grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most states do not require certification to operate a grooming business. However, completing a professional grooming program (4–16 weeks) gives you the skills to work safely and efficiently, and credentials help attract clients. The National Dog Groomers Association of America (NDGAA) offers respected certifications.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the most profitable type of pet grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mobile grooming has the highest profit margins (60–75%) because of low overhead and premium pricing. Home-based grooming also has strong margins (60–70%). Retail salons have the highest revenue potential but lower margins (30–40%) due to rent, utilities, and staffing costs. Multi-groomer salons can earn $200,000+ per year in revenue.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to open a pet grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A home-based grooming business can be operational in 2–4 weeks once you have equipment and licensing. A mobile business takes 4–8 weeks (van conversion + permits). A retail salon takes 3–6 months for lease negotiation, build-out, permitting, and staffing. Plan for the timeline that matches your model.',
      },
    },
    {
      '@type': 'Question',
      name: 'What software do I need to run a pet grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You need grooming-specific software that handles appointment scheduling, client and pet profiles, automated reminders (SMS and email), payment processing with deposits, and business reporting. GroomGrid provides all of these in one platform built for groomers, starting at $29/month with a 14-day free trial.',
      },
    },
  ],
};

const businessModels = [
  {
    icon: '🏠',
    model: 'Home-Based',
    cost: '$2,000–$8,000',
    revenue: '$40K–$75K/year',
    margin: '60–70%',
    best: 'Solo groomers who want low risk and high margins. Works well in suburban areas with good zoning.',
  },
  {
    icon: '🚐',
    model: 'Mobile Grooming',
    cost: '$30K–$80K',
    revenue: '$60K–$120K/year',
    margin: '60–75%',
    best: 'Groomers who value flexibility and command premium pricing. Best in suburban/rural areas with low drive density.',
  },
  {
    icon: '🏪',
    model: 'Retail Salon',
    cost: '$50K–$150K+',
    revenue: '$100K–$300K+/year',
    margin: '30–40%',
    best: 'Groomers ready to build a team. Higher revenue ceiling but higher overhead and management complexity.',
  },
];

export default function HowToOpenAPetGroomingBusinessPage() {
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
              <li>
                <Link href="/blog/" className="hover:text-green-600 transition-colors">Blog</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">
                How to Open a Pet Grooming Business
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Business Guide · Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            How to Open a Pet Grooming<br className="hidden sm:block" /> Business in 2026
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Opening a pet grooming business is more than buying shears and booking dogs. You need a
            business model, a location strategy, licensing, insurance, equipment, a pricing
            structure, and systems to manage it all. This guide covers every piece — in the order
            you actually need them.
          </p>
        </header>

        {/* ── Choosing Your Model ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Choose Your Business Model First
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Every decision that follows — location, equipment, staffing, pricing — depends on
              your business model. There are three main paths:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {businessModels.map((model) => (
                <div
                  key={model.model}
                  className="p-5 rounded-xl border border-stone-200 bg-white hover:border-green-300 hover:shadow-md transition-all"
                >
                  <span className="text-3xl mb-3 block">{model.icon}</span>
                  <p className="font-bold text-stone-800 text-lg mb-1">{model.model}</p>
                  <p className="text-stone-500 text-sm mb-2">Startup: <span className="text-green-600 font-semibold">{model.cost}</span></p>
                  <p className="text-stone-500 text-sm mb-2">Revenue: <span className="font-semibold">{model.revenue}</span></p>
                  <p className="text-stone-500 text-sm mb-3">Margin: <span className="font-semibold">{model.margin}</span></p>
                  <p className="text-stone-600 text-sm leading-relaxed">{model.best}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Business Plan ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Writing Your Pet Grooming Business Plan
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            You do not need a 40-page document. You need clarity on seven things:
          </p>
          <div className="space-y-4 mb-6">
            {[
              'Business model — home, mobile, or retail',
              'Target market — what breeds, what area, what price point',
              'Startup costs — equipment, licensing, insurance, marketing, and 3 months of operating cash',
              'Revenue model — per-groom pricing, packages, subscriptions',
              'Competitive landscape — who else is grooming in your area and at what price',
              'Marketing plan — how you will get your first 20 clients',
              'Systems — what software will run your scheduling, reminders, and payments',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold text-lg">{i + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-stone-600 leading-relaxed">
            If you are not seeking a loan, a one-page plan covering these seven items is sufficient.
            The act of writing it forces you to think through the numbers — which is where most
            new grooming businesses either succeed or quietly fail.
          </p>
        </section>

        {/* ── Licensing & Insurance ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Licensing, Permits, and Insurance
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Requirements vary by state and municipality, but here is what you will almost
              certainly need:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Business license — required in virtually every jurisdiction. Usually $50–$200/year.',
                'DBA registration — if your business name differs from your legal name. $10–$100.',
                'Sales tax permit — if your state taxes grooming services (most do not, but check).',
                'Kennel or animal care permit — some cities require this for any business handling animals. $50–$300.',
                'Sign permit — if you plan to put up a sign at a retail location.',
                'General liability insurance — covers property damage and injuries. $150–$350/year.',
                'Professional liability (care, custody, and control) — covers injuries to animals in your care. $100–$250/year.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed">
              Budget $400–$800/year for all licensing and insurance combined. It is not optional — a
              single incident without insurance can wipe out a year of income.
            </p>
          </div>
        </section>

        {/* ── Location ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Choosing a Location for Your Grooming Business
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            If you are going mobile, your &quot;location&quot; is your van — and the decision is which
            neighborhoods to serve. If you are opening a retail salon, location is the single
            biggest cost and success factor.
          </p>
          <div className="space-y-6">
            {[
              {
                q: 'For mobile groomers',
                a: 'Target suburban areas with medium-to-high pet ownership density. Rural routes work but drive time eats profit. Use Google Maps to plan cluster routes — groom 2–3 dogs in the same neighborhood on the same day to maximize revenue per hour of driving.',
              },
              {
                q: 'For retail salons',
                a: 'Look for locations on high-traffic roads near veterinary offices, pet stores, or residential neighborhoods. Visibility matters — a grooming salon with good signage and parking is its own marketing. Budget $1,500–$4,000/month for rent in most metro areas.',
              },
              {
                q: 'For home-based groomers',
                a: 'Your home is your location. The key constraint is zoning — verify it before investing. The advantage is zero rent. The challenge is parking and client access. Make sure clients can get to your grooming area without walking through your living space.',
              },
            ].map((item) => (
              <div key={item.q} className="border-l-4 border-green-400 pl-5">
                <p className="font-bold text-stone-800 mb-2">{item.q}</p>
                <p className="text-stone-600 leading-relaxed text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Staffing ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Staffing Your Grooming Business
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Solo groomers do not need staff. But if you are opening a salon, you will need at
              least one bather and potentially a second groomer within the first 6 months.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Common staffing models:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Commission-based — groomer keeps 50–60% of each groom. No guaranteed income, but no payroll risk for you.',
                'Hourly plus commission — base hourly ($12–$18/hr) plus 10–20% commission. More stable for employees, more predictable for scheduling.',
                'Booth rental — groomers rent a station for $200–$500/week and keep 100% of revenue. Best for experienced groomers with their own clientele.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold mt-0.5">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed">
              However you structure it, make sure scheduling software handles multi-groomer
              calendars. Managing staff schedules with a paper book is a fast track to double
              bookings and unhappy clients.
            </p>
          </div>
        </section>

        {/* ── Software ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Software: The Operating System for Your Grooming Business
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Grooming software is not optional — it is how you run the business without chaos. The
            right platform handles five things that paper and spreadsheets cannot:
          </p>
          <div className="space-y-8">
            {[
              { icon: '📅', title: 'Scheduling', description: 'Visual calendar with drag-and-drop, recurring bookings, and multi-groomer views. No more double bookings or forgotten appointments.' },
              { icon: '🔔', title: 'Automated Reminders', description: 'SMS and email reminders sent automatically at 72 hours, 24 hours, and 2 hours before each appointment. Reduces no-shows by 40–60%.' },
              { icon: '🐕', title: 'Client & Pet Profiles', description: 'Full records for every client and pet — breed, size, behavior notes, vaccination status, service history. Institutional memory for your business.' },
              { icon: '💳', title: 'Payments & Deposits', description: 'Collect deposits at booking, accept card payments at checkout, and send invoices. Eliminates chasing payments and awkward money conversations.' },
              { icon: '📊', title: 'Business Reporting', description: 'Revenue, appointments, no-show rates, and client retention metrics. The numbers you need to make decisions instead of guesses.' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-5 p-6 rounded-xl border border-stone-200 hover:border-green-300 transition-all">
                <span className="text-3xl flex-shrink-0">{feature.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
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

        {/* ── Bottom CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Open your grooming business with the right systems from day one
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed max-w-xl mx-auto">
              GroomGrid handles scheduling, reminders, payments, and client records — so you can
              focus on building the business. Try it free for 14 days, no credit card required.
            </p>
            <Link
              href="/signup?coupon=BETA50"
              className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors shadow-md inline-block"
            >
              Try GroomGrid Free →
            </Link>
            <p className="text-green-200 text-sm mt-4">14-day free trial · No credit card required</p>
          </div>
        </section>

        {/* ── Related Articles ── */}
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-stone-800 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/blog/how-to-start-a-mobile-dog-grooming-business"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Mobile Business</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">
                How to Start a Mobile Dog Grooming Business: The Complete Guide
              </h3>
            </Link>
            <Link
              href="/blog/how-much-to-start-dog-grooming-business"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Startup Costs</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">
                How Much Does It Cost to Start a Dog Grooming Business?
              </h3>
            </Link>
            <Link
              href="/blog/is-dog-grooming-a-profitable-business"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Profitability</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">
                Is Dog Grooming a Profitable Business? Real Numbers, Real Talk
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
              <Link href="/grooming-business-operations/" className="hover:text-stone-600 transition-colors">
                Operations Hub
              </Link>
              <Link href="/mobile-grooming-business/" className="hover:text-stone-600 transition-colors">
                Mobile Grooming
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
