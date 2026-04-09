# Implementation Plan

## Feature: Accessibility fixes for signup-to-paid conversion flow
Scope: BUGFIX/TWEAK | Branch: cortex/accessibility-signup-plans-fix

## Overview
Fix 6 accessibility issues identified in audit: PlanCard keyboard accessibility, error message linking, skip link, focus indicators, decorative icons, and focus order.

## Current State Analysis
- PlanCard.tsx: Outer div is clickable but not keyboard-accessible (no role, tabIndex, onKeyDown)
- Signup/login pages: Error messages lack aria-describedby linkage to inputs
- Layout.tsx: Skip link exists but uses custom CSS pattern instead of sr-only
- globals.css: Focus indicator styling exists but needs verification
- Decorative icons: Partial aria-hidden coverage across files

## Required Changes

### 1. CRITICAL: PlanCard keyboard accessibility
File: `src/components/funnel/PlanCard.tsx`
- Add role="button" to outer div (line 38)
- Add tabIndex={0} to outer div
- Add onKeyDown handler for Enter and Space keys
- Add aria-pressed={selected} for ARIA button state

### 2. CRITICAL: Error messages linked to inputs
Files: `src/app/signup/page.tsx`, `src/app/login/page.tsx`
- Add id attribute to error message containers
- Add aria-describedby on inputs pointing to error container IDs
- Verify aria-invalid is already set (signup has it on lines 160, 193)
- Verify role="alert" and aria-live on error containers (signup has it on line 136)

Note: settings/profile page doesn't exist yet - skip this part.

### 3. HIGH: Skip link (refine existing implementation)
File: `src/app/layout.tsx` and `src/app/globals.css`
- Current skip link uses `.skip-link:focus { top: 0; }` pattern
- Update to use sr-only focus:not-sr-only pattern for better accessibility
- Verify main element has id="main-content" (already exists on line 55)

### 4. HIGH: Focus indicator styling
File: `src/app/globals.css`
- Current focus-visible uses 2px solid green (#16a34a) with 2px offset
- Verify contrast ratio meets WCAG AA (4.5:1) - green on white should pass
- Ensure focus ring is applied to all interactive elements via :focus-visible

### 5. MEDIUM: Decorative icons with aria-hidden
Files: `src/components/funnel/PlanCard.tsx`, `src/app/signup/page.tsx`, `src/app/login/page.tsx`, `src/app/plans/page.tsx`
- Add aria-hidden="true" to all lucide-react icons that are purely decorative
- Icons already have some aria-hidden (signup: 127, 137, 146, 178, 215; login: 63, 75, 100, 121)
- Need to add to remaining decorative icons in all 4 files

### 6. MEDIUM: Focus order on plans page
File: `src/app/plans/page.tsx` and `src/components/funnel/PlanCard.tsx`
- Fix #1 (PlanCard keyboard accessibility) should resolve this automatically
- Verify tab order flows through all plan cards

## Testing Plan
1. Verify keyboard-only navigation works through signup → plans → checkout flow
2. Verify screen reader announces errors correctly with aria-describedby
3. Verify skip link appears on focus and jumps to main content
4. Verify focus indicators visible and meet contrast requirements
5. Verify all decorative icons have aria-hidden="true"
6. Verify PlanCard can be activated with Enter/Space keys

## Files to Modify
1. src/components/funnel/PlanCard.tsx - Keyboard accessibility, aria-hidden on icons
2. src/app/signup/page.tsx - Error message aria-describedby, aria-hidden on remaining icons
3. src/app/login/page.tsx - Error message aria-describedby, aria-hidden on remaining icons
4. src/app/plans/page.tsx - aria-hidden on remaining icons
5. src/app/layout.tsx - Update skip link implementation
6. src/app/globals.css - Update skip link CSS pattern

## Risks
- Low risk - all changes are accessibility enhancements
- No backend or database changes required
- No breaking UI changes expected

## Success Criteria
- PlanCard is keyboard-accessible (role="button", tabIndex, onKeyDown, aria-pressed)
- Error messages have proper aria-describedby linkage
- Skip link uses sr-only focus:not-sr-only pattern
- All focus indicators meet WCAG AA contrast
- All decorative icons have aria-hidden="true"
- Focus order works correctly through entire signup-to-plans flow
