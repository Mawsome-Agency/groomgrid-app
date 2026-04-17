import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Dog Grooming Waiver Template: Free Liability Waiver for Professional Groomers | GroomGrid',
  description:
    'Protect your grooming business with a free dog grooming waiver template. Covers senior dogs, matting, medical emergencies, and behavioral risks — ready to customize and use.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/dog-grooming-waiver-template/',
  },
  openGraph: {
    title: 'Dog Grooming Waiver Template: Free Liability Waiver for Professional Groomers',
    description:
      'Free dog grooming waiver template covering senior dogs, matting, medical emergencies, and liability — ready to customize.',
    url: 'https://getgroomgrid.com/blog/dog-grooming-waiver-template/',
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
      name: 'Dog Grooming Waiver Template',
      item: 'https://getgroomgrid.com/blog/dog-grooming-waiver-template/',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dog Grooming Waiver Template: Free Liability Waiver for Professional Groomers',
  description:
    'Free dog grooming waiver template covering senior dogs, matting, medical emergencies, and liability — ready to customize.',
  url: 'https://getgroomgrid.com/blog/dog-grooming-waiver-template/',
  datePublished: '2026-04-17',
  dateModified: '2026-04-17',
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
    '@id': 'https://getgroomgrid.com/blog/dog-grooming-waiver-template/',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do dog groomers need a liability waiver?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. A grooming waiver protects your business when things go wrong — a senior dog with an undisclosed heart condition, a mat shave the owner claims to not have authorized, or a dog with bite history the owner never mentioned. Without a signed waiver, disputes default to your word against the client\'s. With a waiver, you have signed documentation that establishes what was disclosed, consented to, and agreed upon before any service took place.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a grooming waiver and a grooming contract?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A grooming waiver covers liability — it documents health disclosures, authorizes mat removal, grants emergency vet consent, and establishes what risks the client has acknowledged. A grooming contract covers the business relationship — pricing, payment terms, cancellation policies, and what happens if the client no-shows. You need both. Some groomers combine them into one document; others keep them separate so the waiver is clearly presented as a distinct legal acknowledgment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a digital grooming waiver legally valid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Digital signatures are legally valid in all 50 US states under the E-SIGN Act of 2000. A digital waiver signed at the time of booking creates a timestamped, IP-recorded record that is often stronger evidence than a paper form in a dispute. Booking software that collects waivers electronically handles this automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should a dog grooming waiver include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A complete dog grooming waiver should include: (1) general grooming authorization, (2) health disclosure for the pet including medications, recent surgeries, and prior adverse reactions, (3) matting and coat condition release authorizing shave-downs when necessary, (4) senior dog acknowledgment for dogs 7 years and older, (5) behavioral and aggression disclosure, (6) medical emergency consent to contact the vet and seek emergency care, and (7) liability limitation for pre-existing conditions not disclosed by the owner.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can a groomer refuse service if a client won\'t sign the waiver?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You are not obligated to groom animals whose owners refuse to sign your standard documentation. Frame it as routine professional protocol: "I require all new clients to complete our intake and waiver before the first appointment." Most clients will comply when it\'s presented as standard process rather than as something unusual.',
      },
    },
  ],
};

const waiverSections = [
  {
    icon: '🐕',
    title: 'General Grooming Authorization',
    description:
      'Client authorizes physical handling, restraint, and use of grooming tools. Acknowledges that some pets experience stress during grooming.',
    risk: 'Baseline consent',
  },
  {
    icon: '🏥',
    title: 'Health & Medication Disclosure',
    description:
      'Documents all known health conditions, current medications, recent surgeries, and prior adverse reactions to grooming products.',
    risk: 'Pre-existing conditions',
  },
  {
    icon: '✂️',
    title: 'Matting & Coat Release',
    description:
      'Authorizes mat removal including shave-downs when necessary. Client acknowledges that matting may hide skin conditions uncovered during removal.',
    risk: 'Coat disputes',
  },
  {
    icon: '🐾',
    title: 'Senior Dog Acknowledgment',
    description:
      'For dogs 7+ years or with health conditions. Client acknowledges elevated grooming risk and authorizes service at their discretion.',
    risk: 'Age-related stress reactions',
  },
  {
    icon: '⚠️',
    title: 'Behavioral & Aggression Disclosure',
    description:
      'Client discloses bite history, prior service refusals, and handling difficulties. Groomer reserves right to discontinue service.',
    risk: 'Undisclosed aggression',
  },
  {
    icon: '🚨',
    title: 'Medical Emergency Consent',
    description:
      'Authorizes emergency vet transport if needed. Client agrees to cover all emergency veterinary costs.',
    risk: 'Cardiac/stress emergencies',
  },
];

export default function DogGroomingWaiverTemplatePage() {
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
          <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-green-600 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog/" className="hover:text-green-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-stone-700 font-medium" aria-current="page">
                Dog Grooming Waiver Template
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Business Protection · Updated April 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Dog Grooming Waiver Template:<br className="hidden sm:block" /> Free Liability Waiver for
            Professional Groomers
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            A grooming waiver is the document that stands between your business and the client who
            claims the mat shave was unauthorized, the senior dog&apos;s stress reaction was your
            fault, or the bite-prone dog they never mentioned was somehow your problem. This guide
            covers what belongs in a waiver and provides a complete, customizable dog grooming
            waiver template you can use today.
          </p>
        </header>

        {/* ── Why You Need a Waiver ── */}
        <section className="px-6 py-14 bg-amber-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Why Every Groomer Needs a Signed Waiver
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Most groomers don&apos;t think about waivers until they need one. A senior dog with
              undiagnosed heart disease goes into distress during the bath. A Doodle arrives with
              severe matting, gets shaved, and the owner claims they &ldquo;had no idea.&rdquo; A dog with a
              known bite history takes a piece of the groomer&apos;s hand — and the owner suggests
              the groomer must have provoked it.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              <strong>With a waiver:</strong> these situations are unpleasant but manageable. You
              have signed documentation establishing what was disclosed, consented to, and agreed
              upon before any service took place.
            </p>
            <p className="text-stone-600 leading-relaxed mb-6">
              <strong>Without a waiver:</strong> every dispute defaults to your word against the
              client&apos;s. And clients who are angry, guilty, or grieving will often remember
              events very differently than you do.
            </p>
            <div className="bg-white rounded-xl border border-amber-200 p-6">
              <p className="text-stone-700 font-semibold mb-2">📋 A grooming waiver is NOT:</p>
              <ul className="space-y-1 text-stone-600 text-sm">
                <li>• A permission slip to be negligent — it doesn&apos;t protect you from gross negligence or intentional harm</li>
                <li>• The same as a service contract — that covers pricing, payment terms, and cancellation policy</li>
                <li>• The same as a client intake form — that collects information about the dog</li>
              </ul>
              <p className="text-stone-700 font-semibold mt-4 mb-2">✅ A grooming waiver IS:</p>
              <ul className="space-y-1 text-stone-600 text-sm">
                <li>• Documented disclosure of what the owner knew about their pet before the service</li>
                <li>• Signed consent for mat removal, emergency vet care, and breed-appropriate handling</li>
                <li>• Liability protection for situations arising from conditions the owner failed to disclose</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Waiver Sections ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            The 6 Sections a Grooming Waiver Must Cover
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            A complete dog grooming waiver addresses six categories of risk. Here&apos;s what each
            section protects against:
          </p>
          <div className="space-y-6">
            {waiverSections.map((section) => (
              <div
                key={section.title}
                className="flex items-start gap-5 p-6 rounded-xl border border-stone-200 hover:border-green-300 transition-all"
              >
                <span className="text-3xl flex-shrink-0">{section.icon}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-bold text-stone-800">{section.title}</h3>
                    <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                      Protects: {section.risk}
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-sm">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Waiver Template ── */}
        <section className="px-6 py-14 bg-green-50" id="waiver-template">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-3">
              Complete Dog Grooming Waiver Template
            </h2>
            <p className="text-stone-600 mb-2">
              Copy, customize the bracketed fields, and use this template as your standard
              new-client waiver. <em>This is a general template — consult a local attorney if you
              want state-specific review.</em>
            </p>
            <div className="bg-white border border-stone-200 rounded-xl p-8 mt-6 font-mono text-sm text-stone-700 leading-relaxed space-y-6">

              <div className="text-center border-b border-stone-200 pb-6">
                <p className="font-bold text-base text-stone-900 uppercase tracking-wide">
                  DOG GROOMING SERVICES — LIABILITY WAIVER AND RELEASE FORM
                </p>
                <p className="mt-2 text-stone-600">[YOUR BUSINESS NAME]</p>
                <p className="text-stone-500 text-xs">[Address | City, State | Phone | Email | Website]</p>
              </div>

              <div>
                <p className="font-bold text-stone-800 uppercase text-xs tracking-widest mb-3">Owner Information</p>
                <p>Owner Name: _________________________</p>
                <p>Phone: _________________________</p>
                <p>Email: _________________________</p>
                <p>Emergency Contact Name: _________________________</p>
                <p>Emergency Contact Phone: _________________________</p>
              </div>

              <div>
                <p className="font-bold text-stone-800 uppercase text-xs tracking-widest mb-3">Pet Information</p>
                <p>Pet Name: _________________________</p>
                <p>Breed: _________________________</p>
                <p>Age: ___________________________ &nbsp; Weight: _______________</p>
                <p>Veterinarian Name: _________________________</p>
                <p>Veterinarian Phone: _________________________</p>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <p className="font-bold text-stone-800 mb-2">SECTION 1 — GENERAL GROOMING AUTHORIZATION</p>
                <p className="font-sans text-stone-600 text-sm leading-relaxed">
                  I authorize [Business Name] to perform the requested grooming services. I acknowledge
                  that grooming involves physical handling, bathing, drying, clipping, nail trimming,
                  and ear cleaning as appropriate. I understand that some pets experience stress during
                  grooming and that [Business Name] will exercise professional care throughout.
                </p>
                <p className="mt-3">☐ I authorize the services as described.</p>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <p className="font-bold text-stone-800 mb-2">SECTION 2 — HEALTH DISCLOSURE</p>
                <p className="font-sans text-stone-600 text-sm mb-3">
                  Failure to disclose known health or behavioral conditions releases [Business Name]
                  from liability for related issues arising during grooming.
                </p>
                <p>Does your pet have any current health conditions, injuries, or recent surgeries?</p>
                <p className="ml-4">☐ No &nbsp; ☐ Yes — Describe: _________________________</p>
                <p className="mt-2">Is your pet currently taking any medications or supplements?</p>
                <p className="ml-4">☐ No &nbsp; ☐ Yes — List: _________________________</p>
                <p className="mt-2">Has your pet had any prior adverse reactions to grooming or products?</p>
                <p className="ml-4">☐ No &nbsp; ☐ Yes — Describe: _________________________</p>
                <p className="mt-2">Is your pet a senior dog (7+ years) or do they have conditions affected by grooming stress?</p>
                <p className="ml-4">☐ No &nbsp; ☐ Yes — Describe: _________________________</p>
                <p className="mt-3">☐ I have fully disclosed all known health conditions.</p>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <p className="font-bold text-stone-800 mb-2">SECTION 3 — MATTING AND COAT CONDITION RELEASE</p>
                <p className="font-sans text-stone-600 text-sm leading-relaxed mb-3">
                  I authorize [Business Name] to determine the appropriate course of action when
                  matting is present, including full or partial shave-downs. I acknowledge that:
                </p>
                <ul className="font-sans text-stone-600 text-sm space-y-1 ml-4">
                  <li>• Removing a severely matted coat may reveal pre-existing skin conditions</li>
                  <li>• [Business Name] is not responsible for skin conditions uncovered during mat removal</li>
                  <li>• Coat texture may change after a mat shave and may take time to grow back</li>
                  <li>• Shaving is the humane alternative to combing out severe matting</li>
                </ul>
                <p className="mt-3">☐ I authorize mat removal as determined necessary by the groomer.</p>
                <p>☐ I acknowledge the conditions above.</p>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <p className="font-bold text-stone-800 mb-2">SECTION 4 — BEHAVIORAL DISCLOSURE</p>
                <p>Does your pet have any known aggression, bite history, or handling difficulties?</p>
                <p className="ml-4">☐ No &nbsp; ☐ Yes — Describe: _________________________</p>
                <p className="mt-2">Has your pet been refused service at any other grooming facility?</p>
                <p className="ml-4">☐ No &nbsp; ☐ Yes — Describe: _________________________</p>
                <p className="font-sans text-stone-600 text-sm mt-3 leading-relaxed">
                  I understand that [Business Name] reserves the right to discontinue service if my
                  pet&apos;s behavior poses a risk. I accept responsibility for any injury caused by my
                  pet if I failed to disclose known behavioral concerns.
                </p>
                <p className="mt-3">☐ I have fully disclosed all known behavioral history.</p>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <p className="font-bold text-stone-800 mb-2">SECTION 5 — MEDICAL EMERGENCY CONSENT</p>
                <p className="font-sans text-stone-600 text-sm leading-relaxed mb-3">
                  In the event of a medical emergency, I authorize [Business Name] to contact my
                  listed veterinarian or transport my pet to the nearest emergency veterinary clinic.
                  I understand I am responsible for all veterinary fees related to emergency care.
                </p>
                <p>☐ I authorize emergency veterinary care as described above.</p>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <p className="font-bold text-stone-800 mb-2">SECTION 6 — LIABILITY LIMITATION</p>
                <p className="font-sans text-stone-600 text-sm leading-relaxed">
                  [Business Name] will exercise professional care and skill throughout all services.
                  [Business Name] is not liable for pre-existing health or behavioral conditions I
                  failed to disclose, nor for conditions arising from the pet&apos;s known health
                  status when services were requested anyway. This waiver does not release [Business
                  Name] from liability for gross negligence or intentional misconduct.
                </p>
                <p className="mt-3">☐ I understand the liability limitations described above.</p>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <p className="font-bold text-stone-800 mb-2">SECTION 7 — PHOTO RELEASE (Optional)</p>
                <p>☐ I authorize use of my pet&apos;s image for business marketing purposes.</p>
                <p>☐ I do not authorize use of my pet&apos;s image.</p>
              </div>

              <div className="border-t border-2 border-stone-300 pt-6 mt-6">
                <p className="font-bold text-stone-800 mb-2">ACKNOWLEDGMENT AND SIGNATURE</p>
                <p className="font-sans text-stone-600 text-sm leading-relaxed mb-4">
                  By signing below, I confirm I have read this entire document, understand and agree
                  to all terms, and certify that all information provided is accurate and complete.
                </p>
                <p>Client Signature: _________________________ &nbsp; Date: ___________</p>
                <p className="mt-2">Printed Name: _________________________</p>
                <p className="mt-3 text-xs text-stone-400 font-sans">
                  For digital signatures, the date and IP address of signature will be recorded by the booking system.
                </p>
              </div>
            </div>

            <p className="text-sm text-stone-500 mt-4 italic">
              Note: This is a general template. Consult a local attorney for state-specific enforceability review.
            </p>
          </div>
        </section>

        {/* ── Digital vs Paper ── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Digital Waivers vs. Paper Waivers
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            Both work legally, but digital waivers have significant operational advantages — especially
            for groomers who want to stop managing paper at the door.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl border border-stone-200">
              <h3 className="font-bold text-stone-800 mb-3">📄 Paper Waiver</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li>✓ Works without technology</li>
                <li>✓ Familiar to older clients</li>
                <li className="text-red-600">✗ Gets wet, lost, or misplaced</li>
                <li className="text-red-600">✗ Collected at check-in when everyone is rushed</li>
                <li className="text-red-600">✗ Hard to retrieve in a dispute</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-green-200 bg-green-50">
              <h3 className="font-bold text-stone-800 mb-3">💻 Digital Waiver</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li>✓ Signed at booking, before the appointment</li>
                <li>✓ Timestamped and IP-recorded — no &ldquo;I didn&apos;t sign that&rdquo; disputes</li>
                <li>✓ Stored permanently against the client profile</li>
                <li>✓ No clipboard at the van door for mobile groomers</li>
                <li>✓ Legally valid under the E-SIGN Act in all 50 states</li>
              </ul>
            </div>
          </div>
          <p className="text-stone-600 leading-relaxed">
            <Link href="/blog/dog-grooming-software/" className="text-green-700 font-semibold hover:underline">
              Grooming management software
            </Link>{' '}
            like{' '}
            <Link href="/" className="text-green-700 font-semibold hover:underline">
              GroomGrid
            </Link>{' '}
            handles waiver collection as part of the new client intake flow. Clients complete their
            profile, health disclosures, and waiver when they first book online — the signed records
            are stored against their profile permanently. No paper, no clipboard, no scramble at
            check-in.
          </p>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-10">
              Grooming Waiver FAQs
            </h2>
            <div className="space-y-8">
              {faqSchema.mainEntity.map((item) => (
                <div key={item.name} className="border-b border-stone-200 pb-8 last:border-0">
                  <h3 className="text-lg font-bold text-stone-800 mb-3">{item.name}</h3>
                  <p className="text-stone-600 leading-relaxed">{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Content ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-8">More Grooming Business Resources</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <Link
              href="/blog/dog-grooming-contract-template/"
              className="p-5 rounded-xl border border-stone-200 hover:border-green-300 hover:shadow-sm transition-all block"
            >
              <p className="text-2xl mb-2">📄</p>
              <p className="font-semibold text-stone-800 text-sm mb-1">Dog Grooming Contract Template</p>
              <p className="text-stone-500 text-xs">Pricing, cancellation policy, and payment terms</p>
            </Link>
            <Link
              href="/blog/dog-grooming-business-management/"
              className="p-5 rounded-xl border border-stone-200 hover:border-green-300 hover:shadow-sm transition-all block"
            >
              <p className="text-2xl mb-2">📊</p>
              <p className="font-semibold text-stone-800 text-sm mb-1">Dog Grooming Business Management</p>
              <p className="text-stone-500 text-xs">Scheduling, client retention, and payments</p>
            </Link>
            <Link
              href="/blog/reduce-no-shows-dog-grooming/"
              className="p-5 rounded-xl border border-stone-200 hover:border-green-300 hover:shadow-sm transition-all block"
            >
              <p className="text-2xl mb-2">🚫</p>
              <p className="font-semibold text-stone-800 text-sm mb-1">How to Reduce No-Shows</p>
              <p className="text-stone-500 text-xs">Deposit policies and automated reminders</p>
            </Link>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Collect Waivers Automatically at Booking
            </h2>
            <p className="text-green-100 text-lg leading-relaxed mb-8">
              GroomGrid handles client intake, health disclosures, and waiver collection as part of
              the booking flow — so you have signed documentation before every appointment, not after
              the problem.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-colors"
            >
              Start Free Trial →
            </Link>
            <p className="text-green-200 text-sm mt-4">No credit card required · Solo plan from $29/month</p>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-6 py-8 border-t border-stone-100 max-w-5xl mx-auto text-center text-stone-400 text-sm">
          <p>
            © 2026{' '}
            <Link href="/" className="hover:text-green-600 transition-colors">
              GroomGrid
            </Link>{' '}
            · AI-powered grooming business management ·{' '}
            <Link href="/blog/" className="hover:text-green-600 transition-colors">
              Blog
            </Link>
          </p>
        </footer>
      </div>
    </>
  );
}
