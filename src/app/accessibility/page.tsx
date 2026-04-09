import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accessibility Statement | GroomGrid',
  description: 'GroomGrid accessibility statement and WCAG 2.1 Level AA conformance information.',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-100 p-8 md:p-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Accessibility Statement</h1>
        <p className="text-stone-500 text-sm mb-8">Last updated: April 2026</p>

        <section aria-labelledby="commitment-heading" className="mb-8">
          <h2 id="commitment-heading" className="text-xl font-semibold text-stone-800 mb-3">
            Our Commitment
          </h2>
          <p className="text-stone-600 leading-relaxed">
            GroomGrid is committed to ensuring digital accessibility for people with disabilities.
            We continually improve the user experience for everyone and apply relevant accessibility
            standards.
          </p>
        </section>

        <section aria-labelledby="conformance-heading" className="mb-8">
          <h2 id="conformance-heading" className="text-xl font-semibold text-stone-800 mb-3">
            Conformance Status
          </h2>
          <p className="text-stone-600 leading-relaxed">
            GroomGrid aims to conform to the{' '}
            <a
              href="https://www.w3.org/TR/WCAG21/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:underline"
            >
              Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
            </a>
            . These guidelines explain how to make web content more accessible to people with
            disabilities.
          </p>
        </section>

        <section aria-labelledby="measures-heading" className="mb-8">
          <h2 id="measures-heading" className="text-xl font-semibold text-stone-800 mb-3">
            Measures Taken
          </h2>
          <ul className="list-disc list-inside space-y-2 text-stone-600">
            <li>Skip navigation link to bypass repetitive content (WCAG 2.4.1)</li>
            <li>All form inputs have associated labels (WCAG 1.3.1)</li>
            <li>Error messages are announced to screen readers (WCAG 4.1.3)</li>
            <li>Modal dialogs trap focus and return it on close (WCAG 2.4.3)</li>
            <li>Interactive elements have visible focus indicators (WCAG 2.4.7)</li>
            <li>Progress indicators expose current step to assistive technology (WCAG 4.1.2)</li>
            <li>Status messages use ARIA live regions (WCAG 4.1.3)</li>
            <li>Decorative icons are hidden from screen readers (WCAG 1.1.1)</li>
          </ul>
        </section>

        <section aria-labelledby="known-heading" className="mb-8">
          <h2 id="known-heading" className="text-xl font-semibold text-stone-800 mb-3">
            Known Limitations
          </h2>
          <p className="text-stone-600 leading-relaxed">
            We are actively working to resolve any remaining accessibility issues. If you encounter
            a barrier, please contact us so we can address it promptly.
          </p>
        </section>

        <section aria-labelledby="contact-heading" className="mb-8">
          <h2 id="contact-heading" className="text-xl font-semibold text-stone-800 mb-3">
            Contact Us
          </h2>
          <p className="text-stone-600 leading-relaxed">
            If you experience accessibility barriers on GroomGrid, please let us know using the
            bug report button in the app or reach out directly. We aim to respond within 2 business
            days.
          </p>
        </section>

        <div className="border-t border-stone-100 pt-6">
          <Link href="/" className="text-sm text-green-700 hover:underline">
            &larr; Back to GroomGrid
          </Link>
        </div>
      </div>
    </div>
  );
}
