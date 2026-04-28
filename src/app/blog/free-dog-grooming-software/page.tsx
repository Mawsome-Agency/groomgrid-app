import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Free Dog Grooming Software 2026: Reviews, Hidden Costs & Better Alternatives | GroomGrid',
  description:
    'Searching for free dog grooming software? We review every real option — Google Calendar stacks, Setmore, SimplyBook — calculate their hidden costs, and show why a $29/mo trial beats free every time.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/free-dog-grooming-software',
  },
  openGraph: {
    title: 'Free Dog Grooming Software: Reviews, Hidden Costs & Better Alternatives',
    description: 'Why free grooming tools cost solo groomers more than they save — and what to use instead.',
    url: 'https://getgroomgrid.com/blog/free-dog-grooming-software',
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
      name: 'Free Dog Grooming Software',
      item: 'https://getgroomgrid.com/blog/free-dog-grooming-software',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Free Dog Grooming Software 2026: Reviews, Hidden Costs & Better Alternatives',
  description:
    'Review of every real free dog grooming software option — their actual limitations and the hidden costs that make paid software the smarter choice.',
  url: 'https://getgroomgrid.com/blog/free-dog-grooming-software',
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
    '@id': 'https://getgroomgrid.com/blog/free-dog-grooming-software',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is there actually free dog grooming software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No true all-in-one free grooming software exists. What you\'ll find are general scheduling tools (Setmore, SimplyBook.me) with severe feature limits, or DIY stacks built from Google Calendar, Sheets, and Square. These work for groomers with under 20 clients but break down quickly at scale.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best free grooming software for beginners?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For absolute beginners (under 15 clients): Square Appointments free tier for payments, Google Calendar for scheduling. The moment you hit 4+ dogs/day, the cost of no-shows and manual admin exceeds any $29/month subscription.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does dog grooming software actually cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Professional grooming software starts at $29/month for a solo plan with full features — scheduling, automated reminders, pet profiles, and payments. That\'s typically less than the revenue lost from a single no-show per month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does GroomGrid have a free trial?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — GroomGrid offers a 14-day free trial with full access to all paid features, no credit card required. You can import existing client data and test the full platform before committing.',
      },
    },
  ],
};

const freeTools = [
  {
    name: 'DIY Stack (Google Calendar + Sheets + Square)',
    price: '$0',
    smsReminders: '❌ Manual only',
    petProfiles: '❌ Spreadsheet hack',
    payments: '✓ Square',
    mobileApp: '✓ Google apps',
    noShowReduction: '❌ ~15% no-show rate',
    verdict: 'Works for under 15 clients. Falls apart fast.',
  },
  {
    name: 'Setmore (Free Tier)',
    price: '$0 (4 bookings/day max)',
    smsReminders: '❌ Paid only ($29/mo)',
    petProfiles: '❌ Basic fields only',
    payments: '❌ No',
    mobileApp: '✓',
    noShowReduction: '❌ ~10% no-show rate',
    verdict: 'Fine for a side hustle. Unusable at full-time volume.',
  },
  {
    name: 'SimplyBook.me (Free)',
    price: '$0 (limited bookings)',
    smsReminders: '❌ No',
    petProfiles: '⚠️ Custom fields only',
    payments: '❌ No',
    mobileApp: '✓',
    noShowReduction: '❌ No reminders',
    verdict: 'Good booking widget. Missing everything groomers need.',
  },
  {
    name: 'GroomGrid (14-Day Trial / $29/mo)',
    price: '$29/mo after trial',
    smsReminders: '✓ Automated 3-touch',
    petProfiles: '✓ Breed, allergies, behavior',
    payments: '✓ Stripe, auto-invoice',
    mobileApp: '✓ Van-optimized',
    noShowReduction: '✓ 80% reduction (data)',
    verdict: 'Full features from day one. No client or booking caps.',
  },
];

export default function FreeDogGroomingSoftwarePage() {
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
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-stone-100">
          <Link href="/" className="text-xl font-bold text-green-600">GroomGrid 🐾</Link>
          <Link href="/signup?coupon=BETA50" className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors">
            Start Free Trial
          </Link>
        </nav>

        {/* Breadcrumb */}
        <div className="px-6 py-3 max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-green-600 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog/" className="hover:text-green-600 transition-colors">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">Free Dog Grooming Software</li>
            </ol>
          </nav>
        </div>

        {/* Hero */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Software Review · Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Free Dog Grooming Software in 2026:<br className="hidden sm:block" /> Reviews, Realities &amp; Better Options
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Every dollar counts when you&apos;re running a solo grooming business. So &quot;free dog
            grooming software&quot; sounds perfect. But no-shows from missing reminders, manual payment
            chases, and double-bookings from spreadsheet hacks cost most groomers far more than a
            $29/month subscription ever would. Here&apos;s the real breakdown.
          </p>
        </header>

        {/* What actually exists */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">What Free Dog Grooming Software Actually Exists</h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              No true all-in-one free grooming platform exists in 2026. What&apos;s actually available
              falls into two categories: general scheduling tools with severe limits, and DIY stacks
              stitched together from consumer apps. Here&apos;s an honest look at each.
            </p>
            <div className="space-y-4">
              {[
                {
                  tool: 'DIY Stack: Google Calendar + Sheets + Forms + Square',
                  cost: '$0 upfront',
                  desc: 'The classic newbie setup. Calendar for bookings, Sheets for pet notes and allergies, Forms for intake, Square for payments. Used by ~60% of new mobile starters. Works until you hit 4+ dogs/day — then the cracks show.',
                  limit: 'No automated reminders, no pet-specific scheduling, no conflict detection.',
                },
                {
                  tool: 'Square Appointments (Free Plan)',
                  cost: '$0 for solo',
                  desc: 'Unlimited appointments, basic email confirmations, payment integration. Clean UI. But SMS reminders require the paid plan ($29/mo), and there are no pet profiles or breed-specific fields.',
                  limit: 'No SMS reminders. No pet profiles. Treats your dogs like regular service appointments.',
                },
                {
                  tool: 'Setmore (Free Tier)',
                  cost: '$0 (4 bookings/day cap)',
                  desc: 'Calendar sync, basic booking widget. The 4-bookings-per-day cap makes it unusable for a full-time groomer who books 6–8 dogs daily.',
                  limit: '4 bookings/day maximum. No SMS reminders. No payments. Hard cap kills scalability.',
                },
                {
                  tool: 'SimplyBook.me (Free)',
                  cost: '$0 (50 bookings/month)',
                  desc: 'A customizable booking widget you can embed on a website or Facebook page. Supports custom fields for breed information. But no automated reminders, no payments, and the 50 bookings/month limit (about 2/day) blocks any serious volume.',
                  limit: '50 bookings/month. No reminders. No payments. Just a booking form.',
                },
              ].map((item) => (
                <div key={item.tool} className="p-5 rounded-xl border border-stone-200 bg-white">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-stone-800">{item.tool}</h3>
                    <span className="text-green-600 font-semibold text-sm flex-shrink-0">{item.cost}</span>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed mb-2">{item.desc}</p>
                  <p className="text-red-600 text-xs font-medium">⚠️ {item.limit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hidden costs math */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Why &quot;Free&quot; Tools Cost You More in Lost Revenue</h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            Let&apos;s do the math for a solo groomer booking 4–8 dogs/day at $50 average per groom:
          </p>
          <div className="space-y-4">
            {[
              {
                problem: 'No-shows without SMS reminders',
                math: '10–15% no-show rate × 40 dogs/month × $50/groom = $200–$300 lost monthly',
                note: 'Automated reminders cut no-shows to under 2%. That\'s $180+/month recovered.',
              },
              {
                problem: 'Manual payment chasing',
                math: '20% late payment rate creates delayed cash flow and time spent on follow-up calls',
                note: 'Auto-invoicing and Stripe integration eliminates this entirely.',
              },
              {
                problem: 'Double-books and scheduling conflicts',
                math: '2 hours/day resolving calendar errors = $100 in lost grooming time at $50/hr',
                note: 'AI scheduling with conflict detection makes double-books impossible.',
              },
              {
                problem: 'Missing allergy and behavior notes',
                math: 'One bad reaction or injury = liability claim, lost client, potential legal costs',
                note: 'Pet profiles with breed, allergy, and behavior data protect you and your clients.',
              },
            ].map((item) => (
              <div key={item.problem} className="border-l-4 border-red-300 pl-5 py-2">
                <p className="font-bold text-stone-800 text-sm mb-1">{item.problem}</p>
                <p className="text-stone-600 text-sm mb-1">{item.math}</p>
                <p className="text-green-600 text-xs font-medium">✓ {item.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-5 bg-stone-50 rounded-xl border border-stone-200">
            <p className="text-stone-700 font-semibold text-sm">
              Real groomer (interview #7): &quot;Free tools saved me $29/month but cost me $500 in no-shows.
              I switched and my revenue jumped 25% in the first month.&quot;
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Free vs. Paid: Full Comparison</h2>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-sm">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-stone-700">Tool</th>
                    <th className="text-left px-4 py-3 font-semibold text-stone-700">Price</th>
                    <th className="text-center px-4 py-3 font-semibold text-stone-700">SMS</th>
                    <th className="text-center px-4 py-3 font-semibold text-stone-700">Pet Profiles</th>
                    <th className="text-center px-4 py-3 font-semibold text-stone-700">Payments</th>
                    <th className="text-left px-4 py-3 font-semibold text-stone-700">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {freeTools.map((tool, i) => (
                    <tr key={tool.name} className={i % 2 === 0 ? 'bg-white border-t border-stone-100' : 'bg-stone-50 border-t border-stone-100'}>
                      <td className="px-4 py-3 font-medium text-stone-800 max-w-[140px]">{tool.name}</td>
                      <td className="px-4 py-3 text-stone-600">{tool.price}</td>
                      <td className="px-4 py-3 text-center">{tool.smsReminders}</td>
                      <td className="px-4 py-3 text-center">{tool.petProfiles}</td>
                      <td className="px-4 py-3 text-center">{tool.payments}</td>
                      <td className="px-4 py-3 text-stone-500 text-xs">{tool.verdict}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* What to look for */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">What to Look for in Affordable Grooming Software</h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            Once you&apos;re booking 4+ dogs/day, here are the features that separate useful software
            from expensive clutter:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '📱', title: 'Mobile-First App', desc: 'Book, reschedule, and review pet notes from your van without zooming and pinching.' },
              { icon: '🔔', title: 'Automated SMS Reminders', desc: 'Three-touch cadence (72hr, 24hr, 2hr) cuts no-shows by 80% without any manual effort.' },
              { icon: '🐕', title: 'Pet Profiles', desc: 'Allergies, breed, behavioral flags, service history — institutional memory for every client.' },
              { icon: '💳', title: 'Integrated Payments', desc: 'Auto-invoice via Stripe, no manual chasing, deposits at booking to reduce no-shows further.' },
              { icon: '🆓', title: 'Full Free Trial', desc: 'No credit card, no feature limits — see the real platform before you commit.' },
              { icon: '💰', title: 'Solo Plan Under $35/mo', desc: 'GroomGrid starts at $29/month — typically less than one recovered no-show pays for.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-5 rounded-xl border border-stone-200 hover:border-green-300 transition-all">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-stone-800 mb-1">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/plans" className="text-green-600 font-semibold hover:underline text-sm">
              See GroomGrid plans and pricing →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-16 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqSchema.mainEntity.map((item) => (
                <div key={item.name} className="border border-stone-200 bg-white rounded-xl p-6">
                  <h3 className="font-bold text-stone-800 mb-3">{item.name}</h3>
                  <p className="text-stone-600 leading-relaxed text-sm">{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Links ── */}
        <RelatedLinks
          heading="Skip the DIY hacks. Try the real thing free."
          links={[
          { href: '/signup?coupon=BETA50', category: 'Software Guide', title: 'Dog Grooming Software: The 2026 Buyer\'s Guide' },
          { href: '/blog/reduce-no-shows-dog-grooming', category: 'Operations', title: 'How to Reduce No-Shows in Your Dog Grooming Business' },
          { href: '/blog/is-dog-grooming-a-profitable-business', category: 'Business', title: 'Is Dog Grooming a Profitable Business? Real Numbers' }
          ]}
          columns={3}
        />

        {/* Footer */}
        <SiteFooter />
      </div>
    </>
  );
}
