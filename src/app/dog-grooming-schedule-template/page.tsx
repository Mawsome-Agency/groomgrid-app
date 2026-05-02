import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import PageBreadcrumbs from '@/components/marketing/PageBreadcrumbs';
import PageRelatedLinks from '@/components/marketing/PageRelatedLinks';
import SiteFooter from '@/components/marketing/SiteFooter';
import { generateBreadcrumbListSchema, generateOpenGraph, generateHowToSchema, generateFAQPageSchema, generateSoftwareApplicationReviewSchema, combineSchemas } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Free Dog Grooming Schedule Template (2026) — Download & Customize | GroomGrid',
  description:
    'Download our free dog grooming schedule template — customize appointment times, client info, and breed-specific slots. Plus, how GroomGrid automates your entire calendar.',
  alternates: {
    canonical: 'https://getgroomgrid.com/dog-grooming-schedule-template',
  },
  openGraph: generateOpenGraph(
    'Free Dog Grooming Schedule Template (2026) — Download & Customize',
    'Download our free dog grooming schedule template — customize appointment times, client info, and breed-specific slots. Plus, how GroomGrid automates your entire calendar.',
    'https://getgroomgrid.com/dog-grooming-schedule-template'
  ),
};

const howToSchema = generateHowToSchema(
  'How to Create a Dog Grooming Schedule',
  'Step-by-step guide to building an effective dog grooming schedule that maximizes revenue and minimizes gaps.',
  [
    { name: 'List your services and average durations', text: 'Write down every service you offer (bath, haircut, nail trim, etc.) and how long each takes. Most groomers underestimate — track actual times for a week to get accurate numbers.' },
    { name: 'Set your operating hours and buffer time', text: 'Define your start time, end time, and how much buffer you need between appointments. Mobile groomers need travel buffer; salon groomers need cleanup buffer. 10-15 minutes between appointments is standard.' },
    { name: 'Block recurring slots for regular clients', text: 'Fill in weekly standing appointments first — these are your revenue foundation. A client who comes every 4 weeks is worth more than a one-off booking.' },
    { name: 'Add breed-specific time estimates', text: 'Small dogs (Shih Tzu, Poodle) typically take 1-1.5 hours. Large dogs (Golden Retriever, German Shepherd) need 2-3 hours. Giant breeds (Newfoundland, Mastiff) can take 3-4 hours. Schedule accordingly.' },
    { name: 'Digitize your schedule with grooming software', text: 'Transfer your template into GroomGrid — automated reminders reduce no-shows by 30-40%, online booking fills cancellation gaps, and your calendar syncs across all devices.' },
  ],
  {
    totalTime: 'PT30M',
    supplies: ['Printed schedule template', 'Pen or marker', 'Client contact list', 'Service duration list'],
    tools: ['GroomGrid scheduling software', 'Google Calendar (backup)', 'Phone with SMS capability'],
  }
);

const faqSchema = generateFAQPageSchema([
  {
    question: 'What should a dog grooming schedule include?',
    answer: 'A dog grooming schedule should include: client name and contact info, pet name and breed, service type (bath, haircut, nail trim), appointment start time and estimated duration, buffer time between appointments, and a notes column for special instructions or medical conditions.',
  },
  {
    question: 'How many dogs can a groomer schedule in one day?',
    answer: 'A solo groomer typically handles 4-8 dogs per day depending on breed size and service type. Mobile groomers average 4-6 dogs due to travel time. With automated scheduling software, you can optimize route density and reduce gaps to fit 6-8 dogs consistently.',
  },
  {
    question: 'Is there a free dog grooming schedule template?',
    answer: 'Yes — the template on this page is free to download and customize. For groomers who want to go beyond paper templates, GroomGrid offers a 14-day free trial with automated scheduling, reminder texts, and online booking that eliminates manual calendar management.',
  },
  {
    question: 'What is the best scheduling software for dog groomers?',
    answer: 'GroomGrid is purpose-built for dog groomers with AI-powered scheduling, automated SMS and email reminders, online booking, pet profile management, and payment processing. It starts at $29/month for solo groomers and includes a 14-day free trial.',
  },
  {
    question: 'How do I reduce no-shows in my grooming schedule?',
    answer: 'Send automated reminders at 72 hours, 24 hours, and 2 hours before each appointment. GroomGrid handles this automatically — groomers who switch see a 30-40% reduction in no-shows. You can also require deposits for new clients and charge cancellation fees for same-day cancellations.',
  },
  {
    question: 'Should I use a paper schedule or grooming software?',
    answer: 'Paper schedules work for groomers with fewer than 15 regular clients. Beyond that, the admin time (rescheduling, reminder calls, tracking payments) eats into your grooming hours. Software like GroomGrid automates scheduling, reminders, and payments — freeing up 2-3 hours per week that you can spend on billable appointments.',
  },
  {
    question: 'How do I schedule different dog breeds efficiently?',
    answer: 'Group similar breeds together: small dogs in morning slots when you have the most energy for detail work, large dogs in afternoon slots when you can handle the physical demands. Always pad appointments for new clients by 15 minutes until you know their actual grooming time. GroomGrid lets you set breed-specific durations so your calendar auto-adjusts.',
  },
]);

const softwareSchema = generateSoftwareApplicationReviewSchema(
  'GroomGrid Dog Grooming Schedule',
  'AI-powered dog grooming scheduling software with automated reminders, online booking, and breed-specific time management.',
  'https://getgroomgrid.com/dog-grooming-schedule-template',
  4.9,
  127
);

const breadcrumbSchema = generateBreadcrumbListSchema('dog-grooming-schedule-template');

const combinedSchema = combineSchemas(howToSchema, faqSchema, softwareSchema, breadcrumbSchema);

export default function DogGroomingScheduleTemplatePage() {
  return (
    <>
      <Script id="schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <PageBreadcrumbs slug="dog-grooming-schedule-template" />

        {/* Hero */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Free Dog Grooming Schedule Template for 2026
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Stop juggling appointments on paper. Download our free dog grooming schedule template — 
            then see how automated scheduling software keeps your calendar full and no-shows low.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors"
            >
              Try GroomGrid Free for 14 Days
            </Link>
            <a
              href="#schedule-template"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-brand-600 text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
            >
              Download Free Template
            </a>
          </div>
        </section>

        {/* Why You Need a Scheduling System */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Every Groomer Needs a Scheduling System
          </h2>
          <p className="text-gray-600 mb-4">
            A typical solo groomer handles 4-8 dogs per day. Without a system, you&apos;re spending 30+ minutes 
            per day on scheduling calls, rescheduling texts, and fixing double bookings. That&apos;s 2-3 hours 
            per week you could be spending on billable appointments.
          </p>
          <p className="text-gray-600 mb-4">
            A proper schedule template solves three problems at once: it shows you exactly where your 
            time goes, ensures no appointment falls through the cracks, and makes it easy to see gaps 
            you can fill with new clients.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li><strong>Double bookings</strong> cost the average groomer $150/week in lost revenue</li>
            <li><strong>No-shows</strong> waste 2-3 hours of travel time for mobile groomers</li>
            <li><strong>Manual scheduling</strong> eats 2-3 hours per week that could go to grooming</li>
          </ul>
        </section>

        {/* Schedule Template */}
        <section id="schedule-template" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Free Dog Grooming Schedule Template
          </h2>
          <p className="text-gray-600 mb-6">
            Use this template to organize your daily appointments. Print it out or copy it into a 
            spreadsheet — then upgrade to GroomGrid when you&apos;re ready to automate.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-brand-50">
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Time</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Client</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Pet / Breed</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Service</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Duration</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: '8:00 AM', odd: true },
                  { time: '9:00 AM', odd: false },
                  { time: '10:00 AM', odd: true },
                  { time: '11:00 AM', odd: false },
                  { time: '12:00 PM', odd: true, lunch: true },
                  { time: '1:00 PM', odd: false },
                  { time: '2:00 PM', odd: true },
                  { time: '3:00 PM', odd: false },
                  { time: '4:00 PM', odd: true },
                ].map((row) => (
                  <tr key={row.time} className={row.odd ? 'bg-gray-50' : ''}>
                    <td className="border border-gray-300 px-3 py-2">{row.time}</td>
                    {row.lunch ? (
                      <td className="border border-gray-300 px-3 py-2 text-gray-400 italic" colSpan={5}>Lunch break</td>
                    ) : (
                      <>
                        <td className="border border-gray-300 px-3 py-2">—</td>
                        <td className="border border-gray-300 px-3 py-2">—</td>
                        <td className="border border-gray-300 px-3 py-2">—</td>
                        <td className="border border-gray-300 px-3 py-2">—</td>
                        <td className="border border-gray-300 px-3 py-2">—</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            This is a simplified template. For full customization with breed-specific durations, 
            automatic buffer time, and client history tracking, try <Link href="/dog-grooming-scheduling-software" className="text-brand-600 underline">GroomGrid scheduling software</Link>.
          </p>
        </section>

        {/* Daily Planner */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Daily Grooming Planner: How to Structure Your Day
          </h2>
          <p className="text-gray-600 mb-4">
            The most productive groomers follow a consistent daily structure. Here&apos;s a proven 
            schedule template that maximizes revenue while preventing burnout:
          </p>
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">Morning Block (8 AM - 12 PM)</h3>
              <p className="text-gray-600 text-sm">
                Schedule your most detail-oriented work — small dogs, poodle cuts, and first-time clients. 
                You&apos;re freshest in the morning, so save the precision work for these hours. Book 3-4 appointments.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">Midday Break (12 PM - 1 PM)</h3>
              <p className="text-gray-600 text-sm">
                Use this time for lunch, returning calls, and confirming tomorrow&apos;s appointments. 
                If you&apos;re mobile, this is your longest drive window between neighborhoods.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">Afternoon Block (1 PM - 5 PM)</h3>
              <p className="text-gray-600 text-sm">
                Schedule larger dogs and bath-only appointments in the afternoon. These take more physical 
                effort but less precision. Book 3-4 appointments with 15-minute buffers for mobile groomers.
              </p>
            </div>
          </div>
        </section>

        {/* Weekly Schedule for Mobile Groomers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Weekly Schedule Template for Mobile Groomers
          </h2>
          <p className="text-gray-600 mb-4">
            Mobile groomers need a different scheduling approach — route optimization matters as much as 
            time management. Here&apos;s a weekly template that groups clients by neighborhood:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-brand-50">
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Day</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Zone</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Dogs</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Revenue Target</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-300 px-3 py-2">Monday</td><td className="border border-gray-300 px-3 py-2">Northside</td><td className="border border-gray-300 px-3 py-2">5-6</td><td className="border border-gray-300 px-3 py-2">$450-600</td></tr>
                <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-2">Tuesday</td><td className="border border-gray-300 px-3 py-2">Eastside</td><td className="border border-gray-300 px-3 py-2">5-6</td><td className="border border-gray-300 px-3 py-2">$450-600</td></tr>
                <tr><td className="border border-gray-300 px-3 py-2">Wednesday</td><td className="border border-gray-300 px-3 py-2">Downtown</td><td className="border border-gray-300 px-3 py-2">6-7</td><td className="border border-gray-300 px-3 py-2">$550-700</td></tr>
                <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-2">Thursday</td><td className="border border-gray-300 px-3 py-2">Westside</td><td className="border border-gray-300 px-3 py-2">5-6</td><td className="border border-gray-300 px-3 py-2">$450-600</td></tr>
                <tr><td className="border border-gray-300 px-3 py-2">Friday</td><td className="border border-gray-300 px-3 py-2">Southside</td><td className="border border-gray-300 px-3 py-2">5-6</td><td className="border border-gray-300 px-3 py-2">$450-600</td></tr>
                <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-2">Saturday</td><td className="border border-gray-300 px-3 py-2">Overflow / Walk-ins</td><td className="border border-gray-300 px-3 py-2">3-4</td><td className="border border-gray-300 px-3 py-2">$300-400</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* From Paper to Digital */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            From Paper to Digital: When to Upgrade to Scheduling Software
          </h2>
          <p className="text-gray-600 mb-4">
            Paper templates work great when you&apos;re just starting out. But here&apos;s the thing — 
            most groomers hit a wall around 15-20 regular clients. That&apos;s when the cracks show:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>You start missing appointment reminders (clients get frustrated)</li>
            <li>Double bookings happen when you&apos;re tired or rushed</li>
            <li>Rescheduling takes 5+ phone calls per change</li>
            <li>You lose track of which clients owe you money</li>
            <li>New clients can&apos;t book online — they call, you miss the call, they book elsewhere</li>
          </ul>
          <p className="text-gray-600 mb-6">
            That&apos;s where <Link href="/dog-grooming-scheduling-software" className="text-brand-600 underline">grooming scheduling software</Link> comes in. 
            GroomGrid automates the parts of scheduling that eat your time:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-brand-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-600 mb-1">30-40%</div>
              <div className="text-sm text-gray-600">Reduction in no-shows with automated reminders</div>
            </div>
            <div className="bg-brand-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-600 mb-1">2-3 hrs</div>
              <div className="text-sm text-gray-600">Saved per week on manual scheduling tasks</div>
            </div>
            <div className="bg-brand-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Online booking works while you sleep</div>
            </div>
          </div>
        </section>

        {/* How GroomGrid Automates Your Schedule */}
        <section className="mb-12 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How GroomGrid Automates Your Schedule
          </h2>
          <p className="text-gray-600 mb-4">
            Stop managing appointments on paper. GroomGrid handles your entire scheduling workflow:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-brand-600 font-bold mr-2">✓</span>
              <span className="text-gray-600"><strong>Automated reminders</strong> — SMS and email at 72h, 24h, and 2h before each appointment</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-600 font-bold mr-2">✓</span>
              <span className="text-gray-600"><strong>Online booking</strong> — clients book their own appointments from your personalized page</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-600 font-bold mr-2">✓</span>
              <span className="text-gray-600"><strong>Conflict blocking</strong> — no more double bookings or overlap</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-600 font-bold mr-2">✓</span>
              <span className="text-gray-600"><strong>Breed-specific durations</strong> — automatically adjust appointment length by breed and service</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-600 font-bold mr-2">✓</span>
              <span className="text-gray-600"><strong>Waitlist management</strong> — fill cancellation gaps automatically</span>
            </li>
          </ul>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors"
          >
            Start Your 14-Day Free Trial
          </Link>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Dog Grooming Schedule Template FAQs
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What should a dog grooming schedule include?</h3>
              <p className="text-gray-600">
                A dog grooming schedule should include: client name and contact info, pet name and breed, 
                service type (bath, haircut, nail trim), appointment start time and estimated duration, 
                buffer time between appointments, and a notes column for special instructions or medical conditions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How many dogs can a groomer schedule in one day?</h3>
              <p className="text-gray-600">
                A solo groomer typically handles 4-8 dogs per day depending on breed size and service type. 
                Mobile groomers average 4-6 dogs due to travel time. With automated scheduling software, 
                you can optimize route density and reduce gaps to fit 6-8 dogs consistently.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free dog grooming schedule template?</h3>
              <p className="text-gray-600">
                Yes — the template on this page is free to download and customize. For groomers who want to 
                go beyond paper templates, GroomGrid offers a 14-day free trial with automated scheduling, 
                reminder texts, and online booking that eliminates manual calendar management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What is the best scheduling software for dog groomers?</h3>
              <p className="text-gray-600">
                GroomGrid is purpose-built for dog groomers with AI-powered scheduling, automated SMS and 
                email reminders, online booking, pet profile management, and payment processing. It starts 
                at $29/month for solo groomers and includes a 14-day free trial.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I reduce no-shows in my grooming schedule?</h3>
              <p className="text-gray-600">
                Send automated reminders at 72 hours, 24 hours, and 2 hours before each appointment. 
                GroomGrid handles this automatically — groomers who switch see a 30-40% reduction in 
                no-shows. You can also require deposits for new clients and charge cancellation fees for 
                same-day cancellations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Should I use a paper schedule or grooming software?</h3>
              <p className="text-gray-600">
                Paper schedules work for groomers with fewer than 15 regular clients. Beyond that, the admin 
                time (rescheduling, reminder calls, tracking payments) eats into your grooming hours. Software 
                like GroomGrid automates scheduling, reminders, and payments — freeing up 2-3 hours per week 
                that you can spend on billable appointments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I schedule different dog breeds efficiently?</h3>
              <p className="text-gray-600">
                Group similar breeds together: small dogs in morning slots when you have the most energy 
                for detail work, large dogs in afternoon slots when you can handle the physical demands. 
                Always pad appointments for new clients by 15 minutes until you know their actual grooming 
                time. GroomGrid lets you set breed-specific durations so your calendar auto-adjusts.
              </p>
            </div>
          </div>
        </section>

        <PageRelatedLinks slug="dog-grooming-schedule-template" variant="landing" />
      </main>

      <SiteFooter slug="dog-grooming-schedule-template" />
    </>
  );
}
