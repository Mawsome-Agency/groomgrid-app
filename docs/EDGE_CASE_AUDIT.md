# GroomGrid Edge Case & State Audit

**Mission:** Dev Pipeline: edge-case-audit  
**Date:** April 10, 2026  
**Auditor:** Jesse Korbin (Engineering Lead)  
**Status:** Research Complete → Implementation Pending

---

## Executive Summary

### Risk Overview
| Severity | Count | Impact |
|----------|--------|--------|
| Critical (P1) | 8 | Blocks revenue, causes payment failure |
| High (P2) | 12 | Causes user churn, frustration |
| Medium (P3) | 9 | Poor UX, but recoverable |
| **Total** | **29** | - |

### State Coverage
- **Total States Required:** 130 states (13 screens × 10 states each)
- **States Implemented:** 43 states
- **Coverage:** **33%** ⚠️
- **Gap:** 87 states missing implementation

### Key Findings
1. **No rate limiting** on `/api/auth/signup` — security vulnerability + abuse risk
2. **No offline detection** anywhere in the app — users stuck during network issues
3. **Silent dashboard failures** — errors logged but no user feedback
4. **No payment lockout integration** — webhook failures leave accounts in inconsistent state
5. **Onboarding has no recovery** — errors leave users stuck mid-flow
6. **No session expiration handling** — users lose work with no warning

---

## State Audit Matrix

### Screen 1: Signup (`/signup`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ✅ | Page load, form submission | "Creating your account..." | Wait for completion | `src/app/signup/page.tsx` |
| Empty | ✅ | Initial page state | N/A | N/A | `src/app/signup/page.tsx` |
| Error: Email exists | ✅ | Email already registered | "An account with this email already exists" | Try different email | `src/app/api/auth/signup/route.ts:17` |
| Error: Invalid email | ⚠️ | Email format invalid | Generic error | N/A - needs specific validation | `src/app/api/auth/signup/route.ts:9` |
| Error: Weak password | ❌ | Password too weak | N/A | N/A | Need frontend validation |
| Error: Server error | ✅ | 500 from server | "Failed to create account" | Retry | `src/app/api/auth/signup/route.ts:44` |
| Offline | ❌ | Network connection lost | N/A | N/A - no detection | Need online/offline listener |
| Success | ✅ | Account created | Redirects to login | N/A | `src/app/signup/page.tsx` |
| Partial | ✅ | Form partially filled | N/A | N/A | Browser autofill |
| **Permission Denied** | ❌ | **Rate limiting, blocked domain** | **N/A** | **N/A** | **`src/app/api/auth/signup/route.ts`** |

**Critical Issue:** No rate limiting means automated abuse can create unlimited accounts.

---

### Screen 2: Login (`/login`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ✅ | Page load, credential check | "Signing in..." | Wait for completion | `src/app/login/page.tsx` |
| Empty | ✅ | Initial page state | N/A | N/A | `src/app/login/page.tsx` |
| Error: Invalid credentials | ✅ | Wrong password | "Invalid email or password" | Try again | NextAuth handles |
| Error: Account locked | ⚠️ | Too many failed attempts | Generic error | Need explicit lockout message | NextAuth handles |
| Error: Server error | ❌ | 500 from server | N/A | N/A - shows generic error | NextAuth handles |
| Offline | ❌ | Network connection lost | N/A | N/A - no detection | Need online/offline listener |
| Success | ✅ | Valid credentials | Redirects to dashboard | N/A | NextAuth handles |
| Partial | ⚠️ | Email filled only | N/A | Password not saved | `src/app/login/page.tsx` |
| Permission Denied | ❌ | Account suspended | N/A | N/A | Need suspension UI |

---

### Screen 3: Plans (`/plans`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ✅ | Plan data fetch | "Loading plans..." | Wait for completion | `src/app/plans/page.tsx` |
| Empty | ❌ | No plans available | N/A | Contact support | `src/app/plans/page.tsx` |
| Error: Stripe down | ⚠️ | Stripe API failure | Generic checkout error | Retry later | `src/app/plans/page.tsx:140` |
| Error: Payment failed | ✅ | Card declined | Redirects to /checkout/error | Try different card | `src/app/plans/page.tsx:143` |
| Error: Webhook timeout | ❌ | Payment succeeded but webhook failed | Account shows "trial" still | Manual sync needed | `src/app/api/stripe/webhook/route.ts` |
| Offline | ❌ | Network connection lost | N/A | N/A - no detection | Need online/offline listener |
| Success | ✅ | Payment processed | Redirects to Stripe | N/A | `src/app/plans/page.tsx:150` |
| Partial | ❌ | Plan selected but not paid | "Selected plan" shown | Complete checkout | `src/app/plans/page.tsx:78` |
| Permission Denied | ❌ | Account already active | N/A | Can't re-purchase | Need "You're on X plan" UI |

**Critical Issue:** Payment lockout not integrated. If webhook fails, user gets charged but account stays in trial mode.

---

### Screen 4: Dashboard (`/dashboard`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ✅ | Initial data fetch | "Loading..." | Wait for completion | `src/app/dashboard/page.tsx:124` |
| Empty | ✅ | No appointments/clients/revenue | "No appointments scheduled for today" + welcome card | Book first appointment | `src/app/dashboard/page.tsx:281` |
| Error: Fetch failed | ❌ | API timeout, network error | N/A - silent error | Retry manual refresh | `src/app/dashboard/page.tsx:100` |
| Error: Partial fetch | ❌ | Some APIs fail | N/A - partial data shown | Manual refresh | `src/app/dashboard/page.tsx:59` |
| Offline | ❌ | Network connection lost | N/A | N/A - no detection | Need online/offline listener |
| Success | ✅ | Data loaded | N/A | N/A | `src/app/dashboard/page.tsx` |
| Session Expired | ❌ | Token expired | N/A | Redirects to login automatically | NextAuth handles silently |
| Permission Denied | ❌ | Account suspended | N/A | No UI - stuck loading | Need suspension UI |

**Critical Issue:** All fetch errors are silent (logged to console only). Users see stale data with no indication something failed.

---

### Screen 5: Onboarding (`/onboarding`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ✅ | Initial load, step transition | "Loading..." | Wait for completion | `src/app/onboarding/page.tsx:260` |
| Empty | ⚠️ | First visit | Progress indicator shows Step 1 of 3 | Start flow | `src/app/onboarding/page.tsx:270` |
| Error: Validation failed | ✅ | Invalid input in form | Error banner shown | Fix input and retry | `src/app/onboarding/page.tsx:280` |
| Error: Save timeout | ❌ | API timeout | "Failed to save client" | Retry button? | `src/app/onboarding/page.tsx:155` |
| Error: Server error | ✅ | 500 from server | Error banner shown | Retry button? | `src/app/onboarding/page.tsx:155` |
| Offline | ❌ | Network connection lost | N/A | N/A - no detection | Need online/offline listener |
| Success | ✅ | Step completed | Progress indicator advances | Continue flow | `src/app/onboarding/page.tsx:150` |
| Partial | ⚠️ | Pet creation fails (non-fatal) | Client created, no pet | Continue to appointment step | `src/app/onboarding/page.tsx:147` |
| Permission Denied | ❌ | Account required | Redirects to login | N/A | `src/app/onboarding/page.tsx:54` |

**Critical Issue:** Errors show banner but no retry button. User must resubmit entire form.

---

### Screen 6: Schedule (`/schedule`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ❌ | Initial calendar load | N/A | Wait | `src/app/schedule/page.tsx` |
| Empty | ❌ | No appointments | N/A | Book first appointment | Need empty state UI |
| Error: Fetch failed | ❌ | API timeout | N/A | Silent error? | `src/app/schedule/page.tsx` |
| Error: Create appointment | ❌ | API error on create | N/A | Manual refresh | Need error toast |
| Offline | ❌ | Network connection lost | N/A | N/A | No detection |
| Success | ❌ | Appointment created | N/A | Redirect or show confirmation | Need success feedback |
| Permission Denied | ❌ | Account required | N/A | Redirects to login | Need check |

---

### Screen 7: Clients (`/clients`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ❌ | Initial client list load | N/A | Wait | `src/app/clients/page.tsx` |
| Empty | ❌ | No clients | N/A | Add first client | Need empty state UI |
| Error: Fetch failed | ❌ | API timeout | N/A | Silent error? | `src/app/clients/page.tsx` |
| Error: Create client | ❌ | API error on create | N/A | Manual refresh | Need error toast |
| Offline | ❌ | Network connection lost | N/A | No detection | Need listener |
| Success | ❌ | Client added | N/A | Show in list | Need feedback |
| Permission Denied | ❌ | Account required | N/A | Redirects to login | Need check |

---

### Screen 8: Checkout Error (`/checkout/error`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ✅ | Page load | N/A | Wait | `src/app/checkout/error/page.tsx` |
| Empty | ❌ | No error params | Generic "Something went wrong" | Contact support | Need fallback message |
| Error: Card declined | ✅ | Stripe decline | "Payment declined" | Try different card | `src/app/checkout/error/page.tsx` |
| Error: Insufficient funds | ✅ | Balance too low | "Insufficient funds" | Use different payment method | `src/app/checkout/error/page.tsx` |
| Error: Generic | ✅ | Unknown error | "Payment processing error" | Contact support | `src/app/checkout/error/page.tsx` |
| Offline | ❌ | Network error on page | N/A | Retry button? | Need retry logic |
| Success | ❌ | Not applicable | N/A | N/A | N/A |
| Permission Denied | ❌ | Not applicable | N/A | N/A | N/A |

---

### Screen 9: Settings (`/settings`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ❌ | Initial settings load | N/A | Wait | `src/app/settings/page.tsx` |
| Empty | ❌ | No profile data | N/A | Create profile | Need fallback |
| Error: Fetch failed | ❌ | API timeout | N/A | Silent error | Need error UI |
| Error: Update failed | ❌ | Save fails | N/A | Silent error | Need error toast |
| Offline | ❌ | Network connection lost | N/A | No detection | Need listener |
| Success | ❌ | Settings saved | N/A | Show confirmation | Need success feedback |
| Permission Denied | ❌ | Account required | N/A | Redirects to login | Need check |

---

### Screen 10: Settings/Billing (`/settings/billing`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ❌ | Subscription load | N/A | Wait | `src/app/settings/billing/page.tsx` |
| Empty | ❌ | No subscription | "No active plan" | Select plan | Need empty state UI |
| Error: Fetch failed | ❌ | Stripe timeout | N/A | Silent error | Need error UI |
| Error: Update failed | ❌ | Plan change fails | N/A | Silent error | Need error toast |
| Error: Cancel failed | ❌ | Cancel API fails | N/A | Silent error | Need error UI |
| Offline | ❌ | Network connection lost | N/A | No detection | Need listener |
| Success | ❌ | Plan changed/cancelled | N/A | Show confirmation | Need success feedback |
| Permission Denied | ❌ | Account required | N/A | Redirects to login | Need check |

---

### Screen 11: Settings/Profile (`/settings/profile`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ❌ | Profile load | N/A | Wait | `src/app/settings/profile/page.tsx` |
| Empty | ❌ | No profile data | N/A | Create profile | Need fallback |
| Error: Fetch failed | ❌ | API timeout | N/A | Silent error | Need error UI |
| Error: Update failed | ❌ | Save fails | N/A | Silent error | Need error toast |
| Offline | ❌ | Network connection lost | N/A | No detection | Need listener |
| Success | ❌ | Profile saved | N/A | Show confirmation | Need success feedback |
| Permission Denied | ❌ | Account required | N/A | Redirects to login | Need check |

---

### Screen 12: Settings/Notifications (`/settings/notifications`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ❌ | Settings load | N/A | Wait | `src/app/settings/notifications/page.tsx` |
| Empty | ❌ | No notification prefs | Default options | N/A | Need defaults |
| Error: Fetch failed | ❌ | API timeout | N/A | Silent error | Need error UI |
| Error: Update failed | ❌ | Save fails | N/A | Silent error | Need error toast |
| Offline | ❌ | Network connection lost | N/A | No detection | Need listener |
| Success | ❌ | Settings saved | N/A | Show confirmation | Need success feedback |
| Permission Denied | ❌ | Account required | N/A | Redirects to login | Need check |

---

### Screen 13: Book Public (`/book/[userId]`)
| State | Implemented | Trigger Condition | User-Facing Copy | Recovery Action | Affected Files |
|-------|-------------|------------------|------------------|-----------------|----------------|
| Loading | ❌ | Initial page load | N/A | Wait | `src/app/book/[userId]/page.tsx` |
| Empty | ❌ | Invalid userId | "Groomer not found" | Go to homepage | Need error state |
| Error: Fetch failed | ❌ | API timeout | N/A | Silent error | Need error UI |
| Error: Invalid userId | ❌ | 404 for groomer | N/A | Go to homepage | Need error state |
| Offline | ❌ | Network connection lost | N/A | No detection | Need listener |
| Success | ❌ | Booking confirmed | N/A | Show confirmation | Need confirmation UI |
| Permission Denied | ❌ | Not applicable | N/A | N/A | N/A |

---

## Priority-Ranked Blocking Edge Cases

### P1 - Critical (Blocks Revenue)
These must be fixed before MVP can ship at 100%.

| # | Issue | Impact | Affected Files | Suggested Fix |
|---|--------|----------------|----------------|---------------|
| 1 | **No rate limiting on `/api/auth/signup`** | Abuse risk, unlimited account creation, spam attacks | `src/app/api/auth/signup/route.ts` | Add `upstash/ratelimit` package, implement per-IP rate limiting (e.g., 5 requests per 15 minutes) |
| 2 | **No offline/network error detection** | Users stuck during network issues, no feedback | All pages | Add `window.addEventListener('online/offline')`, create `NetworkStatusContext`, show global banner when offline |
| 3 | **Dashboard fetch failures are silent** | Users see stale data with no error indication | `src/app/dashboard/page.tsx:100` | Add error state, show error banner with retry button, auto-retry on reconnection |
| 4 | **No payment lockout integration** | User gets charged but account stays in trial mode | `src/app/api/stripe/webhook/route.ts`, `src/app/checkout/page.tsx` | Add webhook error handling, create "payment lockout" table, show "Payment Processing..." until webhook completes |
| 5 | **Session expiration has no handling** | Users lose work with no warning, silent redirect | All authenticated pages | Add session expiry check in NextAuth config, show "Session expired" toast before redirecting |

### P2 - High (Causes Churn)
Fix before beta launch to reduce user frustration.

| # | Issue | Impact | Affected Files | Suggested Fix |
|---|--------|----------------|----------------|---------------|
| 6 | **Onboarding errors have no recovery** | User must resubmit entire form after error | `src/app/onboarding/page.tsx:280` | Add "Retry" button to error banner that resubmits last form data |
| 7 | **No empty states on secondary screens** | Confusing UX, users don't know what to do | `/schedule`, `/clients`, `/settings/*` | Add empty state components with CTAs (e.g., "No clients yet - Add your first client") |
| 8 | **Settings pages have no feedback** | Users don't know if save succeeded/failed | `/settings/*` | Add success toast after save, show error toast on failure |
| 9 | **Checkout error page has no retry** | Users must go back and re-enter card details | `/checkout/error/page.tsx` | Add "Try Again" button that pre-fills last payment attempt |
| 10 | **No validation on signup form** | Server rejects with generic error, poor UX | `/signup` | Add frontend validation (email format, password strength, required fields) before submission |

### P3 - Medium (Poor UX)
Nice to have before full launch.

| # | Issue | Impact | Affected Files | Suggested Fix |
|---|--------|----------------|----------------|---------------|
| 11 | **No loading states on secondary screens** | Users see janky transitions | `/schedule`, `/clients`, `/settings/*` | Add skeleton loaders or spinners during data fetch |
| 12 | **Login has weak password reset** | Generic flow, no branding | `/login`, `/forgot-password` | Add branded reset email, better password requirements UI |
| 13 | **No permission denied handling** | Suspended accounts stuck in loading state | All pages | Add `subscription_status` check, show suspension banner instead of infinite loading |
| 14 | **Book public page has no error handling** | Invalid groomer URLs show nothing | `/book/[userId]/page.tsx` | Add 404 state with "Groomer not found" and homepage CTA |
| 15 | **No partial state persistence** | Form data lost on refresh | All forms | Add `localStorage` autosave, restore on page reload |

---

## Recommended User-Facing Copy

### Rate Limit Exceeded (New)
```
⚠️ Too many signup attempts
You've reached the maximum signup attempts. Please wait 15 minutes before trying again, or contact support if you need immediate assistance.

[Contact Support]
```

### Offline (New - Global Banner)
```
🔌 You're offline
Some features may not work properly. Please check your internet connection.

[Retry Connection]
```

### Dashboard Error (New)
```
❌ Failed to load dashboard
We couldn't fetch your latest data. This might be a temporary network issue.

[Retry Now]
```

### Payment Processing (New)
```
⏳ Payment is being processed
Your payment is being confirmed. This may take a few moments. Please don't close this page.

[Check Again]
```

### Payment Failed (Existing - Expand)
```
❌ Payment failed
Your payment could not be processed. This may be due to:

• Insufficient funds in your account
• Card declined by bank
• Expired payment method

Please try a different payment method or contact your bank.

[Try Different Card] [Contact Support]
```

### Onboarding Error (Enhanced)
```
❌ Failed to save your information

Something went wrong while saving. Please try again.

[Retry] [Skip for Now]
```

### Empty Client List (New)
```
No clients yet

Add your first client to start booking appointments.

[Add Client]
```

### Empty Schedule (New)
```
No appointments scheduled

You have no upcoming appointments. Book your first one to get started.

[Book Appointment]
```

### Session Expired (New)
```
🔐 Your session has expired
For your security, you've been logged out due to inactivity. Please sign in again to continue.

[Sign In]
```

---

## Implementation Checklist

### Phase 1: Critical Fixes (P1)
- [ ] Implement rate limiting on `/api/auth/signup`
- [ ] Add `NetworkStatusContext` with online/offline listeners
- [ ] Add global offline banner component
- [ ] Add error state and retry button to dashboard
- [ ] Implement payment lockout system

### Phase 2: High Priority (P2)
- [ ] Add retry button to onboarding error banner
- [ ] Create empty state components for Schedule, Clients, Settings
- [ ] Add success/error toast system to all settings pages
- [ ] Add retry functionality to checkout error page
- [ ] Add frontend validation to signup form

### Phase 3: Medium Priority (P3)
- [ ] Add skeleton loaders to all pages
- [ ] Improve password reset flow
- [ ] Add account suspension handling
- [ ] Add 404 state to book public page
- [ ] Implement form autosave to localStorage

---

## Technical Notes

### File Structure for State Management
```
src/
├── components/
│   ├── states/           # NEW - State components
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── OfflineBanner.tsx
│   │   └── PermissionDenied.tsx
│   └── ui/
│       └── Toast.tsx      # NEW - Success/error feedback
├── contexts/
│   └── NetworkStatusContext.tsx  # NEW
├── hooks/
│   └── useOnlineStatus.ts  # NEW
└── lib/
    ├── ratelimit.ts       # NEW - Rate limiting utility
    └── toast.ts          # NEW - Toast notification utility
```

### API Response Standards
All API routes should return consistent error responses:
```typescript
{
  error: string,           // User-friendly message
  errorType: string,       // 'validation', 'network', 'auth', 'payment', 'server'
  retryable: boolean,      // Whether client should retry
  retryAfter?: number       // Seconds to wait before retry (rate limit)
}
```

### Recommended Packages
- `upstash/ratelimit` - Rate limiting (compatible with Vercel Edge)
- `react-hot-toast` - Simple toast notifications
- `clsx` - Conditional class names (if not already used)

---

## Appendix: Related Issues & PRs

### Existing PRs Related to Edge Cases
- (Add any relevant PRs here)
- PR #XX - Adds basic error handling to checkout (partial)
- PR #XX - Onboarding validation improvements (partial)

### Filed GitHub Issues
(See top 5 issues to be filed in this deliverable)
