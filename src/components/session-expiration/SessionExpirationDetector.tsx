'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SessionExpirationModal from './SessionExpirationModal';

export default function SessionExpirationDetector() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0);
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);

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
    if (checkInterval) {
      clearInterval(checkInterval);
    }

    // Only set up detection if we have an active session
    if (status === 'authenticated' && session) {
      // Check session expiration every 30 seconds
      const interval = setInterval(() => {
        const timeLeft = calculateTimeUntilExpiry();
        
        // Show modal when session expires in 5 minutes or less
        if (timeLeft <= 300 && timeLeft > 0) {
          setTimeUntilExpiry(timeLeft);
          setShowModal(true);
        }
      }, 30000); // Check every 30 seconds

      setCheckInterval(interval);

      // Clean up interval on unmount
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [session, status]);

  const handleExtend = () => {
    // Hide modal and reset state
    setShowModal(false);
    setTimeUntilExpiry(0);
    
    // The session extension API will be called by the modal
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