import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { BOFUAnalyticsWrapper } from '@/components/analytics/BOFUAnalyticsWrapper';

export const metadata: Metadata = {
  title: 'Mobile Grooming Business: Complete Guide to Starting & Growing | GroomGrid',
  description:
    'Everything you need to start, run, and grow a mobile dog grooming business — business plan, route optimization, pricing strategy, and the tools that make it work.',
  alternates: {
    canonical: 'https://getgroomgrid.com/mobile-grooming-business',
  },
  openGraph: {
    title: 'Mobile Grooming Business: Complete Guide to Starting & Growing',
    description:
      'Everything you need to start, run, and grow a mobile dog grooming business — business plan, route optimization, pricing strategy, and the tools that make it work.',
    url: 'https://getgroomgrid.com/mobile-grooming-business',
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
      name: 'Mobile Grooming Business',
      item: 'https://getgroomgrid.com/mobile-grooming-business',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Mobile Grooming Business: Complete Guide to Starting & Growing',
  description:
    'Everything you need to start, run, and grow a mobile dog grooming business — business plan, route optimization, pricing strategy, and the tools that make it work.',
  url: 'https://getgroomgrid.com/mobile-grooming-business',
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
    '@id': 'https://getgroomgrid.com/mobile-grooming-business',
  },
};

const topics = [
  {
    title: 'Mobile Grooming Business Plan',
    description:
      'How to write a business plan that actually helps you launch and scale — startup costs, revenue projections, service area mapping, and the financials mobile groomers need to know.',
    href: '/blog/mobile-dog-grooming-business-plan',
    icon: '📋',
  },
  {
    title: 'Route Optimization',
    description:
      'Stop wasting hours and gas money zig-zagging across town. Smart route planning can add 1-2 more dogs per day to your schedule without working longer hours.',
    href: '/blog/how-to-start-mobile-grooming-business',
    icon: '🗺️',
  },
  {
    title: 'Pricing Your Mobile Services',
    description:
      'How to price for profitability as a mobile groomer — factoring in van costs, drive time, service area surcharges, and what the market will bear in your zip code.',
    href: '/blog/mobile-dog-grooming-business-plan',
    icon: '💲',
  },
  {
    title: 'Mobile Grooming Startup Guide',
    description:
      'The step-by-step checklist for launching your mobile grooming business: licensing, insurance, equipment, your first clients, and the tools you need on day one.',
    href: '/blog/how-to-start-mobile-grooming-business',
    icon: '🚐',
  },
];

const startupCosts = [
  { item: 'Mobile grooming van (used)', range: '$15,000 – $40,000' },
  { item: 'Van conversion / plumbing', range: '$5,000 – $20,000' },
  { item: 'Equipment & tools', range: '$2,000 – $5,000' },
  { item: 'Business licensing & insurance', range: '$500 – $2,000/yr' },
  { item: 'Initial marketing & branding', range: '$500 – $2,000' },
  { item: 'Scheduling & business software', range: '$30 – $80/mo' },
];

export default function MobileGroomingBusinessPage() {
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

      <BOFUAnalyticsWrapper
        pageType="mobile-grooming-business"
        sectionIds={[
          'hero',
          'why-mobile',
          'topics',
          'startup-costs',
          'route-optimization',
          'pricing',
          'operations',
          'licensing',
          'related-articles',
          'cta',
        ]}
        sectionTitles={[
          'Hero',
          'Why Mobile Grooming',
          'Topics in This Hub',
          'Startup Costs',
          'Route Optimization',
          'Pricing Strategy',
          'Running Operations',
          'Licensing and Insurance',
          'Related Guides',
          'CTA',
        ]}
      >
        <div className="min-h-screen bg-white text-stone-900">
          {/* ── Nav ── */}
          <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-stone-100">
            <Link href="/" className="text-xl font-bold text-green-600">
              GroomGrid 🐾
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
              data-cta-type="start_trial"
              data-cta-location="nav"
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
                  Mobile Grooming Business
                </li>
              </ol>
            </nav>
          </div>

          {/* ── Hero ── */}
          <header
            className="px-6 pt-10 pb-12 max-w-4xl mx-auto"
            data-section="hero"
          >
            <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
              Mobile Grooming Hub
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
              Mobile Grooming Business:<br className="hidden sm:block" /> Your Complete Playbook
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
              Mobile grooming is one of the best business models in pet care — low overhead,
              premium pricing, loyal clients, and the freedom to set your own schedule. But getting
              it right takes more than a van and a pair of clippers. This hub covers everything:
              startup costs, business planning, route optimization, pricing, and the systems that
              let you scale without burning out.
            </p>
          </header>

          {/* ── Why Mobile Grooming ── */}
          <section
            className="px-6 py-12 bg-green-50"
            data-section="why-mobile"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                Why Mobile Grooming Is Worth Considering
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                The mobile grooming industry has exploded over the last decade — and for good reason.
                Clients love the convenience of door-to-door service, no waiting rooms, and one-on-one
                attention for their pets. Groomers love the premium pricing, low overhead (no salon
                rent), and the ability to work independently without answering to a salon owner.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                A well-run mobile grooming business can generate $60,000–$120,000 per year with
                a single van. The math works because mobile groomers can charge 20-50% more than
                salon groomers for the same services — clients are paying for the convenience, and
                most are happy to do it.
              </p>
              <p className="text-stone-600 leading-relaxed">
                The catch? Mobile grooming has unique operational challenges that brick-and-mortar
                salons don&apos;t face: route planning, van maintenance, fuel costs, weather
                cancellations, and the logistics of running a business from a moving vehicle. This
                hub covers all of it so you can build a mobile business that&apos;s both profitable
                and sustainable.
              </p>
            </div>
          </section>

          {/* ── Sub-topic cards ── */}
          <section
            className="px-6 py-14 max-w-5xl mx-auto"
            data-section="topics"
          >
            <h2 className="text-2xl font-bold text-stone-800 mb-3 text-center">
              Topics in This Hub
            </h2>
            <p className="text-center text-stone-500 mb-10">
              Deep-dive guides on every major aspect of running a mobile grooming business — click any topic to read more.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {topics.map((topic) => (
                <Link
                  key={topic.title}
                  href={topic.href}
                  className="group p-6 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
                >
                  <span className="text-3xl mb-3 block">{topic.icon}</span>
                  <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-green-600 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{topic.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Startup Costs ── */}
          <section
            className="px-6 py-12 bg-stone-50"
            data-section="startup-costs"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                Startup Costs: What to Expect
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                One of the first questions every aspiring mobile groomer asks is: how much does it
                cost to get started? The honest answer is: it depends. A bare-bones setup with a used
                van can run $20,000–$30,000 all-in. A fully kitted-out professional unit can reach
                $60,000 or more. Here&apos;s a realistic breakdown:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-green-50 text-left">
                      <th className="px-4 py-3 font-semibold text-stone-700 border border-stone-200 rounded-tl-lg">
                        Item
                      </th>
                      <th className="px-4 py-3 font-semibold text-stone-700 border border-stone-200 rounded-tr-lg">
                        Typical Range
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {startupCosts.map((row, i) => (
                      <tr
                        key={row.item}
                        className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}
                      >
                        <td className="px-4 py-3 border border-stone-200 text-stone-700">
                          {row.item}
                        </td>
                        <td className="px-4 py-3 border border-stone-200 text-stone-600 font-medium">
                          {row.range}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-stone-500 text-sm mt-4">
                *Ranges vary by location, van age, equipment quality, and whether you convert a van yourself
                or buy a pre-built unit. For a full breakdown with financing options, see our{' '}
                <Link
                  href="/blog/mobile-dog-grooming-business-plan"
                  className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
                >
                  Mobile Dog Grooming Business Plan guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* ── Route Optimization ── */}
          <section
            className="px-6 py-12 max-w-4xl mx-auto"
            data-section="route-optimization"
          >
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Route Optimization: The Key to Profitable Days
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Here&apos;s a math problem most mobile groomers don&apos;t do: if you&apos;re driving
              90 minutes between appointments, you&apos;re losing an estimated $45–$90 in time value
              per gap. Over a full week, that&apos;s potentially $200–$400 in unrealized revenue —
              just from inefficient routing.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Smart route optimization starts with geographic clustering: grouping your clients by
              neighborhood and scheduling the same areas on the same days. This sounds obvious, but
              most mobile groomers let clients book whatever time they want and end up crisscrossing
              their entire service area daily.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              The fix is to structure your schedule by zone. Monday might be the north side of town,
              Tuesday the east side, Wednesday the suburbs. Within each zone, book appointments in
              a geographic line — shortest total drive time between stops. Even rough geographic
              clustering (not perfect optimization) can cut daily drive time by 30-50%.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Over time, your goal is to build a neighborhood anchor — a cluster of 4-6 loyal clients
              within a few blocks of each other who book every 6 weeks. Those clients are pure gold:
              you drive to one area, do multiple dogs, drive home. Maximum revenue per mile driven.
            </p>
            <div className="bg-green-50 border border-green-100 rounded-xl p-5 mt-6">
              <p className="text-green-700 font-semibold mb-1">Route Pro Tip</p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Consider offering a small discount (10-15%) for &quot;neighborhood pricing&quot; —
                clients who book on the designated day for their area. You fill your schedule
                efficiently, they get a deal, and everyone wins.
              </p>
            </div>
          </section>

          {/* ── Pricing Strategy ── */}
          <section
            className="px-6 py-12 bg-green-50"
            data-section="pricing"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                Pricing Your Mobile Grooming Services
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Mobile grooming pricing is different from salon pricing — and it should be. You&apos;re
                providing a premium, door-to-door service with no waiting room stress for the pet. You
                have the right to charge for that. Most successful mobile groomers price 20-50% above
                the local salon rates for equivalent services.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                When setting your prices, factor in:
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  {
                    factor: 'Drive time and fuel',
                    desc: 'You\'re paying to get to the client. If an appointment is 20 minutes away, factor that cost into your pricing — especially for clients outside your primary zone.',
                  },
                  {
                    factor: 'Breed and coat complexity',
                    desc: 'A Shih Tzu matted to the skin takes three times as long as a Labrador bath-and-brush. Price for the actual work, not a flat rate.',
                  },
                  {
                    factor: 'Van depreciation and maintenance',
                    desc: 'Your van is your business. Set aside 10-15% of revenue for maintenance, repairs, and eventual replacement.',
                  },
                  {
                    factor: 'Your target hourly rate',
                    desc: 'Work backwards from what you want to earn. If you want $60/hr and a full groom takes 1.5 hours (including drive time), your floor price is $90.',
                  },
                ].map((item) => (
                  <li key={item.factor} className="flex gap-3">
                    <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                    <div>
                      <span className="font-semibold text-stone-800">{item.factor}: </span>
                      <span className="text-stone-600">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-stone-600 leading-relaxed">
                Don&apos;t undercharge to compete with salons. Your clients are choosing mobile for a
                reason — they value convenience over price. Price yourself like the premium service
                you are, then deliver the experience that justifies it.
              </p>
            </div>
          </section>

          {/* ── Operations for Mobile Groomers ── */}
          <section
            className="px-6 py-12 max-w-4xl mx-auto"
            data-section="operations"
          >
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Running Operations as a Solo Mobile Groomer
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Mobile grooming amplifies every operational challenge because you&apos;re doing it all
              yourself — from the road. There&apos;s no receptionist to handle rescheduling, no
              co-worker to manage the waiting area, no one to chase the payment while you&apos;re
              finishing a groom.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              This is why automation matters so much for mobile groomers. When your booking system
              sends confirmations automatically, your reminder messages go out on schedule without
              you touching your phone, and clients can pay online before you arrive — you eliminate
              dozens of small tasks that would otherwise steal time and attention from your actual
              work.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              The best mobile groomers we&apos;ve talked to typically run a lean but effective stack:
              an online booking system clients can use 24/7, automated reminders that go out 48 hours
              and 2 hours before appointments, a simple client database with pet notes, and a payment
              system that collects deposits at booking and final payment on the day of the groom.
            </p>
            <p className="text-stone-600 leading-relaxed">
              With the right systems in place, a solo mobile groomer can handle 6-8 dogs per day
              with minimal administrative overhead. Without them, you&apos;re doing 4-5 dogs while
              spending the rest of your day on texts, calls, and payment chases. The difference is
              roughly $150–$300 per day in revenue — and a lot of stress.
            </p>
          </section>

          {/* ── Licensing and Insurance ── */}
          <section
            className="px-6 py-12 bg-stone-50"
            data-section="licensing"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                Licensing, Insurance, and Legal Basics
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Before you take your first client, you need to have your legal foundation in order.
                Requirements vary by state and city, but here&apos;s what most mobile groomers need
                to set up:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    title: 'Business structure',
                    desc: 'Most solo mobile groomers operate as a sole proprietorship or single-member LLC. An LLC adds liability protection and looks more professional to clients.',
                    icon: '🏢',
                  },
                  {
                    title: 'Business license',
                    desc: 'Most cities require a basic business license to operate. Check with your city or county clerk\'s office — usually $50-$200/year.',
                    icon: '📄',
                  },
                  {
                    title: 'Grooming certification',
                    desc: 'Not legally required in most states, but a certification from NDGAA or IPG adds credibility and can justify premium pricing.',
                    icon: '🎓',
                  },
                  {
                    title: 'Insurance',
                    desc: 'You need commercial auto insurance for the van (personal auto won\'t cover business use) plus general liability insurance. Budget $1,500-$3,000/year.',
                    icon: '🛡️',
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-white border border-stone-200 rounded-xl p-5">
                    <span className="text-2xl mb-2 block">{item.icon}</span>
                    <h3 className="font-bold text-stone-800 mb-1">{item.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Related Articles ── */}
          <section
            className="px-6 py-12 max-w-4xl mx-auto"
            data-section="related-articles"
          >
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Related Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  href: '/blog/mobile-dog-grooming-business-plan',
                  title: 'How to Write a Mobile Dog Grooming Business Plan',
                  desc: 'A complete template with startup costs, revenue projections, service area maps, and funding options for mobile groomers.',
                },
                {
                  href: '/blog/how-to-start-mobile-grooming-business',
                  title: 'How to Start a Mobile Grooming Business: Step-by-Step Guide',
                  desc: 'From buying your first van to booking your first client — the full startup checklist for aspiring mobile groomers.',
                },
                {
                  href: '/grooming-business-operations/',
                  title: 'Grooming Business Operations Hub',
                  desc: 'Scheduling, no-show prevention, deposits, and client retention — the operational foundation every groomer needs.',
                },
                {
                  href: '/blog/is-dog-grooming-a-profitable-business',
                  title: 'Is Dog Grooming a Profitable Business in 2025?',
                  desc: 'Revenue benchmarks, profit margins, and the financial reality of running a modern grooming business.',
                },
              ].map((article) => (
                <Link
                  key={article.href}
                  href={article.href}
                  className="group p-5 bg-stone-50 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-stone-800 mb-2 group-hover:text-green-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{article.desc}</p>
                  <span className="text-green-600 text-sm font-medium mt-3 inline-block">
                    Read the guide →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section
            className="px-6 py-16 bg-green-600 text-white"
            data-section="cta"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold mb-4">
                Built for Mobile Groomers, By People Who Get It
              </h2>
              <p className="text-green-100 text-lg mb-8 leading-relaxed">
                GroomGrid is designed for the way mobile groomers actually work — on the road, solo,
                handling everything yourself. Online booking, automated reminders, mobile payments,
                and client notes all in one app. Start free for 14 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/plans"
                  className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors shadow-md"
                  data-cta-type="see_plans"
                  data-cta-location="cta"
                  data-cta-section="cta"
                >
                  See GroomGrid for Mobile Groomers →
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-4 rounded-xl border-2 border-white text-white font-bold text-lg hover:bg-green-700 transition-colors"
                  data-cta-type="start_trial"
                  data-cta-location="cta"
                  data-cta-section="cta"
                >
                  Start Free Trial
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
                <Link href="/blog/how-to-start-mobile-grooming-business" className="hover:text-stone-600 transition-colors">
                  Start Mobile Grooming
                </Link>
                <Link href="/grooming-business-operations/" className="hover:text-stone-600 transition-colors">
                  Operations Hub
                </Link>
                <Link href="/plans" className="hover:text-stone-600 transition-colors">
                  Pricing
                </Link>
              </div>
              <p>© {new Date().getFullYear()} GroomGrid. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </BOFUAnalyticsWrapper>
    </>
  );
}
