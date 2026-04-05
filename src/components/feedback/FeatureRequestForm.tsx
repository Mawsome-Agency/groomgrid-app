'use client'

import { useState } from 'react'

type Priority = 'nice_to_have' | 'important' | 'critical'

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'nice_to_have', label: 'Nice to have' },
  { value: 'important', label: 'Important' },
  { value: 'critical', label: 'Critical' },
]

export function FeatureRequestForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('nice_to_have')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})

  function validate(): boolean {
    const newErrors: { title?: string; description?: string } = {}
    if (!title.trim()) newErrors.title = 'Title is required.'
    if (!description.trim()) newErrors.description = 'Description is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'feature',
          page: typeof window !== 'undefined' ? window.location.pathname : null,
          message: description.trim(),
          metadata: {
            title: title.trim(),
            priority,
          },
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
      setTitle('')
      setDescription('')
      setPriority('nice_to_have')
    } catch {
      setErrors({ description: 'Failed to submit. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-stone-800">
          Thanks! We review every request 🐾
        </p>
        <p className="mt-1 text-sm text-stone-600">
          Your idea has been added to our backlog. We&apos;ll reach out if we have questions.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-green-700 hover:underline"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">
          Feature title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          placeholder="e.g. Recurring appointment scheduler"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          placeholder="Describe what you need and why it would help your business."
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  )
}
