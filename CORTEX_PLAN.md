# CORTEX PLAN: Platform-Wide WCAG 2.1 Level AA Accessibility

## Audit Scope

This branch implements WCAG 2.1 Level AA conformance fixes across the GroomGrid Next.js app.
The audit focused on the most user-facing routes and shared components.

## WCAG Criteria Addressed

| Criterion | Name | Files Affected |
|-----------|------|----------------|
| 1.3.1 | Info and Relationships | All form pages (labels + inputs) |
| 2.4.1 | Bypass Blocks | layout.tsx (skip nav link) |
| 2.4.3 | Focus Order | BugReportModal (focus trap) |
| 2.4.7 | Focus Visible | globals.css (:focus-visible ring) |
| 4.1.2 | Name, Role, Value | NpsWidget, ThumbsWidget, BugReportModal, ProgressIndicator |
| 4.1.3 | Status Messages | BugReportModal, NpsWidget, ThumbsWidget (aria-live) |

## Files Changed

- `src/app/globals.css` — skip-link, sr-only, :focus-visible styles
- `src/app/layout.tsx` — skip-to-main link, sr-announcer live region, main landmark
- `src/app/login/page.tsx` — label/input id pairing, role="alert" on errors
- `src/app/signup/page.tsx` — label/input id pairing, role="alert" on errors
- `src/app/accessibility/page.tsx` — new accessibility statement page
- `src/components/feedback/BugReportModal.tsx` — dialog role, aria-modal, focus trap, aria-describedby
- `src/components/feedback/NpsWidget.tsx` — role="group", aria-pressed, label for textarea
- `src/components/feedback/FeatureRequestForm.tsx` — label/input ids, aria-invalid, role="alert"
- `src/components/feedback/ThumbsWidget.tsx` — role="group", aria-live on voted state
- `src/components/funnel/ProgressIndicator.tsx` — aria-current, role="progressbar", nav landmark

## Implementation Notes

- No new dependencies added.
- All changes follow existing code style and Tailwind conventions.
- TypeScript strict mode maintained throughout.
- The `<main id="main-content">` wrapper is added in layout.tsx so the skip link target is always present regardless of which page is rendered.
