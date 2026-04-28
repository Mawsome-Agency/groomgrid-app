'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * DeploymentVersionCheck — detects new deployments and handles stale Server Action errors.
 *
 * Two mechanisms:
 * 1. Polls /api/health every 60s for build ID changes → shows reload banner
 * 2. Catches "Failed to find Server Action" errors → auto-reloads once,
 *    then shows an error message if the error persists after reload
 *
 * This prevents the "Failed to find Server Action" error that blocks conversions
 * when a user's cached page has stale action IDs from a previous build.
 */

const SERVER_ACTION_ERROR_PATTERN = /Failed to find Server Action/i;
const RELOAD_KEY = 'gg_server_action_reload_attempted';

export default function DeploymentVersionCheck() {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [serverActionError, setServerActionError] = useState(false);
  const initialBuildId = useRef<string | null>(null);

  // Poll for build ID changes
  useEffect(() => {
    // On successful page load, clear the reload flag so future errors
    // can trigger a fresh auto-reload
    sessionStorage.removeItem(RELOAD_KEY);

    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.buildId) {
          initialBuildId.current = data.buildId;
        }
      })
      .catch(() => {
        // Health check failed — ignore
      });

    const interval = setInterval(() => {
      if (!initialBuildId.current) return;
      fetch('/api/health')
        .then((res) => res.json())
        .then((data) => {
          if (data.buildId && data.buildId !== initialBuildId.current) {
            setNewVersionAvailable(true);
          }
        })
        .catch(() => {
          // Network error — ignore
        });
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  // Catch stale Server Action errors globally
  useEffect(() => {
    function handleServerActionError() {
      const alreadyReloaded = sessionStorage.getItem(RELOAD_KEY);
      if (!alreadyReloaded) {
        // First occurrence — auto-reload to pick up the new deployment
        sessionStorage.setItem(RELOAD_KEY, '1');
        window.location.reload();
      } else {
        // Second occurrence — error persists after reload, show error message.
        // Clear the flag so a future error can trigger a fresh auto-reload.
        sessionStorage.removeItem(RELOAD_KEY);
        setServerActionError(true);
      }
    }

    function handleError(event: ErrorEvent) {
      const message = event.message || '';
      if (SERVER_ACTION_ERROR_PATTERN.test(message)) {
        handleServerActionError();
      }
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      const message = typeof reason === 'string'
        ? reason
        : (reason?.message || '');
      if (SERVER_ACTION_ERROR_PATTERN.test(message)) {
        handleServerActionError();
      }
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  if (serverActionError) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-50 bg-red-600 text-white px-4 py-3 text-center text-sm font-medium shadow-lg">
        Something went wrong. Please{' '}
        <button
          onClick={() => {
            setServerActionError(false);
            window.location.reload();
          }}
          className="underline font-bold hover:text-red-100"
        >
          refresh the page
        </button>{' '}
        to try again.
      </div>
    );
  }

  if (!newVersionAvailable) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-green-600 text-white px-4 py-3 text-center text-sm font-medium shadow-lg">
      A new version of GroomGrid is available.{' '}
      <button
        onClick={() => window.location.reload()}
        className="underline font-bold hover:text-green-100"
      >
        Reload now
      </button>
    </div>
  );
}
