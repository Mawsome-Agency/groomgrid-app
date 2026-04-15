'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { SessionExpirationModalProps } from '@/types/session';

export default function SessionExpirationModal({ 
  onExtend,
  timeUntilExpiry
}: SessionExpirationModalProps) {
  const [timeLeft, setTimeLeft] = useState(timeUntilExpiry);
  const [isExtending, setIsExtending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ariaLiveRef = useRef<HTMLDivElement>(null);

  // Update countdown timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleLogout(); // Auto-logout when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Auto-close modal after 60 seconds of inactivity
  useEffect(() => {
    autoCloseTimeoutRef.current = setTimeout(() => {
      handleClose();
    }, 60000);

    return () => {
      if (autoCloseTimeoutRef.current) clearTimeout(autoCloseTimeoutRef.current);
    };
  }, []);

  // Reset auto-close timer on any user interaction
  const resetAutoCloseTimer = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    autoCloseTimeoutRef.current = setTimeout(() => {
      handleClose();
    }, 60000);
  };

  const handleExtend = async () => {
    resetAutoCloseTimer();
    setIsExtending(true);
    setError(null);
    
    try {
      const res = await fetch('/api/auth/session/extend', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to extend session');
      
      // Call the parent's extend handler
      await onExtend();
    } catch (err) {
      console.error('Session extension failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to extend session');
    } finally {
      setIsExtending(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const handleClose = () => {
    // Just hide the modal without extending session
    if (typeof onExtend === 'function') {
      onExtend();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
        onClick={resetAutoCloseTimer}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleClose();
          resetAutoCloseTimer();
        }}
        role="dialog"
        aria-labelledby="session-expiration-title"
        aria-describedby="session-expiration-description"
        aria-modal="true"
      >
        {/* ARIA live region for countdown announcements */}
        <div 
          ref={ariaLiveRef}
          aria-live="polite"
          className="sr-only"
        >
          Session expires in {formatTime(timeLeft)}
        </div>
        
        <div className="text-center">
          <h2 id="session-expiration-title" className="text-xl font-bold text-gray-900 mb-2">
            Session Expiring Soon
          </h2>
          <p id="session-expiration-description" className="text-gray-600 mb-4">
            Your session will expire in <span className="font-semibold">{formatTime(timeLeft)}</span>. 
            Would you like to extend your session?
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleExtend}
              disabled={isExtending}
              className={`px-4 py-2 rounded-md font-medium ${
                isExtending 
                  ? 'bg-brand-400 cursor-not-allowed' 
                  : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
            >
              {isExtending ? 'Extending...' : 'Extend Session'}
            </button>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
          
          <p className="mt-4 text-xs text-gray-500">
            For security reasons, sessions automatically expire after 30 minutes of inactivity.
          </p>
        </div>
      </div>
    </div>
  );
}
