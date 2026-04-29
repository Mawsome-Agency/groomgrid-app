import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Best Dog Grooming Appointment App (2026): Scheduling, Reminders & Payments | GroomGrid',
  description:
    'Compare the best dog grooming appointment apps for 2026 — scheduling, automated reminders, online booking, payment processing, and client management features.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/dog-grooming-appointment-app',
  },
  openGraph: {
    title: 'Best Dog Grooming Appointment App (2026): Scheduling, Reminders & Payments',
    description:
      'Compare the best dog grooming appointment apps — scheduling, automated reminders, online booking, payment processing, and client management.',
    url: 'https://getgroomgrid.com/blog/dog-grooming-appointment-app',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Dog Grooming Appointment App (2026): Scheduling, Reminders & Payments',
  description: 'Compare the best dog grooming appointment apps for 2026 — scheduling, automated reminders, online booking, payment processing.',
  url: 'https://getgroomgrid.com/blog/dog-grooming-appointment-app',
  datePublished: '2026-04-27',
  dateModified: '2026-04-27',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://getgroomgrid.com/blog/dog-grooming-appointment-app' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best app for dog grooming appointments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best app depends on your business. For solo mobile groomers, GroomGrid offers AI-powered scheduling, automated reminders, and payment processing starting at $29/month. For larger salons, MoeGo and DaySmart Pet offer multi-staff scheduling.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free dog grooming appointment app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most grooming apps offer free trials but not free plans. Generic scheduling tools like Calendly have free tiers but lack pet-specific features like breed tracking, service history, and vaccination records. For a working groomer, a specialized app pays for itself through reduced no-shows.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do automated reminders reduce no-shows?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Automated SMS and email reminders sent at 72 hours, 24 hours, and 2 hours before an appointment can reduce no-shows by 30–40%. This is the single highest-ROI feature of any grooming appointment app. At $60/groom, eliminating 2 no-shows per week saves $6,240/year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can clients book dog grooming appointments online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — modern grooming apps include online booking where clients can see available time slots and book directly. This works 24/7, fills cancellation gaps automatically, and eliminates phone tag.',
      },
    },
  ],
};

const mustHaveFeatures = [
  { icon: '📅', title: 'Visual Calendar Scheduling', desc: 'Drag-and-drop appointment management with breed-specific time slots, buffer time between grooms, and multi-groomer views.' },
  { icon: '🔔', title: 'Automated SMS & Email Reminders', desc: 'Send reminders at 72h, 24h, and 2h before appointments automatically. This single feature pays for the entire app.' },
  { icon: '💳', title: 'Online Payment Processing', desc: 'Accept deposits at booking and full payment at checkout. Reduces no-shows (deposits create commitment) and eliminates payment chasing.' },
  { icon: '📱', title: 'Mobile-Friendly Interface', desc: 'Works on your phone in the grooming van. You should be able to check your schedule, add notes, and process payments from anywhere.' },
  { icon: '🐕', title: 'Client & Pet Profiles', desc: 'Breed, weight, service history, behavioral notes, vaccination records, and allergies — all in one place, accessible at booking.' },
  { icon: '📊', title: 'Business Reporting', desc: 'Revenue tracking, no-show rates, client retention, and popular services. The data you need to make smart business decisions.' },
];

const apps = [
  {
    name: 'GroomGrid',
    best: 'Best for solo mobile groomers & small salons',
    price: '$29–$79/mo',
    pros: ['AI-powered scheduling', 'Automated reminders that actually work', 'Mobile-first design', 'Integrated payments with deposits', 'Cat-specific workflow support'],
    cons: ['Newer platform', 'No enterprise multi-location yet'],
    rating: '5.0',
  },
  {
    name: 'MoeGo',
    best: 'Best for established salons with 3+ groomers',
    price: '$69–$149/mo',
    pros: ['Mature platform', 'Multi-location support', 'Comprehensive reporting', 'Strong mobile app', 'Grooming report cards'],
    cons: ['Steeper learning curve', 'Higher price point', 'No AI features', 'Contract-based pricing'],
    rating: '4.2',
  },
  {
    name: 'DaySmart Pet',
    best: 'Best for enterprise & multi-location operations',
    price: '$49–$199/mo',
    pros: ['Enterprise-grade', 'Point of sale system', 'Inventory management', 'HR features', 'Established brand'],
    cons: ['Complex setup', 'Dated interface', 'Customer support complaints', 'Expensive for solo groomers'],
    rating: '3.8',
  },
];

export default function DogGroomingAppointmentApp() {
  return (
    <>      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-stone-50">
        <header className="bg-gradient-to-br from-green-600 to-green-700 text-white">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <nav className="text-sm text-green-200 mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-white transition-colors">Home</Link><span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link><span>/</span>
              <span className="text-white">Grooming Appointment App</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Best Dog Grooming Appointment App (2026): Scheduling, Reminders &amp; Payments
            </h1>
            <p className="text-lg text-green-100 max-w-3xl">
              Compare the top grooming appointment apps — features, pricing, and which one is right for your
              mobile grooming business or salon.
            </p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Quick Answer */}
          <section className="mb-12">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-green-800 mb-3">Quick Answer</h2>
              <p className="text-green-900 text-lg leading-relaxed">
                The best grooming appointment app is one that <strong>automatically sends reminders</strong>,
                lets clients <strong>book online 24/7</strong>, and <strong>processes payments</strong> — because
                those three features alone will save you 5–10 hours per week and recover $5,000–$15,000/year in
                no-show revenue. GroomGrid does all three starting at <strong>$29/month</strong>.
              </p>
            </div>
          </section>

          {/* Must-Have Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">6 Must-Have Features in a Grooming Appointment App</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mustHaveFeatures.map((f) => (
                <div key={f.title} className="bg-white border border-stone-200 rounded-xl p-6">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-stone-800 mb-2">{f.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* App Comparisons */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Top Dog Grooming Appointment Apps Compared</h2>
            <div className="space-y-6">
              {apps.map((app) => (
                <div key={app.name} className={`bg-white rounded-2xl p-8 ${app.name === 'GroomGrid' ? 'border-2 border-green-300 shadow-lg' : 'border border-stone-200'}`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-stone-800">{app.name}</h3>
                        {app.name === 'GroomGrid' && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">RECOMMENDED</span>}
                        <span className="text-amber-500 text-sm">★ {app.rating}</span>
                      </div>
                      <p className="text-stone-500 text-sm mb-3">{app.best}</p>
                      <p className="text-green-700 font-bold mb-4">{app.price}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-green-600 mb-2 uppercase tracking-wider">Pros</p>
                          <ul className="space-y-1">
                            {app.pros.map((p) => <li key={p} className="text-stone-600 text-sm flex items-start gap-2"><span className="text-green-500">✓</span> {p}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Cons</p>
                          <ul className="space-y-1">
                            {app.cons.map((c) => <li key={c} className="text-stone-500 text-sm flex items-start gap-2"><span className="text-stone-400">✗</span> {c}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ROI Calculator */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">The ROI of a Grooming Appointment App</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-amber-800">$6,240</p>
                  <p className="text-amber-600 text-sm">Annual savings from eliminating 2 no-shows/week at $60/groom</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-800">5–10 hrs</p>
                  <p className="text-amber-600 text-sm">Weekly hours saved on scheduling, reminders, and follow-ups</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-800">387%</p>
                  <p className="text-amber-600 text-sm">Appointment surge reported by businesses using automated reminders</p>
                </div>
              </div>
              <p className="text-amber-700 text-sm mt-6 text-center">
                At $29/month ($348/year), the app pays for itself if it prevents just <strong>6 no-shows per year</strong>.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">Stop Losing Money to No-Shows and Manual Scheduling</h2>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                GroomGrid handles your appointments, reminders, and payments automatically — so you can focus on grooming.
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

          {/* Related */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Related Guides</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/blog/dog-grooming-software" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                <p className="text-sm text-green-600 font-semibold mb-1">Software</p>
                <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">Dog Grooming Software: 2026 Buyer&apos;s Guide</h3>
              </Link>
              <Link href="/blog/reduce-no-shows-dog-grooming" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                <p className="text-sm text-green-600 font-semibold mb-1">Operations</p>
                <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">How to Reduce No-Shows in Your Grooming Business</h3>
              </Link>
              <Link href="/blog/free-dog-grooming-software" className="group p-5 border border-stone-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                <p className="text-sm text-green-600 font-semibold mb-1">Free Options</p>
                <h3 className="font-bold text-stone-800 group-hover:text-green-600 transition-colors text-sm">Free Dog Grooming Software: What Actually Works</h3>
              </Link>
            </div>
          </section>
        </main>

        <SiteFooter slug="blog/dog-grooming-appointment-app" />
      </div>
    </>
  );
}
