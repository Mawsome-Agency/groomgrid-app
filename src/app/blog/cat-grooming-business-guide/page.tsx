import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'How to Start a Cat Grooming Business: The Complete Guide | GroomGrid',
  description:
    'Everything you need to start a cat grooming business — certifications, pricing ($80–$150/cat), handling techniques, scheduling, and the tools to manage it all.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/cat-grooming-business-guide',
  },
  openGraph: {
    title: 'How to Start a Cat Grooming Business: The Complete Guide',
    description:
      'Everything you need to start a cat grooming business — certifications, pricing ($80–$150/cat), handling techniques, scheduling, and the tools to manage it all.',
    url: 'https://getgroomgrid.com/blog/cat-grooming-business-guide',
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
      name: 'How to Start a Cat Grooming Business',
      item: 'https://getgroomgrid.com/blog/cat-grooming-business-guide',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Start a Cat Grooming Business: The Complete Guide',
  description:
    'Everything you need to start a cat grooming business — certifications, pricing ($80–$150/cat), handling techniques, scheduling, and the tools to manage it all.',
  url: 'https://getgroomgrid.com/blog/cat-grooming-business-guide',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/cat-grooming-business-guide',
  },
};

export default function CatGroomingBusinessGuidePage() {
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
              <li className="text-stone-700 font-medium" aria-current="page">Cat Grooming Business Guide</li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Starting Out
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            How to Start a Cat Grooming<br className="hidden sm:block" /> Business in 2025
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            Cat grooming is one of the most underserved niches in the pet industry. Demand is growing,
            competition is low, and clients are willing to pay $80–$150 per appointment. Here&apos;s
            everything you need to launch a profitable cat grooming business — and keep it running smoothly.
          </p>
        </header>

        {/* ── Why Cat Grooming ── */}
        <section className="px-6 py-12 bg-amber-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Why Cat Grooming Is a Smarter Niche Than You Think</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Most grooming software is dog-first. Most groomers are dog-first. That means cat owners —
              who genuinely need professional grooming help for their long-haired Persians and anxious
              Maine Coons — are chronically underserved. That gap is your opportunity.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              The economics are compelling: the average cat groom runs $80–$150, roughly comparable to
              a mid-size dog. But cat grooming sessions are often calmer (one animal, no barking), and
              volume requirements are lower. Serve 4–6 cats per day and you have a full, profitable
              schedule.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { stat: '$80–$150', label: 'Avg. cat groom price', sub: 'Premium over dog grooming' },
                { stat: 'Low', label: 'Competition level', sub: 'Few certified cat groomers' },
                { stat: '4–6', label: 'Cats/day for full income', sub: 'Manageable daily volume' },
              ].map(({ stat, label, sub }) => (
                <div key={stat} className="p-5 bg-white rounded-xl border border-amber-200 text-center">
                  <p className="text-3xl font-extrabold text-amber-600 mb-1">{stat}</p>
                  <p className="font-semibold text-stone-800 text-sm">{label}</p>
                  <p className="text-stone-500 text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How Cats Are Different ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Cat Grooming vs. Dog Grooming: What&apos;s Actually Different</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            If you have a dog grooming background, you already have transferable skills. But cat grooming
            is a genuinely distinct discipline — and underestimating that difference is the fastest way
            to injure yourself, stress the animal, or lose a client.
          </p>

          <h3 className="text-xl font-bold text-stone-800 mt-8 mb-3">Temperament and Handling</h3>
          <p className="text-stone-600 leading-relaxed mb-4">
            Cats don&apos;t respond to the same social cues as dogs. They can&apos;t be soothed with
            treats and enthusiasm. A scared or overstimulated cat will shut down, scratch, or bite —
            often with little warning. You need to read feline body language fluently: flattened ears,
            a lashing tail, skin that ripples along the back, pupils that blow wide open. These are
            your stop signals.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            The key principle is working <em>with</em> a cat&apos;s stress tolerance, not against it.
            Experienced cat groomers learn to work quickly on calm cats and to break sessions into
            shorter chunks for anxious ones. Some cats are perfectly happy on a table; others need
            a towel wrap (the &quot;burrito&quot; technique) to feel secure.
          </p>

          <h3 className="text-xl font-bold text-stone-800 mt-8 mb-3">Sedation Awareness</h3>
          <p className="text-stone-600 leading-relaxed mb-4">
            This is the big one. Some cat owners will tell you their vet has recommended mild sedation
            for grooming. You need to know what was administered, the dosage, and how it affects the
            cat&apos;s body temperature regulation, breathing, and reaction time. Never groom a
            sedated cat without explicit documentation from the owner — and ideally from the vet.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            Your client intake form should always ask: <em>Has this cat ever been sedated for grooming?
            If so, what was used and what was the dose?</em> This protects you and the cat.
          </p>

          <h3 className="text-xl font-bold text-stone-800 mt-8 mb-3">Coat Types and Breed-Specific Needs</h3>
          <p className="text-stone-600 leading-relaxed mb-4">
            Persian coats mat at a completely different rate than a short-haired domestic. Maine Coons
            have a double coat that needs completely different tools and technique than a Siamese.
            The &quot;lion cut&quot; — the signature cat groom — requires confidence with clippers on
            a moving, potentially unhappy animal. Plan to apprentice or take hands-on training before
            you do paid lion cuts solo.
          </p>

          <div className="mt-8 p-6 bg-stone-50 rounded-xl border border-stone-200">
            <p className="font-semibold text-stone-800 mb-3">Cat vs. Dog grooming at a glance:</p>
            <div className="space-y-3 text-sm">
              {[
                { aspect: 'Session length', cat: '1.5–3 hrs (anxiety breaks)', dog: '1–2 hrs' },
                { aspect: 'Key skill', cat: 'Reading feline body language', dog: 'Breed-specific styling' },
                { aspect: 'Stress signals', cat: 'Subtle, sudden', dog: 'More gradual, readable' },
                { aspect: 'Sedation awareness', cat: 'Critical — must document', dog: 'Rare concern' },
                { aspect: 'Booking buffer', cat: '30–60 min extra per session', dog: 'Standard schedule' },
              ].map(({ aspect, cat, dog }) => (
                <div key={aspect} className="grid grid-cols-3 gap-2">
                  <span className="font-medium text-stone-700">{aspect}</span>
                  <span className="text-amber-700">🐱 {cat}</span>
                  <span className="text-blue-700">🐶 {dog}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mid-Article CTA ── */}
        <section className="px-6 py-10 bg-green-600">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-bold text-xl mb-1">Running a cat grooming business on paper and prayer?</p>
              <p className="text-green-100 text-sm">
                GroomGrid gives cat groomers cat-specific pet profiles — temperament notes, sedation records,
                breed-specific service history, and flexible appointment slots that actually fit your schedule.
              </p>
            </div>
            <Link
              href="/signup?coupon=BETA50"
              className="shrink-0 px-6 py-3 rounded-xl bg-white text-green-700 font-bold text-sm hover:bg-green-50 transition-colors"
            >
              Try GroomGrid Free →
            </Link>
          </div>
        </section>

        {/* ── Certification ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">NCGIA Certification: Why It Matters</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            The National Cat Groomers Institute of America (NCGIA) is the gold standard for professional
            cat grooming credentials. Founded by Danelle German — widely regarded as the leading authority
            on cat grooming education in North America — the NCGIA offers a rigorous certification program
            that covers feline anatomy, coat types, handling techniques, and safe bathing/drying methods
            for cats.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            Becoming a Certified Feline Master Groomer (CFMG) or Certified Feline Stylist (CFS) tells
            potential clients something important: you&apos;re not a dog groomer who also does cats on the
            side. You are a specialist. That distinction justifies premium pricing and builds instant trust.
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'NCGIA courses are available online and in-person — start with the Fundamentals program',
              'The CFMG designation requires hands-on skill testing with live cats',
              'Certification adds marketing muscle — use it on your website, social, and van branding',
              'NCGIA members get access to a groomer directory that cat owners actively search',
              'Annual CE requirements keep your skills current as techniques evolve',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-amber-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-stone-600 leading-relaxed">
            Even if you can&apos;t pursue full NCGIA certification immediately, completing their foundational
            online courses is a smart first investment before taking on paying cat clients. You&apos;ll
            avoid the mistakes that lead to scratched hands, stressed cats, and bad Yelp reviews.
          </p>
        </section>

        {/* ── Pricing ── */}
        <section className="px-6 py-14 bg-amber-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Cat Grooming Pricing: What to Charge</h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              Cat grooming commands premium rates because of the specialized skill required and the
              limited number of qualified providers. Don&apos;t underprice yourself to compete with
              dog-first groomers who &quot;also do cats.&quot; Your certification and expertise are worth
              more than that.
            </p>
            <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
              <div className="grid grid-cols-3 gap-0 text-sm font-bold text-stone-700 bg-amber-100 px-4 py-3">
                <span>Service</span>
                <span>Short-hair cats</span>
                <span>Long-hair cats</span>
              </div>
              {[
                { service: 'Bath + blow-dry + brush', short: '$55–$80', long: '$75–$110' },
                { service: 'Full groom (bath + trim + nail)', short: '$80–$110', long: '$100–$150' },
                { service: 'Lion cut (full body clip)', short: '$100–$130', long: '$120–$160' },
                { service: 'Dematting (per 30 min)', short: '$25–$45', long: '$30–$60' },
                { service: 'Nail trim only', short: '$20–$35', long: '$20–$35' },
                { service: 'Sanitary clip', short: '$25–$40', long: '$30–$50' },
              ].map(({ service, short, long }) => (
                <div key={service} className="grid grid-cols-3 gap-0 text-sm px-4 py-3 border-t border-amber-100">
                  <span className="text-stone-700 font-medium">{service}</span>
                  <span className="text-stone-600">{short}</span>
                  <span className="text-stone-600">{long}</span>
                </div>
              ))}
            </div>
            <p className="text-stone-500 text-sm mt-4">
              These are market-rate ranges for the US as of 2025. Adjust upward in high-cost metro areas,
              and add a surcharge for extreme matting or behavioral difficulty.
            </p>
            <div className="mt-6 p-5 bg-white rounded-xl border border-amber-200">
              <p className="font-semibold text-stone-800 mb-2">Behavioral surcharges — use them</p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Cats that require extra handling time, multiple breaks, or a second handler to complete safely
                cost you real time. A $25–$50 &quot;handling fee&quot; for difficult cats is standard and
                expected in the cat grooming world. Document it in your service agreement and note it in your
                pet records so you&apos;re prepared at the next appointment.
              </p>
            </div>
          </div>
        </section>

        {/* ── Scheduling Challenges ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Scheduling: The Hidden Challenge in Cat Grooming</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Cat grooming sessions are inherently less predictable than dog grooms. A cat who was calm
            last appointment may be a nightmare today because you&apos;re running 10 minutes late and
            she sensed your energy. You need to build that unpredictability into your schedule — or
            you&apos;ll end up perpetually behind, stressed, and running rushed sessions on animals that
            need patience above all else.
          </p>

          <h3 className="text-xl font-bold text-stone-800 mt-6 mb-3">Block Longer Appointment Slots</h3>
          <p className="text-stone-600 leading-relaxed mb-4">
            Where a dog groom might run 60–90 minutes, a cat groom — especially for long-haired breeds
            or anxious animals — should be blocked at 90 minutes to 3 hours. That includes setup, the
            groom itself, breaks when needed, and cleanup. Trying to squeeze cats into the same time
            slots as dogs is a recipe for corner-cutting.
          </p>

          <h3 className="text-xl font-bold text-stone-800 mt-6 mb-3">Cat-Only Days vs. Mixed Schedules</h3>
          <p className="text-stone-600 leading-relaxed mb-4">
            Many experienced cat groomers swear by dedicated cat-only days. The reasons are practical:
            the smell of dogs stresses cats before they even get on the table. If you have a salon space,
            the ambient noise of a dog-grooming environment can push an already-anxious cat over the edge.
            Cat-only scheduling means a quieter, calmer room — and calmer grooms.
          </p>

          <h3 className="text-xl font-bold text-stone-800 mt-6 mb-3">Tracking Temperament Over Time</h3>
          <p className="text-stone-600 leading-relaxed mb-4">
            One of the most valuable things you can do for your business is keep detailed notes on every
            cat&apos;s behavior across appointments. Was Mochi calm for the bath but stressed during
            the drying? Did she need a 15-minute break after the lion cut? Did the new shampoo seem
            to irritate her skin?
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            These notes aren&apos;t just good animal welfare — they protect you legally and make every
            subsequent appointment go more smoothly. A cat who had a bad experience last time needs a
            modified approach this time. You can&apos;t track that in your head across 20+ clients.
          </p>
        </section>

        {/* ── GroomGrid for Cat Groomers ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">How GroomGrid Is Built for Cat Groomers</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Most grooming software is built with dogs in mind. Cat fields are an afterthought — a
              generic &quot;notes&quot; box that you end up stuffing with everything from vaccination
              records to behavioral history. GroomGrid treats cat grooming as the distinct discipline
              it actually is.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: 'Cat-specific pet profiles',
                  detail:
                    'Capture temperament level (calm / manageable / difficult), anxiety triggers, sedation history, coat type, behavioral notes, and special handling instructions — all in structured fields, not buried in a text blob.',
                },
                {
                  title: 'Flexible appointment slots',
                  detail:
                    'Set custom appointment durations per pet, not per service. A senior Persian who needs three breaks and extra patience gets a 3-hour slot. A chill shorthair who loves the table gets 90 minutes. No forcing square pegs into round holes.',
                },
                {
                  title: 'Behavioral history across appointments',
                  detail:
                    "Every session is logged. You walk into next month's appointment knowing exactly how last time went — what worked, what didn't, and what to watch for. No more relying on memory.",
                },
                {
                  title: 'No-show protection',
                  detail:
                    'Cat clients are high-value — a single no-show on a 3-hour lion cut slot is a significant hit to your day. Automated SMS reminders go out 48 and 24 hours before, dramatically reducing last-minute cancellations.',
                },
                {
                  title: 'Client communication that builds trust',
                  detail:
                    'After each appointment, send a quick summary note to the owner — how the session went, any observations, and when to book next. Cat owners are detail-oriented. They want to know their baby was in good hands.',
                },
              ].map(({ title, detail }) => (
                <div key={title} className="p-5 bg-white rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-800 mb-2">🐱 {title}</p>
                  <p className="text-stone-600 text-sm leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mobile vs Salon ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Mobile Cat Grooming vs. Salon: Which Model Fits You?</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Both models work for cat grooming, and each has real advantages. The right choice depends
            on your capital, your tolerance for logistics, and your target clients.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-lg font-bold text-stone-800 mb-3">🚐 Mobile Cat Grooming</p>
              <div className="space-y-2 text-sm text-stone-600">
                <p><strong>Best for:</strong> House-call specialists, anxious cats who hate travel</p>
                <p><strong>Startup cost:</strong> $15,000–$50,000 (van + equipment)</p>
                <p><strong>Key advantage:</strong> Cats groom dramatically better in a quiet, familiar-smelling environment. No dog smells, no salon noise. Many anxious cats who are nightmares at the salon are completely cooperative at home.</p>
                <p><strong>Key challenge:</strong> Travel time eats into appointment capacity. You&apos;re doing 3–5 cats per day, not 6–8.</p>
              </div>
            </div>
            <div className="p-6 bg-green-50 rounded-xl border border-green-200">
              <p className="text-lg font-bold text-stone-800 mb-3">🏠 Salon-Based Cat Grooming</p>
              <div className="space-y-2 text-sm text-stone-600">
                <p><strong>Best for:</strong> Cat-only studios, dedicated cat grooming rooms in existing salons</p>
                <p><strong>Startup cost:</strong> $5,000–$20,000 (dedicated cat room setup)</p>
                <p><strong>Key advantage:</strong> Higher daily volume, consistent environment you can control, opportunity to build a cat-specialist reputation in your area.</p>
                <p><strong>Key challenge:</strong> If you&apos;re in a mixed salon, dog smells and noise require deliberate separation. Consider cat-only hours or a dedicated room.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-stone-50 rounded-xl border border-stone-200">
            <p className="font-semibold text-stone-800 mb-3">The hybrid model: start mobile, add in-studio later</p>
            <p className="text-stone-600 text-sm leading-relaxed">
              Many successful cat groomers start mobile to build a client base with lower overhead, then
              add a studio space once they have consistent demand. The client relationships you build
              doing house calls — where you&apos;re meeting the cat in its own territory — tend to be
              exceptionally loyal. Those clients will follow you into a studio.
            </p>
          </div>
        </section>

        {/* ── Getting Started Checklist ── */}
        <section className="px-6 py-14 bg-amber-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Your Cat Grooming Business Launch Checklist</h2>
            <div className="space-y-3">
              {[
                'Complete at minimum the NCGIA Fundamentals course before taking paid cat clients',
                'Practice handling techniques with rescue cats or under a mentor before solo sessions',
                'Register your business (LLC recommended) and get business liability insurance',
                'Create a thorough client intake form capturing temperament, sedation history, health conditions, and vet contact',
                'Set appointment slots at 90 minutes minimum — 2–3 hours for long-haired or anxious cats',
                'Price your services at market rate ($80–$150/groom) — do not undersell your specialized skill',
                'Set up a pet profile system to track behavioral notes, coat condition, and session history per cat',
                'Join NCGIA for directory listing and referral traffic from cat owners searching for certified groomers',
                'Consider cat-only scheduling days to reduce cross-contamination of dog smells and noise',
                'Use SMS appointment reminders — no-shows on 3-hour cat slots hurt. A lot.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-amber-100">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-stone-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Ready to Run Your Cat Grooming Business Like a Pro?
          </h2>
          <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            GroomGrid is purpose-built for groomers who take their craft seriously. Cat-specific pet
            profiles, flexible appointment scheduling, automated reminders, and payment tracking —
            all in one place. No spreadsheets. No sticky notes. No chasing clients.
          </p>
          <Link
            href="/signup?coupon=BETA50"
            className="inline-block px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-xl hover:bg-green-600 transition-colors"
          >
            Start Your Free Trial — No Credit Card Required
          </Link>
          <p className="text-stone-400 text-sm mt-4">50% off for founding members · Cancel anytime</p>
        </section>

        {/* ── Footer ── */}
        <footer className="px-6 py-8 border-t border-stone-100 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <p>© {new Date().getFullYear()} GroomGrid. Built for groomers who love their craft.</p>
          <div className="flex gap-6">
            <Link href="/blog" className="hover:text-green-600 transition-colors">Blog</Link>
            <Link href="/plans" className="hover:text-green-600 transition-colors">Pricing</Link>
            <Link href="/signup" className="hover:text-green-600 transition-colors">Get Started</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
