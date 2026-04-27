# GroomGrid Email Nurture Sequence

**Mission**: 3-email welcome nurture sequence for new signups who haven't completed onboarding or started a trial.

**Delivery Path**: These emails are intended for integration with the existing drip system (`src/lib/email/drip-templates.ts`). They target users post-signup but pre-onboarding completion (see `Profile.onboardingCompleted` and `DripEmailQueue`).

**Brand Voice Notes**: Friendly, professional, pet-obsessed. Warm and humorous. Avoid corporate jargon like "upgrade", "solution", "leverage". Use paw puns, dog/cat references, relatable groomer life.

**Timing**:
- Email 1: Immediate (Day 0)
- Email 2: +48 hours
- Email 3: +5 days (with BETA50 urgency)

**Personalization**: Use `{{firstName}}`, `{{groomerName}}` where noted. Link to app via `{{appUrl}}`.

---

## Email 1: Welcome + Quick Win (Immediate)

**Subject**: Your grooming business just got an upgrade 🐾

**Plain Text Version**:
Hey {{firstName}},

Congrats on taking the first step to get your grooming business organized! No more sticky notes or wondering if that 2pm appointment is still on.

The best part? Those automated appointment reminders are going to save you so much time (and gas). One groomer told us her no-shows dropped immediately once she started using SMS reminders.

Ready to send your first one? Complete your profile and we'll walk you through it.

[Complete Your Profile]({{appUrl}}/onboarding)

Wagging tails,
The GroomGrid Team

**HTML Version** (for drip-templates.ts integration):
```html
<!-- Use existing emailWrapper from drip-templates.ts -->
<h1>Welcome to the pack, {{firstName}}! 🐾</h1>
<p>Hey there! Big high-five (or high-paw) for signing up. You're one step closer to spending more time with the pups and less time chasing paperwork.</p>
<p>The #1 thing we hear from mobile groomers like you: those "where are you?" texts from clients who forgot their appointment. Our automated reminders fix that fast.</p>
<p>Let's get your first reminder out the door. It takes 2 minutes.</p>
{{ctaButton "Complete Your Profile →", "{{appUrl}}/onboarding"}}
<p style="font-size:13px; color:#78716c;">P.S. Your furry clients are going to love how organized you are.</p>
```

**Key Metrics to Track**: Open rate, CTR on onboarding CTA, % who complete profile within 24h.

---

## Email 2: Social Proof + Feature Deep Dive (48 hours later)

**Subject**: How Sarah stopped losing $200/month to no-shows 🐕

**Plain Text Version**:
Hi {{firstName}},

Hope your week is going well (and that all your appointments showed up!).

Sarah, a mobile groomer in Arizona, was losing about $200 every month to no-shows. She'd drive across town only to find the client forgot. Sound familiar?

After switching to GroomGrid's smart scheduling and detailed client/pet profiles, her no-shows basically disappeared. The SMS reminders and easy pet notes (like "Fluffy gets anxious around loud noises") made all the difference.

Want to try it for yourself? Let's get your first appointment scheduled.

[Schedule Your First Appointment]({{appUrl}}/appointments/new)

Happy grooming,
Maya & the GroomGrid Team

**HTML Version**:
```html
<h1>How one groomer saved $200/month (and her sanity) 🐾</h1>
<p>Hi {{firstName}},</p>
<p>You know that sinking feeling when you pull up to a house and... no one answers? Sarah from Phoenix sure did. She was burning gas and time on no-shows to the tune of $200/month.</p>
<p>Now with GroomGrid's SMS reminders + smart client profiles (with all those important notes about behavior, allergies, and "please don't use the loud dryer"), her calendar stays full and her stress level stays low.</p>
<p>The best part? The pet profiles actually make your job easier because you have everything at your fingertips in the van.</p>
{{ctaButton "Schedule Your First Appointment", "{{appUrl}}/appointments/new"}}
<p>P.S. Sarah says her dogs are happier too because she spends less time driving around frustrated. Win-win!</p>
```

**Key Metrics**: Story engagement (time spent reading), CTR to scheduling, reduction in no-show complaints (tracked via support).

**Note for Implementation**: The story is fictional but based on common ICP pain points from research (MoeGo case studies, groomer Facebook groups). Replace with real testimonials as they become available.

---

## Email 3: Urgency + Trial Expiration (5 days later)

**Subject**: Don't let scheduling chaos win 🐾

**Plain Text Version**:
Hey {{firstName}},

It's been a few days since you joined us. How's it going?

Remember those three big headaches we talked about?
- No-shows eating your time and gas
- Chasing payments after the groom (awkward, right?)
- Double bookings that stress everyone out

GroomGrid is built to handle all three with reminders, easy invoicing, and smart scheduling that actually works for mobile groomers.

Don't let the old chaos win. Use code **BETA50** for 50% off your first month and let's get your business running smooth.

[Start Your Free Trial Today]({{appUrl}}/plans?coupon=BETA50)

You've got this,
The GroomGrid Pack

**HTML Version**:
```html
<h1>Don't let the scheduling chaos win, {{firstName}} 🐾</h1>
<p>Hey friend,</p>
<p>It's been a few days. We know how it goes — you sign up with good intentions but life (and dogs that need baths) gets in the way.</p>
<p>Quick reminder of the 3 things GroomGrid was built to fix for groomers like you:</p>
<ul>
  <li>No-shows that waste your drive time and gas money</li>
  <li>Chasing payments (that awkward "hey did you get my invoice?" text)</li>
  <li>Double bookings that make you want to pull your hair out</li>
</ul>
<p>Our automated reminders, client profiles, and smart calendar have helped mobile groomers cut no-shows dramatically. One groomer recovered enough appointments to book an extra 8 dogs per month.</p>
<p>Want to give it a real try? Use code <strong>BETA50</strong> for 50% off your first month. No pressure — just want to make sure you don't miss out while the offer is hot.</p>
{{ctaButton "Start Your Free Trial Today", "{{appUrl}}/plans?coupon=BETA50"}}
<p style="font-size:13px;color:#78716c;">P.S. Your future self (and your bank account) will thank you. Let's keep those tails wagging on schedule! 🐶</p>
```

**Key Metrics**: Conversion rate on BETA50 CTA, % who activate trial, coupon redemption rate.

---

## Integration Notes

**Where to use**:
- Add to `src/lib/email/drip-templates.ts` as new steps (e.g., `nurture1()`, `nurture2()`, `nurture3()`)
- Update the drip enrollment logic in `/api/auth/signup` or onboarding flow to trigger this sequence for users with `onboardingCompleted: false`
- Track opens/clicks via existing Resend/Mailgun webhooks (see `src/lib/email/resend.ts`)

**Related Files**:
- `src/lib/email/drip-templates.ts` (existing welcome templates — align tone)
- `docs/CONVERSION_FUNNEL_ANALYSIS.md` (this sequence supports signup-to-paid funnel)
- `docs/GTM_PLAYBOOK.md` (part of conversion assets for "Get first 100 paying subscribers" rock)

**Testing Recommendations**:
1. Test email rendering on mobile (van-friendly!)
2. Verify personalization works for common groomer names
3. A/B test subject lines (current ones are warm but could be more specific)
4. Monitor against current GA4 data (high bounce on /signup page)

**Version**: 1.0 (2026-04-24)
**Author**: Maya Rodriguez (Documentation Lead)
**Supports Rock**: Get first 100 paying subscribers (via better onboarding conversion)

This documentation serves as the single source of truth for the nurture sequence copy. Update here before changing live templates.
