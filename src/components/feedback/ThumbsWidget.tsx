'use client'

import { useState } from 'react'

interface ThumbsWidgetProps {
  page: string
}

function getVotedKey(page: string) {
  return `gg_thumbs_${page.replace(/\//g, '_')}`
}

export function ThumbsWidget({ page }: ThumbsWidgetProps) {
  const [voted, setVoted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(getVotedKey(page))
  })
  const [submitting, setSubmitting] = useState(false)

  async function handleVote(score: 1 | -1) {
    if (voted || submitting) return
    setSubmitting(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'thumbs',
          score,
          page,
          metadata: {},
        }),
      })
      localStorage.setItem(getVotedKey(page), score.toString())
      setVoted(true)
    } catch {
      // Non-critical
    } finally {
      setSubmitting(false)
    }
  }

  if (voted) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-stone-500">
        <span>Thanks!</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-stone-500">Was this helpful?</span>
      <button
        onClick={() => handleVote(1)}
        disabled={submitting}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 text-base transition-colors hover:border-green-500 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Thumbs up"
      >
        👍
      </button>
      <button
        onClick={() => handleVote(-1)}
        disabled={submitting}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 text-base transition-colors hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Thumbs down"
      >
        👎
      </button>
    </div>
  )
}
