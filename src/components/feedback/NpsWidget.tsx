'use client'

import { useState, useEffect } from 'react'

const NPS_STORAGE_KEY = 'gg_nps_dismissed'
const NPS_SHOW_AFTER_DAYS = 7

function shouldShowNps(): boolean {
  if (typeof window === 'undefined') return false
  const dismissed = localStorage.getItem(NPS_STORAGE_KEY)
  if (dismissed) return false
  // Check if user signed up more than 7 days ago
  const signupStr = localStorage.getItem('gg_signup_date')
  if (!signupStr) return false
  const signupDate = new Date(signupStr)
  const daysSinceSignup =
    (Date.now() - signupDate.getTime()) / (1000 * 60 * 60 * 24)
  return daysSinceSignup >= NPS_SHOW_AFTER_DAYS
}

function scoreColor(score: number): string {
  if (score >= 9) return 'bg-green-500 text-white border-green-500'
  if (score >= 7) return 'bg-yellow-400 text-stone-800 border-yellow-400'
  return 'bg-red-500 text-white border-red-500'
}

function scoreIdleColor(score: number): string {
  if (score >= 9) return 'border-green-300 text-green-700 hover:bg-green-50'
  if (score >= 7) return 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
  return 'border-red-300 text-red-700 hover:bg-red-50'
}

export function NpsWidget() {
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setVisible(shouldShowNps())
  }, [])

  function dismiss() {
    localStorage.setItem(NPS_STORAGE_KEY, 'true')
    setVisible(false)
  }

  async function handleSubmit() {
    if (selected === null) return
    setSubmitting(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'nps',
          score: selected,
          message: comment || null,
          page: window.location.pathname,
          metadata: {},
        }),
      })
      setSubmitted(true)
      localStorage.setItem(NPS_STORAGE_KEY, 'true')
      setTimeout(() => setVisible(false), 2500)
    } catch {
      // Silently fail — feedback is non-critical
    } finally {
      setSubmitting(false)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-xl border border-stone-200 bg-white shadow-lg">
      <div className="flex items-start justify-between p-4 pb-2">
        <p className="text-sm font-semibold text-stone-800">
          {submitted ? 'Thanks for your feedback! 🐾' : 'Quick question'}
        </p>
        <button
          onClick={dismiss}
          className="ml-2 flex-shrink-0 text-stone-400 hover:text-stone-600"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      {submitted ? (
        <div className="px-4 pb-4 text-sm text-stone-500">
          Your feedback helps us build a better GroomGrid.
        </div>
      ) : (
        <>
          <div className="px-4 pb-3">
            <p className="text-sm text-stone-600">
              How likely are you to recommend GroomGrid to another groomer?
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 px-4 pb-3">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`h-8 w-8 rounded-md border text-xs font-semibold transition-colors ${
                  selected === i
                    ? scoreColor(i)
                    : `border-stone-200 text-stone-600 ${scoreIdleColor(i)}`
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="flex justify-between px-4 pb-2 text-[11px] text-stone-400">
            <span>Not likely</span>
            <span>Very likely</span>
          </div>

          {selected !== null && (
            <div className="px-4 pb-3">
              <textarea
                className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                rows={2}
                placeholder="Any thoughts? (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={handleSubmit}
              disabled={selected === null || submitting}
              className="flex-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Submit'}
            </button>
            <button
              onClick={dismiss}
              className="rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-500 hover:bg-stone-50"
            >
              Skip
            </button>
          </div>
        </>
      )}
    </div>
  )
}
