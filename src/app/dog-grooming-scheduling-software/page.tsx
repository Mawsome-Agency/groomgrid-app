import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';
import { generateBreadcrumbListSchema, generateOpenGraph } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Dog Grooming Scheduling Software — Easy Booking & Reminders | GroomGrid',
  description:
    'Grooming scheduling software that auto-sends reminders, blocks double bookings, and works from your phone. Try free 14 days.',
  alternates: {
    canonical: 'https://getgroomgrid.com/dog-grooming-scheduling-software',
  },
  openGraph: generateOpenGraph(
    'Dog Grooming Scheduling Software — Easy Booking & Reminders',
    'Grooming scheduling software that auto-sends reminders, blocks double bookings, and works from your phone. Try free 14 days.',
    'https://getgroomgrid.com/dog-grooming-scheduling-software'
  ),
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'GroomGrid Dog Grooming Scheduling Software',
  description:
    'AI-powered scheduling software for dog groomers with automated reminders, conflict blocking, and mobile-first booking.',
  provider: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
  },
  serviceType: 'Dog Grooming Scheduling Software',
  areaServed: 'United States',
  url: 'https://getgroomgrid.com/dog-grooming-scheduling-software',
  offers: [
    {
      '@type': 'Offer',
      name: 'Solo Plan',
      price: '29',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
      description: 'Scheduling software for solo groomers with reminders, online booking, and mobile access.',
    },
    {
      '@type': 'Offer',
      name: 'Salon Plan',
      price: '79',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
      description: 'Multi-staff scheduling with team coordination, waitlist management, and advanced conflict detection.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does GroomGrid prevent double bookings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid uses intelligent conflict detection that checks groomer availability, appointment duration, and buffer time between appointments. When a client tries to book a slot that overlaps with an existing appointment, the system automatically blocks the request and suggests the next available time. For multi-groomer salons, it tracks each groomer\'s schedule separately.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can clients book appointments online 24/7?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every GroomGrid account includes a personalized booking page (yourname.getgroomgrid.com) that clients can access anytime. They can see your real-time availability, select services, choose preferred times, and receive instant confirmation—all without calling you. You control which services are bookable online and can require deposits for certain appointment types.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do the automated reminders work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid sends a sequence of automated SMS and email reminders: 48 hours before (confirmation request), 24 hours before (friendly reminder with prep instructions), and 2 hours before (final reminder). Clients can confirm, reschedule, or cancel with one tap. Studies show this 3-touch reminder system reduces no-shows by 30-40%.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a mobile app for managing my schedule on the go?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid is built mobile-first, so the entire platform works perfectly from any smartphone browser—no separate app download required. Check your schedule, add appointments, view pet profiles, and send reminders all from your phone. For mobile groomers working from a van, this means full schedule access without touching a laptop.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I set different appointment durations for different services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Configure default durations for each service type—nail trims (15 min), bath and brush (45 min), full groom small dog (60 min), full groom large dog (90 min), etc. When clients book online or you add appointments manually, the system automatically reserves the correct amount of time. You can also override durations for specific appointments if needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does GroomGrid scheduling software cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid starts at $29/month for the Solo plan, which includes unlimited scheduling, automated reminders, online booking, and mobile access. The Salon plan at $79/month adds multi-staff scheduling, waitlist management, and team coordination features. Both plans include a 14-day free trial, and you can use code BETA50 for 50% off your first month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does GroomGrid have a waitlist feature?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. When you\'re fully booked, clients can join a waitlist for their preferred date/time. If an appointment cancels, GroomGrid automatically notifies waitlisted clients in order and gives them a time window to claim the slot. This fills gaps in your schedule without manual outreach, recovering revenue that would otherwise be lost.',
      },
    },
  ],
};

export default function DogGroomingSchedulingSoftwarePage() {
  const breadcrumbSchema = generateBreadcrumbListSchema('dog-grooming-scheduling-software');

  const painPoints = [
    {
      icon: '📅',
      problem: 'Double bookings and calendar chaos',
      solution: 'Intelligent conflict detection blocks overlapping appointments automatically. Multi-staff salons see each groomer\'s schedule separately—no more accidental double-bookings.',
    },
    {
      icon: '🚫',
      problem: 'No-shows wasting your time',
      solution: 'Automated 3-touch reminder sequence (48h, 24h, 2h) reduces no-shows by 30-40%. Clients confirm or reschedule with one tap, giving you time to fill gaps.',
    },
    {
      icon: '📞',
      problem: 'Phone tag and endless scheduling calls',
      solution: '24/7 online booking lets clients see your availability and book instantly. Your personalized booking page handles the back-and-forth so you can focus on grooming.',
    },
    {
      icon: '📋',
      problem: 'Scattered notes and client info',
      solution: 'Every appointment links to a complete pet profile—breed, size, allergies, behavioral notes, and full grooming history accessible in seconds.',
    },
    {
      icon: '💸',
      problem: 'Chasing payments after appointments',
      solution: 'Require deposits at booking, send payment links via SMS, or store cards on file. Get paid before the client leaves—no more awkward follow-ups.',
    },
    {
      icon: '📱',
      problem: 'Desktop-only software that doesn\'t work in the field',
      solution: 'Mobile-first design means full schedule access from any phone. Check appointments, view pet profiles, and manage your day—even from a grooming van.',
    },
  ];

  const features = [
    {
      title: '2-Tap Booking',
      description: 'Add appointments in seconds with intelligent defaults. GroomGrid suggests durations based on service type and pre-fills client info from your database.',
      badge: 'Fast',
    },
    {
      title: 'Auto SMS & Email Reminders',
      description: '3-touch reminder sequence sent automatically. Clients confirm with one tap. Included in every plan—no extra fees for reminder credits.',
      badge: 'Included',
    },
    {
      title: 'Conflict Blocking',
      description: 'Smart detection prevents double bookings by checking groomer availability, service duration, and buffer time. Never overbook again.',
      badge: 'Smart',
    },
    {
      title: 'Mobile-First Design',
      description: 'Full scheduling power on any device. Large tap targets, fast loading, and offline access so you can check your schedule anywhere.',
      badge: 'Mobile',
    },
    {
      title: '24/7 Online Booking',
      description: 'Your personalized booking page works while you sleep. Clients see real-time availability and book instantly—no phone calls required.',
      badge: 'Revenue',
    },
    {
      title: 'Waitlist Management',
      description: 'When appointments cancel, waitlisted clients get notified automatically. Fill gaps in your schedule without lifting a finger.',
      badge: 'Auto',
    },
    {
      title: 'Service-Based Durations',
      description: 'Set custom appointment lengths by service type. Nail trims (15 min), full grooms (60-90 min), de-shedding treatments—GroomGrid tracks it all.',
      badge: 'Flexible',
    },
    {
      title: 'Abandoned Booking Recovery',
      description: 'When clients start but don\'t finish booking, GroomGrid sends a gentle reminder automatically—recovering appointments that would be lost.',
      badge: 'Growth',
    },
  ];

  const schedulingDeepDive = [
    {
      icon: '🗺️',
      title: 'Smart Route Building',
      description: 'For mobile groomers, GroomGrid optimizes your daily route to minimize drive time between appointments. See your full day mapped out with travel estimates.',
    },
    {
      icon: '🌐',
      title: '24/7 Online Booking',
      description: 'Your booking page never sleeps. Capture appointments at 11 PM when pet owners finally remember to schedule. No more "I\'ll call you back tomorrow."',
    },
    {
      icon: '🔄',
      title: 'Gap Filling & Waitlist',
      description: 'Cancellations happen. Your waitlist automatically notifies interested clients and fills empty slots—protecting your revenue without manual work.',
    },
    {
      icon: '⏱️',
      title: 'Custom Service Durations',
      description: 'Set realistic appointment times for every service. A nail trim isn\'t a full groom—GroomGrid reserves the right amount of time for each appointment type.',
    },
  ];

  const comparisonData = [
    {
      feature: 'Automated SMS Reminders',
      groomgrid: true,
      moego: true,
      daysmart: true,
      pawfinity: false,
    },
    {
      feature: 'Online Booking Page',
      groomgrid: true,
      moego: true,
      daysmart: true,
      pawfinity: true,
    },
    {
      feature: 'Double Booking Prevention',
      groomgrid: true,
      moego: true,
      daysmart: true,
      pawfinity: true,
    },
    {
      feature: 'Mobile-First Design',
      groomgrid: true,
      moego: false,
      daysmart: false,
      pawfinity: false,
    },
    {
      feature: 'Waitlist Management',
      groomgrid: true,
      moego: true,
      daysmart: true,
      pawfinity: false,
    },
    {
      feature: 'Abandoned Booking Recovery',
      groomgrid: true,
      moego: false,
      daysmart: false,
      pawfinity: false,
    },
    {
      feature: 'Service-Based Durations',
      groomgrid: true,
      moego: true,
      daysmart: true,
      pawfinity: true,
    },
    {
      feature: 'Included Reminder Credits',
      groomgrid: 'Unlimited',
      moego: 'Limited',
      daysmart: 'Limited',
      pawfinity: 'Limited',
    },
    {
      feature: 'Starting Price',
      groomgrid: '$29/mo',
      moego: '$49/mo',
      daysmart: '$69/mo',
      pawfinity: '$35/mo',
    },
  ];

  const roiStats = [
    {
      number: '30–40%',
      unit: 'fewer no-shows',
      detail: 'Automated reminders recover 2-3 appointments per month. At $65-90 per groom, that\'s $130-270 in protected revenue monthly.',
    },
    {
      number: '5+',
      unit: 'hours saved weekly',
      detail: 'Online booking eliminates scheduling calls. Mobile access means no more driving back to check the computer. Time is money.',
    },
    {
      number: '$240+',
      unit: 'saved annually vs MoeGo',
      detail: 'GroomGrid Solo at $29/mo vs MoeGo\'s $49+/mo. Same core scheduling features—lower price, no setup fees.',
    },
  ];

  const gettingStartedSteps = [
    {
      step: '1',
      title: 'Sign up free',
      body: 'Create your account in 60 seconds. No credit card required—your 14-day trial starts immediately with full scheduling access.',
    },
    {
      step: '2',
      title: 'Set your services & durations',
      body: 'Add your service menu with custom durations. Nail trim (15 min), small dog full groom (60 min), large dog (90 min)—you control the schedule.',
    },
    {
      step: '3',
      title: 'Import existing clients',
      body: 'Upload your client list via CSV or add them manually. Historical grooming notes can be imported or entered over time.',
    },
    {
      step: '4',
      title: 'Share your booking link',
      body: 'Get your personalized booking page (yourname.getgroomgrid.com). Add it to Instagram, Facebook, business cards, and email signature.',
    },
    {
      step: '5',
      title: 'Connect payments',
      body: 'Link your bank via Stripe in 5 minutes. Accept deposits at booking, send payment links, and get paid before the client leaves.',
    },
  ];

  const faqItems = [
    {
      question: 'How does GroomGrid prevent double bookings?',
      answer:
        'GroomGrid uses intelligent conflict detection that checks groomer availability, appointment duration, and buffer time between appointments. When a client tries to book a slot that overlaps with an existing appointment, the system automatically blocks the request and suggests the next available time. For multi-groomer salons, it tracks each groomer\'s schedule separately.',
    },
    {
      question: 'Can clients book appointments online 24/7?',
      answer:
        'Yes. Every GroomGrid account includes a personalized booking page (yourname.getgroomgrid.com) that clients can access anytime. They can see your real-time availability, select services, choose preferred times, and receive instant confirmation—all without calling you. You control which services are bookable online and can require deposits for certain appointment types.',
    },
    {
      question: 'How do the automated reminders work?',
      answer:
        'GroomGrid sends a sequence of automated SMS and email reminders: 48 hours before (confirmation request), 24 hours before (friendly reminder with prep instructions), and 2 hours before (final reminder). Clients can confirm, reschedule, or cancel with one tap. Studies show this 3-touch reminder system reduces no-shows by 30-40%.',
    },
    {
      question: 'Is there a mobile app for managing my schedule on the go?',
      answer:
        'GroomGrid is built mobile-first, so the entire platform works perfectly from any smartphone browser—no separate app download required. Check your schedule, add appointments, view pet profiles, and send reminders all from your phone. For mobile groomers working from a van, this means full schedule access without touching a laptop.',
    },
    {
      question: 'Can I set different appointment durations for different services?',
      answer:
        'Absolutely. Configure default durations for each service type—nail trims (15 min), bath and brush (45 min), full groom small dog (60 min), full groom large dog (90 min), etc. When clients book online or you add appointments manually, the system automatically reserves the correct amount of time. You can also override durations for specific appointments if needed.',
    },
    {
      question: 'How much does GroomGrid scheduling software cost?',
      answer:
        'GroomGrid starts at $29/month for the Solo plan, which includes unlimited scheduling, automated reminders, online booking, and mobile access. The Salon plan at $79/month adds multi-staff scheduling, waitlist management, and team coordination features. Both plans include a 14-day free trial, and you can use code BETA50 for 50% off your first month.',
    },
    {
      question: 'Does GroomGrid have a waitlist feature?',
      answer:
        'Yes. When you\'re fully booked, clients can join a waitlist for their preferred date/time. If an appointment cancels, GroomGrid automatically notifies waitlisted clients in order and gives them a time window to claim the slot. This fills gaps in your schedule without manual outreach, recovering revenue that would otherwise be lost.',
    },
  ];

  return (
    <>
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
            data-cta="nav-trial"
          >
            Start Free Trial
          </Link>
        </nav>

        {/* ── Breadcrumb ── */}
        <div className="px-6 py-3 max-w-5xl mx-auto">
          <PageBreadcrumbs slug="dog-grooming-scheduling-software" />
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Scheduling Software • Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Dog Grooming Scheduling Software<br className="hidden sm:block" /> — Book Appointments in 2 Taps
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Stop double bookings, no-shows, and phone-tag forever. GroomGrid's scheduling software
            auto-sends reminders, blocks conflicts before they happen, and lets clients book 24/7—
            while you focus on grooming.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup?coupon=BETA50"
              className="px-7 py-3.5 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors shadow-sm text-center"
              data-cta="hero-primary"
            >
              Start Free 14-Day Trial →
            </Link>
            <Link
              href="/plans"
              className="px-7 py-3.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-lg hover:border-stone-400 transition-colors text-center"
              data-cta="hero-secondary"
            >
              See Pricing
            </Link>
          </div>
          <p className="text-stone-400 text-sm mt-3">
            No credit card required • Solo tier from $29/mo • Use code <strong className="text-green-600">BETA50</strong> for 50% off
          </p>
        </header>

        {/* ── Pain Points ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-3">
              6 Scheduling Headaches GroomGrid Solves
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Every groomer knows the pain of schedule chaos. Here is how the right software eliminates each one:
            </p>
            <div className="grid grid-cols-1 gap-6">
              {painPoints.map((item) => (
                <div key={item.problem} className="bg-white border border-stone-200 rounded-xl p-6 flex gap-5">
                  <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <p className="font-bold text-stone-800 mb-1">{item.problem}</p>
                    <p className="text-stone-600 text-sm leading-relaxed">{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Scheduling Features That Save Hours Every Week
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            Built by groomers, for groomers. Every feature is designed around how you actually work.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-5 border border-stone-200 rounded-xl bg-white hover:border-green-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="font-bold text-stone-800 text-sm">{feature.title}</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0">
                    {feature.badge}
                  </span>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Scheduling Deep Dive ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-3">
              Scheduling That Actually Works for Groomers
            </h2>
            <p className="text-stone-600 leading-relaxed mb-10">
              Four powerful features that transform how you manage your calendar:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {schedulingDeepDive.map((item) => (
                <div key={item.title} className="p-6 border border-green-200 rounded-xl bg-white hover:border-green-400 hover:shadow-sm transition-all">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            GroomGrid vs The Competition
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            See how GroomGrid compares on the scheduling features that matter most to groomers:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-200">
                  <th className="text-left py-3 px-4 font-semibold text-stone-700">Feature</th>
                  <th className="text-center py-3 px-4 font-bold text-green-700 bg-green-50 rounded-t-lg">GroomGrid</th>
                  <th className="text-center py-3 px-4 font-semibold text-stone-600">MoeGo</th>
                  <th className="text-center py-3 px-4 font-semibold text-stone-600">DaySmart</th>
                  <th className="text-center py-3 px-4 font-semibold text-stone-600">Pawfinity</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={row.feature} className={index % 2 === 0 ? 'bg-stone-50' : 'bg-white'}>
                    <td className="py-3 px-4 text-sm text-stone-700 font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center bg-green-50">
                      {typeof row.groomgrid === 'boolean' ? (
                        row.groomgrid ? (
                          <span className="text-green-600 font-bold">✓</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )
                      ) : (
                        <span className="text-green-700 font-semibold text-sm">{row.groomgrid}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.moego === 'boolean' ? (
                        row.moego ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )
                      ) : (
                        <span className="text-stone-600 text-sm">{row.moego}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.daysmart === 'boolean' ? (
                        row.daysmart ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )
                      ) : (
                        <span className="text-stone-600 text-sm">{row.daysmart}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.pawfinity === 'boolean' ? (
                        row.pawfinity ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )
                      ) : (
                        <span className="text-stone-600 text-sm">{row.pawfinity}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-stone-500 text-sm mt-4 text-center">
            GroomGrid delivers the same core scheduling power at a lower price—with mobile-first design competitors can't match.
          </p>
        </section>

        {/* ── ROI Stats ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              The ROI of Better Scheduling
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              At $29/month, GroomGrid pays for itself quickly. Here is the math:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {roiStats.map((stat) => (
                <div key={stat.unit} className="bg-white border border-stone-200 rounded-xl p-6 text-center">
                  <p className="text-4xl font-extrabold text-green-600 mb-1">{stat.number}</p>
                  <p className="text-stone-700 font-semibold text-sm mb-2">{stat.unit}</p>
                  <p className="text-stone-500 text-xs leading-relaxed">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Getting Started ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Get Started in 5 Steps
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            No onboarding calls, no IT setup. Most groomers are scheduling appointments within 30 minutes:
          </p>
          <div className="space-y-4">
            {gettingStartedSteps.map((item) => (
              <div key={item.step} className="flex gap-4 p-5 border border-stone-200 rounded-xl bg-white">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <p className="font-bold text-stone-800 mb-1">{item.title}</p>
                  <p className="text-stone-600 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 py-16 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqItems.map((item) => (
                <div key={item.question} className="border border-stone-200 rounded-xl p-6 bg-white">
                  <h3 className="font-bold text-stone-800 mb-3">{item.question}</h3>
                  <p className="text-stone-600 leading-relaxed text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Links ── */}
        <PageRelatedLinks slug="dog-grooming-scheduling-software" variant="landing" heading="Scheduling software that works as hard as you do" />

        {/* ── Footer ── */}
        <SiteFooter slug="dog-grooming-scheduling-software" />
      </div>
    </>
  );
}
