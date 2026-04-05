'use client'

import { useState, useEffect } from 'react'

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPage(window.location.pathname)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-stone-800">Report a Bug</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-8 text-center">
            <p className="text-lg font-medium text-stone-800">Report sent!</p>
            <p className="mt-1 text-sm text-stone-500">
              We&apos;ll look into it. Thanks for helping improve GroomGrid.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Current page
              </label>
              <input
                type="text"
                value={currentPage}
                readOnly
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                What happened? What did you expect?{' '}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="e.g. I clicked Save and nothing happened. I expected the client to be saved."
                required
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
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
      >
        🐛 Report Bug
      </button>
      <BugReportModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
