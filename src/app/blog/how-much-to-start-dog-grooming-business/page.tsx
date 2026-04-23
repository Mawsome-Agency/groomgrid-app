import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'How Much Does It Cost to Start a Dog Grooming Business? | GroomGrid',
  description:
    'Detailed cost breakdown to start a dog grooming business in 2026 — equipment, licensing, insurance, marketing, and software. Includes home salon, mobile, and retail location estimates.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/how-much-to-start-dog-grooming-business',
  },
  openGraph: {
    title: 'How Much Does It Cost to Start a Dog Grooming Business?',
    description:
      'Detailed cost breakdown to start a dog grooming business in 2026 — equipment, licensing, insurance, marketing, and software. Includes home salon, mobile, and retail location estimates.',
    url: 'https://getgroomgrid.com/blog/how-much-to-start-dog-grooming-business',
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
      name: 'How Much to Start a Dog Grooming Business',
      item: 'https://getgroomgrid.com/blog/how-much-to-start-dog-grooming-business',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How Much Does It Cost to Start a Dog Grooming Business?',
  description:
    'Detailed cost breakdown to start a dog grooming business in 2026 — equipment, licensing, insurance, marketing, and software. Includes home salon, mobile, and retail location estimates.',
  url: 'https://getgroomgrid.com/blog/how-much-to-start-dog-grooming-business',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/how-much-to-start-dog-grooming-business',
  },
};

export default function HowMuchToStartDogGroomingBusinessPage() {
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
              <li><Link href="/" className="hover:text-green-600 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="hover:text-green-600 transition-colors">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">Startup Costs</li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Startup Costs
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            How Much Does It Cost to<br className="hidden sm:block" /> Start a Dog Grooming Business?
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            The honest answer: anywhere from $2,000 to $100,000+ depending on the model you choose.
            Here&apos;s the complete breakdown — equipment, licensing, insurance, marketing — so you can
            plan accurately and start without surprises.
          </p>
        </header>

        {/* ── Three Models ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">The Three Grooming Business Models</h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Your startup costs depend almost entirely on which model you choose. Each has different
              overhead, income potential, and scalability.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { model: 'Home Salon', range: '$2,000–$8,000', note: 'Lowest startup cost. Clients come to you. Limited by zoning, space, and local regulations.' },
                { model: 'Mobile Van', range: '$15,000–$65,000', note: 'Higher startup, premium pricing. Travel to clients. Fuel and maintenance are ongoing costs.' },
                { model: 'Retail Location', range: '$30,000–$150,000', note: 'Highest startup but maximum capacity. Lease, buildout, equipment, and staff costs.' },
              ].map(({ model, range, note }) => (
                <div key={model} className="p-5 bg-white rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-800 text-lg mb-1">{model}</p>
                  <p className="text-green-600 font-bold text-xl mb-3">{range}</p>
                  <p className="text-stone-500 text-sm">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Equipment Costs ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Equipment Costs (All Models)</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Equipment is your largest upfront cost. Quality matters — cheap clippers and dryers wear out
            quickly and cost more over time. Invest in professional-grade tools from the start.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-stone-100">
                  <th className="text-left p-3 font-semibold text-stone-700 border border-stone-200">Item</th>
                  <th className="text-left p-3 font-semibold text-stone-700 border border-stone-200">Budget</th>
                  <th className="text-left p-3 font-semibold text-stone-700 border border-stone-200">Professional</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Clippers (2)', '$200–$400', '$500–$800'],
                  ['Blade set (complete)', '$100–$200', '$200–$400'],
                  ['Shear set (4–6 pairs)', '$300–$600', '$700–$1,500'],
                  ['High-velocity dryer', '$200–$350', '$400–$600'],
                  ['Stand dryer', '$150–$250', '$300–$500'],
                  ['Grooming table (hydraulic)', '$400–$600', '$800–$1,500'],
                  ['Bathing tub/station', '$200–$500', '$500–$1,500'],
                  ['Brushes, combs, tools', '$100–$200', '$250–$500'],
                  ['Shampoos & supplies (monthly)', '$50–$100', '$100–$200'],
                ].map(([item, budget, pro]) => (
                  <tr key={item} className="even:bg-stone-50">
                    <td className="p-3 border border-stone-200 font-medium text-stone-700">{item}</td>
                    <td className="p-3 border border-stone-200 text-stone-600">{budget}</td>
                    <td className="p-3 border border-stone-200 text-green-700 font-medium">{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Licensing and Legal ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Licensing, Legal, and Insurance</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Costs vary significantly by state and city. Use these as planning estimates — verify
              your specific requirements with your state licensing board.
            </p>
            <div className="space-y-3">
              {[
                { item: 'Business entity formation (LLC)', cost: '$50–$500', note: 'One-time state filing fee; legal protection worth it' },
                { item: 'Business license', cost: '$50–$200/yr', note: 'Required in most municipalities' },
                { item: 'State grooming license', cost: '$50–$200', note: 'Some states require formal certification' },
                { item: 'General liability insurance', cost: '$500–$1,500/yr', note: 'Covers injuries, property damage claims' },
                { item: 'Commercial auto insurance (mobile)', cost: '$1,200–$3,000/yr', note: 'Required if operating from a van' },
                { item: 'Care, custody & control coverage', cost: '$200–$600/yr', note: 'Covers dogs in your care — often required by clients' },
              ].map(({ item, cost, note }) => (
                <div key={item} className="flex gap-4 items-start p-4 bg-white rounded-lg border border-stone-200">
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800">{item}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{note}</p>
                  </div>
                  <span className="text-green-600 font-bold text-sm whitespace-nowrap">{cost}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Marketing ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Marketing and Launch Costs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { item: 'Logo + branding (basic)', cost: '$200–$800' },
              { item: 'Website (DIY vs agency)', cost: '$0–$3,000' },
              { item: 'Google Business Profile', cost: 'Free' },
              { item: 'Business cards (500)', cost: '$30–$80' },
              { item: 'Social media setup', cost: 'Free' },
              { item: 'Paid ads (first 3 months)', cost: '$300–$1,000' },
            ].map(({ item, cost }) => (
              <div key={item} className="flex justify-between p-4 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-stone-700 font-medium">{item}</span>
                <span className="text-green-600 font-bold text-sm">{cost}</span>
              </div>
            ))}
          </div>
          <p className="text-stone-600 leading-relaxed">
            Most groomers underinvest in marketing at launch and then wonder why the first 3 months are
            slow. Allocate at least $500–$1,000 for your launch push — it compounds into word-of-mouth
            referrals faster than organic growth alone.
          </p>
        </section>

        {/* ── Summary ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Total Startup Cost Summary</h2>
            <div className="space-y-4">
              {[
                { model: 'Home Salon (lean)', total: '$2,000–$5,000', items: 'Basic equipment, license, liability insurance, simple marketing' },
                { model: 'Home Salon (well-equipped)', total: '$5,000–$10,000', items: 'Professional equipment, LLC, full insurance, website, launch marketing' },
                { model: 'Mobile Van (used van)', total: '$15,000–$35,000', items: 'Used van conversion, full equipment, commercial auto insurance, launch' },
                { model: 'Mobile Van (new van)', total: '$45,000–$75,000', items: 'New custom van, professional equipment, full insurance and marketing budget' },
                { model: 'Retail Location', total: '$50,000–$150,000+', items: 'Lease, buildout, full equipment, staff, insurance, marketing, working capital' },
              ].map(({ model, total, items }) => (
                <div key={model} className="p-5 bg-white rounded-xl border border-stone-200">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-stone-800">{model}</p>
                    <span className="text-green-600 font-bold">{total}</span>
                  </div>
                  <p className="text-stone-500 text-sm">{items}</p>
                </div>
              ))}
            </div>
            <p className="text-stone-600 leading-relaxed mt-6">
              To understand what you can earn once you&apos;re running, read our complete breakdown of{' '}
              <Link
                href="/blog/is-dog-grooming-a-profitable-business"
                className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
              >
                grooming business profitability
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── Signup CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              One startup cost that pays for itself fast
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              GroomGrid handles your bookings, reminders, deposits, and client records from day one.
              Prevent a single no-show and it&apos;s paid for. Try it free with 50% off your first month.
            </p>
            <Link
              href="/signup?coupon=BETA50"
              className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors shadow-md inline-block"
            >
              Start Free Trial →
            </Link>
          </div>
        </section>

        {/* ── Related Articles ── */}
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-stone-800 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/blog/is-dog-grooming-a-profitable-business"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Business</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors">
                Is Dog Grooming a Profitable Business? Real Numbers, Real Talk
              </h3>
            </Link>
            <Link
              href="/blog/dog-grooming-tools-equipment-list"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Equipment</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors">
                Dog Grooming Tools &amp; Equipment List: The Complete Professional Checklist
              </h3>
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-6 py-8 max-w-5xl mx-auto border-t border-stone-100 mt-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
            <Link href="/" className="font-bold text-green-600">GroomGrid 🐾</Link>
            <div className="flex gap-6">
              <Link href="/grooming-business-operations/" className="hover:text-stone-600 transition-colors">Operations Hub</Link>
              <Link href="/mobile-grooming-business/" className="hover:text-stone-600 transition-colors">Mobile Grooming</Link>
              <Link href="/plans" className="hover:text-stone-600 transition-colors">Pricing</Link>
              <Link href="/signup?coupon=BETA50" className="hover:text-stone-600 transition-colors">Sign Up</Link>
            </div>
            <p>© {new Date().getFullYear()} GroomGrid. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
