import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Dog Grooming Contract Template: What to Include and Why | GroomGrid',
  description:
    'Protect your grooming business with a solid client contract. Here\'s exactly what to include, plus a ready-to-use dog grooming contract template.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/dog-grooming-contract-template/',
  },
  openGraph: {
    title: 'Dog Grooming Contract Template: What to Include and Why',
    description:
      'Protect your grooming business with a solid client contract. Here\'s exactly what to include, plus a ready-to-use dog grooming contract template.',
    url: 'https://getgroomgrid.com/blog/dog-grooming-contract-template/',
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
      name: 'Dog Grooming Contract Template',
      item: 'https://getgroomgrid.com/blog/dog-grooming-contract-template/',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dog Grooming Contract Template: What to Include and Why',
  description:
    'Protect your grooming business with a solid client contract. Here\'s exactly what to include, plus a ready-to-use dog grooming contract template.',
  url: 'https://getgroomgrid.com/blog/dog-grooming-contract-template/',
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
    '@id': 'https://getgroomgrid.com/blog/dog-grooming-contract-template/',
  },
};

const contractSections = [
  {
    title: 'Groomer and Client Information',
    description:
      'Full legal name of the grooming business, contact info, and client name/address. This establishes who the agreement is between.',
    required: true,
  },
  {
    title: 'Pet Information',
    description:
      'Dog\'s name, breed, age, weight, and any known medical conditions or behavioral notes. Critical if something goes wrong during the groom.',
    required: true,
  },
  {
    title: 'Services and Pricing',
    description:
      'Itemized list of services to be performed, the agreed price for each, and your add-on fee structure.',
    required: true,
  },
  {
    title: 'Deposit and Payment Policy',
    description:
      'Deposit amount required at booking, accepted payment methods, when final payment is due, and consequences of nonpayment.',
    required: true,
  },
  {
    title: 'Cancellation and No-Show Policy',
    description:
      'How much notice is required to cancel without penalty, what happens to the deposit, and your fee for last-minute cancellations.',
    required: true,
  },
  {
    title: 'Liability Waiver',
    description:
      'Covers pre-existing conditions, matting, senior dog risk, and behavioral incidents. Protects you if a pre-existing health issue surfaces during grooming.',
    required: true,
  },
  {
    title: 'Photo and Social Media Release',
    description:
      'Permission to photograph the dog and use images on your website or social media. Most clients say yes — just ask upfront.',
    required: false,
  },
  {
    title: 'Emergency Veterinary Authorization',
    description:
      'Authorizes you to seek emergency vet care if the owner is unreachable. Include whether the client or groomer bears the cost.',
    required: false,
  },
];

export default function DogGroomingContractTemplatePage() {
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
                Contract Template
              </li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Templates &amp; Policies
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Dog Grooming Contract Template:<br className="hidden sm:block" /> What to Include and Why
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            A grooming contract isn&apos;t just legal protection — it&apos;s a communication tool.
            When clients sign before the first appointment, everyone&apos;s on the same page about
            pricing, cancellations, and what happens if things get complicated. Here&apos;s exactly
            what your contract needs.
          </p>
        </header>

        {/* ── Why You Need One ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Why Every Groomer Needs a Written Contract
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              &quot;But my clients are all nice people.&quot; Probably true — until a dog gets a
              superficial nick during a dematting session, an owner claims the cut wasn&apos;t what
              they asked for, or someone disputes your cancellation charge on their credit card.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Contracts protect relationships by preventing disputes. When the policies are written
              down and signed before any money changes hands, there&apos;s no ambiguity. Clients
              know what they agreed to. You have documentation if something goes sideways.
            </p>
            <p className="text-stone-600 leading-relaxed">
              A good grooming contract also builds trust. It signals that you run a professional
              operation — not a hobby. That&apos;s the kind of business clients refer to their
              friends.
            </p>
          </div>
        </section>

        {/* ── What to Include ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-3">
            What to Include in Your Grooming Contract
          </h2>
          <p className="text-stone-500 mb-8">
            Required sections are marked with a star. Optional sections are still worth including
            for most businesses.
          </p>
          <div className="space-y-4">
            {contractSections.map((section) => (
              <div
                key={section.title}
                className="p-6 border border-stone-200 rounded-xl bg-white"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-bold text-stone-800">{section.title}</h3>
                  <span
                    className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                      section.required
                        ? 'bg-green-100 text-green-700'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {section.required ? '★ Required' : 'Optional'}
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed">{section.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Sample Language ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Sample Contract Language You Can Adapt
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              This is a starting point — not a substitute for legal review. Adapt it to your
              state&apos;s laws and your specific business policies.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-800 mb-3">Cancellation Policy</h3>
                <div className="bg-white border border-stone-200 rounded-xl p-5 font-mono text-sm text-stone-600 leading-relaxed">
                  Cancellations must be made at least 24 hours before the scheduled appointment.
                  Cancellations made with less than 24 hours notice will result in forfeiture of
                  the deposit. No-shows will be charged 50% of the scheduled service total. We
                  reserve the right to require prepayment for future appointments after two
                  no-shows.
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-800 mb-3">Liability Waiver</h3>
                <div className="bg-white border border-stone-200 rounded-xl p-5 font-mono text-sm text-stone-600 leading-relaxed">
                  Client acknowledges that grooming can be stressful for some animals, particularly
                  senior dogs or those with pre-existing health conditions. [Business Name] will
                  take all reasonable precautions to ensure the safety and comfort of your pet. In
                  the event that a pre-existing condition is discovered or aggravated during
                  grooming, [Business Name] will not be held liable. Client assumes all
                  responsibility for full disclosure of their pet&apos;s medical history.
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-800 mb-3">Matting Disclaimer</h3>
                <div className="bg-white border border-stone-200 rounded-xl p-5 font-mono text-sm text-stone-600 leading-relaxed">
                  Severely matted coats may require shaving close to the skin, which can result in
                  the appearance of skin irritation, clipper marks, or a very short coat. This is
                  a common result of severe matting and is not the result of negligence. Client
                  agrees to hold [Business Name] harmless for any discomfort or changes in
                  appearance resulting from matted coat removal.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Digital vs Paper ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Digital Contracts vs. Paper: Which Is Better?
          </h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            Paper contracts work, but they create friction at intake and filing headaches later.
            Digital contracts — signed before the appointment via email or your booking platform —
            are better in almost every way:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { pro: '✓ Clients sign before arriving', note: 'No awkward paperwork at drop-off' },
              { pro: '✓ Automatically stored', note: 'No physical filing, easy to retrieve' },
              { pro: '✓ Timestamped signature', note: 'Stronger documentation if disputed' },
              { pro: '✓ Versioned', note: 'Update your policy and clients re-sign on next visit' },
            ].map(({ pro, note }) => (
              <div key={pro} className="p-4 border border-stone-200 rounded-xl bg-white">
                <p className="font-semibold text-stone-800">{pro}</p>
                <p className="text-sm text-stone-500 mt-1">{note}</p>
              </div>
            ))}
          </div>
          <p className="text-stone-600 leading-relaxed">
            A grooming management platform that handles contracts alongside scheduling and payments
            makes this frictionless. For a full breakdown of what to look for in a platform, read
            our guide on{' '}
            <Link
              href="/blog/dog-grooming-business-management"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              dog grooming business management
            </Link>
            .
          </p>
        </section>

        {/* ── Common Mistakes ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Common Contract Mistakes Groomers Make
            </h2>
            <div className="space-y-4">
              {[
                {
                  mistake: 'Vague cancellation language',
                  fix: 'Specify exact hours, exact penalties. "Last minute" means nothing legally.',
                },
                {
                  mistake: 'Not mentioning matting fees',
                  fix: 'Dematting takes extra time. Charge for it and say so upfront.',
                },
                {
                  mistake: 'Skipping the photo release',
                  fix: 'You want to post cute client photos. Get permission in writing first.',
                },
                {
                  mistake: 'Never updating the contract',
                  fix: 'Review your policies yearly. If you changed something, update the contract.',
                },
                {
                  mistake: 'Only getting verbal agreement',
                  fix: 'Verbal agreements are nearly impossible to prove. Always get it in writing.',
                },
              ].map(({ mistake, fix }) => (
                <div key={mistake} className="flex gap-4 p-4 bg-white rounded-xl border border-stone-200">
                  <div className="flex-shrink-0">
                    <span className="text-red-400 text-lg">✗</span>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">{mistake}</p>
                    <p className="text-sm text-stone-500 mt-1">{fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Conclusion ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Start With a Simple Contract, Then Refine
          </h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            You don&apos;t need a five-page legal document to protect your business. A one-page
            contract that covers the eight sections above — signed before the first appointment —
            is enough to handle 95% of situations.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            Start there. Add sections as you encounter situations your current contract doesn&apos;t
            cover. Within a year, you&apos;ll have a contract that reflects the real edge cases in
            your specific business.
          </p>
          <p className="text-stone-600 leading-relaxed">
            And pair it with a solid deposit policy. A contract without a deposit is easy to ignore
            — a contract plus a financial commitment means clients take their slot seriously. That
            combination is what fills your calendar with clients who actually show up.
          </p>
        </section>

        {/* ── Signup CTA ── */}
        <section className="px-6 py-16 bg-green-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Ready to streamline your grooming business?
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              GroomGrid handles scheduling, reminders, payments, and client records in one simple
              platform. Try it free for 14 days — no credit card required.
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
                Dog Grooming Business Management: The Complete Guide
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
