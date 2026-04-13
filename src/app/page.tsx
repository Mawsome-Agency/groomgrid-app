'use client';

import Link from 'next/link';

const SIGNUP_URL = '/signup';

function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-stone-900">
      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-stone-100">
        <span className="text-xl font-bold text-green-600">GroomGrid 🐾</span>
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="text-stone-600 hover:text-green-600 text-sm font-medium transition-colors"
          >
            Blog
          </Link>
          <CtaLink
            href={SIGNUP_URL}
            className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
          >
            Start Free Trial
          </CtaLink>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 pt-14 pb-16 max-w-3xl mx-auto text-center">
        <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
          Built for busy groomers
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
          Stop losing money to<br className="hidden sm:block" /> no-shows and double bookings.
        </h1>
        <p className="text-lg text-stone-600 mb-8 max-w-xl mx-auto leading-relaxed">
          GroomGrid is the AI-powered scheduling app that handles bookings, fires
          off reminders, and collects payment — so you can focus on the dogs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <CtaLink
            href={SIGNUP_URL}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors shadow-md"
          >
            Start Free Trial — 14 Days Free
          </CtaLink>
          <p className="text-sm text-stone-500">$29/mo after trial · No credit card required</p>
        </div>
        <p className="text-xs text-stone-400 mt-4">
          Join 50+ groomers already on the waitlist 🐶
        </p>
      </section>

      {/* ── Pain → Solution ── */}
      <section className="px-6 py-14 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-stone-800 mb-2">
            Sound familiar?
          </h2>
          <p className="text-center text-stone-500 mb-10">
            Every groomer hits these walls. GroomGrid knocks them down.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                pain: '😤 \u201cI double-booked again.\u201d',
                fix: 'Smart scheduling blocks conflicts the moment you book — zero overlaps, zero angry clients.',
              },
              {
                pain: '😩 \u201cThey just didn\u2019t show up.\u201d',
                fix: 'Auto SMS + email reminders go out 48 hrs and 2 hrs before every appointment. Ghosting drops fast.',
              },
              {
                pain: '💸 \u201cStill chasing that invoice.\u201d',
                fix: 'Collect payment at booking time. No awkward follow-ups. Money hits your account, done.',
              },
            ].map(({ pain, fix }) => (
              <div key={pain} className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
                <p className="font-semibold text-stone-700 mb-3 text-base">{pain}</p>
                <p className="text-stone-600 text-sm leading-relaxed">{fix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-14 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-stone-800 mb-2">
          Everything you need. Nothing you don&apos;t.
        </h2>
        <p className="text-center text-stone-500 mb-10">
          Built for solo mobile groomers doing 4–8 dogs a day.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              emoji: '📅',
              title: '2-tap booking',
              desc: 'Schedule appointments in seconds from your phone, between jobs, with one hand.',
            },
            {
              emoji: '🔔',
              title: 'Automatic reminders',
              desc: 'SMS and email reminders fire automatically — you set it once and forget it.',
            },
            {
              emoji: '🐾',
              title: 'Pet profiles',
              desc: 'Store breed, coat type, grooming notes, and client preferences. No more "wait, which doodle is this?"',
            },
            {
              emoji: '💳',
              title: 'Upfront payments',
              desc: 'Collect deposits or full payment at booking. Stripe-powered, instant transfers.',
            },
          ].map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="flex gap-4 p-5 rounded-xl border border-stone-100 hover:border-green-200 transition-colors"
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{emoji}</span>
              <div>
                <p className="font-semibold text-stone-800 mb-1">{title}</p>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="px-6 py-14 bg-stone-50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Early access
          </p>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            Join 50+ groomers on the waitlist
          </h2>
          <p className="text-stone-500 mb-10">
            Independent groomers, mobile pros, and salon owners are already lined up.
            Don&apos;t let them get a head start.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {[
              {
                quote:
                  'GroomGrid cut my booking time in half. I can focus on the dogs, not the paperwork.',
                name: 'Sarah Mitchell',
                business: 'Paws on Wheels · Mobile Groomer',
              },
              {
                quote:
                  'No-shows dropped 40% after I switched. The automatic reminders alone are worth every penny.',
                name: 'James Rodriguez',
                business: 'Fur Perfect Salon · 3 Groomers',
              },
            ].map(({ quote, name, business }) => (
              <div key={name} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <p className="text-stone-700 text-sm leading-relaxed mb-4">&ldquo;{quote}&rdquo;</p>
                <p className="font-semibold text-stone-800 text-sm">{name}</p>
                <p className="text-stone-500 text-xs">{business}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Teaser ── */}
      <section className="px-6 py-14 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Simple pricing. No surprises.</h2>
        <p className="text-stone-500 mb-8">Cheaper than one no-show a month.</p>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-6">
          <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-1">
            Solo Groomer
          </p>
          <p className="text-5xl font-extrabold text-stone-900 mb-1">
            $29
            <span className="text-xl font-normal text-stone-500">/mo</span>
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Everything you need to run your grooming business.
          </p>
          <ul className="text-left space-y-2 mb-8 text-sm text-stone-600 max-w-xs mx-auto">
            {[
              'Unlimited appointments',
              'Automated SMS + email reminders',
              'Client & pet profiles',
              'Payment collection',
              'Mobile-first app',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <CtaLink
            href={SIGNUP_URL}
            className="inline-block w-full sm:w-auto px-8 py-4 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors"
          >
            Start Free Trial
          </CtaLink>
          <p className="text-xs text-stone-400 mt-3">14 days free · No credit card required</p>
        </div>
        <p className="text-stone-500 text-sm">
          Running a salon?{' '}
          <Link href="/plans" className="text-green-600 font-semibold hover:underline">
            See all plans →
          </Link>
        </p>
      </section>

      {/* ── Final CTA Banner ── */}
      <section className="px-6 py-16 bg-green-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-3">Ready to stop the chaos?</h2>
        <p className="text-green-100 mb-8 max-w-md mx-auto leading-relaxed">
          Join the groomers who are done with scheduling headaches. Your first 14
          days are completely on us.
        </p>
        <CtaLink
          href={SIGNUP_URL}
          className="inline-block px-10 py-4 rounded-xl bg-white text-green-600 font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
        >
          Start Free Trial — $29/mo after
        </CtaLink>
        <p className="text-green-200 text-sm mt-4">No credit card required · Cancel anytime</p>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-8 text-center text-stone-400 text-sm border-t border-stone-100">
        <p className="mb-2">
          <Link href="/blog" className="hover:text-stone-600 transition-colors">
            Blog
          </Link>
          {' · '}
          <a
            href="mailto:hello@getgroomgrid.com"
            className="hover:text-stone-600 transition-colors"
          >
            hello@getgroomgrid.com
          </a>
        </p>
        <p>© 2026 GroomGrid</p>
      </footer>
    </div>
  );
}
