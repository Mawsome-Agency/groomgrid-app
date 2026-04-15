'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SessionExpirationModal from './SessionExpirationModal';

export default function SessionExpirationDetector() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Calculate when the session will expire (JWT tokens typically expire in 1 hour)
  const calculateTimeUntilExpiry = () => {
    if (session?.expires) {
      const expiryTime = new Date(session.expires).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = Math.max(0, expiryTime - currentTime) / 1000; // Convert to seconds
      return Math.floor(timeDiff);
    }
    return 0;
  };

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Clear interval when status changes to prevent memory leaks
    if (status !== 'authenticated' || !session) {
      setTimeUntilExpiry(0);
      setShowModal(false);
      return;
    }

    // Only set up detection if we have an active session
    if (status === 'authenticated' && session) {
      // Check session expiration every 30 seconds
      intervalRef.current = setInterval(() => {
        const timeLeft = calculateTimeUntilExpiry();
        
        // Show modal when session expires in 5 minutes or less
        if (timeLeft <= 300 && timeLeft > 0) {
          setTimeUntilExpiry(timeLeft);
          setShowModal(true);
        }
      }, 30000); // Check every 30 seconds
    }

    // Clean up interval on unmount or when status/session changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [session, status]);

  const handleExtend = async () => {
    try {
      const res = await fetch('/api/auth/session/extend', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to extend session');
      
      // Force a client-side session refresh
      await getSession(); // from next-auth/react
      router.refresh();   // next/navigation
    } catch (error) {
      console.error('Session extension failed:', error);
      // Redirect to login if extension fails
      router.push('/login');
      // Also close the modal
      setShowModal(false);
      setTimeUntilExpiry(0);
      return Promise.reject(error); // Propagate error to modal
    } finally {
      // Always close the modal after attempting extension
      setShowModal(false);
      setTimeUntilExpiry(0);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setTimeUntilExpiry(0);
  };

  if (!showModal) {
    return null;
  }

  return (
    <SessionExpirationModal 
      onExtend={handleExtend} 
      timeUntilExpiry={timeUntilExpiry}
    />
  );
}
