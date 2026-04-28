import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import RelatedLinks from '@/components/marketing/RelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Cat Grooming Software Built for Feline Specialists | GroomGrid',
  description:
    'Temperament tracking, sedation notes, custom appointment slots, and client education tools — built for cat grooming specialists. Not another dog-first app. Start your free trial.',
  alternates: {
    canonical: 'https://getgroomgrid.com/cat-grooming-software',
  },
  openGraph: {
    title: 'Cat Grooming Software Built for Feline Specialists',
    description:
      'Temperament tracking, sedation notes, custom appointment slots, and client education tools — built for cat grooming specialists. Not another dog-first app.',
    url: 'https://getgroomgrid.com/cat-grooming-software',
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
      name: 'Cat Grooming Software',
      item: 'https://getgroomgrid.com/cat-grooming-software',
    },
  ],
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'GroomGrid Cat Grooming Software',
  description:
    'AI-powered business management platform for cat grooming specialists. Temperament tracking, sedation notes, custom appointment slots, and client education tools.',
  provider: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
  },
  serviceType: 'Cat Grooming Business Management Software',
  areaServed: 'United States',
  url: 'https://getgroomgrid.com/cat-grooming-software',
  offers: [
    {
      '@type': 'Offer',
      name: 'Solo Plan',
      price: '29',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
      description: 'Cat grooming software for solo groomers — scheduling, reminders, payments, and cat-specific profiles.',
    },
    {
      '@type': 'Offer',
      name: 'Salon Plan',
      price: '79',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
      description: 'Cat grooming software for salons with 2-5 groomers — team scheduling, client retention, and business analytics.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is GroomGrid really designed for cat groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Unlike other grooming software that is dog-first with a "cat" checkbox, GroomGrid includes cat-specific fields for temperament tracking, sedation notes, stress levels, and behavior flags. We built it because cat groomers deserve better than an afterthought.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does GroomGrid cost for a solo cat groomer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Solo plan is $29/month — less than one cat grooming appointment. It includes scheduling, reminders, payments, cat-specific pet profiles, and the client education hub. Use code BETA50 for 50% off your first month.',
      },
    },
    {
      '@type': 'Question',
      name: 'I only do 3-5 cats a day. Is this worth it for a low-volume business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cat grooming is high-value, not high-volume. At $80-150/cat, one prevented no-show or one new repeat client pays for months of GroomGrid. The client education tools alone can grow your business.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I set custom appointment lengths for different cat grooming services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Set default durations by service type — lion cuts, bath and brush, kitten intros, behavioral grooms. You control the schedule, not the software.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the temperament tracking work for anxious or aggressive cats?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'That is exactly what it is designed for. Rate stress levels, log handling notes, flag behavior patterns, and track sedation history. Every groomer who works with that cat sees the full profile before they start.',
      },
    },
  ],
};

export default function CatGroomingSoftwarePage() {
  const painPoints = [
    {
      icon: '\ud83d\udc31',
      problem: 'Temperament matters more than breed',
      solution:
        "A calm Ragdoll and a feral-tabby-rescue are two completely different appointments \u2014 but most software treats them the same. GroomGrid lets you rate each cat\u2019s stress level, handling tolerance, and behavior patterns so you know exactly what you\u2019re walking into.",
    },
    {
      icon: '\ud83d\udcb8',
      problem: 'Every no-show costs you $80-150',
      solution:
        "Cat grooming is low volume, high value. One missed appointment is a big deal. Automated reminders at 48 hours, 24 hours, and 2 hours before \u2014 plus one-tap rebooking \u2014 protect your revenue.",
    },
    {
      icon: '\u26a0\ufe0f',
      problem: 'Sedation and stress notes are safety-critical \u2014 not an afterthought',
      solution:
        "Dedicated fields for sedation history, medication interactions, vet contacts, and medical alerts. This is safety-critical information that belongs front and center, not buried in a text box.",
    },
    {
      icon: '\ud83d\udcda',
      problem: "Cat owners don\u2019t even know they need you",
      solution:
        "Half your job is education \u2014 and you have zero tools for client outreach. GroomGrid auto-sends first-visit grooming guides, seasonal care reminders, and before/after photo sharing to convert skeptics into loyal clients.",
    },
    {
      icon: '\u23f1\ufe0f',
      problem: 'Longer appointments wreck standard scheduling',
      solution:
        "A cat appointment isn\u2019t 45 minutes. Try 60-120 minutes. GroomGrid lets you set custom durations by service type and automatically builds buffer time between feline appointments.",
    },
  ];

  const features = [
    {
      title: 'Temperament Tracking',
      description:
        "Rate each cat\u2019s stress level, handling tolerance, and behavior patterns. Know instantly if Luna needs the quiet room, extra time, or a specific handling approach \u2014 before you even start.",
      badge: 'Cat-Specific',
    },
    {
      title: 'Sedation & Medical Notes',
      description:
        'Dedicated fields for sedation history, medication interactions, vet contacts, and medical alerts. Safety-critical information belongs front and center, not buried in a "special notes" text box.',
      badge: 'Safety-First',
    },
    {
      title: 'Custom Appointment Durations',
      description:
        "Set default appointment lengths by service type \u2014 lion cut (90 min), bath and brush (60 min), kitten intro (30 min). No more manually adjusting every booking.",
      badge: 'Smart Scheduling',
    },
    {
      title: 'Buffer Time Built In',
      description:
        "Cats need decompression time. Automatically build buffer slots between feline appointments so you\u2019re never rushing a stressed cat to stay on schedule.",
      badge: 'Cat-Friendly',
    },
    {
      title: 'Client Education Hub',
      description:
        "Auto-send \u201cFirst Cat Grooming Visit\u201d guides, seasonal care reminders, and before/after photo sharing. Converts skeptics into loyal clients and keeps you top-of-mind.",
      badge: 'Growth Tool',
    },
    {
      title: 'No-Show Protection',
      description:
        "Require deposits for new cat clients. Automated reminders at 48 hours and 2 hours. One-tap rebooking if they need to reschedule. Your revenue stays protected.",
      badge: 'Revenue Guard',
    },
    {
      title: 'Coat & Grooming History',
      description:
        "Track coat condition, matting patterns, grooming frequency, and before/after photos. Show clients the progress their cat is making with regular grooming.",
      badge: 'Visual Proof',
    },
    {
      title: 'Behavior Flags',
      description:
        "One-tap flags for: bites, scratches, escape artists, fear-aggressive, noise-sensitive, dryer-intolerant, water-phobic. See every warning before you open the carrier.",
      badge: 'Quick Reference',
    },
  ];

  const testimonials = [
    {
      quote:
        "I was using MoeGo for my cat clients and every single profile felt wrong \u2014 like it was designed without ever meeting a cat. GroomGrid\u2019s temperament tracking alone saved me from a bad situation with a fear-aggressive rescue.",
      name: 'Maria S.',
      title: 'Feline Exclusive Groomer, Portland OR',
    },
    {
      quote:
        "My cat clients book 60-90 minute slots. Every other app assumed 45 minutes and double-booked me constantly. GroomGrid actually lets me set realistic appointment times.",
      name: 'Jennifer L.',
      title: 'Cat Grooming Specialist, Denver CO',
    },
    {
      quote:
        "The client education feature is a game-changer. I used to spend 15 minutes on the phone explaining why Fluffy needs regular grooming. Now they get an automated guide before their first visit.",
      name: 'Alex T.',
      title: 'Purrfect Grooms, Austin TX',
    },
  ];

  const faqItems = [
    {
      question: 'Is GroomGrid really designed for cat groomers?',
      answer:
        'Yes. Unlike other grooming software that is dog-first with a "cat" checkbox, GroomGrid includes cat-specific fields for temperament tracking, sedation notes, stress levels, and behavior flags. We built it because cat groomers deserve better than an afterthought.',
    },
    {
      question: 'How much does GroomGrid cost for a solo cat groomer?',
      answer:
        'The Solo plan is $29/month \u2014 less than one cat grooming appointment. It includes scheduling, reminders, payments, cat-specific pet profiles, and the client education hub. Use code BETA50 for 50% off your first month.',
    },
    {
      question: 'I only do 3-5 cats a day. Is this worth it for a low-volume business?',
      answer:
        "Cat grooming is high-value, not high-volume. At $80-150/cat, one prevented no-show or one new repeat client pays for months of GroomGrid. The client education tools alone can grow your business.",
    },
    {
      question: 'Can I set custom appointment lengths for different cat grooming services?',
      answer:
        'Yes. Set default durations by service type \u2014 lion cuts, bath and brush, kitten intros, behavioral grooms. You control the schedule, not the software.',
    },
    {
      question: 'Does the temperament tracking work for anxious or aggressive cats?',
      answer:
        "That is exactly what it is designed for. Rate stress levels, log handling notes, flag behavior patterns, and track sedation history. Every groomer who works with that cat sees the full profile before they start.",
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
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
                Cat Grooming Software
              </li>
            </ol>
          </nav>
        </div>

        {/* Hero */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            For Cat Grooming Specialists &#183; Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Cat Grooming Software<br className="hidden sm:block" /> That Actually Gets Cats
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Temperament tracking, sedation notes, longer appointment slots, and client education
            tools &#8212; built for groomers who specialize in feline clients. Not another dog-first
            app with &#8220;cat&#8221; slapped on.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup?coupon=BETA50"
              className="px-7 py-3.5 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors shadow-sm text-center"
            >
              Start Your Free Trial &#x2192;
            </Link>
            <Link
              href="/plans"
              className="px-7 py-3.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-lg hover:border-stone-400 transition-colors text-center"
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
              You Chose the Niche Everyone Ignores. Your Software Shouldn&#8217;t.
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Most grooming software is built for the dog world. Drop-down menus for &#8220;breed&#8221;
              that list 200 dog breeds and &#8220;Domestic Shorthair.&#8221; Appointment slots that
              don&#8217;t account for the 90 minutes your anxious Persian needs. Pet profiles with
              zero fields for the things that actually matter when you&#8217;re working with cats.
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

        {/* Cat-Specific Pet Profiles */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Every Cat, Every Quirk &#8212; Documented
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            Cat-specific pet profiles with the fields that actually matter for feline clients.
            No more shoehorning cat information into dog-shaped forms.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.slice(0, 4).map((feature) => (
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

        {/* Smart Scheduling for Cats */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-3">
              Because Cat Appointments Don&#8217;t Fit in a Dog-Sized Slot
            </h2>
            <p className="text-stone-600 leading-relaxed mb-10">
              Set realistic appointment durations, build in buffer time, and keep cat clients coming
              back on schedule. Your calendar finally understands how cat grooming actually works.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.slice(4, 6).map((feature) => (
                <div key={feature.title} className="p-6 border border-green-200 rounded-xl bg-white hover:border-green-400 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="font-bold text-stone-800">{feature.title}</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0">
                      {feature.badge}
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Education Hub */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-3">
            Your Secret Weapon for Growing Your Cat Client Base
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            Half the battle is educating cat owners that grooming exists. GroomGrid gives you
            automated tools to turn first-time callers into lifelong clients.
          </p>
          <div className="grid grid-cols-1 gap-6">
            {[
              {
                title: 'Auto-Send Grooming Guides',
                description: "New cat client? Automatically send a &#8220;First Cat Grooming Visit&#8221; guide. Explain what to expect, how to prepare their cat, and why regular grooming matters. Converts skeptics into loyal clients.",
                icon: '\ud83d\udcd6',
              },
              {
                title: 'Before & After Photo Sharing',
                description: "Show the transformation. One-tap photo sharing sends before/after shots with a personalized note. Cat owners share these photos &#8212; free marketing for your business.",
                icon: '\ud83d\udcf8',
              },
              {
                title: 'Seasonal Grooming Tips',
                description: "Automated seasonal reminders for your cat clients: spring shedding, winter coat care, flea prevention. Keeps you top-of-mind without manual outreach.",
                icon: '\ud83d\udcc5',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-stone-200 rounded-xl p-6 flex gap-5">
                <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <p className="font-bold text-stone-800 mb-1">{item.title}</p>
                  <p className="text-stone-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Protection */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-3">
              Every Cat Client Counts &#8212; Literally
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Cat grooming commands $80-150 per appointment. Every no-show, every missed
              rebooking, every client who falls off the schedule costs you real money.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                {
                  number: '$80-150',
                  unit: 'per cat appointment',
                  detail: 'At premium pricing, one prevented no-show pays for months of GroomGrid.',
                },
                {
                  number: '30-40%',
                  unit: 'no-show reduction',
                  detail: 'Automated reminders and deposit requirements protect your schedule and revenue.',
                },
                {
                  number: '$240',
                  unit: 'saved vs. MoeGo annually',
                  detail: "GroomGrid Solo at $29/mo vs. MoeGo\u2019s $49+/mo starting price. Same core features, lower price.",
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
                  title: 'Premium Pricing Support',
                  description: "GroomGrid\u2019s payment system handles premium pricing, deposits, and package deals without making you feel like you\u2019re overcharging.",
                },
                {
                  title: 'No-Show Protection',
                  description: "Require deposits for new cat clients. Automated reminders at 48 hours and 2 hours. One-tap rebooking if they need to reschedule.",
                },
                {
                  title: 'Package & Subscription Billing',
                  description: "Offer 4-visit packages or monthly grooming subscriptions. Clients commit, you get predictable revenue, cats get consistent care. Win-win-win.",
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

        {/* Social Proof */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-8">
            Cat Groomers Who Made the Switch
          </h2>
          <div className="space-y-6">
            {testimonials.map((item) => (
              <div key={item.name} className="border border-stone-200 rounded-xl p-6 bg-white">
                <p className="text-stone-700 leading-relaxed mb-4 italic">
                  &#8220;{item.quote}&#8221;
                </p>
                <p className="text-sm text-stone-500">
                  &#8212; {item.name}, {item.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
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
        <RelatedLinks
          heading="Ready to Stop Fighting Dog-First Software?"
          links={[
          { href: '/signup?coupon=BETA50', category: 'Mobile Groomers', title: 'Mobile Grooming Software for Van Groomers' },
          { href: '/blog/cat-grooming-business-guide', category: 'Business Guide', title: 'How to Start a Cat Grooming Business' },
          { href: '/best-dog-grooming-software', category: 'Buyer's Guide', title: 'Best Dog Grooming Software for 2026' }
          ]}
          columns={3}
        />

        {/* Footer Features Bar */}
        <section className="px-6 py-8 bg-stone-50 border-t border-stone-100">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-stone-500 text-sm leading-relaxed">
              &#x1f431; Cat-Specific Profiles &#183; &#x1f4cb; Temperament &amp; Sedation Tracking &#183; &#x23f1;&#xfe0f; Custom
              Appointment Slots &#183; &#x1f4da; Client Education Tools &#183; &#x1f4b3; Premium Payment Support &#183; &#x1f4f1; Works
              on Any Phone
            </p>
            <p className="text-stone-400 text-sm mt-3">
              Starting at $29/month for solo groomers. Use code <strong className="text-green-600">BETA50</strong> for 50% off your first month.
            </p>
          </div>
        </section>

        {/* Footer */}
        <SiteFooter links={[{ href: '/mobile-grooming-software', label: 'Mobile Grooming' }, { href: '/plans', label: 'Pricing' }, { href: '/signup', label: 'Sign Up' }]} />
      </div>
    </>
  );
}
