import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Dog Grooming Pricing Guide: How Much to Charge in 2026 | GroomGrid',
  description:
    'Complete dog grooming pricing guide with average costs by breed size, service type, and region. Includes mobile vs salon pricing, add-on rates, and strategies for setting your prices.',
  alternates: {
    canonical: 'https://getgroomgrid.com/blog/dog-grooming-pricing-guide',
  },
  openGraph: {
    title: 'Dog Grooming Pricing Guide: How Much to Charge in 2026',
    description:
      'Complete dog grooming pricing guide with average costs by breed size, service type, and region. Includes mobile vs salon pricing, add-on rates, and strategies for setting your prices.',
    url: 'https://getgroomgrid.com/blog/dog-grooming-pricing-guide',
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://getgroomgrid.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://getgroomgrid.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'Dog Grooming Pricing Guide', item: 'https://getgroomgrid.com/blog/dog-grooming-pricing-guide' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dog Grooming Pricing Guide: How Much to Charge in 2026',
  description: 'Complete dog grooming pricing guide with average costs by breed size, service type, and region.',
  url: 'https://getgroomgrid.com/blog/dog-grooming-pricing-guide',
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
    '@id': 'https://getgroomgrid.com/blog/dog-grooming-pricing-guide',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does dog grooming cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The average dog grooming cost ranges from $30 to $90 for a standard bath and haircut, depending on the dog\'s size, breed, coat condition, and your location. Small dogs typically cost $30–$50, medium dogs $50–$70, and large dogs $70–$90+. Specialty breeds, matting, and behavioral issues can add $20–$50 or more.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much should I charge for dog grooming?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most professional groomers charge $40–$75 for a full groom on a small-to-medium dog. Your pricing should factor in your time, overhead costs (rent, insurance, supplies), local market rates, and the complexity of the groom. Mobile groomers typically charge 20–40% more than salons to cover travel costs.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does mobile dog grooming cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mobile dog grooming typically costs $60–$120+ per appointment, compared to $30–$90 for salon grooming. The premium covers travel time, fuel, van maintenance, and the convenience of coming to the client. Mobile groomers often set a minimum service fee of $50–$75 per visit.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the average price for dog grooming?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The national average for a full dog groom (bath, haircut, nail trim, ear cleaning) is approximately $60. Prices vary significantly by region — urban areas like New York and San Francisco can see averages of $80–$120, while rural areas may average $40–$60.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do dog grooming prices vary so much?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dog grooming prices vary based on dog size and breed, coat condition and length, behavior and temperament, geographic location, type of service (salon vs mobile), and the groomer\'s experience level. A severely matted golden retriever in San Francisco will cost significantly more than a short-haired beagle bath in rural Ohio.',
      },
    },
  ],
};

const pricingData = [
  { size: 'Small (under 20 lbs)', breeds: 'Chihuahua, Shih Tzu, Poodle, Yorkie', bathBrush: '$25–$40', fullGroom: '$35–$60', mobile: '$50–$80' },
  { size: 'Medium (20–50 lbs)', breeds: 'Beagle, Cocker Spaniel, Border Collie', bathBrush: '$35–$55', fullGroom: '$50–$75', mobile: '$65–$100' },
  { size: 'Large (50–80 lbs)', breeds: 'Golden Retriever, German Shepherd, Lab', bathBrush: '$45–$65', fullGroom: '$65–$90', mobile: '$80–$130' },
  { size: 'Extra Large (80+ lbs)', breeds: 'Great Dane, Mastiff, St. Bernard', bathBrush: '$55–$80', fullGroom: '$80–$120', mobile: '$100–$160' },
];

const addOns = [
  { service: 'Nail grinding (vs clipping)', price: '$5–$15' },
  { service: 'Teeth brushing', price: '$5–$10' },
  { service: 'Flea/tick treatment', price: '$15–$30' },
  { service: 'De-shedding treatment', price: '$20–$40' },
  { service: 'Blueberry facial', price: '$5–$10' },
  { service: 'Dematting (per hour)', price: '$30–$60' },
  { service: 'Puppy first groom (under 6 months)', price: '$20–$40' },
  { service: 'Anal gland expression', price: '$10–$20' },
  { service: 'Creative coloring / dye', price: '$20–$75' },
  { service: 'Cat grooming (per cat)', price: '$50–$150' },
];

const regionalData = [
  { region: 'Northeast (NY, MA, CT)', avgFullGroom: '$75–$120', avgMobile: '$90–$150' },
  { region: 'Southeast (FL, GA, TX)', avgFullGroom: '$45–$80', avgMobile: '$65–$110' },
  { region: 'Midwest (OH, IL, MI)', avgFullGroom: '$40–$70', avgMobile: '$60–$100' },
  { region: 'West Coast (CA, WA, OR)', avgFullGroom: '$70–$110', avgMobile: '$90–$140' },
  { region: 'Mountain / Plains (CO, AZ, NM)', avgFullGroom: '$45–$75', avgMobile: '$65–$110' },
];

export default function DogGroomingPricingGuide() {
  return (
    <div className="min-h-screen bg-white text-stone-900">
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

      {/* Header */}
      <header className="bg-green-50 border-b border-green-100">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link href="/blog" className="inline-block text-green-600 hover:text-green-700 font-semibold text-sm mb-4">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Dog Grooming Pricing Guide: How Much to Charge in 2026
          </h1>
          <p className="text-lg text-stone-600 mb-4">
            Average dog grooming costs by breed size, service type, and region — plus mobile vs salon pricing,
            add-on rates, and a framework for setting your own prices as a professional groomer.
          </p>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <span>By GroomGrid Team</span>
            <span>·</span>
            <time dateTime="2026-04-27">April 27, 2026</time>
            <span>·</span>
            <span>12 min read</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Table of Contents */}
        <nav className="bg-stone-50 rounded-lg p-6 mb-10 border border-stone-200">
          <h2 className="text-lg font-bold text-stone-900 mb-3">In This Guide</h2>
          <ol className="space-y-2 text-sm text-green-700">
            <li><a href="#average-costs" className="hover:underline">Average Dog Grooming Costs by Size</a></li>
            <li><a href="#pricing-table" className="hover:underline">Full Pricing Table: Salon vs Mobile</a></li>
            <li><a href="#add-ons" className="hover:underline">Add-On Service Pricing</a></li>
            <li><a href="#regional" className="hover:underline">Regional Pricing Differences</a></li>
            <li><a href="#breed-specific" className="hover:underline">Breed-Specific Pricing Factors</a></li>
            <li><a href="#mobile-vs-salon" className="hover:underline">Mobile vs Salon: Pricing Differences</a></li>
            <li><a href="#how-to-set" className="hover:underline">How to Set Your Own Grooming Prices</a></li>
            <li><a href="#common-mistakes" className="hover:underline">Common Pricing Mistakes</a></li>
            <li><a href="#faq" className="hover:underline">Frequently Asked Questions</a></li>
          </ol>
        </nav>

        {/* Section: Average Costs */}
        <section id="average-costs" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">
            What Does Dog Grooming Cost in 2026?
          </h2>
          <p className="text-stone-600 mb-4">
            The national average for a full dog groom — bath, haircut, nail trim, and ear cleaning — runs
            between <strong>$40 and $90</strong>, with most groomers charging around <strong>$60</strong> for a
            standard appointment on a medium-sized dog. But that number tells you almost nothing useful.
          </p>
          <p className="text-stone-600 mb-4">
            Real pricing depends on five factors: <strong>dog size</strong>, <strong>breed and coat type</strong>,
            <strong> coat condition</strong> (matting adds time and cost), <strong>behavior</strong> (anxious or
            aggressive dogs take longer), and <strong>location</strong> (a groom in Manhattan costs more than one
            in rural Kansas — same dog, different overhead).
          </p>
          <p className="text-stone-600 mb-4">
            Here's what professional groomers are charging across the country, broken down by size, service type,
            and setting.
          </p>
        </section>

        {/* Section: Pricing Table */}
        <section id="pricing-table" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">
            Dog Grooming Prices by Size
          </h2>
          <p className="text-stone-600 mb-6">
            These ranges reflect what most professional groomers charge in 2026. Your local market may sit at
            the higher or lower end depending on cost of living and competition density.
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-50">
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Dog Size</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Example Breeds</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Bath & Brush</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Full Groom</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {pricingData.map((row) => (
                  <tr key={row.size} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="p-3 font-medium text-stone-900">{row.size}</td>
                    <td className="p-3 text-stone-600">{row.breeds}</td>
                    <td className="p-3 text-green-700 font-semibold">{row.bathBrush}</td>
                    <td className="p-3 text-green-700 font-semibold">{row.fullGroom}</td>
                    <td className="p-3 text-green-700 font-semibold">{row.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-stone-500">
            <em>Bath & Brush</em> includes shampoo, blow dry, brush out, nail trim, and ear cleaning.
            <em> Full Groom</em> adds breed-specific haircut and styling. <em>Mobile</em> reflects the premium
            for house-call convenience.
          </p>
        </section>

        {/* Section: Add-Ons */}
        <section id="add-ons" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">
            Add-On Service Pricing
          </h2>
          <p className="text-stone-600 mb-6">
            Most groomers build revenue through add-ons — services stacked on top of the base groom.
            These are high-margin items because they add relatively little time but significant perceived value.
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-50">
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Service</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Typical Price</th>
                </tr>
              </thead>
              <tbody>
                {addOns.map((item) => (
                  <tr key={item.service} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="p-3 text-stone-700">{item.service}</td>
                    <td className="p-3 text-green-700 font-semibold">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section: Regional */}
        <section id="regional" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">
            Dog Grooming Prices by Region
          </h2>
          <p className="text-stone-600 mb-6">
            Location is one of the biggest pricing variables. A groomer in San Francisco or New York faces
            dramatically higher rent, labor, and insurance costs than one in rural Ohio — and their prices
            reflect that.
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-50">
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Region</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Avg Full Groom</th>
                  <th className="text-left p-3 font-semibold text-stone-900 border-b">Avg Mobile Groom</th>
                </tr>
              </thead>
              <tbody>
                {regionalData.map((row) => (
                  <tr key={row.region} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="p-3 font-medium text-stone-900">{row.region}</td>
                    <td className="p-3 text-green-700 font-semibold">{row.avgFullGroom}</td>
                    <td className="p-3 text-green-700 font-semibold">{row.avgMobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section: Breed-Specific */}
        <section id="breed-specific" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">
            Breed-Specific Pricing Factors
          </h2>
          <p className="text-stone-600 mb-4">
            Not all dogs are created equal — at least not when it comes to grooming time and effort.
            Breed-specific pricing isn't upselling; it's accurately charging for the work involved.
          </p>
          <div className="space-y-4 mb-6">
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-2">High-Maintenance Breeds (Premium Pricing)</h3>
              <p className="text-stone-600 text-sm mb-2">
                Poodles, Doodles, Bichons, Shih Tzus, and other continuously-growing-coat breeds require
                significantly more time. A standard poodle full groom can take 2–3 hours.
              </p>
              <p className="text-stone-600 text-sm">
                <strong>Typical premium:</strong> 20–40% above base rate for the size category.
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-2">Double-Coated Breeds (De-shedding Surcharge)</h3>
              <p className="text-stone-600 text-sm mb-2">
                Huskies, Golden Retrievers, German Shepherds, and other double-coated breeds shed
                heavily and require specialized de-shedding tools and extra drying time.
              </p>
              <p className="text-stone-600 text-sm">
                <strong>Typical surcharge:</strong> $15–$40 for de-shedding treatment.
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-2">Matting Surcharges</h3>
              <p className="text-stone-600 text-sm mb-2">
                Matting is the single biggest pricing variable. A severely matted dog can double your
                grooming time. Most groomers charge by the hour for dematting ($30–$60/hr) or may
                recommend shaving down.
              </p>
              <p className="text-stone-600 text-sm">
                <strong>Typical surcharge:</strong> $20–$60+ depending on severity.
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-2">Behavioral Surcharges</h3>
              <p className="text-stone-600 text-sm mb-2">
                Aggressive, extremely anxious, or uncooperative dogs slow everything down. Many groomers
                apply a behavioral surcharge or may refer difficult dogs to a vet for sedated grooming.
              </p>
              <p className="text-stone-600 text-sm">
                <strong>Typical surcharge:</strong> $10–$30, sometimes more for extreme cases.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Mobile vs Salon */}
        <section id="mobile-vs-salon" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">
            Mobile vs Salon Grooming: Price Differences
          </h2>
          <p className="text-stone-600 mb-4">
            Mobile groomers charge <strong>20–40% more</strong> than salon groomers on average — and for good reason.
            The mobile premium covers:
          </p>
          <ul className="list-disc list-inside space-y-2 text-stone-600 mb-4">
            <li>Fuel and vehicle maintenance ($200–$500/month)</li>
            <li>Van or trailer payments ($300–$800/month if financed)</li>
            <li>Insurance (commercial auto + grooming liability)</li>
            <li>Drive time between appointments (lost revenue hours)</li>
            <li>Limited daily capacity (4–8 dogs vs 8–15 in a salon)</li>
          </ul>
          <p className="text-stone-600 mb-4">
            But clients willingly pay the premium because mobile grooming eliminates the stress of car rides,
            waiting rooms, and cage time. For anxious dogs, senior pets, and busy owners, the convenience
            is worth every dollar.
          </p>
          <div className="bg-green-50 p-5 rounded-lg border border-green-200 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">💰 Pricing Tip for Mobile Groomers</h3>
            <p className="text-green-700 text-sm">
              Set a minimum service fee of $50–$75 per visit. Even if a small dog's groom only takes
              45 minutes, the drive time, setup, and teardown mean you're spending 90+ minutes per stop.
              Your minimum fee protects your hourly rate. Tools like{' '}
              <Link href="/" className="underline font-semibold">GroomGrid</Link> help you enforce minimums
              automatically during online booking.
            </p>
          </div>
        </section>

        {/* Section: How to Set Your Prices */}
        <section id="how-to-set" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">
            How to Set Your Own Grooming Prices
          </h2>
          <p className="text-stone-600 mb-4">
            If you're a new groomer or re-evaluating your pricing, here's a practical framework:
          </p>
          <ol className="list-decimal list-inside space-y-4 text-stone-600 mb-6">
            <li>
              <strong>Calculate your target hourly rate.</strong> Most experienced groomers aim for
              $40–$70/hour after expenses. If you want to earn $60/hour and a standard groom takes
              1.5 hours, your base price should be $90 minimum.
            </li>
            <li>
              <strong>Add your overhead per appointment.</strong> Divide monthly overhead (rent, insurance,
              software, supplies) by your monthly appointment capacity. A $2,000/month overhead spread
              across 120 appointments = $16.67 per appointment.
            </li>
            <li>
              <strong>Research your local market.</strong> Call 5–10 nearby groomers and salons. Ask their
              prices for a standard golden retriever full groom. You'll quickly see the local range.
            </li>
            <li>
              <strong>Factor in your experience.</strong> New groomers typically charge 15–25% below market
              rate for the first year while building speed and a client base. Don't undervalue yourself
              long-term — raise prices every 6 months.
            </li>
            <li>
              <strong>Price by time, not by breed alone.</strong> A well-maintained poodle takes less time
              than a matted golden retriever. Use breed + condition + behavior as your pricing matrix.
            </li>
            <li>
              <strong>Use software to standardize pricing.</strong>{' '}
              <Link href="/" className="text-green-600 hover:underline font-semibold">
                GroomGrid
              </Link>{' '}
              lets you set breed-size pricing, add surcharges automatically, and present clear quotes
              to clients before they book — eliminating pricing surprises and awkward conversations.
            </li>
          </ol>
        </section>

        {/* Section: Common Mistakes */}
        <section id="common-mistakes" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">
            Common Pricing Mistakes New Groomers Make
          </h2>
          <div className="space-y-4 mb-6">
            <div className="flex gap-3">
              <span className="text-red-500 font-bold text-lg">✗</span>
              <div>
                <h3 className="font-semibold text-stone-900">Charging the same for every dog</h3>
                <p className="text-stone-600 text-sm">
                  A matted doodle takes 3x longer than a short-haired beagle. If you charge the same,
                  you're losing money on half your appointments. Use size tiers with condition surcharges.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-red-500 font-bold text-lg">✗</span>
              <div>
                <h3 className="font-semibold text-stone-900">Competing on price alone</h3>
                <p className="text-stone-600 text-sm">
                  Racing to the bottom doesn't work in grooming. Clients who choose the cheapest groomer
                  are also the most likely to no-show, haggle, and leave bad reviews. Compete on quality,
                  reliability, and convenience.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-red-500 font-bold text-lg">✗</span>
              <div>
                <h3 className="font-semibold text-stone-900">Not raising prices annually</h3>
                <p className="text-stone-600 text-sm">
                  Your costs go up every year. So should your prices. A 5–10% annual increase is standard
                  and most clients won't blink — especially if you communicate it clearly and continue
                  delivering great service.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-red-500 font-bold text-lg">✗</span>
              <div>
                <h3 className="font-semibold text-stone-900">Skipping deposits</h3>
                <p className="text-stone-600 text-sm">
                  No-shows cost mobile groomers $50–$100 in lost time and fuel. Requiring a deposit at
                  booking — even $20 — cuts no-shows by 60%+. Use automated payment collection to make
                  this frictionless.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: FAQ */}
        <section id="faq" className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            Frequently Asked Questions
          </h2>
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
          <h2 className="text-2xl font-bold text-stone-900 mb-3">
            Stop Guessing at Pricing
          </h2>
          <p className="text-stone-600 mb-6 max-w-lg mx-auto">
            GroomGrid helps you set, standardize, and enforce your pricing — automatically. Breed-based
            pricing, surcharges, deposits, and payment collection all built in.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Start Free Trial →
          </Link>
        </section>

        {/* Related Posts */}
        <section className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="text-lg font-bold text-stone-900 mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/blog/how-to-increase-sales-dog-grooming-business"
              className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors"
            >
              <h3 className="font-semibold text-stone-900 text-sm mb-1">How to Increase Sales in Your Dog Grooming Business</h3>
              <p className="text-stone-500 text-xs">8 strategies to grow revenue</p>
            </Link>
            <Link
              href="/blog/mobile-dog-grooming-business-tips"
              className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors"
            >
              <h3 className="font-semibold text-stone-900 text-sm mb-1">Mobile Dog Grooming Business Tips</h3>
              <p className="text-stone-500 text-xs">Run a tighter, more profitable operation</p>
            </Link>
            <Link
              href="/blog/is-dog-grooming-a-profitable-business"
              className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors"
            >
              <h3 className="font-semibold text-stone-900 text-sm mb-1">Is Dog Grooming a Profitable Business?</h3>
              <p className="text-stone-500 text-xs">Real numbers, real talk</p>
            </Link>
            <Link
              href="/blog/dog-grooming-software"
              className="block p-4 rounded-lg border border-stone-200 hover:border-green-300 transition-colors"
            >
              <h3 className="font-semibold text-stone-900 text-sm mb-1">Dog Grooming Software: The 2026 Buyer&apos;s Guide</h3>
              <p className="text-stone-500 text-xs">What to look for before you buy</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
