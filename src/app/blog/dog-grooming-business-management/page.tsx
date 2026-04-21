import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Dog Grooming Business Management: The Complete Guide | GroomGrid',
  description:
    'Learn how to manage your dog grooming business like a pro — scheduling, client retention, deposits, payments, and the tools that make it all click.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/dog-grooming-business-management',
  },
  openGraph: {
    title: 'Dog Grooming Business Management: The Complete Guide',
    description:
      'Learn how to manage your dog grooming business like a pro — scheduling, client retention, deposits, payments, and the tools that make it all click.',
    url: 'https://getgroomgrid.com/blog/dog-grooming-business-management',
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
      name: 'Dog Grooming Business Management',
      item: 'https://getgroomgrid.com/blog/dog-grooming-business-management',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dog Grooming Business Management: The Complete Guide',
  description:
    'Learn how to manage your dog grooming business like a pro — scheduling, client retention, deposits, payments, and the tools that make it all click.',
  url: 'https://getgroomgrid.com/blog/dog-grooming-business-management',
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
    '@id': 'https://getgroomgrid.com/blog/dog-grooming-business-management',
  },
};

export default function DogGroomingBusinessManagementPage() {
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
                <Link href="/grooming-business-operations/" className="hover:text-green-600 transition-colors">
                  Operations
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">
                Business Management
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Business Management
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Dog Grooming Business Management:<br className="hidden sm:block" /> Run the Business, Not Just the Grooms
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            You became a groomer because you love dogs. But somewhere between your first client and
            your 50th, you realized you&apos;re also running a small business — and that part nobody
            trained you for. This guide covers the management fundamentals that keep a grooming
            operation profitable, organized, and growing.
          </p>
        </header>

        {/* ── Why Management Matters ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Why Most Groomers Struggle with the Business Side
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Grooming school teaches you to handle a nervous Goldendoodle. It doesn&apos;t teach
              you to handle a client who no-shows three times in a row, or how to price your
              services when your rent goes up, or how to keep a 5-groomer team coordinated without
              constant check-ins.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              The result: talented groomers who are fully booked but barely profitable. They&apos;re
              losing revenue to no-shows, leaving money on the table with underpriced services, and
              spending hours every week on admin that should take minutes.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Good business management isn&apos;t about becoming a spreadsheet wizard. It&apos;s
              about putting the right systems in place so the business runs smoothly — even on your
              busiest days.
            </p>
          </div>
        </section>

        {/* ── Scheduling ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            1. Scheduling: The Foundation of Everything
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Your schedule is your revenue. Every unfilled slot is money you can&apos;t recover.
            Every double-booking is a client relationship at risk. Getting scheduling right is the
            single highest-leverage thing you can do for your business.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            The best grooming schedules have a few things in common:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Buffer time between appointments — rushing leads to stressed dogs and stressed groomers',
              'Service-type blocking — a full groom needs 2–3 hours; a nail trim needs 20 minutes',
              'No-gap optimization — schedule similar services back-to-back to maximize throughput',
              'Recurring appointment slots for your best regulars',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-stone-600 leading-relaxed">
            Paper calendars and generic scheduling apps create gaps. A grooming-specific platform
            that understands service durations, breed complexity, and your business hours eliminates
            them.
          </p>
        </section>

        {/* ── Client Records ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              2. Client and Pet Records: Know Every Dog Before They Walk In
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              The best groomers remember details — the Bichon who hates her ears touched, the
              Shih Tzu on heart medication, the Lab mix whose owner always wants the same cut.
              With 50+ active clients, you can&apos;t hold all of that in your head.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              A solid client record system captures:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Pet profile', detail: 'Breed, size, coat type, age, temperament notes' },
                { label: 'Service history', detail: 'What was done last time, what the owner requested' },
                { label: 'Health flags', detail: 'Medications, allergies, anxiety, vet contacts' },
                { label: 'Grooming notes', detail: 'Preferred cuts, areas to avoid, owner preferences' },
                { label: 'Contact info', detail: 'Phone, email, emergency contact, address' },
                { label: 'Payment history', detail: 'Outstanding balances, deposit status, preferred method' },
              ].map(({ label, detail }) => (
                <div key={label} className="p-4 bg-white rounded-lg border border-stone-200">
                  <p className="font-semibold text-stone-800 mb-1">{label}</p>
                  <p className="text-sm text-stone-500">{detail}</p>
                </div>
              ))}
            </div>
            <p className="text-stone-600 leading-relaxed">
              When this information is at your fingertips before each appointment, you give every
              dog a better experience and every client a reason to keep coming back.
            </p>
          </div>
        </section>

        {/* ── Deposits & Payments ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            3. Deposits and Payments: Protect Your Time
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            A groomer&apos;s time is the product. When a client doesn&apos;t show up, you
            can&apos;t re-sell that hour. Deposit policies exist to solve this problem — not to
            penalize clients, but to filter out the ones who don&apos;t take their appointment
            seriously.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            A standard deposit structure that works well for most solo groomers:
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <ul className="space-y-2 text-stone-700">
              <li>
                <strong>New clients:</strong> 50% deposit at booking, remainder at pickup
              </li>
              <li>
                <strong>Existing clients with good history:</strong> Optional or waived
              </li>
              <li>
                <strong>High-demand slots (weekends, holidays):</strong> 100% prepay
              </li>
              <li>
                <strong>Cancellation window:</strong> 24–48 hours to avoid forfeiture
              </li>
            </ul>
          </div>
          <p className="text-stone-600 leading-relaxed">
            The key is consistency. Clients respect policies that are communicated clearly upfront
            and applied the same way every time. Use a{' '}
            <Link
              href="/blog/dog-grooming-contract-template"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              grooming contract template
            </Link>{' '}
            to document these policies so there are never disputes about what was agreed.
          </p>
        </section>

        {/* ── Reminders & Retention ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              4. Reminders and Client Retention: Turn One-Times into Regulars
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Acquiring a new grooming client costs 5× more than keeping an existing one. Your
              retention strategy is your most profitable marketing channel — and it starts with
              staying in touch.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              The grooming retention playbook:
            </p>
            <div className="space-y-4 mb-6">
              {[
                {
                  step: '24-48 hours before',
                  action: 'Automated appointment reminder (SMS + email)',
                  why: 'Reduces no-shows by 40–60%',
                },
                {
                  step: 'Same day',
                  action: 'Morning confirmation with arrival instructions',
                  why: 'Reduces day-of questions and late arrivals',
                },
                {
                  step: '4–6 weeks after',
                  action: 'Rebooking reminder based on breed grooming cycle',
                  why: 'Keeps regulars on schedule without them having to initiate',
                },
                {
                  step: 'Annually',
                  action: 'Happy birthday message for the pet',
                  why: 'Builds emotional connection, drives word-of-mouth',
                },
              ].map(({ step, action, why }) => (
                <div key={step} className="flex gap-4 p-4 bg-white rounded-lg border border-stone-200">
                  <div className="flex-shrink-0 w-32 text-sm font-semibold text-green-600">{step}</div>
                  <div>
                    <p className="text-stone-800 font-medium">{action}</p>
                    <p className="text-sm text-stone-500 mt-0.5">{why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            5. Pricing: Stop Undercharging
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Most groomers set prices based on what their competitors charge, not what their
            business needs to be profitable. This is a guaranteed path to burnout — you&apos;ll
            be fully booked and still not making enough.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            Price your services based on:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Your actual cost per service (supplies, time, overhead)',
              'The market rate in your specific area (not just regional averages)',
              'Breed complexity — a matted Doodle takes 3× longer than a smooth-coat Lab',
              'Your target hourly rate after expenses',
              'Add-on services that increase per-appointment revenue without adding time',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-stone-600 leading-relaxed">
            Review your pricing every 6 months. Costs go up — your prices should too. Most clients
            won&apos;t leave over a $5–$10 increase if they love you and their dog loves coming.
            Want to understand the full revenue picture? Read our guide on{' '}
            <Link
              href="/blog/is-dog-grooming-a-profitable-business"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              whether dog grooming is a profitable business
            </Link>
            .
          </p>
        </section>

        {/* ── Tools ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              6. The Right Tools Make Everything Easier
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              You can run a grooming business with a paper calendar, a notes app, and Venmo. A lot
              of groomers do — until they can&apos;t. The moment your client list passes 30–40
              active pets, manual systems start costing you time and money every single week.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              What to look for in a grooming management platform:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                'Scheduling built for grooming service types',
                'Automated appointment reminders',
                'Client and pet profiles with grooming history',
                'Deposit and payment collection',
                'Mobile-friendly so you can manage from anywhere',
                'Rebooking reminders based on breed cycles',
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-stone-200">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span className="text-stone-700">{feature}</span>
                </div>
              ))}
            </div>
            <p className="text-stone-600 leading-relaxed">
              For a deeper look at the operational side, visit our{' '}
              <Link
                href="/grooming-business-operations/"
                className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
              >
                grooming business operations hub
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── Conclusion ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            The Bottom Line
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Dog grooming business management comes down to five pillars: scheduling, client records,
            payments, retention, and pricing. Nail those and the rest of the business follows.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            You don&apos;t need to overhaul everything at once. Pick the area causing the most pain
            right now — whether that&apos;s no-shows, disorganized client notes, or manual payment
            chasing — and fix that first. Each system you put in place compounds over time.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Groomers who invest in their business infrastructure earlier grow faster, burn out less,
            and end up with a business that can scale. Whether you&apos;re solo or building toward a
            salon team, the fundamentals are the same.
          </p>
        </section>

        {/* ── Signup CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Ready to streamline your grooming business?
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              GroomGrid handles scheduling, reminders, payments, and client records in one simple
              platform. Try it free for 14 days — no credit card required.
            </p>
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors shadow-md inline-block"
            >
              Try GroomGrid Free →
            </Link>
          </div>
        </section>

        {/* ── Related Articles ── */}
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-stone-800 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/blog/dog-grooming-contract-template"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Templates</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors">
                Dog Grooming Contract Template: What to Include and Why
              </h3>
            </Link>
            <Link
              href="/blog/is-dog-grooming-a-profitable-business"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Business</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors">
                Is Dog Grooming a Profitable Business? Real Numbers, Real Talk
              </h3>
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-6 py-8 max-w-5xl mx-auto border-t border-stone-100 mt-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
            <Link href="/" className="font-bold text-green-600">
              GroomGrid 🐾
            </Link>
            <div className="flex gap-6">
              <Link href="/grooming-business-operations/" className="hover:text-stone-600 transition-colors">
                Operations Hub
              </Link>
              <Link href="/mobile-grooming-business/" className="hover:text-stone-600 transition-colors">
                Mobile Grooming
              </Link>
              <Link href="/plans" className="hover:text-stone-600 transition-colors">
                Pricing
              </Link>
              <Link href="/signup" className="hover:text-stone-600 transition-colors">
                Sign Up
              </Link>
            </div>
            <p>© {new Date().getFullYear()} GroomGrid. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
