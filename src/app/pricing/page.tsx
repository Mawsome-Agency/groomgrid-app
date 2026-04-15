import type { Metadata } from 'next';
import Link from 'next/link';
import PlanCard from '@/components/funnel/PlanCard';
import Testimonial from '@/components/funnel/Testimonial';
import ValueProp from '@/components/funnel/ValueProp';
import TrustSignals from '@/components/trust/TrustSignals';
import { PLANS, TESTIMONIALS, FAQ_ITEMS } from './pricing-data';

export const metadata: Metadata = {
  title: 'Pricing | GroomGrid - Simple, Affordable Pet Grooming Software',
  description: 'Transparent pricing for GroomGrid. Choose from Solo, Salon, or Enterprise plans. All plans include a 14-day free trial. No hidden fees.',
  alternates: {
    canonical: 'https://getgroomgrid.com/pricing',
  },
  openGraph: {
    title: 'Pricing | GroomGrid - Simple, Affordable Pet Grooming Software',
    description: 'Transparent pricing for GroomGrid. Choose from Solo, Salon, or Enterprise plans. All plans include a 14-day free trial. No hidden fees.',
    url: 'https://getgroomgrid.com/pricing',
    type: 'website',
  },
};

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'GroomGrid Pricing Plans',
  description: 'Pet grooming business management software pricing options',
  offers: PLANS.map(plan => ({
    '@type': 'Offer',
    name: plan.name,
    price: plan.price,
    priceCurrency: 'USD',
    billingPeriod: 'Monthly',
  })),
};

export default function PricingPage() {
  const handleSelectPlan = () => {
    // For the marketing page, we just redirect to signup
    window.location.href = '/signup';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-600">GroomGrid</Link>
          <Link 
            href="/signup" 
            className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-stone-600">All plans include a 14-day free trial. No credit card required.</p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={false}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>

        {/* Trust Signals */}
        <div className="mb-8">
          <TrustSignals location="plans" compact={true} />
        </div>

        {/* Value Props */}
        <div className="mb-8">
          <ValueProp />
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">
            Trusted by Professional Groomers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {TESTIMONIALS.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-stone-900 mb-2">{faq.question}</h3>
                <p className="text-stone-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Final CTA */}
      <section className="py-12 bg-green-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to grow your grooming business?</h2>
          <p className="text-green-100 mb-6 max-w-xl mx-auto">
            Join hundreds of professional groomers who save hours each week with GroomGrid.
          </p>
          <Link 
            href="/signup" 
            className="inline-block px-8 py-4 rounded-xl bg-white text-green-600 font-bold text-lg hover:bg-green-50 transition-colors"
          >
            Start Your Free Trial
          </Link>
          <p className="text-green-200 text-sm mt-3">14 days free · No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-stone-400 text-sm border-t border-stone-100">
        <p>
          © 2026 GroomGrid ·{' '}
          <a
            href="mailto:hello@getgroomgrid.com"
            className="hover:text-stone-600 transition-colors"
          >
            hello@getgroomgrid.com
          </a>
        </p>
      </footer>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
    </div>
  );
}
