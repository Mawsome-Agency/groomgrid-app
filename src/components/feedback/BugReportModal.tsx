'use client'

import { useState, useEffect, useRef } from 'react'

interface BugReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
  const [description, setDescription] = useState('')
  const [currentPage, setCurrentPage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPage(window.location.pathname)
    }
  }, [isOpen])

  // Manage focus when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement
      // Focus first focusable element in dialog
      const timer = setTimeout(() => {
        const focusable = dialogRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        focusable?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else {
      // Return focus to trigger element
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  // Close on Escape and trap focus within modal
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableEls = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        const firstFocusable = focusableEls[0]
        const lastFocusable = focusableEls[focusableEls.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault()
            lastFocusable?.focus()
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault()
            firstFocusable?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) {
      setError('Please describe the bug.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bug',
          page: currentPage,
          message: description.trim(),
          metadata: {
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
      setDescription('')
      setTimeout(() => {
        setSubmitted(false)
        onClose()
      }, 2000)
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4"
      aria-hidden="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bug-report-title"
        className="w-full max-w-md rounded-xl border border-stone-200 bg-white shadow-xl"
        aria-hidden="false"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h2 id="bug-report-title" className="text-lg font-semibold text-stone-800">
            Report a Bug
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 rounded"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-8 text-center" role="status" aria-live="polite">
            <p className="text-lg font-medium text-stone-800">Report sent!</p>
            <p className="mt-1 text-sm text-stone-500">
              We&apos;ll look into it. Thanks for helping improve GroomGrid.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6" noValidate>
            <div className="mb-4">
              <label
                htmlFor="bug-report-page"
                className="mb-1.5 block text-sm font-medium text-stone-700"
              >
                Current page
              </label>
              <input
                id="bug-report-page"
                type="text"
                value={currentPage}
                readOnly
                aria-readonly="true"
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="bug-report-description"
                className="mb-1.5 block text-sm font-medium text-stone-700"
              >
                What happened? What did you expect?{' '}
                <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <textarea
                id="bug-report-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                aria-required="true"
                aria-describedby={error ? 'bug-report-error' : undefined}
                aria-invalid={error ? 'true' : 'false'}
                className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="e.g. I clicked Save and nothing happened. I expected the client to be saved."
              />
              {error && (
                <p id="bug-report-error" role="alert" className="mt-1 text-xs text-red-500">
                  {error}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-busy={submitting}
              >
                {submitting ? 'Sending...' : 'Send Report'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export function BugReportButton() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
        aria-haspopup="dialog"
        aria-expanded={modalOpen}
      >
        🐛 Report Bug
      </button>
      <BugReportModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
