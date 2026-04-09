# Accessibility Statement — GroomGrid

**Last updated:** April 2026  
**Product:** GroomGrid — AI-powered pet grooming business management platform  
**URL:** https://getgroomgrid.com

---

## Our Commitment

GroomGrid is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.

## Conformance Status

GroomGrid aims to meet [WCAG 2.1 Level AA](https://www.w3.org/TR/WCAG21/) conformance.

**Current status:** Partially conformant — some parts of the content do not fully conform to the accessibility standards, as described below.

### What We've Fixed (April 2026)

- Added skip navigation link on all pages ("Skip to main content")
- Form fields now properly associated with labels using `htmlFor`/`id`
- Error messages announced to screen readers via ARIA live regions
- Plan selection cards are now keyboard-accessible buttons
- Loading states and async validation announced via `aria-busy` / `aria-live`
- Decorative icons marked with `aria-hidden` to reduce noise for screen reader users
- `<figure>`, `<blockquote>`, and `<figcaption>` used for testimonials
- Progress indicator uses `role="progressbar"` with numeric value attributes
- Added `focus-visible` CSS for clearer keyboard navigation
- Improved heading hierarchy on all funnel pages

### Known Limitations

We are aware of the following accessibility issues and are actively working to address them:

1. **Color contrast** — The primary green button (`bg-green-500` with white text) does not meet the 4.5:1 minimum contrast ratio for normal-sized text. We plan to update this to `bg-green-600` in the next release.

2. **Toggle switches** — Notification preference toggles (Settings → Notifications) currently use custom divs without keyboard support or ARIA switch role. This is scheduled for the next release.

3. **Mobile menu** — The hamburger menu button is missing `aria-expanded` and `aria-controls` attributes.

4. **Modal dialogs** — Feedback modals (bug report, feature request) lack `role="dialog"`, `aria-modal`, and focus trapping.

5. **Calendar view** — The scheduling calendar grid does not use proper ARIA grid roles (`role="grid"`, `role="gridcell"`).

6. **Placeholder text contrast** — Input placeholder text does not meet minimum contrast requirements (placeholder text is exempt from WCAG under most interpretations, but we aim to improve it).

## Technical Specifications

GroomGrid is built with:
- **React / Next.js 14** (App Router)
- **HTML5** semantic markup
- **Tailwind CSS** for styling
- ARIA attributes for dynamic content

We test with:
- **Keyboard-only navigation** (Chrome, Firefox)
- **Chrome DevTools Accessibility Inspector**
- **axe DevTools** browser extension
- **WAVE** (Web Accessibility Evaluation Tool)

## Feedback

We welcome feedback on the accessibility of GroomGrid. If you experience accessibility barriers, please contact us:

- **Email:** accessibility@getgroomgrid.com (or support@getgroomgrid.com)
- **Response time:** We aim to respond within 2 business days.

## Formal Complaints

If you are not satisfied with our response, you may contact your national accessibility enforcement authority.

---

*This accessibility statement was created following [W3C WAI's accessibility statement generator](https://www.w3.org/WAI/planning/statements/). Assessment approach: self-evaluation.*
