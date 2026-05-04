import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Dog Grooming Scheduling Software: The Complete Guide for 2026 | GroomGrid',
  description: 'Dog grooming scheduling software cuts no-shows 40% and saves 5+ hours/week on admin. Compare the top 5 tools by pricing, mobile features, and automated reminders for 2026.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/dog-grooming-scheduling-software-guide',
  },
  openGraph: {
    title: 'Dog Grooming Scheduling Software: The Complete Guide for 2026',
    description: 'Dog grooming scheduling software cuts no-shows 40% and saves 5+ hours/week on admin. Compare the top 5 tools by pricing, mobile features, and automated reminders for 2026.',
    url: 'https://getgroomgrid.com/blog/dog-grooming-scheduling-software-guide',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dog Grooming Scheduling Software: The Complete Guide for 2026',
  description: 'Dog grooming scheduling software cuts no-shows 40% and saves 5+ hours/week on admin. Compare the top 5 tools by pricing, mobile features, and automated reminders for 2026.',
  url: 'https://getgroomgrid.com/blog/dog-grooming-scheduling-software-guide',
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
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
    '@id': 'https://getgroomgrid.com/blog/dog-grooming-scheduling-software-guide',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is dog grooming scheduling software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dog grooming scheduling software is a specialized appointment management tool built for pet grooming businesses. It handles online booking, automated reminders, calendar management, client and pet profiles, and often includes payment processing — all designed for the unique needs of groomers, such as breed-specific time slots, service add-ons, and mobile routing.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does dog grooming scheduling software cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dog grooming scheduling software typically costs $29–$149/month. Solo groomer plans start at $29/month, salon plans with multi-groomer scheduling run $79–$99/month, and enterprise plans for multi-location businesses cost $149+/month. Most platforms offer a free trial so you can test before committing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does dog grooming scheduling software work for mobile groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — the best dog grooming scheduling software is mobile-first, meaning it works on your phone or tablet from the grooming van. Look for platforms that offer route optimization, GPS-based scheduling, offline access, and the ability to manage appointments on the go without returning to a desktop.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do automated reminders reduce grooming no-shows?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Automated SMS and email reminders sent at 72 hours, 24 hours, and 2 hours before an appointment give clients multiple chances to confirm, reschedule, or cancel. This reduces no-shows by 30–40% on average. For a groomer charging $60–$80 per appointment, preventing just 2 no-shows per week saves over $6,000 per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can clients book grooming appointments online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — modern dog grooming scheduling software includes online booking pages where clients can view available time slots and book directly. This works 24/7, fills cancellation gaps, and eliminates phone tag. Some platforms also support online deposit collection at the time of booking.',
      },
    },
  ],
};

const schedulingFeatures = [
  {
    icon: '📅',
    title: 'Visual Drag-and-Drop Calendar',
    description:
      'A calendar interface where you can book, move, resize, and cancel appointments with a tap or click. The best schedulers support day, week, and month views with color-coded groomer assignments and service types. You should be able to see your full day at a glance — including drive time for mobile groomers.',
  },
  {
    icon: '🔔',
    title: 'Automated Multi-Touch Reminders',
    description:
      'SMS and email reminders sent automatically at 72 hours, 24 hours, and 2 hours before each appointment. This is the single highest-ROI feature in any grooming scheduler. Reminders that include a one-tap confirm or reschedule link see the best response rates — and they run without you lifting a finger.',
  },
  {
    icon: '🌐',
    title: 'Online Client Self-Booking',
    description:
      'A branded booking page where clients can see your real-time availability and book their own appointments. This works while you sleep, fills gaps left by cancellations, and eliminates the back-and-forth of phone tag. The best systems also collect a deposit at booking to reduce no-shows.',
  },
  {
    icon: '🐕',
    title: 'Breed- and Service-Aware Time Slots',
    description:
      'Not every dog takes the same amount of time. Your scheduling software should automatically adjust appointment length based on breed, size, coat type, and service selected. A Golden Retriever bath and haircut needs 90 minutes — a Shih Tzu tidy needs 45. Smart scheduling prevents overbooking and underutilizing your day.',
  },
  {
    icon: '📱',
    title: 'Mobile-First Access',
    description:
      'Your scheduler needs to work perfectly on a phone or tablet — not just a desktop. Mobile groomers manage their entire day from the van. You should be able to check your next appointment, add grooming notes, process payments, and handle reschedules without leaving the app.',
  },
  {
    icon: '💳',
    title: 'Integrated Payment Processing',
    description:
      'Accept deposits at booking, charge full payment after the groom, and send invoices — all from the same platform where you schedule. Integrated payments eliminate the need to chase checks, reconcile Venmo payments, or awkwardly ask for money after services are rendered.',
  },
  {
    icon: '📊',
    title: 'No-Show Tracking & Recovery',
    description:
      'Track which clients miss appointments, how often, and how much revenue no-shows cost you. The best scheduling software flags chronic no-shows, sends follow-up messages, and automatically opens the slot for rebooking — so a missed appointment becomes someone else\'s filled slot.',
  },
  {
    icon: '🔄',
    title: 'Recurring Booking Management',
    description:
      'Most grooming clients come back every 4–8 weeks. Your scheduler should handle recurring appointments natively — book a series upfront, auto-adjust for holidays, and remind both you and the client when the next visit is approaching. This eliminates the mental load of tracking who\'s due when.',
  },
];

const mobileNeeds = [
  {
    icon: '🗺️',
    title: 'Route-Aware Scheduling',
    description:
      'Your calendar should cluster appointments by neighborhood, not just by time. Route-aware scheduling minimizes drive time between stops, which directly increases the number of dogs you can groom per day. The difference between a 15-minute commute and a 40-minute commute — five times per day — is more than an hour of lost revenue.',
  },
  {
    icon: '📍',
    title: 'GPS Check-In & Check-Out',
    description:
      'Automatically log your arrival and departure at each stop using GPS. This creates an accurate time record for billing, shows clients you\'re on the way, and provides documentation for any disputes. It also feeds back into route optimization over time.',
  },
  {
    icon: '📴',
    title: 'Offline Mode',
    description:
      'Cell coverage is unreliable in some service areas. Your scheduling app should work offline — letting you view your schedule, add notes, and process payments — then sync everything when you\'re back online. Data loss from a dead zone should never be a concern.',
  },
  {
    icon: '🚐',
    title: 'Van-Friendly UX',
    description:
      'When you\'re standing in a grooming van with a dog on the table, you need big buttons, one-handed navigation, and minimal scrolling. The interface should be designed for use with wet, gloved hands — not a desk with a mouse. Desktop-only scheduling software fails mobile groomers at the moment they need it most.',
  },
  {
    icon: '⏱️',
    title: 'Travel Buffer Time',
    description:
      'Your scheduler should automatically add travel buffer time between appointments based on distance. A 10 AM booking in one zip code and an 11 AM booking across town is a recipe for lateness — and lateness erodes client trust. Smart buffers keep you on schedule and professional.',
  },
  {
    icon: '📲',
    title: 'Client Text Updates',
    description:
      '"I\'m on my way" and "Running 10 minutes behind" messages sent with one tap. Mobile groomers live and die by punctuality. Giving clients real-time updates builds loyalty and reduces the anxiety of waiting — especially for first-time clients who aren\'t used to having a groomer come to them.',
  },
];

const comparisonRows = [
  { feature: 'AI-powered scheduling assistant', groomgrid: true, moego: false, daysmart: false, pawfinity: false },
  { feature: 'Automated 3-touch reminders', groomgrid: true, moego: true, daysmart: true, pawfinity: true },
  { feature: 'Online booking with deposits', groomgrid: true, moego: true, daysmart: true, pawfinity: false },
  { feature: 'Route-aware scheduling', groomgrid: true, moego: true, daysmart: false, pawfinity: false },
  { feature: 'Mobile-first design', groomgrid: true, moego: true, daysmart: false, pawfinity: false },
  { feature: 'Offline mode', groomgrid: true, moego: false, daysmart: false, pawfinity: false },
  { feature: 'Breed-aware time slots', groomgrid: true, moego: false, daysmart: false, pawfinity: false },
  { feature: 'Solo plan under $35/mo', groomgrid: true, moego: false, daysmart: false, pawfinity: true },
  { feature: '14-day free trial', groomgrid: true, moego: false, daysmart: false, pawfinity: false },
  { feature: 'No-show tracking & recovery', groomgrid: true, moego: true, daysmart: true, pawfinity: false },
];

const choosingQuestions = [
  {
    q: '1. Does the scheduler match how you actually work?',
    a: 'If you\'re a mobile groomer, you need route optimization, travel buffers, and mobile-first design. If you run a salon, you need multi-groomer views, station management, and staff scheduling. The best dog grooming scheduling software is built for your specific workflow — not a generic calendar with pet stickers added on.',
  },
  {
    q: '2. Can you try it risk-free?',
    a: 'A 14-day free trial without a credit card requirement signals the company trusts their product. If you can\'t test the scheduler with your real appointments and real clients before paying, you\'re gambling on software — and groomers don\'t have time for gambles.',
  },
  {
    q: '3. What happens when a client cancels?',
    a: 'The best schedulers don\'t just show you an empty slot — they automatically contact your waitlist, suggest rebooking times, and recover the revenue. Ask specifically about cancellation handling and waitlist features. This is where cheap scheduling tools reveal their limitations.',
  },
  {
    q: '4. How fast is onboarding?',
    a: 'You should be able to import your existing client data via CSV, set up your services and pricing, and have a working calendar within one hour. If onboarding takes days or requires a training call, the software is too complicated for a working groomer.',
  },
  {
    q: '5. Can you export your data?',
    a: 'Your appointment history and client list are among your most valuable business assets. Make sure you can export all data as a CSV at any time — not just when canceling. Data lock-in is a red flag in any SaaS product.',
  },
  {
    q: '6. Does it grow with you?',
    a: 'If you start as a solo groomer and eventually hire a second groomer, your scheduling software should scale without requiring a full migration. Check whether upgrading from a Solo to Salon plan is seamless — same data, same settings, just more capacity.',
  },
];

export default function DogGroomingSchedulingSoftwareGuidePage() {
  return (
    <>
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
          <PageBreadcrumbs slug="blog/dog-grooming-scheduling-software-guide" />
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Scheduling Guide · Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Dog Grooming Scheduling Software:<br className="hidden sm:block" /> The Complete Guide for 2026
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Scheduling is the heartbeat of every grooming business. The right{' '}
            <Link href="/blog/dog-grooming-software" className="text-green-700 font-semibold hover:underline">
              dog grooming software
            </Link>{' '}
            doesn&apos;t just organize your calendar — it fills gaps left by no-shows, routes your mobile
            van efficiently, and books clients while you sleep. This guide covers everything you need to know
            about dog grooming scheduling software: why it matters, which features move the needle, how to
            choose the right platform, and what mobile groomers need that salon owners don&apos;t.
          </p>
        </header>

        {/* ── Why Scheduling Matters ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Why Scheduling Is the Most Important Feature in Grooming Software
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Ask any groomer what their biggest daily headache is, and you&apos;ll hear the same answer
              over and over: scheduling. Not scissor work, not difficult dogs, not even pricing — scheduling.
              The friction of managing a packed calendar, dealing with last-minute cancellations, juggling
              no-shows, and trying to fit in that one more dog without creating a logjam at the bathing
              station. It&apos;s the administrative work that eats into grooming time, and grooming time is
              revenue.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              The numbers tell the story. The average groomer loses 2–3 appointments per week to no-shows
              and late cancellations. At $60–$80 per groom, that&apos;s $6,240–$12,480 per year in lost
              revenue — just from empty slots. And that doesn&apos;t account for the drive time wasted by
              mobile groomers who travel to a house where nobody&apos;s home, or the 15 minutes spent
              texting back and forth to reschedule a single appointment.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Dog grooming scheduling software exists to solve exactly this problem. It replaces the paper
              appointment book, the manual reminder texts, the phone tag, and the mental juggling of who&apos;s
              coming when. More importantly, it actively prevents the problems that paper systems can&apos;t:
              automated reminders that cut no-shows by 30–40%, online booking that fills cancellation gaps,
              and route optimization that squeezes one more dog into your mobile day.
            </p>
            <p className="text-stone-600 leading-relaxed">
              For a deeper look at the full software landscape — including client management, payments, and
              reporting — see our{' '}
              <Link href="/blog/dog-grooming-software" className="text-green-700 font-semibold hover:underline">
                complete dog grooming software buyer&apos;s guide
              </Link>
              . This guide focuses specifically on scheduling: the feature that makes or breaks your daily
              workflow.
            </p>
          </div>
        </section>

        {/* ── The Cost of Bad Scheduling ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            The Real Cost of Bad Scheduling
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            Before we get into features, let&apos;s put numbers on what bad scheduling actually costs you.
            Most groomers underestimate the impact because they&apos;ve never measured it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                label: 'No-Shows',
                stat: '$6,240+',
                detail: 'Lost per year from 2 missed appointments/week at $60/groom',
              },
              {
                label: 'Admin Time',
                stat: '5+ hrs/wk',
                detail: 'Spent on manual scheduling, reminders, and phone tag',
              },
              {
                label: 'Drive Waste',
                stat: '1+ hr/day',
                detail: 'Lost to inefficient routing for mobile groomers',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6 rounded-xl border border-red-200 bg-red-50"
              >
                <p className="text-red-600 font-bold text-xs uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-3xl font-extrabold text-red-700 mb-2">{item.stat}</p>
                <p className="text-stone-600 text-sm leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-stone-600 leading-relaxed mb-4">
            Now add them up. A mobile groomer working without proper scheduling software is losing roughly
            $8,000–$15,000 per year in combined no-shows, admin time, and drive waste. That&apos;s not
            theoretical — it&apos;s the gap between what you&apos;re earning and what you could be earning
            with the same number of clients and the same daily effort.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Dog grooming scheduling software doesn&apos;t add hours to your day. It recovers the hours
            you&apos;re already losing. The right scheduler pays for itself within the first month — usually
            within the first week — through recovered no-shows alone.
          </p>
        </section>

        {/* ── Top Scheduling Features ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">
              8 Must-Have Features in Dog Grooming Scheduling Software
            </h2>
            <p className="text-stone-600 leading-relaxed mb-10">
              Not all scheduling tools are built for groomers. Generic calendar apps lack the
              breed-awareness, service-specific time slots, and payment integration that grooming requires.
              Here are the eight features that separate grooming-grade scheduling software from a fancy
              calendar.
            </p>
            <div className="space-y-6">
              {schedulingFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-5 p-6 rounded-xl border border-stone-200 bg-white hover:border-green-300 transition-all"
                >
                  <span className="text-3xl flex-shrink-0">{feature.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800 mb-2">{feature.title}</h3>
                    <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI-Powered Scheduling ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            AI-Powered Scheduling: What It Actually Does
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            AI is the buzzword of 2026, but in grooming scheduling, it has real, practical applications that
            save time. Here&apos;s what AI-powered scheduling actually does — and what it doesn&apos;t.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            <strong className="text-stone-800">Smart slot suggestions.</strong> When a client books online,
            AI analyzes your historical patterns — which slots fill first, which services tend to run over,
            which groomers handle which breeds — and suggests the optimal appointment time. This isn&apos;t
            just the next available slot; it&apos;s the slot that keeps your day running smoothly.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            <strong className="text-stone-800">Breed and service prediction.</strong> AI can detect the
            breed from a photo or description and automatically set the correct appointment duration. A
            Pomeranian gets 45 minutes. A Standard Poodle gets 90. No more manual time adjustments or
            overbooked mornings because someone said &quot;small dog&quot; when they meant &quot;small
            Newfoundland.&quot;
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            <strong className="text-stone-800">Cancellation recovery.</strong> When an appointment is
            canceled, AI identifies the best candidate to fill it — a client on your waitlist, someone who
            booked a week out but would take the sooner slot, or a recurring client who&apos;s overdue for
            their next groom. It then automatically reaches out, dramatically improving fill rates on
            same-day cancellations.
          </p>
          <p className="text-stone-600 leading-relaxed">
            <strong className="text-stone-800">Revenue forecasting.</strong> By analyzing your booking
            patterns, AI can forecast weekly and monthly revenue, flag slow periods before they become
            problems, and suggest promotions or extended hours to maximize income during peak times. This
            turns your scheduler from a booking tool into a business intelligence platform.
          </p>
        </section>

        {/* ── Mobile-Specific Needs ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">
              Mobile-Specific Scheduling: What Mobile Groomers Need That Salons Don&apos;t
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Mobile groomers face scheduling challenges that salon owners never think about. Your calendar
              isn&apos;t just about time — it&apos;s about geography, fuel costs, and the physical logistics
              of moving a grooming van between houses. Dog grooming scheduling software that works great in a
              salon often fails in the field. Here are the six features mobile groomers need specifically.
            </p>
            <div className="space-y-6">
              {mobileNeeds.map((need) => (
                <div
                  key={need.title}
                  className="flex items-start gap-5 p-6 rounded-xl border border-green-200 bg-white hover:border-green-400 transition-all"
                >
                  <span className="text-3xl flex-shrink-0">{need.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800 mb-2">{need.title}</h3>
                    <p className="text-stone-600 leading-relaxed">{need.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Dog Grooming Scheduling Software Comparison: 2026
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            The four platforms groomers compare most often for scheduling are GroomGrid, MoeGo, DaySmart Pet,
            and Pawfinity. Here&apos;s how they stack up on scheduling-specific features.
          </p>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-700">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold">Feature</th>
                  <th className="text-center px-5 py-4 font-semibold text-green-600">GroomGrid</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">MoeGo</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">DaySmart</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-500">Pawfinity</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}
                  >
                    <td className="px-5 py-3 text-stone-700">{row.feature}</td>
                    <td className="px-5 py-3 text-center">
                      {row.groomgrid ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : (
                        <span className="text-stone-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {row.moego ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : (
                        <span className="text-stone-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {row.daysmart ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : (
                        <span className="text-stone-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {row.pawfinity ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : (
                        <span className="text-stone-300 font-bold">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-stone-500 text-xs mt-3">
            Based on published feature pages as of April 2026. Features subject to change.
          </p>
        </section>

        {/* ── Pricing Section ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              How Much Does Dog Grooming Scheduling Software Cost?
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Scheduling software is typically bundled with a full grooming business management platform, so
              pricing reflects the total feature set. Here&apos;s the realistic range for 2026:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  tier: 'Solo',
                  price: '$29/mo',
                  description: 'One groomer, full scheduling, reminders, and payments. Right for independent and mobile groomers.',
                  highlight: true,
                },
                {
                  tier: 'Salon',
                  price: '$79/mo',
                  description: '2–5 groomers. Multi-calendar, staff scheduling, route optimization, and advanced reporting.',
                  highlight: false,
                },
                {
                  tier: 'Enterprise',
                  price: '$149/mo',
                  description: 'Unlimited groomers, multi-location scheduling, custom integrations, priority support.',
                  highlight: false,
                },
              ].map((tier) => (
                <div
                  key={tier.tier}
                  className={`p-5 rounded-xl border ${
                    tier.highlight
                      ? 'border-green-400 bg-white shadow-md'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <p className="font-bold text-stone-800 text-lg mb-1">{tier.tier}</p>
                  <p className="text-green-600 font-bold text-xl mb-3">{tier.price}</p>
                  <p className="text-stone-500 text-sm leading-relaxed">{tier.description}</p>
                </div>
              ))}
            </div>
            <p className="text-stone-600 leading-relaxed">
              See our{' '}
              <Link href="/plans" className="text-green-700 font-semibold hover:underline">
                full pricing page
              </Link>{' '}
              for a detailed feature comparison across all tiers. The Solo plan includes every scheduling
              feature a working groomer needs — the upgrade to Salon is about adding team management, not
              unlocking core scheduling.
            </p>
          </div>
        </section>

        {/* ── How to Choose ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            How to Choose Dog Grooming Scheduling Software: 6 Questions to Ask
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            There are more scheduling options than ever in 2026. Here are the six questions that separate
            the right choice from an expensive mistake.
          </p>
          <div className="space-y-6">
            {choosingQuestions.map((item) => (
              <div key={item.q} className="border-l-4 border-green-400 pl-5">
                <p className="font-bold text-stone-800 mb-2">{item.q}</p>
                <p className="text-stone-600 leading-relaxed text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Salon vs Mobile Scheduling ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Salon Scheduling vs. Mobile Scheduling: The Key Differences
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              While both salon and mobile groomers need scheduling software, the priorities are different.
              Understanding these differences helps you evaluate features more quickly.
            </p>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-stone-700">
                  <tr>
                    <th className="text-left px-5 py-4 font-semibold">Priority</th>
                    <th className="text-center px-5 py-4 font-semibold text-green-700">Salon Groomers</th>
                    <th className="text-center px-5 py-4 font-semibold text-green-700">Mobile Groomers</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { priority: 'Top scheduling need', salon: 'Multi-groomer calendar views', mobile: 'Route optimization & drive time' },
                    { priority: 'No-show solution', salon: 'Deposit collection at booking', mobile: 'SMS confirm links + waitlist auto-fill' },
                    { priority: 'Biggest time sink', salon: 'Phone tag with clients', mobile: 'Travel between stops' },
                    { priority: 'Must-have feature', salon: 'Staff assignment & station management', mobile: 'Offline mode + mobile-first UX' },
                    { priority: 'Client communication', salon: 'Email confirmations', mobile: 'Real-time text updates ("On my way")' },
                    { priority: 'Revenue growth lever', salon: 'Fill empty groomer slots', mobile: 'Squeeze one more dog per route' },
                  ].map((row, i) => (
                    <tr
                      key={row.priority}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}
                    >
                      <td className="px-5 py-3 text-stone-700 font-medium">{row.priority}</td>
                      <td className="px-5 py-3 text-center text-stone-600">{row.salon}</td>
                      <td className="px-5 py-3 text-center text-stone-600">{row.mobile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-stone-600 leading-relaxed mt-6">
              The best dog grooming scheduling software handles both workflows — but you should evaluate
              based on your primary business model. If you&apos;re 80% mobile and 20% salon, prioritize
              mobile features first.
            </p>
          </div>
        </section>

        {/* ── Transitioning from Manual ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Making the Switch: From Paper and Google Calendar to Dedicated Scheduling Software
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            If you&apos;re currently managing appointments with a paper book, Google Calendar, or a
            spreadsheet, the idea of migrating to new software can feel overwhelming. Here&apos;s the
            reality: it&apos;s simpler than you think, and the payoff is immediate.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            <strong className="text-stone-800">Week 1: Set up your services and pricing.</strong> Enter
            your service menu, breed-specific time slots, and pricing. Most groomers do this in 20–30
            minutes. If your scheduling software supports CSV import, you can bulk-upload your service
            catalog.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            <strong className="text-stone-800">Week 1–2: Import your client list.</strong> Upload your
            existing clients and their pets via CSV — most platforms make this straightforward. You
            don&apos;t need every detail on day one; start with name, phone, pet name, and breed. You can
            add vaccination records and behavioral notes as clients come in for their next appointment.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            <strong className="text-stone-800">Week 2: Turn on automated reminders.</strong> This is the
            single most impactful change you&apos;ll make. Enable 72-hour, 24-hour, and 2-hour reminders
            for all future appointments. Within the first week, you&apos;ll see fewer no-shows and less
            phone tag.
          </p>
          <p className="text-stone-600 leading-relaxed">
            <strong className="text-stone-800">Week 3+: Add online booking.</strong> Share your booking
            link with existing clients and add it to your Google Business Profile, social media, and
            website. New clients will start booking directly — without a phone call — and you&apos;ll
            wonder why you ever did it any other way.
          </p>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 py-16 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqSchema.mainEntity.map((item) => (
                <div key={item.name} className="border border-stone-200 rounded-xl p-6 bg-white">
                  <h3 className="font-bold text-stone-800 mb-3">{item.name}</h3>
                  <p className="text-stone-600 leading-relaxed text-sm">
                    {item.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Stop Losing Appointments. Start Scheduling Smarter.
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            GroomGrid&apos;s AI-powered scheduling software is built for how groomers actually work —
            whether you&apos;re routing a mobile van or managing a salon team. Automated reminders, online
            booking, breed-aware time slots, and route optimization. 14-day free trial, no credit card
            required.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 rounded-xl bg-green-500 text-white text-lg font-bold hover:bg-green-600 transition-colors shadow-lg"
          >
            Start Your Free Trial →
          </Link>
          <p className="text-stone-400 text-sm mt-4">
            No credit card required · Cancel anytime · Set up in under an hour
          </p>
        </section>

        {/* ── Related Content ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-8">More Grooming Business Resources</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <Link
              href="/blog/dog-grooming-software"
              className="p-5 rounded-xl border border-stone-200 hover:border-green-300 hover:shadow-sm transition-all block"
            >
              <p className="text-2xl mb-2">🖥️</p>
              <p className="font-semibold text-stone-800 text-sm mb-1">Dog Grooming Software Guide</p>
              <p className="text-stone-500 text-xs">The full buyer&apos;s guide — features, pricing, and comparisons</p>
            </Link>
            <Link
              href="/blog/reduce-no-shows-dog-grooming/"
              className="p-5 rounded-xl border border-stone-200 hover:border-green-300 hover:shadow-sm transition-all block"
            >
              <p className="text-2xl mb-2">📉</p>
              <p className="font-semibold text-stone-800 text-sm mb-1">Reduce No-Shows in Dog Grooming</p>
              <p className="text-stone-500 text-xs">Proven strategies to cut no-shows and recover lost revenue</p>
            </Link>
            <Link
              href="/plans"
              className="p-5 rounded-xl border border-stone-200 hover:border-green-300 hover:shadow-sm transition-all block"
            >
              <p className="text-2xl mb-2">💰</p>
              <p className="font-semibold text-stone-800 text-sm mb-1">GroomGrid Pricing</p>
              <p className="text-stone-500 text-xs">Plans and pricing for solo groomers, salons, and enterprises</p>
            </Link>
          </div>
        </section>

        {/* ── Related Links ── */}
        <PageRelatedLinks
          slug="blog/dog-grooming-scheduling-software-guide"
          variant="blog"
          heading="The scheduling software built for how groomers actually work"
        />

        {/* ── Footer ── */}
        <SiteFooter slug="blog/dog-grooming-scheduling-software-guide" />
      </div>
    </>
  );
}
