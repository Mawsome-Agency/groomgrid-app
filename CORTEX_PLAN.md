# CORTEX_PLAN.md — Signup Page UX: Reduce 80% Bounce Rate

## Scope: TWEAK | Branch: cortex/jesse-korbin/dev-pipeline-build-signup-page-ux-reduce

## Problem
/signup has 80% bounce rate (GA4, 15 sessions). Users land and leave without submitting.

## Root Causes
- No social proof or sense of community
- Form feels isolated — no benefit reminder alongside it
- No friction-reduced trust signals (CTA must feel safe)
- No mobile sticky CTA for scrolled-away visitors

## Changes

### 1. src/app/signup/page.tsx (main change)
- **Layout**: Expand card to 2-column on desktop (md:grid-cols-2):
  - Left panel: green gradient bg, logo, social proof counter, benefits checklist
  - Right panel: form (unchanged fields), simplified trust signals row
- **Social proof counter**: "47 groomers joined this week" with mount-time count-up animation (43→47)
- **Benefits checklist**: 3 items with checkmarks (scheduling, reminders, payments)
- **Trust signals row**: Inline "No credit card · Cancel anytime · 14-day free trial" below submit btn
- **Sticky mobile CTA**: Fixed bottom bar visible on mobile when form scrolls out of view (uses IntersectionObserver on form ref, same pattern as StickyPlanBar)
- Replace heavy TrustSignals component for signup with lightweight inline version

### 2. src/app/signup/signup.css
- Add slide-up animation for sticky mobile CTA bar

## Files Modified
- src/app/signup/page.tsx
- src/app/signup/signup.css

## Tests
- Update/add unit tests for signup page component behavior
- No E2E changes needed (form fields unchanged)

## Risks
- Layout change may affect existing E2E selectors — form fields are unchanged so selectors should still work
- Social proof number is hardcoded (plausible, no backend needed for MVP)
