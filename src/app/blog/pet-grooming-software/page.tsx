import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Pet Grooming Software: What It Is and Why Your Business Needs It | GroomGrid',
  description:
    'Pet grooming software automates booking, reminders, payments, and client records. Learn what to look for, what to avoid, and how the right tool transforms your grooming business.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/pet-grooming-software',
  },
  openGraph: {
    title: 'Pet Grooming Software: What It Is and Why Your Business Needs It',
    description:
      'Pet grooming software automates booking, reminders, payments, and client records. Learn what to look for, what to avoid, and how the right tool transforms your grooming business.',
    url: 'https://getgroomgrid.com/blog/pet-grooming-software',
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
      name: 'Pet Grooming Software',
      item: 'https://getgroomgrid.com/blog/pet-grooming-software',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pet Grooming Software: What It Is and Why Your Business Needs It',
  description:
    'Pet grooming software automates booking, reminders, payments, and client records. Learn what to look for, what to avoid, and how the right tool transforms your grooming business.',
  url: 'https://getgroomgrid.com/blog/pet-grooming-software',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/pet-grooming-software',
  },
};

export default function PetGroomingSoftwarePage() {
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
              <li className="text-stone-700 font-medium" aria-current="page">Pet Grooming Software</li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Software Guide
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Pet Grooming Software:<br className="hidden sm:block" /> The Complete Beginner&apos;s Guide
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            If you&apos;re still managing your grooming business with a paper calendar, group texts, and
            Venmo, you&apos;re working harder than you need to. Pet grooming software handles the
            repetitive admin automatically — so you can focus on the dogs.
          </p>
        </header>

        {/* ── What Is It ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">What Is Pet Grooming Software?</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Pet grooming software is a purpose-built business management platform for professional
              groomers. Unlike generic scheduling tools (Google Calendar, Calendly) or general
              appointment apps, grooming software understands how grooming businesses actually work —
              service durations by breed, deposit policies, recurring appointment cycles, and the
              specific details you need for every pet.
            </p>
            <p className="text-stone-600 leading-relaxed">
              At its core, good grooming software does three things: it fills your schedule efficiently,
              it keeps clients informed and returning, and it gets you paid without friction.
            </p>
          </div>
        </section>

        {/* ── Core Features ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Core Features to Expect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              {
                title: 'Online Booking',
                desc: 'Clients book 24/7 from a link you share. No more back-and-forth texts to find open slots.',
              },
              {
                title: 'Client & Pet Profiles',
                desc: 'Store breed, coat type, health notes, service history, and owner preferences per dog.',
              },
              {
                title: 'Automated Reminders',
                desc: 'SMS and email reminders go out automatically before appointments — reducing no-shows by 40-60%.',
              },
              {
                title: 'Deposit Collection',
                desc: 'Require deposits at booking to protect your time. Applied automatically at checkout.',
              },
              {
                title: 'Payment Processing',
                desc: 'Accept cards, digital wallets, and online payments without a separate tool.',
              },
              {
                title: 'Rebooking Reminders',
                desc: 'Automatically prompt clients to rebook based on typical grooming cycles for their breed.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="p-5 bg-stone-50 rounded-xl border border-stone-200">
                <p className="font-bold text-stone-800 mb-2">{title}</p>
                <p className="text-sm text-stone-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Who Needs It ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">When Do You Actually Need Software?</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Many groomers start without software and get by for a while. But there are clear signals
              that manual systems are holding you back:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'You&apos;ve had at least one double-booking or missed appointment in the last 30 days',
                'You spend more than 30 minutes per week chasing confirmations or sending reminders manually',
                'You&apos;ve forgotten a client&apos;s service preferences or their dog&apos;s health notes',
                'A client no-showed without warning and you lost that slot with no recourse',
                'You&apos;re not sure which clients haven&apos;t rebooked in the last 8 weeks',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-red-400 font-bold mt-0.5">→</span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed">
              If any of those resonate, software will pay for itself within the first month — often in
              the first week, by preventing a single no-show.
            </p>
          </div>
        </section>

        {/* ── Generic vs Grooming Software ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Generic Scheduling Apps vs Grooming-Specific Software</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Tools like Calendly, Square Appointments, or Acuity Scheduling can handle basic booking —
            but they weren&apos;t built for grooming. They don&apos;t know that a Poodle full groom
            takes 3 hours but a nail trim takes 20 minutes. They don&apos;t store coat notes or track
            grooming history per dog. They can&apos;t prompt clients to rebook based on breed cycle.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            Grooming-specific software builds all of that in. It means less manual configuration,
            fewer workarounds, and a client experience that feels tailored to the pet — because it is.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <p className="font-semibold text-stone-800 mb-2">The right mental model:</p>
            <p className="text-stone-600">
              Generic tools are hammers. Grooming software is a scalpel. Both cut, but one is built for
              the specific job. As your client list grows, you feel that difference every single day.
            </p>
          </div>
        </section>

        {/* ── What to Look For ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">What to Look For When Choosing</h2>
            <ul className="space-y-3">
              {[
                'Free trial with no credit card required — test it before you commit',
                'Mobile-friendly for managing your schedule from anywhere',
                'Built-in reminders that work without manual setup',
                'Transparent pricing with no surprise add-on fees',
                'Onboarding that gets you running in under an hour',
                'Customer support you can actually reach when something goes wrong',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed mt-6">
              For a deeper comparison of the top platforms available, read our full{' '}
              <Link
                href="/blog/dog-grooming-software"
                className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
              >
                dog grooming software buyer&apos;s guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── Related Links ── */}
        <RelatedLinks
          heading="Ready to run your grooming business smarter?"
          links={[
          { href: '/signup?coupon=BETA50', category: 'Software', title: 'Dog Grooming Software: The 2026 Buyer's Guide' },
          { href: '/blog/dog-grooming-business-management', category: 'Operations', title: 'Dog Grooming Business Management: The Complete Guide' }
          ]}
          columns={3}
        />

        {/* ── Footer ── */}
        <SiteFooter links={[{ href: '/grooming-business-operations/', label: 'Operations Hub' }, { href: '/mobile-grooming-business/', label: 'Mobile Grooming' }, { href: '/plans', label: 'Pricing' }, { href: '/signup?coupon=BETA50', label: 'Sign Up' }]} />
      </div>
    </>
  );
}
