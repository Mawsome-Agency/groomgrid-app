'use client';

import { SessionProvider } from '@/components/SessionProvider';
import SessionExpirationDetector from '@/components/session-expiration/SessionExpirationDetector';
import { NetworkStatusProvider } from '@/context/NetworkStatusContext';
import { RequestQueueProvider } from '@/context/RequestQueueContext';
import { OfflineBanner } from '@/components/network';
import DeploymentVersionCheck from '@/components/deployment/DeploymentVersionCheck';

/**
 * Dashboard layout — wraps authenticated pages with providers
 * that are unnecessary on marketing/public pages:
 *
 * - SessionProvider (NextAuth)
 * - NetworkStatusProvider (online/offline detection)
 * - RequestQueueProvider (queued request tracking)
 * - OfflineBanner (visual offline indicator)
 * - SessionExpirationDetector (session timeout warning)
 * - DeploymentVersionCheck (stale deployment detection)
 *
 * Route group (dashboard) is invisible in URLs.
 * /dashboard, /clients, /settings, etc. keep their original paths.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <NetworkStatusProvider>
        <RequestQueueProvider>
          <OfflineBanner position="top" className="fixed inset-x-0 top-0" />
          {children}
          <SessionExpirationDetector />
          <DeploymentVersionCheck />
        </RequestQueueProvider>
      </NetworkStatusProvider>
    </SessionProvider>
  );
}
