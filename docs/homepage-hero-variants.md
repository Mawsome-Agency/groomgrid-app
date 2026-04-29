# Homepage Hero Copy A/B Test Variants

**Current**: Variant A (live)
**Purpose**: Reduce 85% homepage bounce rate
**Created by**: Elena Yazzie  
**Date**: 2026-04-29  

---

## Variant A (CURRENT — live on production)

**Eyebrow**: For solo mobile groomers
**H1**: No-shows cost you $200+/mo. GroomGrid fixes that.
**Subheadline**: Automated reminders, booking, and payments — built for groomers working out of a van.
**CTA**: Try It Free — 14 Days
**Supporting**: $29/mo after · Cancel anytime · No credit card
**Trust signal**: ✓ Setup in 5 min · ✓ Works on your phone · ✓ No credit card needed

**Issues**: 
- "No-shows cost $200+/mo" is specific but assumes they know this stat
- Doesn't convey the full value prop (just one pain point)
- Mobile-first but doesn't say "mobile" in the headline

---

## Variant B — Pain-Agitate-Solve (targets overwhelmed groomer)

**Eyebrow**: Built for mobile groomers like you
**H1**: You didn't start grooming to do admin all night.
**Subheadline**: Appointments, reminders, payments, and pet profiles — all handled. So you can focus on the dogs.
**CTA**: Start Your Free Trial
**Supporting**: Free for 14 days · No credit card · $29/mo after
**Trust signal**: ✓ 5-min setup · ✓ Works in your van · ✓ Groomers save 10+ hrs/week

**Why this works**:
- Leads with empathy — "you didn't start grooming to do admin" validates their frustration
- "All handled" = comprehensive solution, not just reminders
- "Focus on the dogs" = emotional payoff
- "10+ hrs/week" is specific and compelling

**Target persona**: Burnout-Prone Solo Salonist / Newbie Mobile Starter who is overwhelmed by admin

---

## Variant C — Social Proof / Community (targets isolated groomer)

**Eyebrow**: Join mobile groomers who went from chaos to calm
**H1**: Grooming software that actually gets how your day works.
**Subheadline**: The all-in-one app that solo mobile groomers trust for scheduling, reminders, and getting paid — built for life in the van.
**CTA**: See How It Works
**Supporting**: Free 14-day trial · No credit card required
**Trust signal**: ✓ Designed for mobile groomers · ✓ Set up in 5 min · ✓ $14.50/mo founding pricing

**Why this works**:
- "Join mobile groomers" = belonging and community (even with small numbers)
- "Actually gets how your day works" = understanding their specific lifestyle
- "All-in-one" = comprehensive, don't need multiple tools
- CTA "See How It Works" is lower commitment than "Start Free Trial" — better for cold traffic
- Mentions "life in the van" — shows we understand their world
- $14.50 founding pricing is more specific and compelling than $29

**Target persona**: Independent Mobile Groomer (our core ICP)

---

## Implementation Notes

1. **A/B test setup**: Use the existing ab_tests table in production DB
2. **Success metric**: Bounce rate reduction from 85% (target: <70%)
3. **Secondary metric**: Signup conversion rate from homepage
4. **Test duration**: Minimum 2 weeks, 100+ visitors per variant
5. **Winner criteria**: Statistically significant bounce rate improvement (p < 0.05)

**Dev pipeline**: After review, create a feature branch for A/B testing. The homepage already has A/B test infrastructure (ab_tests table, PlanCard component uses it).
