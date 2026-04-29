import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'GroomGrid vs MoeGo: Which Dog Grooming Software is Right for You? | GroomGrid',
  description:
    'Comparing GroomGrid vs MoeGo for dog grooming businesses? See how pricing, features, and ease of use stack up — and why independent groomers are switching.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/groomgrid-vs-moego',
  },
  openGraph: {
    title: 'GroomGrid vs MoeGo: Which Dog Grooming Software is Right for You?',
    description:
      'Comparing GroomGrid vs MoeGo for dog grooming businesses? See how pricing, features, and ease of use stack up — and why independent groomers are switching.',
    url: 'https://getgroomgrid.com/blog/groomgrid-vs-moego',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'GroomGrid vs MoeGo: Which Dog Grooming Software is Right for You?',
  description:
    'Comparing GroomGrid vs MoeGo for dog grooming businesses? See how pricing, features, and ease of use stack up — and why independent groomers are switching.',
  url: 'https://getgroomgrid.com/blog/groomgrid-vs-moego',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/groomgrid-vs-moego',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is GroomGrid cheaper than MoeGo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid starts at $29/month for the Solo tier. MoeGo starts around $49/month. For independent and mobile groomers, GroomGrid is meaningfully cheaper while offering AI-powered scheduling that MoeGo lacks.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does GroomGrid have all the features MoeGo has?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid covers the core features solo and small salon groomers need — scheduling, automated reminders, client/pet profiles, integrated payments, and online booking. MoeGo has more enterprise features like multi-location management, but these add complexity and cost most independent groomers do not need.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I import my MoeGo data into GroomGrid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can export your client list and pet records from MoeGo as a CSV and import them into GroomGrid. The process typically takes under an hour. GroomGrid support can assist with migration.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is MoeGo or GroomGrid better for mobile groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GroomGrid is designed mobile-first from the ground up — it works on any device in the field, requires no desktop app, and includes route-friendly scheduling. MoeGo is mobile-accessible but was originally built for brick-and-mortar salons.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does GroomGrid have AI features that MoeGo lacks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. GroomGrid includes AI-powered scheduling suggestions, AI breed detection from photos, and automated 3-touch reminder sequences. These are not available in MoeGo.',
      },
    },
  ],
};

export default function GroomGridVsMoeGoPage() {
  return (
    <>      <Script
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
            href="/signup?coupon=BETA50"
            className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
          >
            Start Free Trial
          </Link>
        </nav>

        {/* ── Breadcrumb ── */}
        <div className="px-6 py-3 max-w-5xl mx-auto">
          <PageBreadcrumbs slug="blog/groomgrid-vs-moego" />
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Software Comparison
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            GroomGrid vs MoeGo:<br className="hidden sm:block" /> An Honest Comparison for Independent Groomers
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            MoeGo has been the default choice for many grooming businesses for years. But &ldquo;default&rdquo;
            doesn&apos;t mean best. Here&apos;s a direct comparison so you can decide which platform
            actually fits the way you run your business.
          </p>
        </header>

        {/* ── Why This Comparison Matters ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Why the Right Software Actually Matters</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Your grooming software is the operating system of your business. It handles scheduling,
              client communication, payments, and reminders. If it&apos;s clunky, expensive, or missing
              key features, you feel that friction every single working day.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Both GroomGrid and MoeGo are purpose-built for pet grooming businesses. But they take
              very different approaches to pricing, simplicity, and which type of groomer they serve
              best. This comparison focuses on what matters to independent groomers and small salon owners.
            </p>
          </div>
        </section>

        {/* ── Feature Comparison ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Feature-by-Feature Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-stone-100">
                  <th className="text-left p-4 font-semibold text-stone-700 border border-stone-200">Feature</th>
                  <th className="text-left p-4 font-semibold text-green-700 border border-stone-200">GroomGrid</th>
                  <th className="text-left p-4 font-semibold text-stone-700 border border-stone-200">MoeGo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Online booking', 'Included', 'Included'],
                  ['Automated reminders (SMS + email)', 'Included', 'Included'],
                  ['Client & pet profiles', 'Included', 'Included'],
                  ['Deposit collection', 'Included', 'Add-on'],
                  ['Pricing', 'Simple flat rate', 'Tiered plans, add-ons'],
                  ['Setup time', 'Under 30 minutes', 'Longer onboarding'],
                  ['Mobile grooming route tools', 'Included', 'Limited'],
                  ['No-show protection', 'Built-in', 'Manual setup required'],
                  ['Free trial', 'Yes — 50% off first month', 'Limited free tier'],
                ].map(([feature, gg, mg]) => (
                  <tr key={feature} className="even:bg-stone-50">
                    <td className="p-4 border border-stone-200 font-medium text-stone-700">{feature}</td>
                    <td className="p-4 border border-stone-200 text-green-700 font-medium">{gg}</td>
                    <td className="p-4 border border-stone-200 text-stone-600">{mg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Pricing Deep Dive ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Pricing: What You Actually Pay</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              MoeGo uses a tiered pricing model where core features are gated behind higher plans. As
              your business grows — more staff, more clients, more locations — the monthly cost climbs
              significantly. Add-ons like payment processing integrations and advanced reporting can push
              monthly spend well above $100 for a solo groomer or small team.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              GroomGrid takes a simpler approach: one flat rate that includes everything. No add-on
              fees for reminders, deposits, or client management. The goal is predictable, affordable
              software that doesn&apos;t penalize you for growing.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="font-semibold text-stone-800 mb-2">The real cost question:</p>
              <p className="text-stone-600">
                It&apos;s not just what you pay per month — it&apos;s what you save by preventing
                no-shows and keeping clients rebooking automatically. A single prevented no-show per
                week pays for most software subscriptions. The best tool is the one that actually gets
                used and prevents revenue leaks.
              </p>
            </div>
          </div>
        </section>

        {/* ── Ease of Use ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Ease of Use: Who Gets Started Fastest</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            MoeGo is a mature, feature-rich platform — and that comes with complexity. First-time
            users often describe a steep learning curve, particularly around setting up service menus,
            pricing rules, and notification workflows. For tech-savvy groomers who want granular
            control, that depth is a feature. For busy solo groomers who just want to stop losing
            appointments to text-tag chaos, it can feel like overkill.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            GroomGrid is designed for groomers who want to be operational in under 30 minutes. The
            onboarding flow walks you through adding services, setting your hours, and sending your
            first booking link — without needing to read a help center article.
          </p>
          <ul className="space-y-3">
            {[
              'Add your services and pricing in minutes',
              'Clients can book from a link you share — no app download required',
              'Reminders go out automatically once you flip the switch',
              'Deposit policies are set once and applied consistently',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Who Each is For ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Who Each Platform is Built For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-green-200">
                <p className="text-green-600 font-bold text-lg mb-3">GroomGrid is best for:</p>
                <ul className="space-y-2 text-stone-600 text-sm">
                  {[
                    'Solo groomers and small teams (1-5 groomers)',
                    'Mobile groomers who need route-friendly booking',
                    'Groomers switching from paper or generic tools',
                    'Businesses that want fast setup and simple pricing',
                    'Owners who want reminders and deposits without configuration headaches',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-white rounded-xl border border-stone-200">
                <p className="text-stone-700 font-bold text-lg mb-3">MoeGo may suit you if:</p>
                <ul className="space-y-2 text-stone-600 text-sm">
                  {[
                    'You run a large salon with 10+ groomers',
                    'You need complex multi-location management',
                    'You want deep customization of every workflow',
                    'You have a dedicated office manager for setup',
                    'Budget is less of a concern than feature depth',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-stone-400 font-bold">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom Line ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">The Bottom Line</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            MoeGo built a solid product, and for large grooming enterprises it might be the right fit.
            But most grooming businesses are not enterprises — they&apos;re one to five talented
            groomers trying to fill their books, reduce no-shows, and stop losing evenings to admin work.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            GroomGrid was designed specifically for that reality. Simpler, faster to set up, with the
            features that actually move the needle for independent groomers: automated reminders, easy
            deposit collection, and a booking experience that clients actually use.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Want to understand the full landscape of grooming software options? Read our guide to{' '}
            <Link
              href="/blog/dog-grooming-software"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              dog grooming software in 2026
            </Link>{' '}
            or see how to{' '}
            <Link
              href="/blog/reduce-no-shows-dog-grooming"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              reduce no-shows in your grooming business
            </Link>
            .
          </p>
        </section>

        {/* ── Related Links ── */}
        <PageRelatedLinks slug="blog/groomgrid-vs-moego" variant="blog" heading="Try GroomGrid free — 50% off your first month" />

        {/* ── Footer ── */}
        <SiteFooter slug="blog/groomgrid-vs-moego" />
      </div>
    </>
  );
}
