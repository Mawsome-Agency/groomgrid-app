import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'How to Reduce No-Shows in Your Dog Grooming Business | GroomGrid',
  description:
    'Cut grooming no-shows by 60% with automated reminders, deposit policies, and a multi-touch follow-up strategy. Real tactics groomers use every day.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/reduce-no-shows-dog-grooming/',
  },
  openGraph: {
    title: 'How to Reduce No-Shows in Your Dog Grooming Business',
    description:
      'Cut grooming no-shows by 60% with automated reminders, deposit policies, and a multi-touch follow-up strategy.',
    url: 'https://getgroomgrid.com/blog/reduce-no-shows-dog-grooming/',
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
      item: 'https://getgroomgrid.com/blog/',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Reduce No-Shows in Dog Grooming',
      item: 'https://getgroomgrid.com/blog/reduce-no-shows-dog-grooming/',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Reduce No-Shows in Your Dog Grooming Business',
  description:
    'Cut grooming no-shows by 60% with automated reminders, deposit policies, and a multi-touch follow-up strategy.',
  url: 'https://getgroomgrid.com/blog/reduce-no-shows-dog-grooming/',
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
    '@id': 'https://getgroomgrid.com/blog/reduce-no-shows-dog-grooming/',
  },
};

export default function ReduceNoShowsDogGroomingPage() {
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
                Reduce No-Shows
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            No-Show Prevention
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            How to Reduce No-Shows in Your<br className="hidden sm:block" /> Dog Grooming Business
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            A no-show isn&apos;t just an empty slot — it&apos;s 1–3 hours of revenue you&apos;ll
            never get back. Groomers who implement the right reminder and deposit systems cut their
            no-show rate by 60% or more. Here&apos;s exactly how they do it.
          </p>
        </header>

        {/* ── Why No-Shows Hurt ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              The Real Cost of a Dog Grooming No-Show
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              If you charge $75 per groom and have two no-shows a week, that&apos;s $600/month in
              lost revenue — $7,200 a year. And that&apos;s before you factor in the supplies you
              prepped, the slot you couldn&apos;t rebook, and the mental overhead of chasing clients.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Most groomers treat no-shows as an unavoidable cost of doing business. They&apos;re
              not. The groomers with the lowest no-show rates aren&apos;t lucky — they have systems
              that make it easy for clients to remember, confirm, and show up.
            </p>
            <p className="text-stone-600 leading-relaxed">
              The good news: you don&apos;t need to be pushy or awkward. A well-timed automated
              reminder does more than a hundred manual follow-up texts.
            </p>
          </div>
        </section>

        {/* ── Reminder Strategy ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            1. The Multi-Touch Reminder System
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            One reminder isn&apos;t enough. Life is noisy, and clients genuinely forget. The most
            effective grooming reminder cadence uses three touchpoints:
          </p>
          <ul className="space-y-4 mb-6">
            {[
              {
                timing: '72 hours before',
                action: 'Email confirmation with appointment details, pet name, and service booked',
              },
              {
                timing: '24 hours before',
                action: 'SMS reminder with a one-tap confirm/cancel link',
              },
              {
                timing: '2 hours before',
                action: 'Final SMS nudge — short, friendly, just the essentials',
              },
            ].map((item) => (
              <li key={item.timing} className="flex items-start gap-4 text-stone-600">
                <span className="text-green-500 font-bold text-sm bg-green-50 px-2 py-1 rounded whitespace-nowrap mt-0.5">
                  {item.timing}
                </span>
                <span>{item.action}</span>
              </li>
            ))}
          </ul>
          <p className="text-stone-600 leading-relaxed mb-4">
            Groomers who add that 2-hour reminder on top of the 24-hour one see another 15–20%
            reduction in no-shows. It&apos;s the single highest-leverage change most groomers can
            make.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Manual reminders take 5–10 minutes per client per appointment. Automated reminders take
            zero. That&apos;s 3–5 hours a week back in your schedule.
          </p>
        </section>

        {/* ── Deposit Policy ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              2. Collect a Booking Deposit
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Money changes behavior. Clients who&apos;ve paid a $20–$30 deposit are dramatically
              less likely to ghost you. They have skin in the game.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              The most effective deposit policies share three traits:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Small enough to not be a barrier — $15–$30 is the sweet spot for most groomers',
                'Applied to the final service cost (not an extra fee)',
                'Clearly communicated at booking time, not sprung as a surprise',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone-600">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed mb-4">
              When you collect deposits online at booking, you eliminate the awkward conversation
              entirely. The system handles it, and clients who aren&apos;t serious self-select out.
            </p>
            <p className="text-stone-600 leading-relaxed">
              What about existing clients who&apos;ve never paid a deposit? Introduce it as a policy
              update for new bookings — most long-term clients will accept it without complaint.
            </p>
          </div>
        </section>

        {/* ── Confirmation Flow ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            3. Make Confirming (and Canceling) Frictionless
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Clients who want to cancel often ghost instead because canceling feels awkward.
            They&apos;re avoiding a conversation, not intentionally wasting your time.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            Build an easy cancel path into your reminders: a single link that lets them cancel or
            reschedule without needing to call. When canceling is easy, clients actually do it —
            giving you time to rebook the slot.
          </p>
          <p className="text-stone-600 leading-relaxed">
            The goal isn&apos;t to trap clients. It&apos;s to get accurate information so you can
            fill your calendar. A cancellation with 24 hours notice is infinitely better than a
            no-show.
          </p>
        </section>

        {/* ── Repeat No-Show Policy ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              4. Have a Repeat No-Show Policy
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Some clients will no-show even with great reminders. For them, a written policy
              removes emotion from the conversation.
            </p>
            <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
              <p className="text-stone-800 font-semibold mb-2">Example policy:</p>
              <p className="text-stone-600 italic text-sm leading-relaxed">
                &quot;Appointments cancelled with less than 24 hours notice or missed without
                cancellation will forfeit their deposit. After two no-shows, a full prepayment is
                required to book.&quot;
              </p>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Most groomers never need to enforce this policy with good clients. But having it in
              writing means you don&apos;t have to improvise when a chronic no-shower books again.
            </p>
          </div>
        </section>

        {/* ── Quick Wins Summary ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Quick Wins: Where to Start
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            If you&apos;re not doing any of this yet, start here in order:
          </p>
          <ol className="space-y-4">
            {[
              'Set up automated 24-hour SMS reminders — this alone cuts most no-shows',
              'Add a booking deposit for new clients (apply to existing clients on next rebook)',
              'Include a cancel/reschedule link in every reminder',
              'Add the 2-hour reminder nudge for your highest-volume days',
              'Write a no-show policy and add it to your booking confirmation email',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4 text-stone-600">
                <span className="text-green-600 font-extrabold text-lg w-7 flex-shrink-0">
                  {i + 1}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Signup CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Stop losing revenue to no-shows
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              GroomGrid sends automated reminders at 72 hours, 24 hours, and 2 hours before every
              appointment — and lets clients confirm or cancel in one tap. Most groomers cut
              no-shows in half within 30 days. Try it free.
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
              href="/blog/dog-grooming-business-management"
              className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
            >
              <p className="text-sm text-green-600 font-semibold mb-1">Business Management</p>
              <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors">
                Dog Grooming Business Management: Run the Business, Not Just the Grooms
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
