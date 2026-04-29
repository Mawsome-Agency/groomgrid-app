import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Dog Grooming Tools & Equipment List: Everything You Need | GroomGrid',
  description:
    'Complete dog grooming tools and equipment list for professional groomers. Covers clippers, shears, dryers, tables, tubs, and estimated costs for mobile and salon setups.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/dog-grooming-tools-equipment-list',
  },
  openGraph: {
    title: 'Dog Grooming Tools & Equipment List: Everything You Need',
    description:
      'Complete dog grooming tools and equipment list for professional groomers. Covers clippers, shears, dryers, tables, tubs, and estimated costs for mobile and salon setups.',
    url: 'https://getgroomgrid.com/blog/dog-grooming-tools-equipment-list',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dog Grooming Tools & Equipment List: Everything You Need',
  description:
    'Complete dog grooming tools and equipment list for professional groomers. Covers clippers, shears, dryers, tables, tubs, and estimated costs for mobile and salon setups.',
  url: 'https://getgroomgrid.com/blog/dog-grooming-tools-equipment-list',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/dog-grooming-tools-equipment-list',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What equipment does a dog groomer need to start?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A beginner groomer needs professional clippers ($150–400), a blade set (#10, #7F, #5F, #4F), straight and curved shears ($80–200 each), a slicker brush, steel comb, nail trimmers, styptic powder, shampoo and conditioner, towels, a grooming table ($150–500), and a grooming loop or noose. For mobile groomers, add a portable tub and a generator or battery system. Budget $1,500–3,000 for a starter kit.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does dog grooming equipment cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A basic home or starter setup costs $1,500–3,000 including clippers, shears, table, and basic tools. A fully equipped salon runs $10,000–25,000 adding hydraulic tables, professional tubs, cage dryers, and HVAC. A mobile grooming van conversion starts at $25,000–80,000 including the vehicle, water system, generator, and all grooming equipment.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best grooming table for a mobile groomer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mobile groomers need a compact, lightweight table that fits in a van. Folding hydraulic tables ($200–500) are popular because they adjust height and fold flat for storage. Look for models with a non-slip surface, adjustable grooming arm, and weight capacity of at least 150 lbs. Electric tables ($400–800) are quieter but require a reliable power source.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a grooming van to start a mobile grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not necessarily. Many mobile groomers start with a converted trailer ($5,000–15,000) or even a house-call model using portable equipment transported in an SUV or van. A full grooming van conversion ($25,000–80,000) is a significant investment best made after validating your client base. Start small, build demand, then upgrade.',
      },
    },
    {
      '@type': 'Question',
      name: 'What software should I use to manage my grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Professional grooming software like GroomGrid helps manage scheduling, client and pet profiles, automated reminders, and payments — all from one app. For mobile groomers, it eliminates the need to juggle paper calendars, text messages, and spreadsheets. GroomGrid starts at $29/month and includes AI-powered scheduling and breed-specific time estimates.',
      },
    },
  ],
};

export default function DogGroomingToolsEquipmentListPage() {
  return (
    <>      <Script
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
          <PageBreadcrumbs slug="blog/dog-grooming-tools-equipment-list" />
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Equipment & Setup
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Dog Grooming Tools &amp; Equipment List:<br className="hidden sm:block" /> The Complete Professional Checklist
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Whether you&apos;re starting your first grooming business or upgrading an existing setup,
            knowing exactly what tools you need — and what they cost — prevents expensive mistakes. This
            is the master list professional groomers actually use.
          </p>
        </header>

        {/* ── Clippers & Blades ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">1. Clippers and Blades</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Clippers are your most-used tool — and the wrong ones will cause fatigue, missed cuts, and
              stressed dogs. For professional use, cordless models from Andis, Wahl, or Oster are the
              industry standard.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { item: 'Heavy-duty rotary clipper', cost: '$150–$350', note: 'For thick, double-coated breeds' },
                { item: 'Finishing clipper', cost: '$100–$200', note: 'Detail work and sensitive areas' },
                { item: 'Clipper blade set (assorted)', cost: '$80–$200', note: '#3, #4, #5, #7, #10, #15, #30, #40' },
                { item: 'Blade coolant spray', cost: '$10–$20', note: 'Keeps blades cool and clean mid-groom' },
                { item: 'Blade wash solution', cost: '$15–$30', note: 'Daily cleaning between appointments' },
                { item: 'Clipper oil', cost: '$8–$15', note: 'Extend blade life significantly' },
              ].map(({ item, cost, note }) => (
                <div key={item} className="p-4 bg-white rounded-lg border border-stone-200">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-stone-800">{item}</p>
                    <span className="text-green-600 font-medium text-sm">{cost}</span>
                  </div>
                  <p className="text-sm text-stone-500">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Shears & Scissors ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">2. Shears and Scissors</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            A good shear set is a long-term investment. Professional-grade scissors stay sharper longer,
            reduce hand fatigue, and give cleaner cuts. Budget options wear out quickly and cost more
            over time through frequent replacement.
          </p>
          <ul className="space-y-3 mb-6">
            {[
              { item: 'Straight shears (7"–8.5")', cost: '$80–$300', use: 'Body work, straight lines' },
              { item: 'Curved shears', cost: '$80–$250', use: 'Topknots, rounded finishes' },
              { item: 'Thinning shears', cost: '$60–$200', use: 'Blending, removing bulk' },
              { item: 'Chunkers / texturizing shears', cost: '$70–$200', use: 'Volume removal, natural finish' },
              { item: 'Small detail shears (5"–6")', cost: '$50–$150', use: 'Face, ears, paws' },
            ].map(({ item, cost, use }) => (
              <li key={item} className="flex items-start gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-stone-800">{item}</p>
                    <span className="text-green-600 font-medium text-sm ml-4">{cost}</span>
                  </div>
                  <p className="text-sm text-stone-500 mt-1">{use}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Bathing & Drying ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">3. Bathing and Drying Equipment</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Efficient bathing and drying is where you win or lose time. A high-velocity dryer cuts
              drying time by 50–70% compared to stand dryers — on a full day of grooms, that adds up to
              hours.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { item: 'High-velocity dryer', cost: '$200–$500', note: 'Removes water fast, reduces coat matting' },
                { item: 'Stand dryer', cost: '$150–$400', note: 'Hands-free finishing dryer' },
                { item: 'Grooming tub / bathing station', cost: '$300–$1,500', note: 'Stainless or fiberglass; elevated for back health' },
                { item: 'Handheld sprayer', cost: '$30–$80', note: 'Flexible rinse attachment' },
                { item: 'Shampoo and conditioner (professional grade)', cost: '$40–$120/mo', note: 'Dilutable concentrates reduce per-dog cost' },
                { item: 'Towels (microfiber, 12+ pack)', cost: '$50–$100', note: 'Fast-absorbing, machine-washable' },
              ].map(({ item, cost, note }) => (
                <div key={item} className="p-4 bg-white rounded-lg border border-stone-200">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-stone-800">{item}</p>
                    <span className="text-green-600 font-medium text-sm">{cost}</span>
                  </div>
                  <p className="text-sm text-stone-500">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tables & Restraints ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">4. Grooming Tables and Restraints</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Never groom on the floor. A proper grooming table protects your back, keeps the dog secure,
            and makes every groom faster and safer. Hydraulic tables are the gold standard for full-time
            groomers.
          </p>
          <ul className="space-y-3">
            {[
              'Hydraulic grooming table — $400–$1,200. Adjustable height prevents back strain across a full day.',
              'Electric grooming table — $500–$1,500. Foot-pedal controlled, ideal for mobile vans.',
              'Grooming arm with loop — $40–$100. Keeps dog steady hands-free.',
              'Non-slip mat (table surface) — $20–$50. Critical for dog safety and comfort.',
              'Grooming noose / safety harness — $15–$30. Extra security for anxious dogs.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Brushes & Combs ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">5. Brushes, Combs, and Dematting Tools</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              You need tools for every coat type. A slicker brush that works on a Shih Tzu won&apos;t do
              much for a Husky. Build a complete set and label it by coat type to save time during busy days.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { item: 'Slicker brush (sizes S, M, L)', cost: '$15–$50 each', note: 'Removes tangles and loose fur' },
                { item: 'Pin brush', cost: '$10–$40', note: 'Long coats and silky breeds' },
                { item: 'Undercoat rake', cost: '$15–$35', note: 'Double-coated breeds' },
                { item: 'Greyhound-style comb (coarse/fine)', cost: '$10–$25', note: 'Finishing and mat detection' },
                { item: 'Dematting comb', cost: '$15–$30', note: 'Breaks apart mats safely' },
                { item: 'Furminator or deshedding tool', cost: '$30–$60', note: 'Reduces shedding appointments' },
              ].map(({ item, cost, note }) => (
                <div key={item} className="p-4 bg-white rounded-lg border border-stone-200">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-stone-800">{item}</p>
                    <span className="text-green-600 font-medium text-sm">{cost}</span>
                  </div>
                  <p className="text-sm text-stone-500">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Startup Cost Summary ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Estimated Startup Equipment Costs</h2>
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-6 mb-6">
            <div className="space-y-3">
              {[
                ['Basic home/salon setup', '$1,500 – $3,000'],
                ['Full salon setup', '$4,000 – $8,000'],
                ['Mobile van (equipment only)', '$5,000 – $12,000'],
                ['Mobile van (van + equipment)', '$25,000 – $60,000'],
              ].map(([setup, cost]) => (
                <div key={setup} className="flex justify-between items-center py-2 border-b border-stone-200 last:border-0">
                  <span className="text-stone-700 font-medium">{setup}</span>
                  <span className="text-green-600 font-bold">{cost}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-stone-600 leading-relaxed">
            Equipment is just the physical side of the business. You&apos;ll also need software to
            manage bookings, reminders, and client records. Read our guide on{' '}
            <Link
              href="/blog/dog-grooming-business-management"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              dog grooming business management
            </Link>{' '}
            to see how the operational side comes together.
          </p>
        </section>

        {/* ── Related Links ── */}
        <PageRelatedLinks slug="blog/dog-grooming-tools-equipment-list" variant="blog" heading="Got your equipment? Now get your schedule sorted." />

        {/* ── Footer ── */}
        <SiteFooter slug="blog/dog-grooming-tools-equipment-list" />
      </div>
    </>
  );
}
