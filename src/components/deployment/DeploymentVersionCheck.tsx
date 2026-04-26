'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * DeploymentVersionCheck — detects new deployments and prompts users to reload.
 *
 * Prevents "Failed to find Server Action" errors that occur when a user's
 * cached page has stale action IDs from a previous build.
 *
 * Polls /api/health every 60 seconds. If the buildId changes, shows a
 * non-intrusive banner at the bottom of the screen.
 */
export default function DeploymentVersionCheck() {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const initialBuildId = useRef<string | null>(null);

  useEffect(() => {
    // Capture the initial build ID from the health endpoint
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

    // Poll for build ID changes every 60 seconds
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
