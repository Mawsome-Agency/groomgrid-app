import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'How to Become a Dog Groomer: Certification, Training & Career Guide | GroomGrid',
  description:
    'Step-by-step guide to becoming a professional dog groomer — certification programs, training costs, apprenticeships, salary expectations, and how to start your own grooming business.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/how-to-become-a-dog-groomer',
  },
  openGraph: {
    title: 'How to Become a Dog Groomer: Certification, Training & Career Guide',
    description:
      'Step-by-step guide to becoming a professional dog groomer — certification, training costs, salary, and how to start your own business.',
    url: 'https://getgroomgrid.com/blog/how-to-become-a-dog-groomer',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Become a Dog Groomer: Certification, Training & Career Guide',
  description: 'Step-by-step guide to becoming a professional dog groomer — certification programs, training costs, apprenticeships, salary expectations.',
  url: 'https://getgroomgrid.com/blog/how-to-become-a-dog-groomer',
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
    '@id': 'https://getgroomgrid.com/blog/how-to-become-a-dog-groomer',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you need a license to be a dog groomer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most states do not require a specific dog grooming license. However, some states and cities have regulations around animal handling, business licensing, and mobile grooming operations. Certification through organizations like the National Dog Groomers Association of America (NDGAA) or IPG is voluntary but strongly recommended — it builds client trust and can command higher rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to become a dog groomer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Becoming a competent dog groomer typically takes 3–6 months through a grooming school program, or 6–12 months through an apprenticeship at a salon. Most groomers consider themselves fully proficient after 1–2 years of hands-on experience. The learning curve depends on the variety of breeds and styles you work with.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does dog grooming school cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dog grooming school costs range from $3,000 to $10,000 depending on the program length, location, and whether it includes a certification exam. Online-only courses run $500–$2,000 but lack hands-on practice. Community college programs are typically $2,000–$5,000 for a semester.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you become a dog groomer without going to school?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Many successful groomers learned entirely through apprenticeships — working under an experienced groomer for 6–12 months while building hands-on skills. This path costs nothing (you may even earn a training wage) and gives you real-world experience that some schools can\'t match. The trade-off is that it takes longer and you learn at one salon\'s pace.',
      },
    },
  ],
};

const certificationPrograms = [
  { org: 'National Dog Groomers Association of America (NDGAA)', cost: '$300–$500 for exam', duration: 'Self-paced + exam', notes: 'Most recognized US certification. Requires practical exam.' },
  { org: 'International Professional Groomers (IPG)', cost: '$200–$400 for exam', duration: 'Self-paced + exam', notes: 'Multiple certification levels (Salon Detail, Advanced, Master).' },
  { org: 'National Association of Pet Sitters & Dog Walkers (NARPS)', cost: '$150–$300', duration: 'Online course', notes: 'UK-focused but recognized internationally.' },
  { org: 'PetGroomer.com Grooming School Directory', cost: '$3,000–$10,000', duration: '4–16 weeks', notes: 'Directory of accredited in-person schools nationwide.' },
];

const salaryData = [
  { level: 'Entry-level (0–1 year)', hourly: '$12–$17', annual: '$25,000–$35,000', notes: 'Working under a senior groomer' },
  { level: 'Experienced (1–3 years)', hourly: '$18–$28', annual: '$35,000–$55,000', notes: 'Handling most breeds independently' },
  { level: 'Senior / Specialist (3–5 years)', hourly: '$25–$40', annual: '$50,000–$75,000', notes: 'Hand-stripping, breed specialties, cat grooming' },
  { level: 'Business Owner', hourly: '$40–$80+', annual: '$60,000–$120,000+', notes: 'Revenue depends on clients and pricing' },
  { level: 'Mobile Groomer (solo)', hourly: '$50–$100+', annual: '$70,000–$150,000+', notes: 'Higher per-dog revenue but fewer dogs/day' },
];

export default function HowToBecomeADogGroomer() {
  return (
    <div className="min-h-screen bg-white text-stone-900">      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="bg-green-50 border-b border-green-100">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link href="/blog" className="inline-block text-green-600 hover:text-green-700 font-semibold text-sm mb-4">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            How to Become a Dog Groomer in 2026: Training, Certification & Career Guide
          </h1>
          <p className="text-lg text-stone-600 mb-4">
            Everything you need to know about starting a career in dog grooming — from training programs
            and certification options to salary expectations and launching your own business.
          </p>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <span>By GroomGrid Team</span>
            <span>·</span>
            <time dateTime="2026-04-27">April 27, 2026</time>
            <span>·</span>
            <span>14 min read</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Quick Nav */}
        <nav className="bg-stone-50 rounded-lg p-6 mb-10 border border-stone-200">
          <h2 className="text-lg font-bold text-stone-900 mb-3">In This Guide</h2>
          <ol className="space-y-2 text-sm text-green-700">
            <li><a href="#why" className="hover:underline">Why Become a Dog Groomer?</a></li>
            <li><a href="#requirements" className="hover:underline">Requirements & Prerequisites</a></li>
            <li><a href="#paths" className="hover:underline">Three Paths to Becoming a Groomer</a></li>
            <li><a href="#certification" className="hover:underline">Certification Programs & Costs</a></li>
            <li><a href="#salary" className="hover:underline">Dog Groomer Salary by Experience</a></li>
            <li><a href="#skills" className="hover:underline">Essential Skills to Develop</a></li>
            <li><a href="#business" className="hover:underline">Starting Your Own Grooming Business</a></li>
            <li><a href="#faq" className="hover:underline">Frequently Asked Questions</a></li>
          </ol>
        </nav>

        {/* Why */}
        <section id="why" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Why Become a Dog Groomer?</h2>
          <p className="text-stone-600 mb-4">
            Dog grooming sits at an unusual intersection: it&apos;s hands-on, creative, animal-focused work
            that can also be genuinely lucrative. The pet industry continues to grow year over year, and
            professional groomers are in high demand — particularly mobile groomers who bring convenience
            directly to pet owners.
          </p>
          <p className="text-stone-600 mb-4">
            According to the Bureau of Labor Statistics, pet care occupations are projected to grow
            <strong> 22% through 2030</strong> — much faster than average. Experienced groomers who
            run their own businesses routinely earn $60,000–$120,000+ per year, and mobile groomers
            in high-demand markets can clear $150,000.
          </p>
        </section>

        {/* Requirements */}
        <section id="requirements" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Requirements & Prerequisites</h2>
          <p className="text-stone-600 mb-4">
            The good news: you don&apos;t need a college degree to become a dog groomer. Here&apos;s what
            you actually need:
          </p>
          <ul className="list-disc list-inside space-y-2 text-stone-600 mb-4">
            <li><strong>High school diploma or GED</strong> (required by most schools and employers)</li>
            <li><strong>Physical fitness</strong> — grooming is standing, bending, lifting dogs (up to 80+ lbs) for 8+ hours</li>
            <li><strong>Patience with animals</strong> — you&apos;ll work with anxious, aggressive, and elderly dogs daily</li>
            <li><strong>Attention to detail</strong> — breed-standard cuts require precision and consistency</li>
            <li><strong>Business licensing</strong> (if opening your own shop) — varies by state and municipality</li>
          </ul>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> Most states do not require a grooming-specific license, but some cities
              regulate mobile grooming businesses. Check your local regulations before launching.
            </p>
          </div>
        </section>

        {/* Paths */}
        <section id="paths" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Three Paths to Becoming a Dog Groomer</h2>
          <div className="space-y-6 mb-6">
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg mb-2">1. Grooming School ($3,000–$10,000, 4–16 weeks)</h3>
              <p className="text-stone-600 text-sm mb-3">
                The most structured path. Accredited grooming schools teach breed standards, tool handling,
                safety protocols, and business basics in an intensive format. Programs range from 300–600 hours
                and often include externships at working salons.
              </p>
              <p className="text-stone-600 text-sm">
                <strong>Best for:</strong> Career changers who want structured learning and can afford tuition.
                Accelerates your timeline to competence.
              </p>
            </div>
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg mb-2">2. Apprenticeship / On-the-Job Training (Free–$2,000, 6–12 months)</h3>
              <p className="text-stone-600 text-sm mb-3">
                Start as a bather or grooming assistant at a salon and learn from experienced groomers.
                Many of the best groomers learned this way — you get real-world experience with real dogs
                and real clients from day one.
              </p>
              <p className="text-stone-600 text-sm">
                <strong>Best for:</strong> People who learn by doing, can find a mentor, and prefer earning
                while they learn.
              </p>
            </div>
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg mb-2">3. Online Courses + Self-Study ($500–$2,000, 2–6 months)</h3>
              <p className="text-stone-600 text-sm mb-3">
                Online programs teach theory, breed standards, and tool basics through video. The limitation
                is hands-on practice — you&apos;ll need to supplement with volunteer grooming at shelters or
                shadow a local groomer to build actual skills.
              </p>
              <p className="text-stone-600 text-sm">
                <strong>Best for:</strong> Rural areas without local schools, self-motivated learners, or those
                supplementing an apprenticeship.
              </p>
            </div>
          </div>
        </section>

        {/* Certification */}
        <section id="certification" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Certification Programs & Costs</h2>
          <p className="text-stone-600 mb-6">
            While not legally required, certification sets you apart — especially when charging premium
            rates or applying to high-end salons. Here are the main options:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-50">
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Program</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Cost</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Duration</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Notes</th>
                </tr>
              </thead>
              <tbody>
                {certificationPrograms.map((row) => (
                  <tr key={row.org} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="p-3 font-medium text-stone-900">{row.org}</td>
                    <td className="p-3 text-green-700 font-semibold">{row.cost}</td>
                    <td className="p-3 text-stone-600">{row.duration}</td>
                    <td className="p-3 text-stone-600 text-xs">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Salary */}
        <section id="salary" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Dog Groomer Salary by Experience Level</h2>
          <p className="text-stone-600 mb-6">
            Grooming income varies dramatically based on experience, location, and whether you work
            for someone else or run your own business. Here&apos;s realistic earning potential:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-50">
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Level</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Hourly</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Annual</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Notes</th>
                </tr>
              </thead>
              <tbody>
                {salaryData.map((row) => (
                  <tr key={row.level} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="p-3 font-medium text-stone-900">{row.level}</td>
                    <td className="p-3 text-green-700 font-semibold">{row.hourly}</td>
                    <td className="p-3 text-green-700 font-semibold">{row.annual}</td>
                    <td className="p-3 text-stone-600 text-xs">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Essential Skills to Develop</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { skill: 'Breed-standard cuts', desc: 'AKC breed standards for 50+ popular breeds' },
              { skill: 'Scissor work', desc: 'Straight shears, thinning shears, curved shears' },
              { skill: 'Clipper techniques', desc: 'Snap-on combs, blade lengths, hand-stripping' },
              { skill: 'Safe animal handling', desc: 'Restraint techniques, stress signals, bite prevention' },
              { skill: 'Coat assessment', desc: 'Identifying matting, parasites, skin conditions' },
              { skill: 'Client communication', desc: 'Setting expectations, handling complaints, upselling' },
              { skill: 'Time management', desc: 'Scheduling efficiency, buffer time, no-show recovery' },
              { skill: 'Business basics', desc: 'Pricing, expenses, marketing, software tools' },
            ].map((item) => (
              <div key={item.skill} className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                <h3 className="font-semibold text-stone-900 text-sm mb-1">{item.skill}</h3>
                <p className="text-stone-600 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Business */}
        <section id="business" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Starting Your Own Grooming Business</h2>
          <p className="text-stone-600 mb-4">
            Most experienced groomers eventually go out on their own. The three main models:
          </p>
          <div className="space-y-4 mb-6">
            <div className="bg-green-50 p-5 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-800 mb-2">🚐 Mobile Grooming (Highest Earning Potential)</h3>
              <p className="text-green-700 text-sm mb-2">
                A converted van or trailer lets you go to clients. Higher revenue per dog ($60–$120) but
                fewer dogs per day (4–8). Startup costs $20,000–$80,000 for the vehicle and equipment.
              </p>
              <p className="text-green-700 text-sm">
                <strong>Manage it with:</strong>{' '}
                <Link href="/" className="underline font-semibold">GroomGrid</Link> — scheduling, reminders,
                payments, and client management built for mobile groomers.
              </p>
            </div>
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-200">
              <h3 className="font-bold text-stone-900 mb-2">🏠 Home-Based Salon (Lowest Startup Cost)</h3>
              <p className="text-stone-600 text-sm">
                Convert a garage, basement, or spare room. Startup costs $2,000–$10,000 for equipment.
                Check local zoning laws and get proper insurance.
              </p>
            </div>
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-200">
              <h3 className="font-bold text-stone-900 mb-2">🏪 Retail Salon (Highest Volume)</h3>
              <p className="text-stone-600 text-sm">
                Lease a commercial space and hire staff. Highest overhead but also highest potential
                volume (10–20+ dogs/day across multiple groomers). Startup costs $15,000–$50,000.
              </p>
            </div>
          </div>
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
          <h2 className="text-2xl font-bold text-stone-900 mb-3">Ready to Launch Your Grooming Business?</h2>
          <p className="text-stone-600 mb-6 max-w-lg mx-auto">
            GroomGrid handles the business side — scheduling, reminders, payments, client records —
            so you can focus on the grooming.
          </p>
          <Link href="/signup" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            Start Free Trial →
          </Link>
        </section>

        {/* Related */}
        <section className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="text-lg font-bold text-stone-900 mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/blog/how-to-start-dog-grooming-business-at-home" className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors">
              <h3 className="font-semibold text-stone-900 text-sm mb-1">How to Start a Dog Grooming Business at Home</h3>
              <p className="text-stone-500 text-xs">Step-by-step home salon setup</p>
            </Link>
            <Link href="/blog/is-dog-grooming-a-profitable-business" className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors">
              <h3 className="font-semibold text-stone-900 text-sm mb-1">Is Dog Grooming a Profitable Business?</h3>
              <p className="text-stone-500 text-xs">Real numbers, real talk</p>
            </Link>
            <Link href="/blog/dog-grooming-tools-equipment-list" className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors">
              <h3 className="font-semibold text-stone-900 text-sm mb-1">Dog Grooming Tools & Equipment Checklist</h3>
              <p className="text-stone-500 text-xs">Everything you need to buy</p>
            </Link>
            <Link href="/blog/dog-grooming-pricing-guide" className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors">
              <h3 className="font-semibold text-stone-900 text-sm mb-1">Dog Grooming Pricing Guide</h3>
              <p className="text-stone-500 text-xs">How much to charge in 2026</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
