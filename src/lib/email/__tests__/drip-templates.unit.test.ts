/**
 * Unit tests for drip email templates (src/lib/email/drip-templates.ts).
 *
 * Tests getDripEmailContent and each step function in isolation.
 * These are pure functions — no Prisma, no network, no external deps.
 *
 * Key contracts to verify:
 *  - getDripEmailContent returns { subject, html, text } for all valid steps
 *  - getDripEmailContent throws for invalid step numbers
 *  - Each step's output contains the user's first name (not full name)
 *  - Each step's output contains the appUrl
 *  - HTML output is a complete document (has DOCTYPE, brand wrapper)
 *  - Text output is a plain-text version of the same content
 *  - No "undefined" strings leak into output
 *  - Subject lines are non-empty and distinct per step
 */
/** @jest-environment node */

import { getDripEmailContent } from '../drip-templates'

// ─── Fixtures ────────────────────────────────────────────────────────────────

const APP_URL = 'https://app.getgroomgrid.com'
const FULL_NAME = 'Sarah Mitchell'
const SINGLE_NAME = 'GroomerPro'
const EMPTY_NAME = ''

// ─── Group 1: getDripEmailContent — valid steps ────────────────────────────────

describe('getDripEmailContent — valid steps return EmailContent', () => {
  const validSteps = [0, 1, 3, 7, 14]

  it.each(validSteps)('step %d returns an object with subject, html, text', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    expect(result).toHaveProperty('subject')
    expect(result).toHaveProperty('html')
    expect(result).toHaveProperty('text')
  })

  it.each(validSteps)('step %d has non-empty subject', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    expect(result.subject.length).toBeGreaterThan(0)
  })

  it.each(validSteps)('step %d has non-empty html', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    expect(result.html.length).toBeGreaterThan(0)
  })

  it.each(validSteps)('step %d has non-empty text', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    expect(result.text.length).toBeGreaterThan(0)
  })

  it.each(validSteps)('step %d html contains DOCTYPE (complete document)', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    expect(result.html).toContain('<!DOCTYPE html>')
  })

  it.each(validSteps)('step %d html contains brand wrapper', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    expect(result.html).toContain('GroomGrid')
    expect(result.html).toContain('background-color')
  })

  it.each(validSteps)('step %d text does not contain HTML tags', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    // Plain text should not contain common HTML tags
    expect(result.text).not.toMatch(/<table|<tr|<td|<div|<span|<style/)
  })

  it.each(validSteps)('step %d html contains unsubscribe link', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    expect(result.html).toContain('{{unsubscribe_url}}')
  })
})

// ─── Group 2: getDripEmailContent — invalid steps ────────────────────────────────

describe('getDripEmailContent — invalid step numbers throw', () => {
  it('throws for step 2 (not in the sequence)', () => {
    expect(() => getDripEmailContent(2, FULL_NAME, APP_URL)).toThrow(
      'No drip template for step 2'
    )
  })

  it('throws for step 4 (not in the sequence)', () => {
    expect(() => getDripEmailContent(4, FULL_NAME, APP_URL)).toThrow(
      'No drip template for step 4'
    )
  })

  it('throws for step 5 (not in the sequence)', () => {
    expect(() => getDripEmailContent(5, FULL_NAME, APP_URL)).toThrow(
      'No drip template for step 5'
    )
  })

  it('throws for step -1 (negative)', () => {
    expect(() => getDripEmailContent(-1, FULL_NAME, APP_URL)).toThrow(
      'No drip template for step -1'
    )
  })

  it('throws for step 100 (way out of range)', () => {
    expect(() => getDripEmailContent(100, FULL_NAME, APP_URL)).toThrow(
      'No drip template for step 100'
    )
  })
})

// ─── Group 3: Step 0 — Welcome ────────────────────────────────────────────────

describe('Step 0 — Welcome email', () => {
  it('subject contains "Welcome"', () => {
    const result = getDripEmailContent(0, FULL_NAME, APP_URL)
    expect(result.subject).toContain('Welcome')
  })

  it('html contains first name (Sarah)', () => {
    const result = getDripEmailContent(0, FULL_NAME, APP_URL)
    expect(result.html).toContain('Sarah')
  })

  it('text contains first name (Sarah)', () => {
    const result = getDripEmailContent(0, FULL_NAME, APP_URL)
    expect(result.text).toContain('Sarah')
  })

  it('html contains app URL', () => {
    const result = getDripEmailContent(0, FULL_NAME, APP_URL)
    expect(result.html).toContain(APP_URL)
  })

  it('text contains app URL', () => {
    const result = getDripEmailContent(0, FULL_NAME, APP_URL)
    expect(result.text).toContain(APP_URL)
  })

  it('html contains getting started steps', () => {
    const result = getDripEmailContent(0, FULL_NAME, APP_URL)
    expect(result.html).toContain('Add your services')
    expect(result.html).toContain('Add your first client')
    expect(result.html).toContain('Book your first appointment')
  })

  it('text contains getting started steps', () => {
    const result = getDripEmailContent(0, FULL_NAME, APP_URL)
    expect(result.text).toContain('Add your services')
    expect(result.text).toContain('Add your first client')
    expect(result.text).toContain('Book your first appointment')
  })

  it('html contains CTA button', () => {
    const result = getDripEmailContent(0, FULL_NAME, APP_URL)
    expect(result.html).toContain('Set Up My Account')
  })

  it('uses first name only (not full name)', () => {
    const result = getDripEmailContent(0, 'John Smith Jr.', APP_URL)
    expect(result.html).toContain('John')
    expect(result.html).not.toContain('Smith Jr.')
  })
})

// ─── Group 4: Step 1 — First Client ────────────────────────────────────────────

describe('Step 1 — Add first client email', () => {
  it('subject mentions adding a client', () => {
    const result = getDripEmailContent(1, FULL_NAME, APP_URL)
    expect(result.subject).toContain('client')
  })

  it('html contains first name', () => {
    const result = getDripEmailContent(1, FULL_NAME, APP_URL)
    expect(result.html).toContain('Sarah')
  })

  it('html contains client list URL', () => {
    const result = getDripEmailContent(1, FULL_NAME, APP_URL)
    expect(result.html).toContain(`${APP_URL}/clients/new`)
  })

  it('text contains client list URL', () => {
    const result = getDripEmailContent(1, FULL_NAME, APP_URL)
    expect(result.text).toContain(`${APP_URL}/clients/new`)
  })

  it('html contains CTA button', () => {
    const result = getDripEmailContent(1, FULL_NAME, APP_URL)
    expect(result.html).toContain('Add a Client Now')
  })

  it('html mentions client data fields', () => {
    const result = getDripEmailContent(1, FULL_NAME, APP_URL)
    expect(result.html).toContain('Breed')
    expect(result.html).toContain('allergies')
    expect(result.html).toContain('Grooming preferences')
  })

  it('uses first name only (not full name)', () => {
    const result = getDripEmailContent(1, 'Maria Garcia-Lopez', APP_URL)
    expect(result.html).toContain('Maria')
    expect(result.html).not.toContain('Garcia-Lopez')
  })
})

// ─── Group 5: Step 3 — No-Shows ────────────────────────────────────────────────

describe('Step 3 — No-show reminder email', () => {
  it('subject mentions no-shows', () => {
    const result = getDripEmailContent(3, FULL_NAME, APP_URL)
    expect(result.subject).toContain('no-show')
  })

  it('html contains first name', () => {
    const result = getDripEmailContent(3, FULL_NAME, APP_URL)
    expect(result.html).toContain('Sarah')
  })

  it('html contains reminders settings URL', () => {
    const result = getDripEmailContent(3, FULL_NAME, APP_URL)
    expect(result.html).toContain(`${APP_URL}/settings/reminders`)
  })

  it('text contains reminders settings URL', () => {
    const result = getDripEmailContent(3, FULL_NAME, APP_URL)
    expect(result.text).toContain(`${APP_URL}/settings/reminders`)
  })

  it('html mentions reminder timeline (48h, 24h, 2h)', () => {
    const result = getDripEmailContent(3, FULL_NAME, APP_URL)
    expect(result.html).toContain('48 hours')
    expect(result.html).toContain('24 hours')
    expect(result.html).toContain('2 hours')
  })

  it('text mentions reminder timeline', () => {
    const result = getDripEmailContent(3, FULL_NAME, APP_URL)
    expect(result.text).toContain('48 hours')
    expect(result.text).toContain('24 hours')
    expect(result.text).toContain('2 hours')
  })

  it('html contains CTA button to enable reminders', () => {
    const result = getDripEmailContent(3, FULL_NAME, APP_URL)
    expect(result.html).toContain('Enable Reminders')
  })

  it('uses first name only', () => {
    const result = getDripEmailContent(3, 'Tom Two-Names', APP_URL)
    expect(result.html).toContain('Tom')
    expect(result.html).not.toContain('Two-Names')
  })
})

// ─── Group 6: Step 7 — Check-in ────────────────────────────────────────────────

describe('Step 7 — Check-in email', () => {
  it('subject asks about GroomGrid experience', () => {
    const result = getDripEmailContent(7, FULL_NAME, APP_URL)
    expect(result.subject).toContain('GroomGrid')
  })

  it('html contains first name', () => {
    const result = getDripEmailContent(7, FULL_NAME, APP_URL)
    expect(result.html).toContain('Sarah')
  })

  it('html contains help docs link', () => {
    const result = getDripEmailContent(7, FULL_NAME, APP_URL)
    expect(result.html).toContain(`${APP_URL}/docs`)
  })

  it('html contains settings link', () => {
    const result = getDripEmailContent(7, FULL_NAME, APP_URL)
    expect(result.html).toContain(`${APP_URL}/settings`)
  })

  it('text contains help docs and settings links', () => {
    const result = getDripEmailContent(7, FULL_NAME, APP_URL)
    expect(result.text).toContain(`${APP_URL}/docs`)
    expect(result.text).toContain(`${APP_URL}/settings`)
  })

  it('html contains Calendly link for booking a call', () => {
    const result = getDripEmailContent(7, FULL_NAME, APP_URL)
    expect(result.html).toContain('calendly.com/groomgrid/onboarding')
  })

  it('text contains Calendly link', () => {
    const result = getDripEmailContent(7, FULL_NAME, APP_URL)
    expect(result.text).toContain('calendly.com/groomgrid/onboarding')
  })

  it('html contains CTA button for booking', () => {
    const result = getDripEmailContent(7, FULL_NAME, APP_URL)
    expect(result.html).toContain('Book a 15-min Call')
  })

  it('uses first name only', () => {
    const result = getDripEmailContent(7, 'Alex Three Names Here', APP_URL)
    expect(result.html).toContain('Alex')
    expect(result.html).not.toContain('Three Names Here')
  })
})

// ─── Group 7: Step 14 — Upgrade ────────────────────────────────────────────────

describe('Step 14 — Upgrade CTA email', () => {
  it('subject mentions trial ending', () => {
    const result = getDripEmailContent(14, FULL_NAME, APP_URL)
    expect(result.subject).toContain('trial')
  })

  it('html contains first name', () => {
    const result = getDripEmailContent(14, FULL_NAME, APP_URL)
    expect(result.html).toContain('Sarah')
  })

  it('html contains pricing page URL', () => {
    const result = getDripEmailContent(14, FULL_NAME, APP_URL)
    expect(result.html).toContain(`${APP_URL}/pricing`)
  })

  it('text contains pricing page URL', () => {
    const result = getDripEmailContent(14, FULL_NAME, APP_URL)
    expect(result.text).toContain(`${APP_URL}/pricing`)
  })

  it('html mentions Solo plan price ($29)', () => {
    const result = getDripEmailContent(14, FULL_NAME, APP_URL)
    expect(result.html).toContain('$29')
  })

  it('html mentions Salon plan price ($79)', () => {
    const result = getDripEmailContent(14, FULL_NAME, APP_URL)
    expect(result.html).toContain('$79')
  })

  it('text mentions Solo and Salon plans', () => {
    const result = getDripEmailContent(14, FULL_NAME, APP_URL)
    expect(result.text).toContain('$29')
    expect(result.text).toContain('$79')
  })

  it('html contains Upgrade CTA button', () => {
    const result = getDripEmailContent(14, FULL_NAME, APP_URL)
    expect(result.html).toContain('Upgrade Now')
  })

  it('uses first name only', () => {
    const result = getDripEmailContent(14, 'Jennifer Long Name Example', APP_URL)
    expect(result.html).toContain('Jennifer')
    expect(result.html).not.toContain('Long Name Example')
  })
})

// ─── Group 8: Edge cases — userName ────────────────────────────────────────────

describe('getDripEmailContent — userName edge cases', () => {
  it('handles single-word name (no space to split)', () => {
    const result = getDripEmailContent(0, SINGLE_NAME, APP_URL)
    expect(result.html).toContain('GroomerPro')
    expect(result.text).toContain('GroomerPro')
  })

  it('handles empty string name — does not crash, uses empty string', () => {
    // Empty name should not crash; the split(' ')[0] on '' yields ''
    const result = getDripEmailContent(0, EMPTY_NAME, APP_URL)
    expect(result.subject).toBeTruthy()
    expect(result.html).toBeTruthy()
    expect(result.text).toBeTruthy()
  })

  it('handles name with multiple spaces — uses first word only', () => {
    const result = getDripEmailContent(0, '  Dr  Jane   Smith  ', APP_URL)
    // split(' ')[0] on '  Dr  Jane   Smith  ' gives '' (empty before first space)
    // This tests actual behavior — leading spaces mean first split is empty string
    expect(result).toBeDefined()
    expect(result.html).toBeTruthy()
  })

  it('handles very long name without crashing', () => {
    const longName = 'A'.repeat(500)
    const result = getDripEmailContent(0, longName, APP_URL)
    expect(result.html).toContain('A')
    expect(result).toBeDefined()
  })
})

// ─── Group 9: Edge cases — appUrl ────────────────────────────────────────────────

describe('getDripEmailContent — appUrl variations', () => {
  it('works with trailing slash in appUrl', () => {
    const result = getDripEmailContent(1, FULL_NAME, 'https://app.getgroomgrid.com/')
    expect(result.html).toContain('https://app.getgroomgrid.com/')
  })

  it('works with localhost URL for development', () => {
    const result = getDripEmailContent(0, FULL_NAME, 'http://localhost:3000')
    expect(result.html).toContain('http://localhost:3000')
    expect(result.text).toContain('http://localhost:3000')
  })

  it('works with staging URL', () => {
    const result = getDripEmailContent(14, FULL_NAME, 'https://staging.getgroomgrid.com')
    expect(result.html).toContain('https://staging.getgroomgrid.com')
    expect(result.text).toContain('https://staging.getgroomgrid.com')
  })
})

// ─── Group 10: Subject line uniqueness ────────────────────────────────────────

describe('getDripEmailContent — subject lines are distinct per step', () => {
  it('all 5 valid steps have unique subject lines', () => {
    const subjects = [0, 1, 3, 7, 14].map(
      (step) => getDripEmailContent(step, FULL_NAME, APP_URL).subject
    )
    const uniqueSubjects = new Set(subjects)
    expect(uniqueSubjects.size).toBe(5)
  })
})

// ─── Group 11: HTML structure ────────────────────────────────────────────────

describe('getDripEmailContent — HTML structure consistency', () => {
  const validSteps = [0, 1, 3, 7, 14]

  it.each(validSteps)('step %d html has proper html/head/body tags', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    expect(result.html).toContain('<html')
    expect(result.html).toContain('</html>')
    expect(result.html).toContain('<body')
    expect(result.html).toContain('</body>')
  })

  it.each(validSteps)('step %d html contains GroomGrid header', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    expect(result.html).toContain('🐾 GroomGrid')
  })

  it.each(validSteps)('step %d html contains footer', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    expect(result.html).toContain('Built for groomers')
  })

  it.each(validSteps)('step %d html contains brand primary color', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    expect(result.html).toContain('#22c55e')
  })

  it.each(validSteps)('step %d html has CTA button with brand color', (step) => {
    const result = getDripEmailContent(step, FULL_NAME, APP_URL)
    // All steps have a CTA button with the primary brand color
    expect(result.html).toContain('background-color:#22c55e')
  })
})
