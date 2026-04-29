import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { BOFUAnalyticsWrapper } from '@/components/analytics/BOFUAnalyticsWrapper';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Grooming Business Operations: The Complete Guide for Pet Groomers | GroomGrid',
  description:
    'Master your grooming business operations — from appointment scheduling and no-show prevention to deposit policies and client retention. Built for busy groomers.',
  alternates: {
    canonical: 'https://getgroomgrid.com/grooming-business-operations',
  },
  openGraph: {
    title: 'Grooming Business Operations: The Complete Guide for Pet Groomers',
    description:
      'Master your grooming business operations — from appointment scheduling and no-show prevention to deposit policies and client retention.',
    url: 'https://getgroomgrid.com/grooming-business-operations',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Grooming Business Operations: The Complete Guide for Pet Groomers',
  description:
    'Master your grooming business operations — from appointment scheduling and no-show prevention to deposit policies and client retention.',
  url: 'https://getgroomgrid.com/grooming-business-operations',
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
    '@id': 'https://getgroomgrid.com/grooming-business-operations',
  },
};

const topics = [
  {
    title: 'Appointment Reminders',
    description:
      'Automated SMS and email reminders that go out 48 hours and 2 hours before every groom. Clients remember, dogs get groomed, and you stop chasing no-shows.',
    href: '/blog/reduce-no-shows-dog-grooming',
    icon: '⏰',
  },
  {
    title: 'Deposit Policy',
    description:
      'How to set, communicate, and collect booking deposits so your calendar stays full of clients who actually show up.',
    href: '/blog/dog-grooming-business-management',
    icon: '💰',
  },
  {
    title: 'No-Show Prevention',
    description:
      'The multi-touch strategy that successful groomers use to cut no-show rates by 60% — without awkward client conversations.',
    href: '/blog/reduce-no-shows-dog-grooming',
    icon: '🚫',
  },
  {
    title: 'Client Retention',
    description:
      'Rebooking strategies, loyalty rewards, and communication cadences that turn first-time clients into regulars who refer their friends.',
    href: '/blog/dog-grooming-business-management',
    icon: '🐾',
  },
];

export default function GroomingBusinessOperationsPage() {
  return (
    <>      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <BOFUAnalyticsWrapper
        pageType="grooming-business-operations"
        sectionIds={[
          'hero',
          'what-are-operations',
          'topics',
          'appointment-scheduling',
          'no-show-prevention',
          'deposit-policy',
          'client-retention',
          'metrics',
          'tools',
          'related-articles',
          'cta',
        ]}
        sectionTitles={[
          'Hero',
          'What Are Business Operations',
          'Topics Covered',
          'Appointment Scheduling',
          'No-Show Prevention',
          'Deposit Policy',
          'Client Retention',
          'Metrics That Matter',
          'Tools and Software',
          'Related Guides',
          'CTA',
        ]}
      >
        <div className="min-h-screen bg-white text-stone-900">
          {/* ── Nav ── */}
          <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-stone-100">
            <Link href="/" className="text-xl font-bold text-green-600">
              GroomGrid 🐾
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
              data-cta-type="start_trial"
              data-cta-location="nav"
            >
              Start Free Trial
            </Link>
          </nav>

          {/* ── Breadcrumb ── */}
        <div className="px-6 py-3 max-w-5xl mx-auto">
          <PageBreadcrumbs slug="grooming-business-operations" />
        </div>

          {/* ── Hero ── */}
          <header
            className="px-6 pt-10 pb-12 max-w-4xl mx-auto"
            data-section="hero"
          >
            <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
              Operations Hub
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
              Grooming Business Operations:<br className="hidden sm:block" /> Run a Tighter Ship
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
              Running a pet grooming business is equal parts passion and logistics. You got into this
              because you love dogs — not because you dreamed of chasing payments, re-confirming
              appointments, or patching scheduling holes left by no-shows. This hub covers every
              operational corner of your grooming business so you can spend more time with the dogs
              and less time putting out fires.
            </p>
          </header>

          {/* ── What Are Grooming Business Operations ── */}
          <section
            className="px-6 py-12 bg-green-50"
            data-section="what-are-operations"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                What Does &quot;Business Operations&quot; Actually Mean for Groomers?
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                For most groomers, &quot;operations&quot; is just a fancy word for everything that
                happens before and after a dog is on your table. It&apos;s your appointment system,
                your reminder process, how you handle cancellations, how you collect payment, and how
                you turn a one-time client into a loyal regular.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                Poor operations don&apos;t just feel stressful — they cost real money. A single
                no-show on a fully booked Saturday can mean a $60–$120 gap in revenue. Multiply that
                across a year and you&apos;re looking at thousands of dollars walking out the door
                simply because your processes weren&apos;t airtight.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Strong grooming business operations mean every appointment slot is protected, every
                client knows exactly what to expect, and your day flows without constant interruptions.
                Here&apos;s everything you need to know to get there.
              </p>
            </div>
          </section>

          {/* ── Sub-topic cards ── */}
          <section
            className="px-6 py-14 max-w-5xl mx-auto"
            data-section="topics"
          >
            <h2 className="text-2xl font-bold text-stone-800 mb-3 text-center">
              Topics Covered in This Hub
            </h2>
            <p className="text-center text-stone-500 mb-10">
              Deep dives on every major area of grooming operations — click any topic to read the full guide.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {topics.map((topic) => (
                <Link
                  key={topic.title}
                  href={topic.href}
                  className="group p-6 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
                >
                  <span className="text-3xl mb-3 block">{topic.icon}</span>
                  <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-green-600 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{topic.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Appointment Scheduling Deep Dive ── */}
          <section
            className="px-6 py-12 bg-stone-50"
            data-section="appointment-scheduling"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                Appointment Scheduling: The Foundation of Everything
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Your appointment book is the heartbeat of your grooming business. When it&apos;s
                healthy — full but not overbooked, organized by breed and coat type, spaced to give
                each dog the time they need — your whole day hums. When it&apos;s chaos, everything
                suffers: your quality, your stress levels, and your clients&apos; trust.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                The first upgrade most groomers need isn&apos;t a bigger salon or better clippers —
                it&apos;s a scheduling system that actually works. Paper books and spreadsheets might
                feel familiar, but they can&apos;t send automatic reminders, flag double-bookings in
                real time, or show you your revenue at a glance. Modern grooming scheduling software
                handles all of that automatically.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                Great scheduling for groomers means blocking appropriate time per breed, tracking
                whether a dog is a new client or a regular, noting any temperament flags, and leaving
                buffer time between appointments for cleanup. The best groomers also schedule their
                own energy — front-loading challenging dogs in the morning when you&apos;re fresh and
                grouping similar breeds to reduce coat-type adjustment time.
              </p>
              <div className="bg-white border border-green-100 rounded-xl p-5 mt-6">
                <p className="text-green-700 font-semibold mb-1">Pro Tip</p>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Block your last appointment slot 30 minutes before you actually stop taking dogs.
                  That buffer absorbs late clients, tricky coats, and end-of-day cleanup without
                  bleeding into your personal time.
                </p>
              </div>
            </div>
          </section>

          {/* ── No-Show Prevention ── */}
          <section
            className="px-6 py-12 max-w-4xl mx-auto"
            data-section="no-show-prevention"
          >
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              The No-Show Problem (And How to Solve It)
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              No-shows are the most common operational pain point for pet groomers — and the most
              preventable. Industry data suggests that reminder messages can cut no-show rates by
              up to 50-60%. The problem is that most groomers are doing this manually: a
              text here, a call there, remembering who needs a reminder and who doesn&apos;t.
              That&apos;s not a system — that&apos;s hope dressed up as process.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              A real no-show prevention strategy has multiple touchpoints. A confirmation message
              when the appointment is booked. A reminder 48 hours before the groom. A same-day
              reminder 2 hours out. And a clear deposit or cancellation policy that makes
              last-minute no-shows financially painful for clients — so they actually communicate
              when their plans change instead of just ghosting.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              The groomers who have solved this problem aren&apos;t spending hours on the phone —
              they&apos;ve set up automated workflows that fire without any manual input. When your
              reminder system runs itself, you get your time back and your no-show rate drops. See
              the full playbook in our guide:{' '}
              <Link
                href="/blog/reduce-no-shows-dog-grooming"
                className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
              >
                How to Reduce No-Shows in Your Dog Grooming Business
              </Link>
              .
            </p>
          </section>

          {/* ── Deposit Policy ── */}
          <section
            className="px-6 py-12 bg-green-50"
            data-section="deposit-policy"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                Booking Deposits: Protect Your Time and Revenue
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Grooming deposits changed the game for independent groomers. When a client puts money
                down to hold their slot — even just $15–$25 — their psychological commitment to that
                appointment spikes. They&apos;re no longer just &quot;tentatively in.&quot;
                They&apos;re invested.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                Most groomers who implement deposits are amazed at how little pushback they get.
                Clients who book responsible groomers expect that their slot has real value. The ones
                who balk at a small deposit are often the same ones who cancel day-of — so the policy
                actually helps you filter your client roster naturally.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                The key to making deposits work is making them frictionless. If collecting a deposit
                requires you to send a payment link, chase a Venmo, or remember to charge the card on
                file — it becomes a chore. The best setup is a booking flow where clients pay the
                deposit automatically at the time of booking, before you even confirm the appointment.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Clear communication matters too. State your deposit policy on your booking page, in
                your confirmation message, and in any intake forms. No surprises = no disputes.
              </p>
            </div>
          </section>

          {/* ── Client Retention ── */}
          <section
            className="px-6 py-12 max-w-4xl mx-auto"
            data-section="client-retention"
          >
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Client Retention: The Easiest Revenue You&apos;re Leaving on the Table
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Acquiring a new grooming client costs roughly 5x more than keeping an existing one.
              That&apos;s a universal business truth — and it hits especially hard in the grooming
              world where word of mouth and repeat visits are everything. Yet most groomers put all
              their energy into getting new clients and almost none into systematically keeping the
              ones they have.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              The highest-leverage retention move is the rebooking prompt. When you finish a groom
              and hand the dog back, the client is at peak happiness. Their dog looks (and smells)
              amazing. That&apos;s the exact moment to ask: &quot;Want to set the next appointment
              now? Most breeds need grooming every 6-8 weeks.&quot; You will book a significant
              portion of your future schedule this way, for free, with zero marketing effort.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Beyond the in-person prompt, automated follow-ups help. A message 5-6 weeks after a
              groom — &quot;Hey, Biscuit is probably due for their next trim soon! Want to grab a
              spot?&quot; — converts at surprisingly high rates because the timing is right and the
              message feels personal. Pair that with a simple loyalty reward (a small discount on
              every 5th groom, for example) and you&apos;ve built a retention engine that runs on
              autopilot.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Client retention also lives and dies on the notes you keep. Knowing that Daisy the
              Golden is reactive on her ears, or that Mr. Whiskers&apos; owner wants the lion cut
              every time, or that the Johnson family always books on Fridays — that&apos;s the kind
              of personalization that makes clients feel seen and builds loyalty that no competitor
              can easily steal.
            </p>
          </section>

          {/* ── Metrics That Matter ── */}
          <section
            className="px-6 py-12 bg-stone-50"
            data-section="metrics"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                The Numbers Every Groomer Should Track
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                You can&apos;t improve what you don&apos;t measure. Here are the core operational
                metrics that healthy grooming businesses track — and why they matter:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    metric: 'No-show rate',
                    target: '< 5%',
                    why: 'Each no-show is lost revenue you can never get back. If yours is above 5%, your reminder process needs work.',
                  },
                  {
                    metric: 'Rebooking rate',
                    target: '> 60%',
                    why: 'Over 60% of clients who just got a groom should be booking the next one before they leave. If not, you\'re missing easy revenue.',
                  },
                  {
                    metric: 'Average service value',
                    target: 'Know your number',
                    why: 'Tracking your average ticket reveals whether you\'re pricing right and which services are pulling their weight.',
                  },
                  {
                    metric: 'Client lifetime value',
                    target: 'Growing year-over-year',
                    why: 'How much does a typical client spend with you per year? Growing this number is more profitable than acquiring new clients.',
                  },
                ].map((item) => (
                  <div key={item.metric} className="bg-white border border-stone-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-stone-800">{item.metric}</span>
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {item.target}
                      </span>
                    </div>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.why}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Tools and Software ── */}
          <section
            className="px-6 py-12 max-w-4xl mx-auto"
            data-section="tools"
          >
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Tools That Make Operations Easier
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              You don&apos;t need a fleet of apps to run a tight grooming operation — you need the
              right ones. Here&apos;s what the most efficient grooming businesses are using:
            </p>
            <ul className="space-y-4 mb-6">
              {[
                {
                  tool: 'Scheduling software',
                  desc: 'Online booking with automated reminders, breed-based time blocking, and calendar sync. This is the most important tool in your stack.',
                },
                {
                  tool: 'Client management (CRM)',
                  desc: 'Pet and owner profiles, service history, vaccine records, grooming notes, and preferences. Know every dog before they walk in the door.',
                },
                {
                  tool: 'Payment processing',
                  desc: 'Deposits, full payments, and tips — collected at booking or at checkout without cash or awkward payment chases.',
                },
                {
                  tool: 'Automated communication',
                  desc: 'Booking confirmations, reminders, rebooking prompts, and follow-ups — all triggered automatically based on appointment status.',
                },
              ].map((item) => (
                <li key={item.tool} className="flex gap-3">
                  <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                  <div>
                    <span className="font-semibold text-stone-800">{item.tool}: </span>
                    <span className="text-stone-600">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed">
              GroomGrid combines all four of these into one platform built specifically for pet
              groomers. No duct-taping four different apps together — everything talks to everything.
              Your schedule, your clients, your payments, and your reminders all live in one place.
            </p>
          </section>

          {/* ── Related Articles ── */}
          <section
            className="px-6 py-12 bg-stone-50"
            data-section="related-articles"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-stone-800 mb-6">Related Guides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    href: '/blog/reduce-no-shows-dog-grooming',
                    title: 'How to Reduce No-Shows in Your Dog Grooming Business',
                    desc: 'The complete playbook: automated reminders, deposit policies, and cancellation scripts that actually work.',
                  },
                  {
                    href: '/blog/dog-grooming-business-management',
                    title: 'Dog Grooming Business Management: A Practical Guide',
                    desc: 'From daily operations to long-term growth — the management fundamentals every groomer needs.',
                  },
                  {
                    href: '/blog/is-dog-grooming-a-profitable-business',
                    title: 'Is Dog Grooming a Profitable Business in 2025?',
                    desc: 'Real numbers, real margins, and the operational choices that separate thriving grooming businesses from struggling ones.',
                  },
                ].map((article) => (
                  <Link
                    key={article.href}
                    href={article.href}
                    className="group p-5 bg-white border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
                  >
                    <h3 className="font-bold text-stone-800 mb-2 group-hover:text-green-600 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{article.desc}</p>
                    <span className="text-green-600 text-sm font-medium mt-3 inline-block">
                      Read the guide →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section
            className="px-6 py-16 bg-green-600 text-white"
            data-section="cta"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold mb-4">
                Ready to Tighten Up Your Operations?
              </h2>
              <p className="text-green-100 text-lg mb-8 leading-relaxed">
                GroomGrid handles your scheduling, reminders, payments, and client records in one
                simple platform. Most groomers cut their no-show rate in half within 30 days. Try it
                free for 14 days — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/plans"
                  className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors shadow-md"
                  data-cta-type="see_plans"
                  data-cta-location="cta"
                  data-cta-section="cta"
                >
                  See GroomGrid Scheduling →
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-4 rounded-xl border-2 border-white text-white font-bold text-lg hover:bg-green-700 transition-colors"
                  data-cta-type="start_trial"
                  data-cta-location="cta"
                  data-cta-section="cta"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </section>

          {/* ── Footer ── */}
          <SiteFooter slug="grooming-business-operations" />
        </div>
      </BOFUAnalyticsWrapper>
    </>
  );
}
