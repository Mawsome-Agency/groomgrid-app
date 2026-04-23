import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'How to Increase Sales in Your Dog Grooming Business: 8 Proven Strategies | GroomGrid',
  description:
    'Increase revenue in your dog grooming business without adding more appointments. Learn upselling, service packages, rebooking strategies, and the operational changes that drive growth.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/how-to-increase-sales-dog-grooming-business',
  },
  openGraph: {
    title: 'How to Increase Sales in Your Dog Grooming Business: 8 Proven Strategies',
    description:
      'Increase revenue in your dog grooming business without adding more appointments. Learn upselling, service packages, rebooking strategies, and the operational changes that drive growth.',
    url: 'https://getgroomgrid.com/blog/how-to-increase-sales-dog-grooming-business',
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
      name: 'How to Increase Sales in Your Dog Grooming Business',
      item: 'https://getgroomgrid.com/blog/how-to-increase-sales-dog-grooming-business',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Increase Sales in Your Dog Grooming Business: 8 Proven Strategies',
  description:
    'Increase revenue in your dog grooming business without adding more appointments. Learn upselling, service packages, rebooking strategies, and the operational changes that drive growth.',
  url: 'https://getgroomgrid.com/blog/how-to-increase-sales-dog-grooming-business',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/how-to-increase-sales-dog-grooming-business',
  },
};

export default function HowToIncreaseSalesDogGroomingPage() {
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
              <li className="text-stone-700 font-medium" aria-current="page">How to Increase Sales</li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Business Growth
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            How to Increase Sales in Your<br className="hidden sm:block" /> Dog Grooming Business
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Growing your grooming revenue doesn&apos;t always mean booking more appointments. Often the
            fastest path to more income is getting more out of the clients and schedule you already have.
            Here are 8 strategies that work.
          </p>
        </header>

        {/* ── The Revenue Equation ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">The Grooming Revenue Equation</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Revenue = (number of appointments) × (average revenue per appointment). Most groomers
              focus entirely on the first variable — getting more bookings. But increasing average
              revenue per appointment is often faster, easier, and more profitable.
            </p>
            <p className="text-stone-600 leading-relaxed">
              If you currently do 20 appointments per week at $60 average, that&apos;s $1,200/week.
              Raise average revenue by $15 through add-ons and better pricing, and you&apos;re at
              $1,500/week without seeing one extra dog. That&apos;s $15,600 more per year.
            </p>
          </div>
        </section>

        {/* ── Strategy 1: Add-Ons ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">1. Introduce High-Margin Add-On Services</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Add-ons take minimal extra time but command a meaningful price premium. The best add-ons
            solve a real problem for the pet or provide noticeable value owners can see.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { service: 'Teeth brushing', price: '$10–$20', time: '5 min' },
              { service: 'Nail grinding (after clipping)', price: '$10–$15', time: '5 min' },
              { service: 'Blueberry facial / eye treatment', price: '$10–$20', time: '5 min' },
              { service: 'Conditioning treatment (deep)', price: '$15–$30', time: '10 min' },
              { service: 'Ear cleaning', price: '$10–$15', time: '5 min' },
              { service: 'Paw balm application', price: '$8–$15', time: '3 min' },
              { service: 'Deshedding treatment', price: '$20–$50', time: '15-30 min' },
              { service: 'Bandana / bow', price: '$5–$10', time: '2 min' },
            ].map(({ service, price, time }) => (
              <div key={service} className="flex justify-between items-center p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div>
                  <p className="font-semibold text-stone-800">{service}</p>
                  <p className="text-xs text-stone-500">{time}</p>
                </div>
                <span className="text-green-600 font-bold text-sm">{price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Strategy 2: Packages ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">2. Bundle Services into Packages</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Packages increase average ticket size and give clients a sense of value. Instead of selling
              individual services, create tiered packages that make a clear premium option obvious.
            </p>
            <div className="space-y-4">
              {[
                {
                  name: 'Basic Groom',
                  price: '$55–$80',
                  includes: 'Bath, blow dry, brush, nail clip, ear clean',
                },
                {
                  name: 'Full Groom',
                  price: '$75–$110',
                  includes: 'Basic groom + haircut/trim, teeth brushing, bandana',
                },
                {
                  name: 'Spa Package',
                  price: '$110–$160',
                  includes: 'Full groom + conditioning treatment, paw balm, blueberry facial',
                },
              ].map(({ name, price, includes }) => (
                <div key={name} className="p-5 bg-white rounded-xl border border-stone-200">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-stone-800 text-lg">{name}</p>
                    <span className="text-green-600 font-bold">{price}</span>
                  </div>
                  <p className="text-stone-600 text-sm">{includes}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Strategy 3: Rebooking ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">3. Rebook at Checkout (Every Time)</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            The easiest new appointment to fill is the next one for a client you already have. When a
            client picks up their dog, that&apos;s the highest-value moment to suggest the next visit.
            Most clients will say yes — they just need the prompt.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <p className="font-semibold text-stone-800 mb-2">Script that works:</p>
            <p className="text-stone-600 italic">
              &ldquo;For a Labradoodle like Max, I usually recommend coming back every 6–8 weeks to
              keep the coat manageable. Want me to pencil in [specific date] now so you have a spot
              locked in?&rdquo;
            </p>
          </div>
          <p className="text-stone-600 leading-relaxed mt-4">
            Groomers who rebook at checkout consistently run 20–30% higher utilization than those who
            rely on clients to initiate. Combine this with{' '}
            <Link
              href="/blog/reduce-no-shows-dog-grooming"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              automated reminders to reduce no-shows
            </Link>{' '}
            and you build a reliable, full schedule.
          </p>
        </section>

        {/* ── More Strategies ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">4–8. More Proven Revenue Tactics</h2>
            <div className="space-y-6">
              {[
                {
                  num: '4',
                  title: 'Raise your prices — selectively',
                  body: 'Audit your service menu annually. If you haven\'t raised prices in 2 years, you\'re likely undercharging. Start by raising rates on your most time-intensive services (large breed full grooms, Doodle haircuts). Loyal clients will rarely leave over a $10–$15 increase.',
                },
                {
                  num: '5',
                  title: 'Charge appropriately for difficult dogs',
                  body: 'A matted coat or anxious dog takes significantly more time. Implement a "condition surcharge" that adds $15–$50 for coats that require extra work. Communicate it clearly upfront — most clients understand and respect it.',
                },
                {
                  num: '6',
                  title: 'Sell retail products',
                  body: 'Clients trust your product recommendations. A small retail section with shampoos, conditioners, brushes, and paw care products can add $50–$200 of passive revenue per week with zero additional labor. Stock what you personally use and recommend.',
                },
                {
                  num: '7',
                  title: 'Referral program',
                  body: 'Your happiest clients are your best marketing channel. A simple "refer a friend, get $15 off your next groom" drives consistent new client acquisition at a much lower cost than advertising.',
                },
                {
                  num: '8',
                  title: 'Recurring appointment subscriptions',
                  body: 'Offer a monthly or quarterly subscription plan that locks in a discount for pre-committed appointments. Clients pay slightly less per groom; you get predictable revenue and a guaranteed full schedule.',
                },
              ].map(({ num, title, body }) => (
                <div key={num} className="flex gap-5 p-5 bg-white rounded-xl border border-stone-200">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center">
                    {num}
                  </div>
                  <div>
                    <p className="font-bold text-stone-800 mb-2">{title}</p>
                    <p className="text-stone-600 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Conclusion ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Where to Start</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Don&apos;t try to implement all 8 strategies at once. Pick the one with the lowest friction
            and highest expected return for your specific business. For most groomers, that&apos;s either
            introducing 2-3 add-ons or implementing consistent rebooking at checkout.
          </p>
          <p className="text-stone-600 leading-relaxed">
            For the financial picture of what a profitable grooming business looks like, read our deep
            dive on{' '}
            <Link
              href="/blog/is-dog-grooming-a-profitable-business"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              whether dog grooming is actually a profitable business
            </Link>
            .
          </p>
        </section>

        {/* ── Signup CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              The right software makes every strategy easier
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              GroomGrid automates rebooking reminders, tracks client preferences, and makes
              collecting deposits effortless — so more of your revenue strategies actually happen.
              Try it free with 50% off your first month.
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
