import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Mobile Dog Grooming Business Tips: Run a Tighter, More Profitable Operation | GroomGrid',
  description:
    'Practical mobile dog grooming business tips from experienced operators — route optimization, van organization, client communication, pricing, and the tools that keep mobile businesses running smoothly.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/mobile-dog-grooming-business-tips',
  },
  openGraph: {
    title: 'Mobile Dog Grooming Business Tips: Run a Tighter, More Profitable Operation',
    description:
      'Practical mobile dog grooming business tips from experienced operators — route optimization, van organization, client communication, pricing, and the tools that keep mobile businesses running smoothly.',
    url: 'https://getgroomgrid.com/blog/mobile-dog-grooming-business-tips',
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
      name: 'Mobile Dog Grooming Business Tips',
      item: 'https://getgroomgrid.com/blog/mobile-dog-grooming-business-tips',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Mobile Dog Grooming Business Tips: Run a Tighter, More Profitable Operation',
  description:
    'Practical mobile dog grooming business tips from experienced operators — route optimization, van organization, client communication, pricing, and the tools that keep mobile businesses running smoothly.',
  url: 'https://getgroomgrid.com/blog/mobile-dog-grooming-business-tips',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/mobile-dog-grooming-business-tips',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I get clients for my mobile dog grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with your local community — post before-and-after photos on neighborhood Facebook groups and Nextdoor. Offer a first-time discount to build reviews. Partner with local vets, pet stores, and dog walkers for referrals. Claim your Google Business Profile and encourage happy clients to leave reviews. Most mobile groomers fill their books within 3–6 months through word of mouth alone.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much should I charge for mobile dog grooming?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mobile grooming commands a premium over salon pricing due to convenience. Typical rates range from $60–150 per dog depending on size, breed, coat condition, and your local market. Small dogs average $60–80, medium dogs $75–100, and large breeds $100–150+. Factor in drive time, fuel, and vehicle costs when setting your base price. Most mobile groomers set a minimum service fee of $50–75 per stop.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best route planning for mobile groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Group appointments by zip code or neighborhood to minimize drive time. Schedule 4–6 dogs per day with 15–30 minute buffers between stops for travel and cleanup. Avoid booking across town in the same day. Use a scheduling tool that supports geographic grouping — GroomGrid offers route-friendly scheduling that helps mobile groomers cluster appointments by area automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I prevent no-shows as a mobile groomer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No-shows are especially costly for mobile groomers because you lose both revenue and fuel. Require a deposit or credit card on file at booking. Send automated reminders 24 hours and 1 hour before the appointment. Implement a cancellation policy (24-hour notice required). GroomGrid users report 30–40% fewer no-shows with automated 3-touch reminder sequences and deposit requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'What software helps run a mobile grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mobile groomers need software that works on the road — scheduling, client and pet records, automated reminders, and payment processing in one app. GroomGrid is built mobile-first with features designed specifically for van-based groomers, including route-friendly scheduling, breed-specific time estimates, and automated reminder sequences that reduce no-shows.',
      },
    },
  ],
};

export default function MobileDogGroomingBusinessTipsPage() {
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
              <li><Link href="/" className="hover:text-green-600 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="hover:text-green-600 transition-colors">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">Mobile Grooming Tips</li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Mobile Grooming
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Mobile Dog Grooming Business Tips:<br className="hidden sm:block" /> Run Smarter, Earn More
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Mobile grooming offers freedom and premium pricing — but it also comes with unique
            operational challenges that salon groomers never face. These tips come from operators who
            run tight, profitable mobile businesses day in and day out.
          </p>
        </header>

        {/* ── Route Optimization ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">1. Optimize Your Routes — It Adds Up Fast</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              A mobile groomer driving 30 extra minutes between appointments loses 30 minutes of
              productive time — and money on fuel. Over a 5-day week, that&apos;s 2.5 hours and
              roughly $20–$40 in fuel. Over a year: $1,000–$2,000 and 130 hours gone.
            </p>
            <ul className="space-y-3">
              {[
                'Group bookings geographically — never bounce across town between stops',
                'Set service zones and only accept bookings within them (your booking software can enforce this)',
                'Schedule the farthest client first or last — not in the middle of the day',
                'Block out "dead time" between clients in outlying areas — fill it or don\'t go there',
                'Use a route planner (Google Maps multi-stop, Routific) on heavy booking days',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Van Organization ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">2. Keep Your Van Like a Professional Kitchen</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            In a mobile van, everything has a place — and everything in its place. Time spent searching
            for tools is time you&apos;re not grooming. A well-organized van also creates a better
            experience for clients who see inside.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { tip: 'Labeled storage zones', detail: 'Clippers, shears, shampoos, and tools each in a dedicated spot' },
              { tip: 'Pre-packed kit per service type', detail: 'Keep a small kit ready for nail-only or bath-only quick jobs' },
              { tip: 'Daily van check', detail: '5 minutes each morning to verify supplies, water level, and equipment status' },
              { tip: 'Weekly deep clean', detail: 'Prevents odor buildup and keeps the space professional' },
              { tip: 'Spare blade set always on van', detail: 'A dull blade mid-groom kills your schedule' },
              { tip: 'Secure everything', detail: 'Tools that shift during driving cause accidents — use magnetic strips, velcro, and bins' },
            ].map(({ tip, detail }) => (
              <div key={tip} className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <p className="font-semibold text-stone-800 mb-1">{tip}</p>
                <p className="text-sm text-stone-500">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Client Communication ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">3. Client Communication is Your #1 Retention Tool</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Mobile grooming clients chose you partly for the convenience — which means they expect
              communication that matches. They need to know when you&apos;re coming, when you&apos;re
              done, and when they should book again.
            </p>
            <div className="space-y-4">
              {[
                {
                  timing: 'Day before',
                  message: 'Appointment reminder with your arrival window (not just the appointment time)',
                },
                {
                  timing: 'Morning of',
                  message: '"On my way" text when you\'re 15-20 minutes out so they\'re ready',
                },
                {
                  timing: 'After groom',
                  message: 'Quick note or photo of the completed groom (clients love seeing their clean dog)',
                },
                {
                  timing: '5–6 weeks later',
                  message: 'Rebooking reminder so they don\'t wait until the coat is out of control',
                },
              ].map(({ timing, message }) => (
                <div key={timing} className="flex gap-4 p-4 bg-white rounded-lg border border-stone-200">
                  <div className="flex-shrink-0 w-28 text-sm font-semibold text-green-600">{timing}</div>
                  <p className="text-stone-600">{message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing for Mobile ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">4. Price Correctly for the Mobile Model</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Mobile grooming commands a premium over salon prices — and it should. You&apos;re providing
            door-to-door service, a stress-free experience for the dog, and eliminating the owner&apos;s
            drive. Most markets support a 20–35% premium over local salon rates.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
            <p className="font-semibold text-stone-800 mb-3">Mobile pricing considerations:</p>
            <ul className="space-y-2 text-stone-700">
              <li><strong>Travel surcharge:</strong> $5–$20 for clients outside your primary zone</li>
              <li><strong>Solo-owner premium:</strong> Your undivided attention has value — charge for it</li>
              <li><strong>Convenience premium:</strong> 20–35% over local salon base rates</li>
              <li><strong>Fuel adjustment:</strong> Build fuel costs into service pricing, not as a surprise fee</li>
            </ul>
          </div>
          <p className="text-stone-600 leading-relaxed">
            For a complete breakdown of mobile startup costs and revenue potential, see our{' '}
            <Link
              href="/blog/mobile-dog-grooming-business-plan"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              mobile dog grooming business plan guide
            </Link>
            .
          </p>
        </section>

        {/* ── No-Shows ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">5. No-Shows Hit Harder on Mobile — Protect Yourself</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              When a salon client no-shows, you&apos;ve lost an appointment slot. When a mobile client
              no-shows, you&apos;ve also lost the drive time and fuel. Your protection mechanisms need
              to be tighter as a result.
            </p>
            <ul className="space-y-3">
              {[
                'Require a deposit for all new clients (50% minimum)',
                'Send reminder the day before AND a "heading your way" message the morning of',
                'Have a same-day cancellation policy with deposit forfeiture clearly explained at booking',
                'Keep a waitlist of nearby clients you can contact when a same-day slot opens',
                'After 2 no-shows, require prepay in full for future bookings',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Related Links ── */}
        <RelatedLinks
          heading="Software built for mobile groomers"
          links={[
          { href: '/signup?coupon=BETA50', category: 'Planning', title: 'Mobile Dog Grooming Business Plan: The Complete Template' },
          { href: '/blog/reduce-no-shows-dog-grooming', category: 'Operations', title: 'How to Reduce No-Shows in Your Dog Grooming Business' }
          ]}
          columns={3}
        />

        {/* ── Footer ── */}
        <SiteFooter links={[{ href: '/grooming-business-operations/', label: 'Operations Hub' }, { href: '/mobile-grooming-business/', label: 'Mobile Grooming' }, { href: '/plans', label: 'Pricing' }, { href: '/signup?coupon=BETA50', label: 'Sign Up' }]} />
      </div>
    </>
  );
}
