import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Is Dog Grooming a Profitable Business? Real Numbers, Real Talk | GroomGrid',
  description:
    'Dog grooming can be highly profitable — but only if the numbers work. Here\'s the real breakdown: revenue potential, expenses, margins, and what it takes to actually make money grooming dogs.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/is-dog-grooming-a-profitable-business',
  },
  openGraph: {
    title: 'Is Dog Grooming a Profitable Business? Real Numbers, Real Talk',
    description:
      'Dog grooming can be highly profitable — but only if the numbers work. Here\'s the real breakdown: revenue potential, expenses, margins, and what it takes to actually make money grooming dogs.',
    url: 'https://getgroomgrid.com/blog/is-dog-grooming-a-profitable-business',
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
      name: 'Blog',
      item: 'https://getgroomgrid.com/blog',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Is Dog Grooming a Profitable Business?',
      item: 'https://getgroomgrid.com/blog/is-dog-grooming-a-profitable-business',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Is Dog Grooming a Profitable Business? Real Numbers, Real Talk',
  description:
    'Dog grooming can be highly profitable — but only if the numbers work. Here\'s the real breakdown: revenue potential, expenses, margins, and what it takes to actually make money grooming dogs.',
  url: 'https://getgroomgrid.com/blog/is-dog-grooming-a-profitable-business',
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
    '@id': 'https://getgroomgrid.com/blog/is-dog-grooming-a-profitable-business',
  },
};

export default function IsDogGroomingProfitableBusinessPage() {
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
                <Link href="/grooming-business-operations/" className="hover:text-green-600 transition-colors">
                  Operations
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">
                Is It Profitable?
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Business Finance
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Is Dog Grooming a Profitable Business?<br className="hidden sm:block" /> Real Numbers, Real Talk
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Short answer: yes — but only if you run it right. Dog grooming is one of the more
            recession-resistant small businesses you can own. People keep grooming their dogs even
            when budgets tighten. But &quot;can be profitable&quot; and &quot;will be profitable&quot;
            are two different things. Here&apos;s the honest breakdown.
          </p>
        </header>

        {/* ── Industry Context ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              The Pet Grooming Industry: A Growing Market
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              The US pet grooming industry generates over $11 billion annually and has grown
              consistently for the past decade. Pet ownership surged during and after the pandemic,
              and many of those new pet owners are now recurring grooming customers.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              More importantly for individual groomers: most grooming businesses are local, and
              local demand is largely supply-constrained. In most mid-size markets, a good groomer
              with a solid reputation stays fully booked. The barrier isn&apos;t finding customers —
              it&apos;s having the capacity and systems to serve them profitably.
            </p>
            <p className="text-stone-600 leading-relaxed">
              The market is there. The question is whether your specific business model captures it.
            </p>
          </div>
        </section>

        {/* ── Revenue Numbers ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            The Revenue Numbers: What Can You Actually Earn?
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            Let&apos;s run the numbers for a solo groomer operating full-time.
          </p>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-stone-800 mb-4">Solo Groomer — Revenue Scenario</h3>
            <div className="space-y-3">
              {[
                { label: 'Dogs per day', value: '6–8' },
                { label: 'Working days per week', value: '5' },
                { label: 'Average service price', value: '$65–$90' },
                { label: 'Dogs per week', value: '30–40' },
                { label: 'Gross weekly revenue', value: '$1,950–$3,600' },
                { label: 'Gross annual revenue', value: '$100,000–$185,000' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-stone-200 last:border-0">
                  <span className="text-stone-600">{label}</span>
                  <span className="font-semibold text-stone-800">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-stone-500 mt-4">
              Prices vary significantly by market, breed mix, and service complexity. These are
              national midpoints — coastal markets skew higher.
            </p>
          </div>

          <p className="text-stone-600 leading-relaxed">
            $100K–$185K gross sounds great. But gross revenue is not profit. Let&apos;s look at
            what comes out.
          </p>
        </section>

        {/* ── Expense Breakdown ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              The Expense Reality: Where the Money Goes
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Here&apos;s a realistic expense breakdown for a solo groomer operating from a
              standalone salon location:
            </p>
            <div className="space-y-3 mb-6">
              {[
                { category: 'Rent / lease', range: '$800–$2,500/mo', note: 'Highly location-dependent' },
                { category: 'Supplies (shampoo, blades, tools)', range: '$300–$600/mo', note: 'Scales with volume' },
                { category: 'Equipment maintenance & replacement', range: '$100–$300/mo', note: 'Clippers, dryers, tubs' },
                { category: 'Insurance (general liability)', range: '$75–$200/mo', note: 'Non-negotiable' },
                { category: 'Software & booking tools', range: '$30–$150/mo', note: 'Pays for itself in time saved' },
                { category: 'Marketing', range: '$50–$300/mo', note: 'Lower once established' },
                { category: 'Self-employment taxes', range: '25–30% of net', note: 'Set aside from day one' },
              ].map(({ category, range, note }) => (
                <div key={category} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-stone-200 gap-2">
                  <div>
                    <p className="font-semibold text-stone-800">{category}</p>
                    <p className="text-sm text-stone-500">{note}</p>
                  </div>
                  <span className="text-green-600 font-semibold whitespace-nowrap">{range}</span>
                </div>
              ))}
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-stone-700 font-semibold mb-1">Net margin reality check</p>
              <p className="text-stone-600">
                After expenses, a well-run solo grooming salon typically nets 35–55% of gross
                revenue. On $130K gross, that&apos;s $45K–$70K take-home before self-employment tax.
                Not glamorous, but solid — and it scales.
              </p>
            </div>
          </div>
        </section>

        {/* ── Mobile vs Salon ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Mobile Grooming vs. Salon: Which Is More Profitable?
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            Both models can be highly profitable. The math is different.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="p-6 border border-stone-200 rounded-xl">
              <h3 className="text-lg font-bold text-stone-800 mb-3">🏠 Salon Model</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li>✓ Higher volume (6–10 dogs/day)</li>
                <li>✓ Can hire additional groomers</li>
                <li>✓ Walk-in and impulse business possible</li>
                <li>✗ Higher fixed costs (rent, utilities)</li>
                <li>✗ Commute friction for some clients</li>
              </ul>
            </div>
            <div className="p-6 border border-stone-200 rounded-xl">
              <h3 className="text-lg font-bold text-stone-800 mb-3">🚐 Mobile Model</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li>✓ Premium pricing ($20–$40 more per groom)</li>
                <li>✓ Low overhead (no rent)</li>
                <li>✓ One-on-one attention clients love</li>
                <li>✗ Lower volume (4–6 dogs/day max)</li>
                <li>✗ Vehicle costs and fuel add up</li>
              </ul>
            </div>
          </div>
          <p className="text-stone-600 leading-relaxed">
            Mobile groomers often clear better margins on fewer appointments because premium
            pricing offsets the volume cap. Salons have higher ceiling revenue but also higher
            baseline costs. Both work — choose based on your lifestyle and market. For more on
            the mobile side, see our{' '}
            <Link
              href="/mobile-grooming-business/"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              mobile grooming business guide
            </Link>
            .
          </p>
        </section>

        {/* ── What Tanks Profitability ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              What Kills Profitability in Grooming Businesses
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Most grooming businesses that struggle aren&apos;t failing because of the market —
              they&apos;re failing because of operational leaks. Here&apos;s what to watch:
            </p>
            <div className="space-y-4">
              {[
                {
                  problem: 'No-shows with no deposit policy',
                  impact:
                    'One no-show per week = $3,000–$5,000 in lost annual revenue. Fix it with a deposit requirement and a clear cancellation policy.',
                },
                {
                  problem: 'Underpriced services',
                  impact:
                    'If you haven&apos;t raised prices in 2+ years, you&apos;re almost certainly losing ground to inflation. Run your numbers — don&apos;t guess.',
                },
                {
                  problem: 'Poor scheduling efficiency',
                  impact:
                    'Gaps between appointments, poorly matched service durations, and overbooking all reduce throughput. A 30-minute gap every day is 2+ hours of lost revenue per week.',
                },
                {
                  problem: 'No rebooking system',
                  impact:
                    'A client who doesn&apos;t rebook after 8 weeks is probably not coming back. Automated follow-ups recapture this revenue passively.',
                },
                {
                  problem: 'Manual admin consuming paid hours',
                  impact:
                    'Every hour you spend on scheduling, reminders, and invoicing is an hour you&apos;re not billing. Automation pays for itself within weeks.',
                },
              ].map(({ problem, impact }) => (
                <div key={problem} className="p-5 bg-white rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-800 mb-2">⚠ {problem}</p>
                  <p className="text-stone-600 text-sm leading-relaxed">{impact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How to Maximize Profit ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            How to Maximize Grooming Profit Without Working More Hours
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            The groomers who build genuinely profitable businesses aren&apos;t necessarily working
            more — they&apos;re working smarter. Here&apos;s the playbook:
          </p>
          <div className="space-y-4">
            {[
              {
                icon: '💰',
                title: 'Price for your cost structure, not your competition',
                body: 'Know your break-even per appointment. Price above it with margin to spare. Review twice a year.',
              },
              {
                icon: '📅',
                title: 'Protect every appointment slot',
                body: 'Require deposits for new clients and high-value time slots. Use a cancellation policy with teeth.',
              },
              {
                icon: '🔄',
                title: 'Automate reminders and rebooking',
                body: 'Automated appointment reminders cut no-shows. Automated rebooking nudges keep regulars on cycle.',
              },
              {
                icon: '➕',
                title: 'Add profitable upsells',
                body: 'Teeth brushing, ear cleaning, nail grinding, de-shedding treatments — high-margin services that add 10–20 minutes per appointment.',
              },
              {
                icon: '⚙️',
                title: 'Cut admin time with the right tools',
                body: 'An hour saved on scheduling and reminders is an extra appointment you can take. Compound that across a year.',
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex gap-4 p-5 border border-stone-200 rounded-xl">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-bold text-stone-800 mb-1">{title}</p>
                  <p className="text-stone-600 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-stone-600 leading-relaxed mt-6">
            For a comprehensive look at how to implement these systems, read our guide on{' '}
            <Link
              href="/blog/dog-grooming-business-management"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              dog grooming business management
            </Link>
            .
          </p>
        </section>

        {/* ── Conclusion ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              The Verdict: Yes — If You Run It Like a Business
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Dog grooming is profitable. The market is growing, demand outstrips supply in most
              markets, and the services are genuinely recession-resistant. A solo groomer who
              operates efficiently can clear $50K–$80K after expenses. A small salon with two or
              three groomers can generate well over $300K in gross revenue.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              The groomers who don&apos;t make money aren&apos;t losing to the market — they&apos;re
              losing to no-shows, underpricing, and admin overhead. Fix those three things and the
              fundamentals of grooming profitability work in your favor.
            </p>
            <p className="text-stone-600 leading-relaxed">
              The business is there to be built. The question is whether you have the systems to
              capture it.
            </p>
          </div>
        </section>

        {/* ── Signup CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Ready to streamline your grooming business?
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              GroomGrid handles scheduling, reminders, payments, and client records in one simple
              platform. Try it free for 14 days — no credit card required.
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
              href="/blog/dog-grooming-business-management"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Business Management</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors">
                Dog Grooming Business Management: The Complete Guide
              </h3>
            </Link>
            <Link
              href="/blog/dog-grooming-contract-template"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Templates</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors">
                Dog Grooming Contract Template: What to Include and Why
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
