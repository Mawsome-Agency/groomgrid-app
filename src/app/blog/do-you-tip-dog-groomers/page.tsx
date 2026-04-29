import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Do You Tip Dog Groomers? How Much & When (Complete Guide) | GroomGrid',
  description:
    'Everything pet owners and new groomers need to know about tipping dog groomers — standard tip amounts, when to tip extra, holiday tipping, and what groomers really think about tips.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/do-you-tip-dog-groomers',
  },
  openGraph: {
    title: 'Do You Tip Dog Groomers? How Much & When (Complete Guide)',
    description:
      'Standard tip amounts, when to tip extra, holiday tipping, and what groomers really think about tips.',
    url: 'https://getgroomgrid.com/blog/do-you-tip-dog-groomers',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Do You Tip Dog Groomers? How Much & When (Complete Guide)',
  description: 'Everything you need to know about tipping dog groomers — standard amounts, when to tip extra, and what groomers think.',
  url: 'https://getgroomgrid.com/blog/do-you-tip-dog-groomers',
  datePublished: '2026-04-27',
  dateModified: '2026-04-27',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/do-you-tip-dog-groomers',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are you supposed to tip a dog groomer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, tipping your dog groomer is standard practice in the United States. Most groomers expect a tip of 15–20% of the service cost, similar to tipping at a hair salon. Tipping is especially expected if your dog requires extra time due to matting, behavior issues, or special handling.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much should I tip my dog groomer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The standard tip for a dog groomer is 15–20% of the service total. For a $60 groom, that means $9–$12. Many clients round to the nearest $5 or $10 bill. If your dog was difficult, severely matted, or the groomer did an exceptional job, tip 20–25% or more.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you tip a mobile dog groomer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — and many people tip mobile groomers slightly more than salon groomers because of the added convenience. The standard is still 15–20%, but since mobile grooms cost more ($80–$120+), the absolute tip amount is higher ($12–$24).',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you tip the owner of a grooming business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There\'s no hard rule. Some people feel the owner sets their own prices and doesn\'t need a tip. Others tip regardless. If the owner personally grooms your dog and does a great job, a tip is always appreciated — it\'s recognition of their work, not just a wage supplement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I tip during the holidays?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Holiday tipping is a nice gesture that builds your relationship with your groomer. A common approach is to tip the cost of one full grooming session (essentially a 100% tip) during the December holidays. For a regular $60 groom, a $50–$60 holiday bonus is generous and very much appreciated.',
      },
    },
  ],
};

export default function DoYouTipDogGroomers() {
  return (
    <div className="min-h-screen bg-white text-stone-900">      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="bg-green-50 border-b border-green-100">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link href="/blog" className="inline-block text-green-600 hover:text-green-700 font-semibold text-sm mb-4">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Do You Tip Dog Groomers? The Complete Guide to Tipping
          </h1>
          <p className="text-lg text-stone-600 mb-4">
            Standard tip amounts, when to tip extra, holiday tipping etiquette, and what
            professional groomers actually think about tips.
          </p>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <span>By GroomGrid Team</span>
            <span>·</span>
            <time dateTime="2026-04-27">April 27, 2026</time>
            <span>·</span>
            <span>8 min read</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Quick Answer */}
        <section className="mb-12">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-8">
            <h2 className="text-xl font-bold text-green-800 mb-2">Quick Answer</h2>
            <p className="text-green-700">
              <strong>Yes, you should tip your dog groomer.</strong> The standard tip is <strong>15–20%</strong> of
              the service cost — the same as you&apos;d tip at a hair salon. For a typical $60 groom,
              that&apos;s <strong>$9–$12</strong>.
            </p>
          </div>
        </section>

        {/* Standard Tipping */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Standard Tipping Guide</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-50">
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Service Cost</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Standard Tip (15–20%)</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Generous Tip (25%+)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-100"><td className="p-3 font-medium">$30 (small dog bath)</td><td className="p-3 text-green-700">$5–$6</td><td className="p-3 text-green-700">$8+</td></tr>
                <tr className="border-b border-stone-100 bg-stone-50"><td className="p-3 font-medium">$50 (small dog full groom)</td><td className="p-3 text-green-700">$8–$10</td><td className="p-3 text-green-700">$13+</td></tr>
                <tr className="border-b border-stone-100"><td className="p-3 font-medium">$60 (medium dog full groom)</td><td className="p-3 text-green-700">$9–$12</td><td className="p-3 text-green-700">$15+</td></tr>
                <tr className="border-b border-stone-100 bg-stone-50"><td className="p-3 font-medium">$80 (large dog full groom)</td><td className="p-3 text-green-700">$12–$16</td><td className="p-3 text-green-700">$20+</td></tr>
                <tr className="border-b border-stone-100"><td className="p-3 font-medium">$100+ (mobile groom)</td><td className="p-3 text-green-700">$15–$20</td><td className="p-3 text-green-700">$25+</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* When to Tip More */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">When to Tip Extra (20–30%+)</h2>
          <p className="text-stone-600 mb-4">
            Go beyond the standard tip when your groomer handles any of these challenges:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              { scenario: 'Your dog was severely matted', why: 'Dematting is physically exhausting and time-consuming work that most groomers hate doing.' },
              { scenario: 'Your dog is anxious, aggressive, or a biter', why: 'Difficult dogs require extra time, patience, and sometimes a second person for safety.' },
              { scenario: 'Your groomer squeezed you in last-minute', why: 'They gave up a break or stayed late to fit you in. That flexibility is worth recognizing.' },
              { scenario: 'Your dog got into something gross (skunk, mud, poop)', why: 'Nobody wants to deal with that. An extra tip says thank you for the dirty work.' },
              { scenario: 'Exceptional breed-standard work', why: 'If your poodle looks like a show dog, your groomer went above and beyond.' },
              { scenario: 'First-time groom for a puppy', why: 'Puppy grooms take extra patience and gentle handling to create positive associations.' },
            ].map((item) => (
              <li key={item.scenario} className="flex gap-3">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <div>
                  <strong className="text-stone-900">{item.scenario}</strong>
                  <p className="text-stone-600 text-sm">{item.why}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Holiday Tipping */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Holiday Tipping Guide</h2>
          <p className="text-stone-600 mb-4">
            If you see your groomer regularly (monthly or more), a holiday tip is a thoughtful gesture.
            Here&apos;s what most groomers consider generous:
          </p>
          <div className="bg-amber-50 p-5 rounded-lg border border-amber-200 mb-6">
            <h3 className="font-bold text-amber-800 mb-2">🎄 Holiday Tip Guidelines</h3>
            <ul className="text-amber-700 text-sm space-y-2">
              <li><strong>Regular groomer (1x/month):</strong> Tip the cost of one grooming session ($40–$80)</li>
              <li><strong>Occasional groomer (every few months):</strong> 30–50% extra on your December visit</li>
              <li><strong>Mobile groomer who comes to you:</strong> $50–$100 — they save you significant time and stress</li>
              <li><strong>Grooming salon with multiple staff:</strong> A box of treats or gift card for the team ($10–$20/person)</li>
            </ul>
          </div>
        </section>

        {/* What Groomers Think */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">What Groomers Really Think About Tips</h2>
          <p className="text-stone-600 mb-4">
            We asked working groomers what they wish clients knew about tipping. The answers were
            consistent:
          </p>
          <div className="space-y-4 mb-6">
            <blockquote className="border-l-4 border-green-300 pl-4 italic text-stone-600">
              &ldquo;Tips aren&apos;t extra — they&apos;re how I make a living wage. My base pay barely covers
              rent. The tips are what make this career sustainable.&rdquo;
              <cite className="block text-sm text-stone-400 not-italic mt-1">— Mobile groomer, 4 years</cite>
            </blockquote>
            <blockquote className="border-l-4 border-green-300 pl-4 italic text-stone-600">
              &ldquo;I remember who tips well. Not in a &apos;I&apos;ll do a bad job if you don&apos;t tip&apos; way
              — but I&apos;ll squeeze in your emergency appointment, I&apos;ll stay late, I&apos;ll text you photos.
              The relationship matters.&rdquo;
              <cite className="block text-sm text-stone-400 not-italic mt-1">— Salon groomer, 8 years</cite>
            </blockquote>
            <blockquote className="border-l-4 border-green-300 pl-4 italic text-stone-600">
              &ldquo;Even $5 means a lot. It&apos;s not about the amount — it&apos;s knowing that you noticed the
              effort I put in. A thank-you and a small tip keeps me going on the hard days.&rdquo;
              <cite className="block text-sm text-stone-400 not-italic mt-1">— Home-based groomer, 2 years</cite>
            </blockquote>
          </div>
        </section>

        {/* For Groomers Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">For Groomers: How to Encourage Tipping</h2>
          <p className="text-stone-600 mb-4">
            If you&apos;re a groomer wondering how to improve your tip rate without being pushy:
          </p>
          <ul className="list-disc list-inside space-y-2 text-stone-600 mb-6">
            <li><strong>Send before-and-after photos.</strong> Clients who see the transformation tip 20–30% more.</li>
            <li><strong>Offer mobile payment.</strong> Digital tips are easier than fumbling for cash. Tools like{' '} <Link href="/" className="text-green-600 hover:underline">GroomGrid</Link> make tipping seamless during checkout.</li>
            <li><strong>Communicate what you did.</strong> &ldquo;Bella had some matting behind her ears that I worked out — she was a champ!&rdquo; sets the context for extra effort.</li>
            <li><strong>Be clear about pricing upfront.</strong> Clients tip more when they&apos;re not surprised by the bill.</li>
            <li><strong>Build a regular relationship.</strong> Repeat clients tip better than one-time walk-ins.</li>
          </ul>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="border-l-4 border-green-300 pl-4">
                <h3 className="font-semibold text-stone-900 mb-2">{faq.name}</h3>
                <p className="text-stone-600 text-sm">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-green-50 rounded-xl p-8 border border-green-200 text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-3">Make Tipping Easy for Your Clients</h2>
          <p className="text-stone-600 mb-6 max-w-lg mx-auto">
            GroomGrid&apos;s integrated payment system lets clients pay and tip in one tap — no cash, no
            awkwardness, no missed tips.
          </p>
          <Link href="/signup" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            Start Free Trial →
          </Link>
        </section>

        {/* Related */}
        <section className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="text-lg font-bold text-stone-900 mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/blog/dog-grooming-pricing-guide" className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors">
              <h3 className="font-semibold text-stone-900 text-sm mb-1">Dog Grooming Pricing Guide</h3>
              <p className="text-stone-500 text-xs">How much to charge in 2026</p>
            </Link>
            <Link href="/blog/reduce-no-shows-dog-grooming" className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors">
              <h3 className="font-semibold text-stone-900 text-sm mb-1">How to Reduce No-Shows</h3>
              <p className="text-stone-500 text-xs">Cut no-shows by 60%</p>
            </Link>
            <Link href="/blog/how-to-increase-sales-dog-grooming-business" className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors">
              <h3 className="font-semibold text-stone-900 text-sm mb-1">How to Increase Sales</h3>
              <p className="text-stone-500 text-xs">8 proven strategies</p>
            </Link>
            <Link href="/blog/best-pet-grooming-software" className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors">
              <h3 className="font-semibold text-stone-900 text-sm mb-1">Best Pet Grooming Software</h3>
              <p className="text-stone-500 text-xs">Top picks for 2026</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
