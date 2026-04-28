import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Pet Grooming Business Software: Scheduling, Payments & Client Management | GroomGrid',
  description:
    'All-in-one pet grooming business software with AI scheduling, automated reminders, payment processing, client and pet profiles, and business analytics. Built for solo groomers and salons. Start your free trial.',
  alternates: {
    canonical: 'https://getgroomgrid.com/pet-grooming-business-software',
  },
  openGraph: {
    title: 'Pet Grooming Business Software: Scheduling, Payments & Client Management',
    description:
      'Run your entire grooming business from one app — AI scheduling, no-show prevention, payments, pet profiles, and analytics. Built for groomers, not desk jockeys.',
    url: 'https://getgroomgrid.com/pet-grooming-business-software',
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://getgroomgrid.com' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Pet Grooming Business Software',
      item: 'https://getgroomgrid.com/pet-grooming-business-software',
    },
  ],
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'GroomGrid Pet Grooming Business Software',
  description:
    'AI-powered business management platform for pet groomers — scheduling, client and pet profiles, automated reminders, payment processing, and business analytics.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://getgroomgrid.com/pet-grooming-business-software',
  offers: [
    {
      '@type': 'Offer',
      name: 'Solo Plan',
      price: '29',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
      description: 'Pet grooming business software for solo groomers — scheduling, reminders, payments, and pet profiles.',
    },
    {
      '@type': 'Offer',
      name: 'Salon Plan',
      price: '79',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
      description: 'Pet grooming business software for salons with 2-5 groomers — team scheduling, client retention, and business analytics.',
    },
  ],
  featureList: [
    'AI scheduling assistant',
    'Automated SMS & email reminders',
    'Integrated payment processing',
    'Pet profiles with breed, allergies, and grooming history',
    'Client management and intake forms',
    'Business analytics and reporting',
    'Mobile-first design',
    'Deposit and no-show protection',
  ].join(', '),
  provider: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best software for a pet grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid is the best software for pet grooming businesses in 2026. It combines AI-powered scheduling, automated no-show prevention, integrated payments, detailed pet profiles, and business analytics — all in one mobile-first platform. Starting at $29/month for solo groomers and $79/month for salons.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does pet grooming business software cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid starts at $29/month for the Solo plan (1 groomer) and $79/month for the Salon plan (up to 5 groomers). Use code BETA50 for 50% off your first month. No hidden fees, no contracts, cancel anytime.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I manage both mobile and in-shop grooming with one software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. GroomGrid supports both mobile and salon workflows. Mobile groomers get route-optimized scheduling and on-the-road payment collection. Salon owners get multi-staff calendars and team management. Both get the same client profiles, reminder automation, and analytics.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does pet grooming software help prevent no-shows?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. GroomGrid sends automated reminders at 48 hours, 24 hours, and 2 hours before each appointment. You can require deposits for new clients. If a client starts booking but doesn't finish, the abandoned booking recovery feature sends a follow-up automatically. Together, these cut no-shows by 30–40%.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I switch from MoeGo or DaySmart to GroomGrid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "GroomGrid makes switching easy — import your client list via CSV, set up your services and pricing in minutes, and share your new booking link. Most groomers are fully running in under 30 minutes. Your old data stays accessible while you transition.",
      },
    },
  ],
};

export default function PetGroomingBusinessSoftwarePage() {
  const painPoints = [
    {
      icon: '📅',
      problem: 'Scheduling chaos — double bookings, gaps, and missed calls',
      solution:
        "GroomGrid's AI scheduling assistant flags conflicts before they happen, fills gaps with waitlisted clients, and lets clients book online 24/7. You stop playing phone tag.",
    },
    {
      icon: '💸',
      problem: 'No-shows and late cancellations drain revenue',
      solution:
        'Automated 3-touch reminders (48h, 24h, 2h before) cut no-shows by 30–40%. Require deposits from new clients. One no-show prevented pays for months of GroomGrid.',
    },
    {
      icon: '📋',
      problem: 'Pet profiles scattered across paper, texts, and memory',
      solution:
        'Every pet gets a profile with breed, size, allergies, vaccination records, temperament notes, and grooming history. Access it from your phone in 10 seconds.',
    },
    {
      icon: '💳',
      problem: 'Chasing payments after the groom',
      solution:
        'Send a payment link via SMS mid-appointment. Accept cards, tap-to-pay, or digital invoice. Automatic receipts. No more awkward follow-ups or unpaid invoices.',
    },
    {
      icon: '📊',
      problem: 'No idea which services or clients drive your revenue',
      solution:
        'Business analytics show you top services, most valuable clients, appointment trends, and revenue growth. Stop guessing which promotions work — the numbers tell you.',
    },
    {
      icon: '📱',
      problem: "Desktop software that doesn't work from a van or grooming table",
      solution:
        'GroomGrid is mobile-first. Every screen is designed for a 6-inch phone display. Check your schedule, pull up pet profiles, and collect payment — no laptop needed.',
    },
  ];

  const features = [
    {
      title: 'AI Scheduling Assistant',
      description:
        'Tell GroomGrid your working hours and service area. It builds an optimized daily schedule, flags conflicts, and fills gaps with waitlisted clients automatically.',
      badge: 'AI-Powered',
    },
    {
      title: 'Automated Reminders',
      description:
        'Every appointment gets SMS and email reminders at 48 hours, 24 hours, and 2 hours before. Clients confirm, reschedule, or cancel — giving you time to fill the slot.',
      badge: 'Included',
    },
    {
      title: 'Integrated Payments',
      description:
        'Send payment links via SMS, accept cards through tap-to-pay or card reader, and auto-generate receipts. Clients pay before you finish — no chasing.',
      badge: 'Integrated',
    },
    {
      title: 'Pet & Client Profiles',
      description:
        'Breed, size, allergies, vaccination status, temperament notes, grooming history, and before/after photos — all in one place. Accessible from any device in seconds.',
      badge: 'All-in-One',
    },
    {
      title: 'Business Analytics',
      description:
        'See which services generate the most revenue, which clients are your top spenders, and how your business trends month over month. Data-driven decisions, not guesswork.',
      badge: 'Insights',
    },
    {
      title: 'Mobile Grooming Support',
      description:
        'Route-optimized scheduling, on-the-road payment collection, offline pet profile access, and GPS-aware daily views. Built for groomers who work from a van.',
      badge: 'Mobile-First',
    },
    {
      title: 'Cat Grooming Support',
      description:
        "Cat-specific fields for temperament, sedation notes, stress levels, and behavior flags. Custom appointment durations that match feline needs — not dog-sized time slots.",
      badge: 'Cat-Friendly',
    },
    {
      title: 'Abandoned Booking Recovery',
      description:
        "When a client starts booking but doesn't finish, GroomGrid sends an automatic recovery reminder. Recover appointments that would have been lost.",
      badge: 'Auto-Recovery',
    },
  ];

  const competitors = [
    {
      name: 'GroomGrid',
      price: '$29/mo',
      aiScheduling: 'Yes',
      reminders: '3-touch SMS + email',
      payments: 'Integrated',
      mobileFirst: 'Yes',
      catSupport: 'Yes',
      analytics: 'Yes',
      highlight: true,
    },
    {
      name: 'MoeGo',
      price: '$49+/mo',
      aiScheduling: 'No',
      reminders: 'Basic',
      payments: 'Add-on',
      mobileFirst: 'No',
      catSupport: 'Limited',
      analytics: 'Limited',
      highlight: false,
    },
    {
      name: 'DaySmart',
      price: '$30+/mo',
      aiScheduling: 'No',
      reminders: 'Basic',
      payments: 'Add-on',
      mobileFirst: 'No',
      catSupport: 'No',
      analytics: 'Basic',
      highlight: false,
    },
    {
      name: 'Pawfinity',
      price: '$30+/mo',
      aiScheduling: 'No',
      reminders: 'Email only',
      payments: 'Add-on',
      mobileFirst: 'No',
      catSupport: 'No',
      analytics: 'No',
      highlight: false,
    },
  ];

  const faqItems = [
    {
      question: 'What is the best software for a pet grooming business?',
      answer:
        'GroomGrid is the best software for pet grooming businesses in 2026. It combines AI-powered scheduling, automated no-show prevention, integrated payments, detailed pet profiles, and business analytics — all in one mobile-first platform. Starting at $29/month for solo groomers and $79/month for salons.',
    },
    {
      question: 'How much does pet grooming business software cost?',
      answer:
        'GroomGrid starts at $29/month for the Solo plan (1 groomer) and $79/month for the Salon plan (up to 5 groomers). Use code BETA50 for 50% off your first month. No hidden fees, no contracts, cancel anytime.',
    },
    {
      question: 'Can I manage both mobile and in-shop grooming with one software?',
      answer:
        'Yes. GroomGrid supports both mobile and salon workflows. Mobile groomers get route-optimized scheduling and on-the-road payment collection. Salon owners get multi-staff calendars and team management. Both get the same client profiles, reminder automation, and analytics.',
    },
    {
      question: 'Does pet grooming software help prevent no-shows?',
      answer:
        "Yes. GroomGrid sends automated reminders at 48 hours, 24 hours, and 2 hours before each appointment. You can require deposits for new clients. If a client starts booking but doesn't finish, the abandoned booking recovery feature sends a follow-up automatically. Together, these cut no-shows by 30–40%.",
    },
    {
      question: 'How do I switch from MoeGo or DaySmart to GroomGrid?',
      answer:
        'GroomGrid makes switching easy — import your client list via CSV, set up your services and pricing in minutes, and share your new booking link. Most groomers are fully running in under 30 minutes. Your old data stays accessible while you transition.',
    },
  ];

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white text-stone-900">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-stone-100">
          <Link href="/" className="text-xl font-bold text-green-600">
            GroomGrid &#x1f43e;
          </Link>
          <Link
            href="/signup?coupon=BETA50"
            className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
            data-cta-type="signup"
            data-cta-location="nav"
          >
            Start Free Trial
          </Link>
        </nav>

        {/* Breadcrumb */}
        <div className="px-6 py-3 max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">
                Pet Grooming Business Software
              </li>
            </ol>
          </nav>
        </div>

        {/* Hero */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Pet Grooming Business Software &#183; Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Pet Grooming Business Software<br className="hidden sm:block" /> That Runs the Whole Shop
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Scheduling, client management, payment processing, pet profiles, and business analytics
            &#8212; one mobile-first platform built for pet groomers. Not another salon app with
            &#8220;pet&#8221; bolted on.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup?coupon=BETA50"
              className="px-7 py-3.5 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors shadow-sm text-center"
              data-cta-type="signup"
              data-cta-location="hero"
            >
              Start Your Free Trial &#x2192;
            </Link>
            <Link
              href="/plans"
              className="px-7 py-3.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-lg hover:border-stone-400 transition-colors text-center"
              data-cta-type="pricing"
              data-cta-location="hero"
            >
              See Pricing
            </Link>
          </div>
          <p className="text-stone-400 text-sm mt-3">No credit card required &#183; Solo tier from $29/mo &#183; Use code BETA50 for 50% off</p>
        </header>

        {/* Problem Section */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-3">
              Running a Pet Grooming Business Without Software Is Expensive
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Paper calendars, texted appointment confirmations, paper intake forms, and chasing
              payments at the end of the day. Every hour you spend on admin is an hour you&#8217;re
              not grooming. Here&#8217;s how the right software solves each problem:
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

        {/* Feature Grid */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Everything Your Grooming Business Needs in One Platform
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            Scheduling, payments, client management, analytics, and mobile support &#8212; built
            for the way pet groomers actually work, not how desk software assumes you work.
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

        {/* Scheduling Deep Dive */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-3">
              Scheduling That Thinks Like a Groomer
            </h2>
            <p className="text-stone-600 leading-relaxed mb-10">
              Your calendar should do more than show appointments. GroomGrid&#8217;s AI scheduling
              assistant builds efficient daily routes, flags conflicts, and fills cancellations
              automatically.
            </p>
            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  title: 'Smart Daily Route Building',
                  description: 'Tell GroomGrid your service area and it builds the most efficient route for mobile groomers. For salons, it auto-balances groomer workloads across the day.',
                  icon: '🗺️',
                },
                {
                  title: 'Online Booking, 24/7',
                  description: 'Clients book their own appointments through your personalized booking page. No phone tag, no texting back and forth. You just show up and groom.',
                  icon: '📆',
                },
                {
                  title: 'Gap Filling & Waitlist',
                  description: 'When a cancellation opens up, GroomGrid automatically offers the slot to waitlisted clients. No empty slots, no lost revenue.',
                  icon: '📋',
                },
                {
                  title: 'Service-Based Durations',
                  description: 'Set default appointment lengths by service type — full groom (90 min), bath and brush (60 min), nail trim (15 min). No more manually adjusting every booking.',
                  icon: '⏱️',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-green-200 rounded-xl p-6 flex gap-5">
                  <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <p className="font-bold text-stone-800 mb-1">{item.title}</p>
                    <p className="text-stone-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client & Pet Management */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-3">
            Every Pet, Every Owner, Every Detail &#8212; One Place
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            Stop juggling paper files, text messages, and memory. GroomGrid puts every client and pet
            detail in one searchable profile you can pull up from any device.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Complete Pet Profiles',
                description: "Breed, size, allergies, vaccination status, temperament notes, grooming history, and before/after photos. Everything you need before you start the groom.",
                badge: 'All-in-One',
              },
              {
                title: 'Client History & Notes',
                description: "See every appointment, charge, and communication with a client at a glance. No more searching through texts or emails to remember what Fluffy's owner said last time.",
                badge: 'Searchable',
              },
              {
                title: 'Digital Intake Forms',
                description: 'New clients fill out their info and sign waivers online before their first appointment. Pet profiles arrive pre-filled — no clipboards, no paper.',
                badge: 'Automated',
              },
              {
                title: 'Breed-Specific Grooming Notes',
                description: "AI breed detection pre-fills service recommendations and grooming notes based on breed. Poodle cuts, terrier hand-stripping, Persian lion cuts — all pre-loaded.",
                badge: 'AI-Powered',
              },
            ].map((feature) => (
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

        {/* Revenue & Analytics */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-3">
              Know Your Numbers &#8212; Stop Guessing
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Most groomers don&#8217;t know which services make them money, which clients drain time,
              or how their business is trending. GroomGrid&#8217;s analytics give you the full picture.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                {
                  number: '30–40%',
                  unit: 'no-show reduction',
                  detail: 'Automated reminders and deposit requirements protect your revenue and schedule.',
                },
                {
                  number: '2–3 hrs',
                  unit: 'saved per week on admin',
                  detail: 'Scheduling, reminders, payments, and intake forms all run automatically.',
                },
                {
                  number: '$240',
                  unit: 'saved vs. MoeGo annually',
                  detail: "GroomGrid Solo at $29/mo vs. MoeGo's $49+/mo starting price. Same core features, lower price.",
                },
              ].map((stat) => (
                <div key={stat.unit} className="bg-white border border-stone-200 rounded-xl p-6 text-center">
                  <p className="text-4xl font-extrabold text-green-600 mb-1">{stat.number}</p>
                  <p className="text-stone-700 font-semibold text-sm mb-2">{stat.unit}</p>
                  <p className="text-stone-500 text-xs leading-relaxed">{stat.detail}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  title: 'Revenue by Service',
                  description: 'See which services generate the most revenue — full grooms vs. bath-only, mobile vs. in-shop. Focus your marketing where it counts.',
                },
                {
                  title: 'Client Retention Tracking',
                  description: 'Know which clients are coming back, which are drifting away, and when to reach out. Automated re-engagement messages bring lapsed clients back.',
                },
                {
                  title: 'Monthly & Yearly Trends',
                  description: 'Track appointment volume, revenue growth, and average ticket size over time. Spot seasonal patterns and plan for slow months.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 border border-green-300 rounded-xl bg-white">
                  <span className="text-green-600 font-bold text-lg mt-0.5">&#10003;</span>
                  <div>
                    <p className="font-bold text-stone-800 text-sm">{item.title}</p>
                    <p className="text-stone-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Competitor Comparison */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-3">
            GroomGrid vs. Other Pet Grooming Software
          </h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            See how GroomGrid compares to the other options on the market. Spoiler: you get more
            features for less money.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-stone-200">
                  <th className="text-left py-3 px-3 text-stone-600 font-semibold">Feature</th>
                  {competitors.map((comp) => (
                    <th
                      key={comp.name}
                      className={`text-center py-3 px-3 font-semibold ${comp.highlight ? 'text-green-600 bg-green-50 rounded-t-lg' : 'text-stone-600'}`}
                    >
                      {comp.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-100">
                  <td className="py-3 px-3 text-stone-700 font-medium">Starting Price</td>
                  {competitors.map((comp) => (
                    <td
                      key={comp.name}
                      className={`text-center py-3 px-3 ${comp.highlight ? 'bg-green-50 font-semibold text-green-700' : 'text-stone-600'}`}
                    >
                      {comp.price}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 px-3 text-stone-700 font-medium">AI Scheduling</td>
                  {competitors.map((comp) => (
                    <td
                      key={comp.name}
                      className={`text-center py-3 px-3 ${comp.highlight ? 'bg-green-50 font-semibold text-green-700' : 'text-stone-600'}`}
                    >
                      {comp.aiScheduling}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 px-3 text-stone-700 font-medium">Reminders</td>
                  {competitors.map((comp) => (
                    <td
                      key={comp.name}
                      className={`text-center py-3 px-3 ${comp.highlight ? 'bg-green-50 font-semibold text-green-700' : 'text-stone-600'}`}
                    >
                      {comp.reminders}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 px-3 text-stone-700 font-medium">Payments</td>
                  {competitors.map((comp) => (
                    <td
                      key={comp.name}
                      className={`text-center py-3 px-3 ${comp.highlight ? 'bg-green-50 font-semibold text-green-700' : 'text-stone-600'}`}
                    >
                      {comp.payments}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 px-3 text-stone-700 font-medium">Mobile-First</td>
                  {competitors.map((comp) => (
                    <td
                      key={comp.name}
                      className={`text-center py-3 px-3 ${comp.highlight ? 'bg-green-50 font-semibold text-green-700' : 'text-stone-600'}`}
                    >
                      {comp.mobileFirst}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-3 px-3 text-stone-700 font-medium">Cat Grooming Support</td>
                  {competitors.map((comp) => (
                    <td
                      key={comp.name}
                      className={`text-center py-3 px-3 ${comp.highlight ? 'bg-green-50 font-semibold text-green-700' : 'text-stone-600'}`}
                    >
                      {comp.catSupport}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 text-stone-700 font-medium">Analytics</td>
                  {competitors.map((comp) => (
                    <td
                      key={comp.name}
                      className={`text-center py-3 px-3 rounded-b-lg ${comp.highlight ? 'bg-green-50 font-semibold text-green-700' : 'text-stone-600'}`}
                    >
                      {comp.analytics}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/signup?coupon=BETA50"
              className="inline-block px-7 py-3.5 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors shadow-sm"
              data-cta-type="signup"
              data-cta-location="comparison"
            >
              Start Your Free Trial &#x2192;
            </Link>
          </div>
        </section>

        {/* Getting Started */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Set Up Pet Grooming Software in Under 30 Minutes
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              GroomGrid is designed to get you running fast &#8212; no onboarding calls, no IT setup:
            </p>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Sign up for free', body: 'Create your account at getgroomgrid.com. No credit card required — your 14-day trial starts immediately.' },
                { step: '2', title: 'Set up your services and pricing', body: 'Add your service menu (bath, full groom, nail trim, etc.), pricing, and appointment durations. Takes about 10 minutes.' },
                { step: '3', title: 'Import your existing clients', body: 'Have a client list in Google Contacts, a spreadsheet, or another grooming app? Import via CSV in minutes.' },
                { step: '4', title: 'Share your booking link', body: 'You get a personalized booking page (yourname.getgroomgrid.com) immediately. Share it via text, Instagram bio, or Facebook.' },
                { step: '5', title: 'Connect Stripe for payments', body: 'Link your bank account via Stripe — takes about 5 minutes. Start accepting digital payments for your next appointment.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-5 border border-green-200 rounded-xl bg-white">
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
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
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
        </section>

        {/* Related Links */}
        <RelatedLinks
          heading="Explore more GroomGrid resources"
          links={[
            { href: '/plans', category: 'Pricing', title: 'See Plans & Pricing' },
            { href: '/blog/pet-grooming-software', category: "Buyer's Guide", title: 'Best Pet Grooming Software for 2026' },
            { href: '/blog/dog-grooming-business-management', category: 'Business Guide', title: 'Dog Grooming Business Management Tips' },
            { href: '/mobile-grooming-software', category: 'Mobile Groomers', title: 'Mobile Grooming Software for Van Groomers' },
          ]}
          columns={4}
        />

        {/* Footer Features Bar */}
        <section className="px-6 py-8 bg-stone-50 border-t border-stone-100">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-stone-500 text-sm leading-relaxed">
              &#x1f4c5; AI Scheduling &#183; &#x1f4f1; Automated Reminders &#183; &#x1f4b3; Integrated
              Payments &#183; &#x1f43e; Pet Profiles &#183; &#x1f4ca; Business Analytics &#183; &#x1f431; Cat
              Grooming Support
            </p>
            <p className="text-stone-400 text-sm mt-3">
              Starting at $29/month for solo groomers. Use code <strong className="text-green-600">BETA50</strong> for 50% off your first month.
            </p>
          </div>
        </section>

        {/* Footer */}
        <SiteFooter links={[{ href: '/mobile-grooming-software', label: 'Mobile Grooming' }, { href: '/cat-grooming-software', label: 'Cat Grooming' }, { href: '/plans', label: 'Pricing' }, { href: '/signup', label: 'Sign Up' }]} />
      </div>
    </>
  );
}
