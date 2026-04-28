import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'How to Start a Dog Grooming Business at Home: Step-by-Step Guide | GroomGrid',
  description:
    'Start your dog grooming business at home with this complete guide — licensing, equipment, pricing, zoning rules, and the software that keeps everything organized from day one.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/how-to-start-dog-grooming-business-at-home',
  },
  openGraph: {
    title: 'How to Start a Dog Grooming Business at Home',
    description:
      'Start your dog grooming business at home with this complete guide — licensing, equipment, pricing, zoning rules, and the software that keeps everything organized from day one.',
    url: 'https://getgroomgrid.com/blog/how-to-start-dog-grooming-business-at-home',
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
      name: 'How to Start a Dog Grooming Business at Home',
      item: 'https://getgroomgrid.com/blog/how-to-start-dog-grooming-business-at-home',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Start a Dog Grooming Business at Home: Step-by-Step Guide',
  description:
    'Start your dog grooming business at home with this complete guide — licensing, equipment, pricing, zoning rules, and the software that keeps everything organized from day one.',
  url: 'https://getgroomgrid.com/blog/how-to-start-dog-grooming-business-at-home',
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
    '@id': 'https://getgroomgrid.com/blog/how-to-start-dog-grooming-business-at-home',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I run a dog grooming business from my home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, most states allow home-based dog grooming businesses, but you need to check local zoning laws, obtain a business license, and meet health and safety requirements. You also need a dedicated space — ideally a separate room or outbuilding with proper drainage, ventilation, and a grooming tub.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to start a dog grooming business at home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A home-based grooming setup typically costs $2,000–$8,000. The biggest expenses are a grooming tub ($400–$1,500), a professional grooming table ($200–$800), clippers and shears ($300–$600), a dryer ($150–$500), and initial supplies. Licensing and insurance run $200–$500/year. You save on rent, which is the main advantage over a retail location.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a license to groom dogs at home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You need a general business license in most jurisdictions. Some areas also require a kennel or animal care permit, especially if you board dogs. Professional grooming certification is not legally required in most states, but it builds credibility and helps you command higher prices.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much can a home-based dog groomer make?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A home-based groomer doing 4–6 dogs per day at $50–$75 per groom can earn $40,000–$75,000 per year before expenses. Because overhead is low — no rent, no commute — profit margins are typically 60–70%, compared to 30–40% at a retail salon.',
      },
    },
    {
      '@type': 'Question',
      name: 'What equipment do I need to start grooming dogs at home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The essentials are: a professional grooming table with arm and noose, a grooming tub or raised bath, high-quality clippers and blades, straight and curved shears, a force dryer, shampoo and conditioner, towels, a cage or holding area, and basic safety equipment (muzzle, styptic powder, first aid kit). Budget $2,000–$5,000 for a complete starter setup.',
      },
    },
  ],
};

const startupSteps = [
  {
    step: '1',
    title: 'Check Zoning and Local Regulations',
    description:
      'Before buying a single pair of shears, check your local zoning laws. Many residential areas allow home businesses, but some restrict commercial activity, signage, or client traffic. Call your city clerk or zoning office and ask specifically about home-based pet grooming. You need to know whether client parking, noise, or waste disposal will be an issue.',
  },
  {
    step: '2',
    title: 'Get Your Licenses and Insurance',
    description:
      'Register your business (LLC is common for liability protection), get a general business license, and look into whether your area requires a kennel or animal care permit. Insurance is non-negotiable — general liability and professional liability (care, custody, and control) policies run $200–$500/year and protect you if a dog is injured on your property.',
  },
  {
    step: '3',
    title: 'Build Out Your Grooming Space',
    description:
      'You need a dedicated space — a spare room, garage, or outbuilding — with good lighting, ventilation, and waterproof flooring. Install a grooming tub (or modify an existing one with a dog ramp), set up a professional table with an arm and noose, and create a drying area. Proper drainage saves you from carrying soggy towels through your house.',
  },
  {
    step: '4',
    title: 'Buy Your Equipment',
    description:
      'Start with professional-grade basics: clippers (Andis or Oster 2-speed), a blade set (#10, #7F, #5F, #4F), straight and curved shears (8-inch minimum), a force dryer, a slicker brush, nail grinder, shampoo, conditioner, and towels. Budget $2,000–$5,000 for a quality starter kit. Cheap equipment costs more in replacement and frustration.',
  },
  {
    step: '5',
    title: 'Set Your Pricing',
    description:
      'Research what other groomers in your area charge. Home-based groomers often price 10–20% below retail salons because overhead is lower — but do not undervalue yourself. A typical price range is $45–$75 for a standard bath and haircut, $75–$150+ for specialty breeds. Build a pricing sheet by breed and coat condition.',
  },
  {
    step: '6',
    title: 'Set Up Your Business Systems',
    description:
      'This is where most home groomers stumble. You need a way to book appointments, track client and pet info, send reminders, and collect payments — from day one. Paper books and texts work for 2–3 dogs a week. Once you are doing 4+, you need software. GroomGrid handles scheduling, automated reminders, client profiles, and payments in one place, built specifically for groomers.',
  },
];

export default function HowToStartDogGroomingBusinessAtHomePage() {
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
                How to Start a Dog Grooming Business at Home
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
            How to Start a Dog Grooming<br className="hidden sm:block" /> Business at Home
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Starting a dog grooming business at home is one of the lowest-cost ways to enter the
            pet care industry — but low cost does not mean no planning. This guide walks you through
            zoning, licensing, equipment, pricing, and the systems you need to go from &quot;I groom my
            own dog&quot; to &quot;I run a real business.&quot;
          </p>
        </header>

        {/* ── Why Home-Based ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Why Start a Dog Grooming Business at Home?
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              The math is compelling. A retail salon location costs $1,500–$4,000/month in rent
              alone. A home-based setup has zero rent and a fraction of the overhead. That means
              profit margins of 60–70% versus 30–40% at a traditional salon.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Home-based grooming also gives you flexibility. You set your own hours, control your
              environment, and eliminate the commute. For groomers with kids, pets of their own, or
              simply a preference for working in their own space, it is an ideal setup.
            </p>
            <p className="text-stone-600 leading-relaxed">
              The trade-off is volume — most home groomers max out at 4–6 dogs per day because of
              space constraints. But at $50–$75 per groom with minimal overhead, that translates to
              $40,000–$75,000 per year in take-home income.
            </p>
          </div>
        </section>

        {/* ── Step-by-Step ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            How to Start: 6 Steps to Launch Your Home Grooming Business
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            Here is the sequence that works — not the order that feels obvious, but the order that
            avoids expensive mistakes. Check zoning before you buy equipment. Get insurance before
            you take your first client. Set up systems before you need them.
          </p>
          <div className="space-y-8">
            {startupSteps.map((item) => (
              <div key={item.step} className="flex items-start gap-5 p-6 rounded-xl border border-stone-200 hover:border-green-300 transition-all">
                <span className="text-3xl font-extrabold text-green-500 flex-shrink-0">{item.step}</span>
                <div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Equipment Breakdown ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Home Grooming Equipment: What You Actually Need
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Do not overspend on day one. Here is the realistic starter kit with actual price ranges:
            </p>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-stone-700">
                  <tr>
                    <th className="text-left px-5 py-4 font-semibold">Item</th>
                    <th className="text-left px-5 py-4 font-semibold">Budget Range</th>
                    <th className="text-left px-5 py-4 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: 'Grooming Table (hydraulic)', range: '$200–$800', notes: 'Get one with an arm and noose' },
                    { item: 'Grooming Tub / Raised Bath', range: '$400–$1,500', notes: 'With ramp and restraints' },
                    { item: 'Clippers (2-speed)', range: '$150–$300', notes: 'Andis UltraEdge or Oster Golden' },
                    { item: 'Blade Set (4–6 blades)', range: '$80–$200', notes: '#10, #7F, #5F, #4F minimum' },
                    { item: 'Shears (straight + curved)', range: '$100–$400', notes: '8-inch minimum, Japanese steel preferred' },
                    { item: 'Force Dryer', range: '$150–$500', notes: 'K-9 III or Flying Pig' },
                    { item: 'Shampoo & Conditioner', range: '$50–$150', notes: 'Pro-grade, concentrated formulas' },
                    { item: 'Towels (20+)', range: '$40–$80', notes: 'Microfiber or heavy cotton' },
                    { item: 'Cage / Holding Area', range: '$100–$300', notes: 'Ventilated, easy to clean' },
                    { item: 'Safety Supplies', range: '$50–$100', notes: 'Muzzle set, styptic powder, first aid kit' },
                  ].map((row, i) => (
                    <tr key={row.item} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                      <td className="px-5 py-3 text-stone-700 font-medium">{row.item}</td>
                      <td className="px-5 py-3 text-green-600 font-semibold">{row.range}</td>
                      <td className="px-5 py-3 text-stone-500 text-sm">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-stone-500 text-xs mt-3">
              Prices based on major pet supply retailers as of April 2026. Quality varies — buy professional-grade.
            </p>
          </div>
        </section>

        {/* ── Zoning & Legal ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Zoning and Legal Requirements for Home Grooming
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            This is the step most people skip — and the one that causes the most trouble. Zoning
            laws determine whether you can legally run a business from your home. In most
            residential zones, home businesses are allowed, but with conditions.
          </p>
          <div className="space-y-4 mb-6">
            {[
              'Client traffic — some zones limit the number of clients per day or require off-street parking',
              'Signage — most residential zones restrict or prohibit business signage',
              'Noise — dryers and barking dogs may violate noise ordinances, especially in close neighborhoods',
              'Waste disposal — you need a plan for fur, wastewater, and waste that complies with local health codes',
              'Separate entrance — some jurisdictions require a separate entrance for home businesses',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">→</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-stone-600 leading-relaxed">
            Call your local zoning office before investing in equipment. A 10-minute phone call can
            save you thousands. If your home is not zoned for business, you may need a conditional
            use permit — which is obtainable in most cases but takes 4–8 weeks.
          </p>
        </section>

        {/* ── Pricing ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              How to Price Your Home Grooming Services
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Home-based groomers have a pricing advantage: lower overhead means you can charge less
              than retail salons while keeping more profit. But do not race to the bottom.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Research local salon prices, then set yours 10–15% below. That gap is your competitive
              advantage — clients get the same quality grooming at a better price, and you still
              earn more per groom than you would at a salon paying booth rent.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Standard pricing for home grooming in 2026:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Small breeds (Shih Tzu, Yorkie): $45–$65 per groom',
                'Medium breeds (Cocker Spaniel, Springer): $55–$80 per groom',
                'Large breeds (Golden Retriever, Lab): $65–$100 per groom',
                'Giant breeds (Newfoundland, Bernese): $90–$150+ per groom',
                'Cats (if you groom them): $60–$120 per groom',
                'Add-ons: teeth brushing +$10, de-shedding treatment +$15–$25, blueberry facial +$8',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed">
              Build a pricing sheet by breed size and coat condition. Mats, aggressive dogs, and
              senior pets all take extra time — charge for it.
            </p>
          </div>
        </section>

        {/* ── Business Systems ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              The Business Systems You Need from Day One
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Most home groomers start with a paper calendar, a notebook for client info, and
              Venmo for payments. That works — until it does not. Missed appointments, lost
              client history, and chasing payments are the three things that eat your time and
              your income.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              You need three systems from the start:
            </p>
            <div className="space-y-6">
              {[
                {
                  q: 'Scheduling with automated reminders',
                  a: 'Every no-show costs you $50–$100 in lost revenue. Automated SMS reminders — sent at 72 hours, 24 hours, and 2 hours before the appointment — reduce no-shows by 40–60%. GroomGrid sends these automatically, so you never have to remember.',
                },
                {
                  q: 'Client and pet profiles',
                  a: 'Breed, size, vaccination status, behavior notes, service history — all in one place. When Mrs. Johnson calls about her anxious Border Collie, you should be able to pull up every note in seconds. GroomGrid stores full pet profiles with behavioral flags and grooming history.',
                },
                {
                  q: 'Payment processing',
                  a: 'Collect deposits at booking. Accept card payments at checkout. Send invoices for packages. Integrated payment processing eliminates the awkward &quot;can you Venmo me?&quot; conversation and means you get paid on the spot.',
                },
              ].map((item) => (
                <div key={item.q} className="border-l-4 border-green-400 pl-5">
                  <p className="font-bold text-stone-800 mb-2">{item.q}</p>
                  <p className="text-stone-600 leading-relaxed text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqSchema.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => (
              <div key={item.name} className="border border-stone-200 rounded-xl p-6">
                <h3 className="font-bold text-stone-800 mb-3">{item.name}</h3>
                <p className="text-stone-600 leading-relaxed text-sm">
                  {item.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Related Links ── */}
        <RelatedLinks
          heading="Run your home grooming business like a pro"
          links={[
          { href: '/signup?coupon=BETA50', category: 'Startup Costs', title: 'How Much Does It Cost to Start a Dog Grooming Business?' },
          { href: '/blog/is-dog-grooming-a-profitable-business', category: 'Profitability', title: 'Is Dog Grooming a Profitable Business? Real Numbers, Real Talk' },
          { href: '/blog/dog-grooming-business-management', category: 'Management', title: 'Dog Grooming Business Management: The Complete Guide' }
          ]}
          columns={3}
        />

        {/* ── Footer ── */}
        <SiteFooter />
      </div>
    </>
  );
}
