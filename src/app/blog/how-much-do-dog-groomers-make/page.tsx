import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'How Much Do Dog Groomers Make? Salary & Income Guide (2026) | GroomGrid',
  description:
    'Dog groomer salary breakdown for 2026 — hourly rates, annual income, mobile vs salon pay, commission structures, and how to maximize your grooming income.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/how-much-do-dog-groomers-make',
  },
  openGraph: {
    title: 'How Much Do Dog Groomers Make? Salary & Income Guide (2026)',
    description:
      'Dog groomer salary breakdown — hourly rates, annual income, mobile vs salon, commission structures, and how to maximize your grooming income.',
    url: 'https://getgroomgrid.com/blog/how-much-do-dog-groomers-make',
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://getgroomgrid.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://getgroomgrid.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'How Much Do Dog Groomers Make?', item: 'https://getgroomgrid.com/blog/how-much-do-dog-groomers-make' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How Much Do Dog Groomers Make? Salary & Income Guide (2026)',
  description: 'Dog groomer salary breakdown for 2026 — hourly rates, annual income, mobile vs salon pay, commission structures, and how to maximize your grooming income.',
  url: 'https://getgroomgrid.com/blog/how-much-do-dog-groomers-make',
  datePublished: '2026-04-27',
  dateModified: '2026-04-27',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://getgroomgrid.com/blog/how-much-do-dog-groomers-make' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much do dog groomers make per hour?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dog groomers in the US earn $12–$25 per hour on average, with experienced groomers earning $20–$35 per hour. Mobile groomers and salon owners can earn significantly more — $30–$60+ per hour when factoring in business profit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can dog groomers make $100,000 a year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, but it requires business ownership. Successful mobile groomers in high-demand areas or salon owners with multiple groomers can reach $100,000+ in annual revenue. Solo groomers typically max out around $50,000–$75,000 working for someone else.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do mobile dog groomers make more than salon groomers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mobile groomers generally earn more per groom ($70–$120 vs $40–$70 at a salon) but see fewer dogs per day (4–6 vs 8–12). On average, mobile groomers earn $50,000–$90,000/year while salon groomers earn $30,000–$55,000/year.',
      },
    },
    {
      '@type': 'Question',
      name: 'What state pays dog groomers the most?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The highest-paying states for dog groomers are California, Washington, Massachusetts, New York, and New Jersey. Groomers in these states can earn $35,000–$65,000+ per year, with mobile groomers earning significantly more.',
      },
    },
  ],
};

const salaryData = [
  { role: 'Entry-Level Salon Groomer', hourly: '$12–$16', annual: '$25,000–$33,000', notes: 'Less than 1 year experience, working under a senior groomer.' },
  { role: 'Experienced Salon Groomer', hourly: '$18–$25', annual: '$37,000–$52,000', notes: '2–5 years experience, handles all breeds independently.' },
  { role: 'Senior / Specialty Groomer', hourly: '$25–$35', annual: '$52,000–$73,000', notes: '5+ years, breed specialties, hand-scissoring skills.' },
  { role: 'Mobile Groomer (Solo)', hourly: '$30–$60', annual: '$50,000–$90,000', notes: 'Self-employed, 4–6 dogs/day at premium rates.' },
  { role: 'Salon Owner / Manager', hourly: '$40–$80+', annual: '$60,000–$120,000+', notes: 'Revenue from multiple groomers, upselling retail.' },
];

export default function HowMuchDoDogGroomersMake() {
  return (
    <>
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-stone-50">
        <header className="bg-gradient-to-br from-green-600 to-green-700 text-white">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <nav className="text-sm text-green-200 mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-white transition-colors">Home</Link><span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link><span>/</span>
              <span className="text-white">Dog Groomer Salary</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              How Much Do Dog Groomers Make in 2026? Salary &amp; Income Guide
            </h1>
            <p className="text-lg text-green-100 max-w-3xl">
              Real numbers for dog groomer salaries — hourly rates, annual income by experience level,
              mobile vs salon pay, commission structures, and how to maximize what you earn.
            </p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Quick Answer */}
          <section className="mb-12">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-green-800 mb-3">Quick Answer</h2>
              <p className="text-green-900 text-lg leading-relaxed">
                Dog groomers in the US earn an average of <strong>$35,000–$55,000 per year</strong> ($17–$26/hour).
                Mobile groomers and salon owners can earn <strong>$60,000–$120,000+ per year</strong>.
                Your income depends heavily on experience, location, business model, and how efficiently you manage your schedule.
              </p>
            </div>
          </section>

          {/* Salary Table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Dog Groomer Salary by Experience Level (2026)</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-green-600 text-white text-left">
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Hourly</th>
                    <th className="px-6 py-4 font-semibold">Annual</th>
                    <th className="px-6 py-4 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryData.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                      <td className="px-6 py-4 font-medium text-stone-800">{row.role}</td>
                      <td className="px-6 py-4 text-stone-600 font-semibold">{row.hourly}</td>
                      <td className="px-6 py-4 text-green-700 font-bold">{row.annual}</td>
                      <td className="px-6 py-4 text-stone-500 text-sm">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-stone-400 text-sm mt-3">Sources: Bureau of Labor Statistics, ZipRecruiter, Indeed, GroomGrid groomer surveys (2025–2026).</p>
          </section>

          {/* Mobile vs Salon */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Mobile vs Salon: Which Pays More?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border-2 border-green-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">🚐 Mobile Groomer</h3>
                <ul className="space-y-3 text-stone-700">
                  <li><strong>Per groom:</strong> $70–$120 (premium pricing)</li>
                  <li><strong>Dogs/day:</strong> 4–6</li>
                  <li><strong>Daily revenue:</strong> $280–$720</li>
                  <li><strong>Annual (solo):</strong> $50,000–$90,000</li>
                  <li><strong>Overhead:</strong> Van payment, fuel, insurance ($1,500–$3,000/mo)</li>
                  <li><strong>Take-home:</strong> Typically 50–60% of gross after expenses</li>
                </ul>
              </div>
              <div className="bg-white border-2 border-stone-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-stone-700 mb-4">🏠 Salon Groomer</h3>
                <ul className="space-y-3 text-stone-700">
                  <li><strong>Per groom:</strong> $40–$70 (split with salon)</li>
                  <li><strong>Dogs/day:</strong> 8–12</li>
                  <li><strong>Daily revenue:</strong> $320–$840 (before split)</li>
                  <li><strong>Annual (employee):</strong> $30,000–$55,000</li>
                  <li><strong>Overhead:</strong> Minimal (salon covers equipment, products)</li>
                  <li><strong>Take-home:</strong> 40–60% commission or $15–$25/hr base</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Commission Structures */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Commission Structures: How Groomers Get Paid</h2>
            <div className="space-y-4">
              {[
                {
                  type: 'Commission-Only (40–60% split)',
                  desc: 'You keep 40–60% of each grooming fee. Common at independent salons. The more dogs you groom, the more you earn. No floor pay — you only earn when you work.',
                  best: 'Experienced groomers with speed and a steady client base.',
                },
                {
                  type: 'Hourly + Commission Hybrid',
                  desc: 'A base hourly rate ($12–$18/hr) plus a smaller commission (15–25%). Provides income stability while rewarding productivity.',
                  best: 'Groomers still building their speed and clientele.',
                },
                {
                  type: 'Flat Salary',
                  desc: 'Fixed annual salary regardless of volume. More common at corporate salons and veterinary clinics. Predictable but limits upside.',
                  best: 'Groomers who value stability and benefits over income growth.',
                },
                {
                  type: ' booth / Chair Rental',
                  desc: 'You rent a station ($200–$600/week) and keep 100% of what you earn. Highest potential income but you cover all your own expenses.',
                  best: 'Established groomers with a full book of clients.',
                },
              ].map((item) => (
                <div key={item.type} className="bg-white border border-stone-200 rounded-xl p-6">
                  <h3 className="font-bold text-stone-800 mb-2">{item.type}</h3>
                  <p className="text-stone-600 mb-2">{item.desc}</p>
                  <p className="text-green-700 text-sm"><strong>Best for:</strong> {item.best}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Maximizing Income */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">How to Maximize Your Dog Grooming Income</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '📱',
                  title: 'Use Grooming Software',
                  desc: 'Automated reminders reduce no-shows by 30–40%. Online booking fills cancellations. That is $5,000–$15,000/year recovered.',
                  link: true,
                },
                {
                  icon: '🏷️',
                  title: 'Raise Prices Annually',
                  desc: 'A 5–10% annual price increase keeps pace with costs. Most clients accept it — the ones who leave were your least profitable anyway.',
                },
                {
                  icon: '➕',
                  title: 'Add Premium Services',
                  desc: 'Teeth brushing, nail grinding, de-shedding treatments, flea baths, blueberry facials. Each add-on is $10–$30 pure profit per dog.',
                },
                {
                  icon: '🔄',
                  title: 'Increase Client Retention',
                  desc: 'Rebooking at checkout, loyalty programs, and follow-up messages. A retained client is worth $600–$1,200/year.',
                },
                {
                  icon: '🚐',
                  title: 'Go Mobile',
                  desc: 'Mobile groomers charge 50–100% more per dog and have lower overhead than a brick-and-mortar lease. The trade-off is fewer dogs per day.',
                },
                {
                  icon: '🎓',
                  title: 'Specialize in Breed Cuts',
                  desc: 'Poodle, doodle, and terrier specialists command premium pricing. Certification from NDGAA or IPG adds credibility and lets you charge 20–30% more.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-stone-200 rounded-xl p-6">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {item.desc}
                    {item.link && (
                      <> <Link href="/signup" className="text-green-600 font-semibold hover:underline">See how GroomGrid helps →</Link></>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* State-by-State */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Highest-Paying States for Dog Groomers</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { state: 'California', avg: '$42,500' },
                { state: 'Washington', avg: '$40,200' },
                { state: 'Massachusetts', avg: '$39,800' },
                { state: 'New York', avg: '$38,600' },
                { state: 'New Jersey', avg: '$38,100' },
                { state: 'Connecticut', avg: '$37,400' },
                { state: 'Oregon', avg: '$36,800' },
                { state: 'Colorado', avg: '$36,200' },
                { state: 'Alaska', avg: '$35,900' },
                { state: 'Hawaii', avg: '$35,600' },
              ].map((item) => (
                <div key={item.state} className="bg-white border border-stone-200 rounded-lg p-4 text-center">
                  <p className="font-bold text-stone-800 text-sm">{item.state}</p>
                  <p className="text-green-700 font-semibold">{item.avg}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">Want to Earn More as a Groomer?</h2>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                GroomGrid helps you reduce no-shows, fill cancellations automatically, and keep clients coming back.
                That means more dogs groomed and more money in your pocket.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors">
                  Start Free Trial
                </Link>
                <Link href="/plans" className="inline-block border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-green-500 transition-colors">
                  See Pricing
                </Link>
              </div>
            </div>
          </section>

          {/* Related Posts */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Related Guides</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/blog/how-to-become-a-dog-groomer" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                <p className="text-sm text-green-600 font-semibold mb-1">Career</p>
                <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">How to Become a Dog Groomer: Certification &amp; Career Guide</h3>
              </Link>
              <Link href="/blog/is-dog-grooming-a-profitable-business" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                <p className="text-sm text-green-600 font-semibold mb-1">Business</p>
                <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">Is Dog Grooming a Profitable Business? Real Numbers</h3>
              </Link>
              <Link href="/blog/dog-grooming-pricing-guide" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                <p className="text-sm text-green-600 font-semibold mb-1">Pricing</p>
                <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">Dog Grooming Pricing Guide: How Much to Charge</h3>
              </Link>
            </div>
          </section>
        </main>

        <footer className="px-6 py-8 max-w-5xl mx-auto border-t border-stone-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
            <Link href="/" className="font-bold text-green-600">GroomGrid 🐾</Link>
            <div className="flex gap-6">
              <Link href="/grooming-business-operations/" className="hover:text-stone-600 transition-colors">Operations Hub</Link>
              <Link href="/mobile-grooming-business/" className="hover:text-stone-600 transition-colors">Mobile Grooming</Link>
              <Link href="/plans" className="hover:text-stone-600 transition-colors">Pricing</Link>
              <Link href="/signup" className="hover:text-stone-600 transition-colors">Sign Up</Link>
            </div>
            <p>© {new Date().getFullYear()} GroomGrid. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
