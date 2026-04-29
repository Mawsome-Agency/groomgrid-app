import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'How to Start a Mobile Dog Grooming Business: The Complete Guide | GroomGrid',
  description:
    'Everything you need to start a mobile dog grooming business — van setup, licensing, pricing, finding first clients, and the tools to manage it all from day one.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/how-to-start-a-mobile-dog-grooming-business',
  },
  openGraph: {
    title: 'How to Start a Mobile Dog Grooming Business: The Complete Guide',
    description:
      'Everything you need to start a mobile dog grooming business — van setup, licensing, pricing, finding first clients, and the tools to manage it all from day one.',
    url: 'https://getgroomgrid.com/blog/how-to-start-a-mobile-dog-grooming-business',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Start a Mobile Dog Grooming Business: The Complete Guide',
  description:
    'Everything you need to start a mobile dog grooming business — van setup, licensing, pricing, finding first clients, and the tools to manage it all from day one.',
  url: 'https://getgroomgrid.com/blog/how-to-start-a-mobile-dog-grooming-business',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/how-to-start-a-mobile-dog-grooming-business',
  },
};

export default function HowToStartMobileDogGroomingBusinessPage() {
  return (
    <>      <Script
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
          <PageBreadcrumbs slug="blog/how-to-start-a-mobile-dog-grooming-business" />
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Starting Out
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            How to Start a Mobile Dog<br className="hidden sm:block" /> Grooming Business
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Mobile dog grooming is one of the most profitable models in the pet industry — low overhead,
            premium pricing, and clients who are loyal because you make their lives easier. Here&apos;s
            the complete roadmap to launch yours.
          </p>
        </header>

        {/* ── Why Mobile ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Why Mobile Grooming Is a Smart Business Model</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Mobile grooming solves a real problem for dog owners: they don&apos;t want to drive to a
              salon, wait around for hours, and deal with a stressed dog who&apos;s been around other
              animals all day. You come to them. That convenience commands a premium — typically 20–35%
              above local salon rates.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { pro: 'No lease costs', detail: 'Your van is your salon — no monthly rent on top of equipment' },
                { pro: 'Premium pricing', detail: 'Clients pay more for the convenience of door-to-door service' },
                { pro: 'Flexible schedule', detail: 'Set your own routes, hours, and service zones' },
                { pro: 'Lower startup than salon', detail: 'A used van + equipment can get you operational for $20–$40K' },
                { pro: 'One-on-one attention', detail: 'Dogs are calmer alone — your grooms can be faster and higher quality' },
                { pro: 'Loyal client base', detail: 'Mobile clients tend to be highly loyal once they find a groomer they trust' },
              ].map(({ pro, detail }) => (
                <div key={pro} className="p-4 bg-white rounded-lg border border-stone-200">
                  <p className="font-semibold text-stone-800 mb-1">{pro}</p>
                  <p className="text-sm text-stone-500">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Step 1: Licensing ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Step 1: Licensing and Legal Requirements</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Requirements vary by state and city. Most states don&apos;t require a specific grooming
            license, but you&apos;ll need a business license, the right insurance, and potentially
            a pet care facility permit depending on local ordinances.
          </p>
          <ul className="space-y-3 mb-4">
            {[
              'Register your business (LLC is recommended for liability protection) — $50–$500 filing fee',
              'Obtain a local business license — typically $50–$200/year',
              'Check state grooming certification requirements — varies widely',
              'Get general liability insurance AND commercial auto insurance — see Step 5',
              'Check local zoning — some areas restrict home-based van businesses',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Step 2: Van ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Step 2: Choosing and Setting Up Your Van</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Your van is your most important investment. You have three main options:
            </p>
            <div className="space-y-4 mb-6">
              {[
                {
                  option: 'Buy a pre-converted grooming van',
                  cost: '$25,000–$70,000',
                  pros: 'Ready to operate quickly, professional layout already done',
                  cons: 'Higher upfront cost, limited customization',
                },
                {
                  option: 'Buy a used cargo van + convert it',
                  cost: '$8,000–$25,000 total',
                  pros: 'More affordable, customize to your workflow',
                  cons: 'Conversion takes time, plumbing and electrical work required',
                },
                {
                  option: 'Lease or finance a new grooming van',
                  cost: '$500–$1,200/month',
                  pros: 'Newest equipment, less upfront cash',
                  cons: 'Ongoing fixed cost, ownership complications',
                },
              ].map(({ option, cost, pros, cons }) => (
                <div key={option} className="p-5 bg-white rounded-xl border border-stone-200">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-stone-800">{option}</p>
                    <span className="text-green-600 font-bold text-sm">{cost}</span>
                  </div>
                  <p className="text-stone-600 text-sm"><strong>Pros:</strong> {pros}</p>
                  <p className="text-stone-600 text-sm"><strong>Cons:</strong> {cons}</p>
                </div>
              ))}
            </div>
            <p className="text-stone-600 leading-relaxed">
              For the full equipment list you&apos;ll need to outfit your van, see our{' '}
              <Link
                href="/blog/dog-grooming-tools-equipment-list"
                className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
              >
                dog grooming tools and equipment list
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── Step 3: Pricing ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Step 3: Setting Your Prices</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Mobile pricing should reflect the premium service you offer. Research local salon rates and
            add 20–35%. Most mobile groomers charge $75–$150+ for a full groom depending on breed,
            size, and coat condition.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <p className="font-semibold text-stone-800 mb-3">Sample mobile pricing ranges:</p>
            <div className="space-y-2 text-stone-700">
              <div className="flex justify-between"><span>Small breed full groom</span><span className="font-bold">$75–$100</span></div>
              <div className="flex justify-between"><span>Medium breed full groom</span><span className="font-bold">$90–$130</span></div>
              <div className="flex justify-between"><span>Large breed full groom</span><span className="font-bold">$120–$175</span></div>
              <div className="flex justify-between"><span>Nail trim only</span><span className="font-bold">$25–$40</span></div>
              <div className="flex justify-between"><span>Bath + brush only</span><span className="font-bold">$55–$85</span></div>
            </div>
          </div>
        </section>

        {/* ── Step 4: First Clients ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Step 4: Getting Your First Clients</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              The first 10–20 clients are the hardest. After that, referrals do most of the work.
            </p>
            <ul className="space-y-3">
              {[
                'Set up Google Business Profile immediately — local search drives most new mobile grooming clients',
                'Post in neighborhood Facebook groups and Nextdoor — introduce yourself, offer a launch discount',
                'Partner with local vets and pet stores — leave business cards, offer referral discounts',
                'Ask every early client for a Google review — 5 reviews gets you into map results',
                'Instagram before/after photos — shows your work, builds trust, reaches local pet owners',
                'Offer a friends & family discount for your first 10 clients to build reviews fast',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Step 5: Insurance & Tools ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Step 5: Insurance and Business Software</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            <strong>Insurance:</strong> You need commercial auto insurance (your personal policy won&apos;t
            cover a grooming van), general liability, and care/custody/control coverage. Budget $1,500–$4,000
            per year combined.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            <strong>Business software:</strong> From your first client, use software to manage bookings,
            send reminders, collect deposits, and store pet profiles. Managing 20+ active clients via text
            and paper is chaos waiting to happen — and no-shows become very expensive when you&apos;ve
            already driven to the location.
          </p>
          <p className="text-stone-600 leading-relaxed">
            For a detailed financial plan with revenue projections, see our{' '}
            <Link
              href="/blog/mobile-dog-grooming-business-plan"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              mobile dog grooming business plan template
            </Link>
            .
          </p>
        </section>

        {/* ── Related Links ── */}
        <PageRelatedLinks slug="blog/how-to-start-a-mobile-dog-grooming-business" variant="blog" heading="Start your mobile business with the right software" />

        {/* ── Footer ── */}
        <SiteFooter slug="blog/how-to-start-a-mobile-dog-grooming-business" />
      </div>
    </>
  );
}
