import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Mobile Dog Grooming Business Plan: The Complete Template | GroomGrid',
  description:
    'Build a profitable mobile dog grooming business with this complete business plan guide — covering pricing, routes, equipment, and client acquisition.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/mobile-dog-grooming-business-plan',
  },
  openGraph: {
    title: 'Mobile Dog Grooming Business Plan: The Complete Template',
    description:
      'Build a profitable mobile dog grooming business with this complete business plan guide — pricing, routes, equipment, and client acquisition.',
    url: 'https://getgroomgrid.com/blog/mobile-dog-grooming-business-plan',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Mobile Dog Grooming Business Plan: The Complete Template',
  description:
    'Build a profitable mobile dog grooming business with this complete business plan guide — pricing, routes, equipment, and client acquisition.',
  url: 'https://getgroomgrid.com/blog/mobile-dog-grooming-business-plan',
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
    '@id': 'https://getgroomgrid.com/blog/mobile-dog-grooming-business-plan',
  },
};

export default function MobileDogGroomingBusinessPlanPage() {
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
            href="/signup"
            className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
          >
            Start Free Trial
          </Link>
        </nav>

        {/* ── Breadcrumb ── */}
        <div className="px-6 py-3 max-w-5xl mx-auto">
          <PageBreadcrumbs slug="blog/mobile-dog-grooming-business-plan" />
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Business Planning
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Mobile Dog Grooming Business Plan:<br className="hidden sm:block" /> The Complete Template
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Starting a mobile grooming business without a plan is how groomers end up overworked,
            underpaid, and driving to clients who live an hour apart. This guide walks through every
            section of a real mobile grooming business plan — from startup costs to revenue targets.
          </p>
        </header>

        {/* ── Why You Need a Plan ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Why a Business Plan Matters (Even for a Solo Groomer)
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Most mobile groomers start by just taking clients. That works early — until you realize
              you&apos;re driving 30 miles between appointments, charging less than your costs, and
              have no idea how many clients you need to make a living.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              A business plan doesn&apos;t have to be a 40-page document for a bank. It&apos;s a
              set of decisions you make upfront so you&apos;re not improvising every week: your
              service area, your pricing, your capacity, and your growth targets.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Groomers who plan earn more, work less, and build businesses that can eventually run
              without them.
            </p>
          </div>
        </section>

        {/* ── Business Overview ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            1. Business Overview
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Start with the basics — what you offer, who you serve, and how you&apos;re different:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Services: Full groom, bath + brush, nail trim, de-shedding treatments — decide what you will and won\'t offer',
              'Target clients: Busy professionals, seniors, dog owners without reliable transport to a salon',
              'Service area: Define a geographic radius that keeps your drive time under 15 minutes between stops',
              'Differentiator: One-on-one attention, no kennel stress, convenience — pick one and own it',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Startup Costs ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              2. Startup Costs
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Mobile grooming startup costs vary widely based on whether you buy a purpose-built van
              or convert a cargo van. Here&apos;s a realistic range:
            </p>
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="text-left px-4 py-3 font-semibold text-stone-700">Item</th>
                    <th className="text-right px-4 py-3 font-semibold text-stone-700">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Mobile grooming van (purpose-built)', '$40,000–$80,000'],
                    ['Van conversion (DIY)', '$10,000–$25,000'],
                    ['Grooming tools and equipment', '$1,500–$4,000'],
                    ['Business license and insurance', '$500–$2,000/year'],
                    ['Initial supplies (shampoo, towels, etc.)', '$300–$800'],
                    ['Scheduling and business software', '$0–$100/month'],
                  ].map(([item, range]) => (
                    <tr key={item} className="border-b border-stone-100 last:border-0">
                      <td className="px-4 py-3 text-stone-600">{item}</td>
                      <td className="px-4 py-3 text-stone-700 font-medium text-right">{range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Most solo mobile groomers launch with $15,000–$30,000 total if they finance the van.
              The biggest variable is vehicle — the right one for your market matters more than the
              most expensive one.
            </p>
          </div>
        </section>

        {/* ── Pricing and Revenue ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            3. Pricing and Revenue Model
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Mobile grooming commands a premium over salon pricing — typically 20–40% more. You&apos;re
            selling convenience, and clients who value that will pay for it.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            Build your pricing from your cost structure:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Calculate your fully-loaded hourly cost (van payment, fuel, insurance, supplies, your time)',
              'Set a minimum service price that covers costs with margin — usually $75–$120 for a full groom',
              'Add size surcharges for large and giant breeds (they take more time and supplies)',
              'Price your fastest services (nail trims, baths) to fill gaps, not anchor your revenue',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-stone-600 leading-relaxed">
            At 6 dogs/day × 5 days/week × $90 average = $2,700/week gross. After costs, most
            solo mobile groomers net $60,000–$100,000/year. Your numbers depend on your market and
            how well you optimize your route.
          </p>
        </section>

        {/* ── Route Optimization ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              4. Route Optimization — Your Hidden Profit Lever
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Fuel, time, and vehicle wear are your biggest variable costs. A poorly optimized route
              can cut your effective hourly rate in half.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Zone your service area into geographic clusters. Schedule clients in the same
              neighborhood on the same day. Resist the urge to &quot;just take one client&quot; 20
              miles out of your zone — it costs you more than the service is worth.
            </p>
            <p className="text-stone-600 leading-relaxed">
              The best mobile groomers treat their route like a delivery service: sequential stops,
              minimal backtracking, and buffer time for traffic and overruns.
            </p>
          </div>
        </section>

        {/* ── Client Acquisition ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            5. Client Acquisition
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Most mobile groomers get their first clients from:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Nextdoor and neighborhood Facebook groups — post your launch, offer a discount for first clients',
              'Local vet offices and pet stores — leave cards, ask to be recommended',
              'Google Business Profile — free, drives local search traffic',
              'Referral programs — "Refer a friend, get $20 off your next groom"',
              'Instagram — before/after groom photos build a portfolio and attract local followers',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-stone-600 leading-relaxed">
            Once you have 20–30 regular clients, most of your growth comes from referrals. Focus
            on those first clients — their word-of-mouth is your marketing budget.
          </p>
        </section>

        {/* ── Related Links ── */}
        <PageRelatedLinks slug="blog/mobile-dog-grooming-business-plan" variant="blog" heading="Run your mobile grooming business from one app" />

        {/* ── Footer ── */}
        <SiteFooter slug="blog/mobile-dog-grooming-business-plan" />
      </div>
    </>
  );
}
