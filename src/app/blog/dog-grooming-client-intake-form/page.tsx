import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Dog Grooming Client Intake Form: What to Ask Every New Client | GroomGrid',
  description:
    'A complete guide to dog grooming client intake forms — what questions to ask, what information protects your business, and how to collect it digitally without the paperwork.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/dog-grooming-client-intake-form',
  },
  openGraph: {
    title: 'Dog Grooming Client Intake Form: What to Ask Every New Client',
    description:
      'A complete guide to dog grooming client intake forms — what questions to ask, what information protects your business, and how to collect it digitally without the paperwork.',
    url: 'https://getgroomgrid.com/blog/dog-grooming-client-intake-form',
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dog Grooming Client Intake Form: What to Ask Every New Client',
  description:
    'A complete guide to dog grooming client intake forms — what questions to ask, what information protects your business, and how to collect it digitally without the paperwork.',
  url: 'https://getgroomgrid.com/blog/dog-grooming-client-intake-form',
  publisher: {
    '@type': 'Organization',
    name: 'GroomGrid',
    url: 'https://getgroomgrid.com',
    logo: { '@type': 'ImageObject', url: 'https://getgroomgrid.com/favicon.ico' },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://getgroomgrid.com/blog/dog-grooming-client-intake-form',
  },
};

export default function DogGroomingClientIntakeFormPage() {
  return (
    <>      <Script
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
          <PageBreadcrumbs slug="blog/dog-grooming-client-intake-form" />
        </div>

        {/* ── Hero ── */}
        <header className="px-6 pt-10 pb-12 max-w-4xl mx-auto">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Templates & Forms
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-6">
            Dog Grooming Client Intake Form:<br className="hidden sm:block" /> Every Question You Should Be Asking
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
            A thorough client intake form isn&apos;t just paperwork — it&apos;s how you protect the
            dog, protect yourself, and give every client the personalized experience that keeps them
            coming back. Here&apos;s exactly what to collect.
          </p>
        </header>

        {/* ── Why It Matters ── */}
        <section className="px-6 py-12 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Why a Thorough Intake Form Matters</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Groomers who skip intake forms work in the dark. They don&apos;t know the dog on heart
              medication until they&apos;re already in a high-stress groom. They don&apos;t know the
              owner&apos;s preferred cut until the dog is already trimmed. They don&apos;t have an
              emergency contact when the dog has a reaction.
            </p>
            <p className="text-stone-600 leading-relaxed">
              A good intake form collects everything you need to do the groom safely, deliver the
              service the client actually wants, and protect your business if anything goes wrong.
              Done right, it also signals professionalism — clients trust groomers who take the time
              to ask the right questions.
            </p>
          </div>
        </section>

        {/* ── Section 1: Owner Info ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Section 1: Owner Information</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Basic contact information plus the fields that matter most when something unexpected happens.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Full name',
              'Phone number (primary)',
              'Email address',
              'Home address (required for mobile; helpful for salon)',
              'Emergency contact name and phone',
              'Preferred contact method (call/text/email)',
              'How did you hear about us?',
              'Any other pets in the household?',
            ].map((field) => (
              <div key={field} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-green-500 font-bold">✓</span>
                <span className="text-stone-700 text-sm">{field}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 2: Pet Info ── */}
        <section className="px-6 py-14 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Section 2: Pet Profile</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              This is the heart of the intake form. The more you know about the dog before they arrive,
              the better the groom — and the safer the experience.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Pet name',
                'Breed (or mix)',
                'Age',
                'Weight',
                'Sex (neutered/spayed?)',
                'Coat type and condition',
                'Color and markings',
                'Vaccination status (rabies, Bordetella)',
                'Veterinarian name and phone',
                'Last grooming date',
                'Previous groomer (any notes?)',
                'Microchip number (optional)',
              ].map((field) => (
                <div key={field} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-stone-200">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-stone-700 text-sm">{field}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: Health ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Section 3: Health and Medical History</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            This section protects the dog and protects you. Always get this information in writing —
            especially for medications and known conditions.
          </p>
          <ul className="space-y-3">
            {[
              'Current medications (name, dosage, frequency)',
              'Known allergies (shampoos, products, environmental)',
              'Heart or respiratory conditions',
              'Skin conditions, hot spots, or known sensitivities',
              'Orthopedic issues (hip dysplasia, arthritis — affects table positioning)',
              'Seizure history',
              'Anxiety or stress triggers during grooming',
              'Previous adverse reactions to grooming products',
              'Recent surgery or injuries',
              'Senior dog (8+ years) — noting additional risk factors',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Section 4: Grooming Preferences ── */}
        <section className="px-6 py-14 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">Section 4: Grooming Preferences and Service Notes</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              This determines whether the client comes back — get it right the first time.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { q: 'What style or cut are you looking for?', note: 'Ask for a reference photo if possible' },
                { q: 'Any areas to avoid or be extra gentle with?', note: 'Ears, paws, belly, face' },
                { q: 'How does the dog handle nail trims?', note: 'Know before you reach for the clippers' },
                { q: 'Any aggression or biting history?', note: 'Non-negotiable — must know upfront' },
                { q: 'Add-ons wanted? (teeth brushing, deshedding, etc.)', note: 'Upsell opportunity, but only if wanted' },
                { q: 'Drop-off and pickup preferences?', note: 'Time windows, who can pick up, callback instructions' },
              ].map(({ q, note }) => (
                <div key={q} className="p-4 bg-white rounded-lg border border-stone-200">
                  <p className="font-semibold text-stone-800 mb-1">{q}</p>
                  <p className="text-xs text-stone-500">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Digital vs Paper ── */}
        <section className="px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Digital Intake vs Paper Forms</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Paper forms get lost, misread, and never referenced again. Digital intake forms collected
            at booking flow directly into the client&apos;s profile in your grooming software — so
            every detail is at your fingertips when the dog walks in the door.
          </p>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
            <p className="font-semibold text-stone-800 mb-2">With digital intake:</p>
            <ul className="space-y-2 text-stone-600 text-sm">
              <li>✓ Information lives in the client profile permanently</li>
              <li>✓ Accessible from your phone mid-groom</li>
              <li>✓ Auto-attached to the appointment history</li>
              <li>✓ Searchable — find all dogs on medication in seconds</li>
              <li>✓ Clients fill it out at home before arriving — no front-desk wait</li>
            </ul>
          </div>
          <p className="text-stone-600 leading-relaxed mt-4">
            A solid client profile system is one of the core pillars of good{' '}
            <Link
              href="/blog/dog-grooming-business-management"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              dog grooming business management
            </Link>
            . Pair it with a{' '}
            <Link
              href="/blog/dog-grooming-contract-template"
              className="text-green-600 font-medium hover:text-green-700 underline underline-offset-2"
            >
              clear grooming contract
            </Link>{' '}
            and you have a professional, documented relationship with every client from day one.
          </p>
        </section>

        {/* ── Related Links ── */}
        <PageRelatedLinks slug="blog/dog-grooming-client-intake-form" variant="blog" heading="Store all of this in one place — automatically" />

        {/* ── Footer ── */}
        <SiteFooter slug="blog/dog-grooming-client-intake-form" />
      </div>
    </>
  );
}
