import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Dog Grooming Business Plan Template: Free Download for 2026 | GroomGrid',
  description:
    'Free dog grooming business plan template with executive summary, market analysis, financial projections, and operational plan. Downloadable structure for mobile, salon, and home-based grooming businesses.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/dog-grooming-business-plan-template',
  },
  openGraph: {
    title: 'Dog Grooming Business Plan Template: Free Download for 2026',
    description:
      'Free dog grooming business plan template with executive summary, market analysis, financial projections, and operational plan — ready to customize for your grooming business.',
    url: 'https://getgroomgrid.com/blog/dog-grooming-business-plan-template',
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
      name: 'Dog Grooming Business Plan Template',
      item: 'https://getgroomgrid.com/blog/dog-grooming-business-plan-template',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dog Grooming Business Plan Template: Free Download for 2026',
  description:
    'Free dog grooming business plan template with executive summary, market analysis, financial projections, and operational plan — ready to customize for your grooming business.',
  url: 'https://getgroomgrid.com/blog/dog-grooming-business-plan-template',
  datePublished: '2026-04-28',
  dateModified: '2026-04-28',
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
    '@id': 'https://getgroomgrid.com/blog/dog-grooming-business-plan-template',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do I need a business plan for a dog grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Even a solo groomer benefits from a business plan. It forces you to think through pricing, costs, target clients, and revenue goals before you start — which prevents expensive mistakes like undercharging, overspending on equipment, or serving the wrong market. A one-page plan is better than no plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should a dog grooming business plan include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A dog grooming business plan should include an executive summary, company description, market analysis, service offerings, marketing and sales strategy, operational plan, and financial projections. The financial section is most important — it shows whether your pricing covers costs and produces a profit.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to start a dog grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Startup costs range from $2,000–$10,000 for a home-based setup, $15,000–$30,000 for a mobile operation, and $50,000–$150,000+ for a retail salon. The biggest variables are location type, equipment quality, and whether you need a vehicle. Most groomers start small and reinvest profits to grow.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I write a financial projection for a grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with your daily capacity (dogs per day), average service price, and operating days per month. Multiply to get monthly revenue. Then subtract fixed costs (rent, insurance, loan payments) and variable costs (supplies, fuel, marketing). Project for 12 months and include a worst-case scenario where you operate at 60% capacity for the first 6 months.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use a template for my dog grooming business plan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. A template gives you the structure and prompts you to fill in the details that matter. This guide includes a complete template with executive summary, market analysis framework, financial projection worksheet, and operational plan outline — all designed specifically for dog grooming businesses.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long should a dog grooming business plan be?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For internal use, 5–10 pages is plenty. If you are seeking a loan or investment, 15–25 pages with detailed financials. The key is not length — it is whether the plan answers: who are your clients, what do you charge, what are your costs, and how will you reach profitability.',
      },
    },
  ],
};

export default function DogGroomingBusinessPlanTemplatePage() {
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
                <Link href="/blog" className="hover:text-green-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">
                Business Plan Template
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Business Planning
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Dog Grooming Business Plan Template:<br className="hidden sm:block" /> Free Structure for 2026
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Starting a grooming business without a plan is how you end up fully booked but barely
            profitable. This template walks you through every section — executive summary, market
            analysis, financial projections, and operations — so you build a business that
            actually makes money from day one.
          </p>
        </header>

        {/* ── Why You Need a Plan ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Why Every Groomer Needs a Business Plan
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Most groomers start by just taking clients. That works — until you realize
              you&apos;re underpricing your services, spending more on supplies than you budgeted
              for, or accepting clients who live 30 minutes apart and eat your profit in drive time.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              A business plan isn&apos;t a formality for a bank loan. It&apos;s the set of decisions
              you make upfront so you stop improvising every week: your pricing, your capacity, your
              costs, and your revenue targets. Groomers who write even a basic plan earn 20–30%
              more than those who wing it, according to small business data from the SBA.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Whether you&apos;re launching a mobile operation, opening a salon, or starting from
              your home, the structure below works for every type of grooming business.
            </p>
          </div>
        </section>

        {/* ── Business Plan Template Overview ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Your Dog Grooming Business Plan Structure
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            A solid grooming business plan has seven core sections. Here&apos;s what goes in each one,
            with prompts and examples specific to the pet grooming industry.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { num: '1', label: 'Executive Summary', detail: 'Your business at a glance — name, model, revenue target' },
              { num: '2', label: 'Company Description', detail: 'What you offer, who you serve, what makes you different' },
              { num: '3', label: 'Market Analysis', detail: 'Local demand, competitor landscape, your target client' },
              { num: '4', label: 'Services & Pricing', detail: 'Menu of services, pricing strategy, add-on revenue' },
              { num: '5', label: 'Marketing & Sales', detail: 'How you acquire clients and keep them coming back' },
              { num: '6', label: 'Operational Plan', detail: 'Facility, equipment, scheduling, daily workflow' },
              { num: '7', label: 'Financial Projections', detail: 'Startup costs, monthly P&L, break-even timeline' },
            ].map(({ num, label, detail }) => (
              <div key={num} className="p-5 bg-white rounded-xl border border-stone-200 hover:border-green-300 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center">{num}</span>
                  <p className="font-semibold text-stone-800">{label}</p>
                </div>
                <p className="text-sm text-stone-500">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 1: Executive Summary ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              1. Executive Summary Template
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              The executive summary is the most-read section of your plan — and the last one you
              should write. It distills everything else into a single page. For a grooming business,
              it should answer these questions clearly:
            </p>
            <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-stone-800 mb-4">Executive Summary Prompts</h3>
              <ul className="space-y-3 text-stone-600">
                {[
                  'Business name, location, and business type (mobile, salon, home-based)',
                  'Core services offered (full groom, bath & brush, specialty services)',
                  'Target market in one sentence (e.g., "busy dog owners in [city] within a 15-mile radius")',
                  'Revenue target for year one (e.g., "$75,000 gross revenue by month 12")',
                  'Competitive advantage (e.g., "mobile convenience with AI-powered scheduling and automated reminders")',
                  'Funding needed and how it will be used (if applicable)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-0.5">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Keep this section under one page. Write it last, after you&apos;ve worked through every
              other section. The clarity of your executive summary reflects the clarity of your
              thinking — if you can&apos;t summarize your business in a few sentences, you need to
              revisit your plan.
            </p>
          </div>
        </section>

        {/* ── Section 2: Company Description ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            2. Company Description
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            This section defines what your grooming business looks like in practice. It&apos;s where you
            decide your model, your client profile, and what sets you apart from the grooming shop
            down the street.
          </p>
          <div className="space-y-4 mb-6">
            {[
              {
                label: 'Business Model',
                detail: 'Mobile (van-based), salon (fixed location), or home-based. Each has different cost structures, pricing floors, and capacity limits. Mobile commands a 20–40% premium but has higher vehicle costs. Salons have rent but can run multiple groomers. Home-based has the lowest overhead but zoning restrictions may apply.',
              },
              {
                label: 'Target Client Profile',
                detail: 'Who are your ideal clients? Mobile groomers often target busy professionals and seniors who can\'t transport their dogs. Salon owners target local neighborhoods within a 10-minute drive. Define the demographics, dog breeds, and income level of your core market.',
              },
              {
                label: 'Your Differentiator',
                detail: '"I\'m good with dogs" isn\'t a differentiator — every groomer is. Real differentiators: breed specialization (e.g., cat grooming, anxious dogs), one-on-one mobile service with no kennel time, same-day availability, or AI-powered booking and reminders that make the client experience seamless.',
              },
            ].map(({ label, detail }) => (
              <div key={label} className="p-5 bg-green-50 rounded-xl border border-green-200">
                <p className="font-bold text-stone-800 mb-2">{label}</p>
                <p className="text-stone-600 text-sm leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Market Analysis ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              3. Market Analysis Framework
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              This is where most grooming business plans fall flat. &quot;There are lots of dog owners
              in my area&quot; isn&apos;t market analysis. You need to quantify demand, identify
              competitors, and define your niche within the market.
            </p>

            <h3 className="text-xl font-bold text-stone-800 mb-3 mt-8">Industry Overview</h3>
            <p className="text-stone-600 leading-relaxed mb-4">
              The U.S. pet grooming industry is worth $8+ billion and growing at 5–7% annually.
              There are approximately 70,000+ dog-owning households per U.S. metro area. The demand
              for professional grooming is rising as pet ownership grows and owners increasingly
              treat grooming as routine care rather than a luxury.
            </p>

            <h3 className="text-xl font-bold text-stone-800 mb-3 mt-8">Local Market Research</h3>
            <p className="text-stone-600 leading-relaxed mb-4">
              For your specific area, research these numbers:
            </p>
            <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-stone-600">
                {[
                  'How many dog-owning households are within your service area? (Check AVMA data, census, or local vet counts)',
                  'How many existing groomers operate in your area? (Search Google Maps, Yelp, and local directories)',
                  'What do they charge? (Call as a prospective client or check their websites)',
                  'What gaps exist? (No mobile groomer? No cat specialist? No weekend availability? Long wait times?)',
                  'What\'s the average household income? (Higher income = willingness to pay premium pricing)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h3 className="text-xl font-bold text-stone-800 mb-3 mt-8">Competitive Positioning</h3>
            <p className="text-stone-600 leading-relaxed mb-4">
              Map your competitors on two axes: price and convenience. Most salons sit in the
              low-price, moderate-convenience quadrant. Mobile groomers sit in the high-price,
              high-convenience quadrant. Your position on this grid determines your pricing
              strategy and your marketing message.
            </p>
            <p className="text-stone-600 leading-relaxed">
              If there are three salons within 5 miles but no mobile groomer, your competitive
              advantage is clear. If you&apos;re the third mobile groomer in the same zip code,
              you need a niche — like specializing in anxious dogs, offering cat grooming, or
              providing extended hours.
            </p>
          </div>
        </section>

        {/* ── Section 4: Services & Pricing ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            4. Services and Pricing Strategy
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Your service menu and pricing are where the business plan meets reality. Don&apos;t just
            list services — explain your pricing logic, your add-on strategy, and how you&apos;ll
            increase per-appointment revenue over time.
          </p>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-4 py-3 font-semibold text-stone-700">Service</th>
                  <th className="text-right px-4 py-3 font-semibold text-stone-700">Typical Price Range</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Full groom (small breed)', '$45–$75'],
                  ['Full groom (medium breed)', '$60–$90'],
                  ['Full groom (large/giant breed)', '$80–$150+'],
                  ['Bath & brush', '$30–$55'],
                  ['Nail trim', '$15–$25'],
                  ['De-shedding treatment', '$40–$75 (add-on)'],
                  ['Teeth brushing', '$10–$15 (add-on)'],
                  ['Flea/tick bath', '$25–$40 (add-on)'],
                  ['Mobile convenience premium', '+20–40% over salon pricing'],
                ].map(([service, range]) => (
                  <tr key={service} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3 text-stone-600">{service}</td>
                    <td className="px-4 py-3 text-stone-700 font-medium text-right">{range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-stone-600 leading-relaxed mb-4">
            <strong>Pricing strategy tips:</strong> Price from your costs, not your competitors.
            Calculate your fully-loaded hourly rate (rent, insurance, supplies, your time), then
            set a minimum service price that covers costs plus a 30–50% margin. Most groomers
            undercharge by $10–$20 per service because they price based on fear, not math.
          </p>
          <p className="text-stone-600 leading-relaxed">
            For a detailed breakdown by breed and region, see our{' '}
            <Link
              href="/blog/dog-grooming-pricing-guide"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              dog grooming pricing guide
            </Link>
            .
          </p>
        </section>

        {/* ── Section 5: Marketing & Sales ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              5. Marketing and Client Acquisition
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Most new groomers rely on word-of-mouth, which is powerful but slow. Your business
              plan should include a multi-channel acquisition strategy for the first 6 months, then
              shift to retention-focused marketing as you build your client base.
            </p>
            <div className="space-y-4 mb-6">
              {[
                {
                  phase: 'Month 1–2: Launch',
                  tactics: 'Google Business Profile setup, Nextdoor and Facebook group posts, referral cards at vet offices and pet stores, launch discount for first 20 clients',
                },
                {
                  phase: 'Month 3–4: Build',
                  tactics: 'Instagram before/after portfolio, client review collection (Google, Yelp), referral program ($20 off for each referred client), SEO-optimized website with online booking',
                },
                {
                  phase: 'Month 5–6: Scale',
                  tactics: 'Automated rebooking reminders, email nurture for clients overdue for grooming, Facebook/Instagram ads targeting local pet owners, community partnerships (shelters, rescues)',
                },
              ].map(({ phase, tactics }) => (
                <div key={phase} className="p-5 bg-white rounded-xl border border-stone-200">
                  <p className="font-bold text-green-600 text-sm mb-1">{phase}</p>
                  <p className="text-stone-600 leading-relaxed">{tactics}</p>
                </div>
              ))}
            </div>
            <p className="text-stone-600 leading-relaxed">
              The most important metric in your marketing plan isn&apos;t how many new clients you
              get — it&apos;s how many come back. A client who grooms every 6 weeks is worth
              $500–$1,000/year. One who visits once and never returns cost you money to acquire.
              Automated reminders and rebooking prompts can increase retention by 40–60%.
            </p>
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <section className="px-6 py-10 max-w-4xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-stone-800 font-semibold mb-2">
              Want automated reminders, online booking, and client management built for groomers?
            </p>
            <p className="text-stone-600 text-sm mb-4">
              GroomGrid handles scheduling, reminders, payments, and pet profiles — so you can
              focus on grooming, not admin.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
            >
              Start Your Free Trial →
            </Link>
          </div>
        </section>

        {/* ── Section 6: Operational Plan ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            6. Operational Plan Outline
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            The operational plan is where your business plan gets specific. It covers the
            day-to-day mechanics of running your grooming business — where you work, what you
            need, and how you manage your schedule.
          </p>

          <h3 className="text-xl font-bold text-stone-800 mb-3 mt-8">Facility & Equipment</h3>
          <p className="text-stone-600 leading-relaxed mb-4">
            Your operational plan should include a complete inventory of what you need and what
            it costs. For a detailed checklist, see our{' '}
            <Link
              href="/blog/dog-grooming-tools-equipment-list"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              dog grooming tools and equipment list
            </Link>
            .
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Mobile: Van or trailer, grooming table, tub, water system, generator, dryer, clippers, shears, products',
              'Salon: Lease details, buildout costs, grooming stations (1 per groomer), bathing area, drying area, waiting room',
              'Home-based: Dedicated space meeting zoning requirements, grooming table, tub access, ventilation, separate entrance recommended',
              'Software: Scheduling, client records, automated reminders, payment processing — plan for $0–$100/month',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-stone-800 mb-3 mt-8">Daily Workflow & Capacity</h3>
          <p className="text-stone-600 leading-relaxed mb-4">
            Map out a typical day. How many dogs can you realistically groom? How much buffer time
            do you need? What happens when a dog is matted and takes twice as long?
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <ul className="space-y-2 text-stone-700">
              <li><strong>Solo groomer capacity:</strong> 4–8 dogs/day depending on service mix</li>
              <li><strong>Buffer time:</strong> 15–30 minutes between appointments for cleanup and prep</li>
              <li><strong>Mobile drive time:</strong> Budget 15 minutes between stops minimum</li>
              <li><strong>Scheduling windows:</strong> 90–120 minutes for full groom, 30 minutes for bath & brush, 15 minutes for nail trim</li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-stone-800 mb-3 mt-8">Staffing (Salon Plan)</h3>
          <p className="text-stone-600 leading-relaxed mb-4">
            If you&apos;re planning a salon, your operational plan needs a staffing model:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Bather/assistant: $12–$18/hour — handles bath, blow dry, nail trims',
              'Groomer (commission): 40–50% of service price — experienced, can work independently',
              'Receptionist (part-time): $13–$16/hour — booking, check-in, client communication',
              'Revenue per groomer: $4,000–$8,000/month gross — hire when demand exceeds your capacity',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Section 7: Financial Projections ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              7. Financial Projections Template
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              This is the section that separates a business plan from a wish list. Your financial
              projections should show exactly how your business reaches profitability — and when.
            </p>

            <h3 className="text-xl font-bold text-stone-800 mb-3 mt-8">Startup Costs Worksheet</h3>
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="text-left px-4 py-3 font-semibold text-stone-700">Expense</th>
                    <th className="text-right px-4 py-3 font-semibold text-stone-700">Home-Based</th>
                    <th className="text-right px-4 py-3 font-semibold text-stone-700">Mobile</th>
                    <th className="text-right px-4 py-3 font-semibold text-stone-700">Salon</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Equipment & tools', '$2,000–$5,000', '$3,000–$6,000', '$5,000–$15,000'],
                    ['Vehicle/van', '—', '$10,000–$80,000', '—'],
                    ['Lease/buildout', '—', '—', '$10,000–$50,000'],
                    ['Licenses & insurance', '$500–$1,500', '$800–$2,000', '$1,000–$3,000'],
                    ['Initial supplies', '$300–$800', '$500–$1,000', '$500–$1,500'],
                    ['Marketing launch', '$200–$500', '$300–$800', '$500–$2,000'],
                    ['Software (annual)', '$0–$350', '$0–$350', '$0–$350'],
                    ['Total range', '$3,000–$8,150', '$14,600–$90,150', '$17,000–$71,850'],
                  ].map(([expense, home, mobile, salon]) => (
                    <tr key={expense} className="border-b border-stone-100 last:border-0">
                      <td className="px-4 py-3 text-stone-600">{expense}</td>
                      <td className="px-4 py-3 text-stone-700 font-medium text-right">{home}</td>
                      <td className="px-4 py-3 text-stone-700 font-medium text-right">{mobile}</td>
                      <td className="px-4 py-3 text-stone-700 font-medium text-right">{salon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-stone-800 mb-3 mt-8">Monthly Revenue Projection</h3>
            <p className="text-stone-600 leading-relaxed mb-4">
              Build your revenue model from the bottom up:
            </p>
            <div className="bg-white border border-green-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-stone-600">
                {[
                  'Dogs per day: ___ (start with 4, scale to 6–8)',
                  'Average service price: $___ (calculate your weighted average across all services)',
                  'Operating days per month: ___ (typically 20–22)',
                  'Monthly gross revenue = Dogs/day × Average price × Operating days',
                  'Example: 5 dogs × $80 avg × 22 days = $8,800/month gross',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-0.5">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h3 className="text-xl font-bold text-stone-800 mb-3 mt-8">Monthly Expenses</h3>
            <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-stone-600">
                {[
                  'Fixed costs: Rent/mortgage, insurance, loan payments, software subscriptions',
                  'Variable costs: Supplies (shampoo, conditioner, blades, scissors — budget $3–$5/dog), fuel (mobile), marketing spend',
                  'Labor: If salon — groomer commission, bather wages, receptionist wages',
                  'Contingency: Add 10% buffer for unexpected expenses (equipment repair, slow months)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-0.5">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h3 className="text-xl font-bold text-stone-800 mb-3 mt-8">Break-Even Timeline</h3>
            <p className="text-stone-600 leading-relaxed mb-4">
              Most solo groomers reach profitability in 2–4 months if they keep costs lean. Salons
              take 6–12 months due to higher fixed costs. Your break-even point is when monthly
              revenue consistently covers all monthly expenses — not just supplies, but rent,
              insurance, loan payments, and your own salary.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Plan for 60% capacity in months 1–3, 80% in months 4–6, and full capacity by month 9.
              That conservative model keeps you from overspending in the early months when client
              acquisition is still ramping up.
            </p>
          </div>
        </section>

        {/* ── Adapting for Your Model ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Adapting This Template for Your Business Model
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            The seven-section structure works for every type of grooming business, but the details
            shift depending on your model:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                model: 'Mobile Grooming',
                emphasis: 'Route optimization, vehicle costs, fuel budget, drive time, premium pricing, capacity per day',
                link: '/blog/mobile-dog-grooming-business-plan',
                linkText: 'Mobile business plan guide →',
              },
              {
                model: 'Salon',
                emphasis: 'Location selection, buildout costs, staffing model, multi-groomer scheduling, walk-in capacity',
                link: '/grooming-business-operations',
                linkText: 'Operations hub →',
              },
              {
                model: 'Home-Based',
                emphasis: 'Zoning compliance, low startup costs, conversion of existing space, licensing, pricing for referral growth',
                link: '/blog/how-to-start-dog-grooming-business-at-home',
                linkText: 'Home grooming guide →',
              },
            ].map(({ model, emphasis, link, linkText }) => (
              <div key={model} className="p-5 bg-white rounded-xl border border-stone-200">
                <p className="font-bold text-stone-800 mb-2">{model}</p>
                <p className="text-sm text-stone-600 leading-relaxed mb-3">{emphasis}</p>
                <Link
                  href={link}
                  className="text-green-600 font-medium text-sm hover:text-green-700 underline underline-offset-2"
                >
                  {linkText}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Common Mistakes ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              5 Business Plan Mistakes Groomers Make
            </h2>
            <div className="space-y-4">
              {[
                {
                  mistake: 'Pricing based on competitors, not costs',
                  fix: 'Calculate your fully-loaded hourly rate first. If competitors are undercharging, that\'s their problem — don\'t make it yours.',
                },
                {
                  mistake: 'Ignoring drive time in mobile plans',
                  fix: 'Every 15-minute drive between clients is 15 minutes you can\'t bill for. Zone your service area and batch nearby clients on the same day.',
                },
                {
                  mistake: 'No contingency budget',
                  fix: 'Equipment breaks. Slow months happen. Always have a 10% buffer in your monthly budget and 3 months of expenses in reserve.',
                },
                {
                  mistake: 'Skipping the marketing plan',
                  fix: '"Word of mouth" isn\'t a plan for month one. Define specific acquisition channels and a budget for each. See our guide on how to increase sales in your dog grooming business.',
                },
                {
                  mistake: 'Over-projecting revenue in year one',
                  fix: 'Use 60% capacity for months 1–3 and 80% for months 4–6. It\'s better to be pleasantly surprised than caught short.',
                },
              ].map(({ mistake, fix }) => (
                <div key={mistake} className="p-5 bg-white rounded-xl border border-stone-200">
                  <p className="font-semibold text-red-600 text-sm mb-1">✗ {mistake}</p>
                  <p className="text-stone-600 leading-relaxed"><strong>Fix:</strong> {fix}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-10">
            Dog Grooming Business Plan FAQs
          </h2>
          <div className="space-y-8">
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} className="border-b border-stone-200 pb-8 last:border-0">
                <h3 className="text-lg font-bold text-stone-800 mb-3">{item.name}</h3>
                <p className="text-stone-600 leading-relaxed">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Related Links ── */}
        <RelatedLinks
          heading="More Grooming Business Resources"
          links={[
            { href: '/blog/dog-grooming-business-management', category: 'Management', title: 'Dog Grooming Business Management: The Complete Guide' },
            { href: '/blog/how-to-start-dog-grooming-business-at-home', category: 'Getting Started', title: 'How to Start a Dog Grooming Business at Home' },
            { href: '/blog/mobile-dog-grooming-business-plan', category: 'Mobile', title: 'Mobile Dog Grooming Business Plan: The Complete Template' },
            { href: '/grooming-business-operations', category: 'Operations', title: 'Grooming Business Operations Hub' },
          ]}
          columns={4}
        />

        {/* ── Bottom CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Turn Your Business Plan into a Running Business
            </h2>
            <p className="text-green-100 text-lg leading-relaxed mb-8">
              GroomGrid handles the operational side — scheduling, automated reminders, client
              records, and payment collection — so you can focus on executing your plan, not
              managing paperwork.
            </p>
            <Link
              href="/plans"
              className="inline-block px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors"
            >
              See Plans & Pricing →
            </Link>
            <p className="text-green-200 text-sm mt-4">Solo plan from $29/month · Free trial · No credit card required</p>
          </div>
        </section>

        {/* ── Footer ── */}
        <SiteFooter />
      </div>
    </>
  );
}
