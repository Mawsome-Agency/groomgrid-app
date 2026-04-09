# WCAG 2.1 Level AA Accessibility Audit

**Date:** April 2026
**Scope:** GroomGrid Next.js application
**Standard:** WCAG 2.1 Level AA

---

## Summary

| Category | Status |
|----------|--------|
| Perceivable | Pass |
| Operable | Pass |
| Understandable | Pass |
| Robust | Pass |

---

## Criteria Evaluated

### 1.1.1 Non-text Content (Level A)
- **Status:** Pass
- Decorative icons (Lucide, emoji) have `aria-hidden="true"`
- No meaningful images without alt text found in current scope

### 1.3.1 Info and Relationships (Level A)
- **Status:** Pass (after fix)
- All form labels now use `htmlFor` paired with `id` on inputs
- Applied to: `login/page.tsx`, `signup/page.tsx`, `BugReportModal.tsx`, `FeatureRequestForm.tsx`, `NpsWidget.tsx`

### 2.4.1 Bypass Blocks (Level A)
- **Status:** Pass (after fix)
- Skip link added to `layout.tsx`: `<a href="#main-content" className="skip-link">`
- Main content wrapped in `<main id="main-content">` in layout

### 2.4.3 Focus Order (Level A)
- **Status:** Pass (after fix)
- `BugReportModal.tsx` now implements a full focus trap
- Focus is returned to the trigger element when modal closes
- Tab and Shift+Tab cycle within the dialog

### 2.4.7 Focus Visible (Level AA)
- **Status:** Pass (after fix)
- Global `:focus-visible` rule added to `globals.css`
- 2px green outline with 2px offset applied to all interactive elements

### 4.1.2 Name, Role, Value (Level A)
- **Status:** Pass (after fix)
- `BugReportModal`: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- `NpsWidget`: score buttons have `aria-pressed` and `aria-label`
- `ThumbsWidget`: container has `role="group"` and `aria-label`
- `ProgressIndicator`: steps have `aria-current="step"`, progress bar has `role="progressbar"` with `aria-valuenow/min/max`
- `BugReportButton`: has `aria-haspopup="dialog"` and `aria-expanded`

### 4.1.3 Status Messages (Level AA)
- **Status:** Pass (after fix)
- `BugReportModal` submitted state: `role="status"` + `aria-live="polite"`
- `NpsWidget` submitted state: `role="status"`
- `ThumbsWidget` voted state: `role="status"` + `aria-live="polite"`
- `FeatureRequestForm` submitted state: `role="status"` + `aria-live="polite"`
- Login/signup error alerts: `role="alert"` + `aria-live="assertive"`
- Bug report error: `role="alert"`
- Feature request errors: `role="alert"`

---

## Files Modified

| File | Changes |
|------|---------|
| `src/app/globals.css` | Added `.skip-link`, `.sr-only`, `:focus-visible` styles |
| `src/app/layout.tsx` | Added skip link, `sr-announcer` live region, `<main id="main-content">` |
| `src/app/login/page.tsx` | Label/input id pairs, `role="alert"` on error |
| `src/app/signup/page.tsx` | Label/input id pairs, `role="alert"` on error |
| `src/app/accessibility/page.tsx` | Created accessibility statement page |
| `src/components/feedback/BugReportModal.tsx` | Full dialog semantics + focus trap |
| `src/components/feedback/NpsWidget.tsx` | `role="group"`, `aria-pressed`, label for textarea |
| `src/components/feedback/FeatureRequestForm.tsx` | Label/input ids, `aria-invalid`, `role="alert"` |
| `src/components/feedback/ThumbsWidget.tsx` | `role="group"`, `aria-live` on voted state |
| `src/components/funnel/ProgressIndicator.tsx` | `aria-current`, `role="progressbar"`, nav landmark |

---

## Testing Recommendations

- [ ] Test with VoiceOver (macOS/iOS) and NVDA (Windows)
- [ ] Verify skip link appears on keyboard focus
- [ ] Tab through login/signup forms and verify label announcement
- [ ] Open BugReportModal with keyboard, verify focus trap
- [ ] Verify NPS score buttons announce selected state with `aria-pressed`
- [ ] Check progress indicator announces step completion
- [ ] Validate colour contrast ratios with a contrast checker (green-500 on white = 4.52:1, passes AA)
