'use client'

import { useCallback, useRef } from 'react'

export const ANALYTICS_EVENTS = {
  SESSION_START: 'session_start',
  APPOINTMENT_CREATED: 'appointment_created',
  APPOINTMENT_UPDATED: 'appointment_updated',
  CLIENT_ADDED: 'client_added',
  CLIENT_UPDATED: 'client_updated',
  FEATURE_USED: 'feature_used',
  PAGE_VIEWED: 'page_viewed',
  SETTINGS_UPDATED: 'settings_updated',
  REMINDER_ENABLED: 'reminder_enabled',
  UPGRADE_CLICKED: 'upgrade_clicked',
  EMPTY_STATE_CTA_CLICKED: 'empty_state_cta_clicked',
} as const

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'gg_session_id'
  let sessionId = sessionStorage.getItem(key)
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem(key, sessionId)
  }
  return sessionId
}

export function useAnalytics() {
  const sessionIdRef = useRef<string | null>(null)

  function getSessionId(): string {
    if (!sessionIdRef.current) {
      sessionIdRef.current = getOrCreateSessionId()
    }
    return sessionIdRef.current
  }

  const track = useCallback(
    async (eventName: string, properties?: Record<string, unknown>) => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName,
            properties: properties ?? {},
            sessionId: getSessionId(),
          }),
        })
      } catch {
        // Non-critical — never let analytics errors break UX
      }
    },
    []
  )

  const trackSession = useCallback(() => {
    track(ANALYTICS_EVENTS.SESSION_START, {
      url: typeof window !== 'undefined' ? window.location.href : '',
    })
  }, [track])

  const trackPageView = useCallback(
    (page: string) => {
      track(ANALYTICS_EVENTS.PAGE_VIEWED, { page })
    },
    [track]
  )

  return { track, trackSession, trackPageView, sessionId: getSessionId }
}
