'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface SessionExpirationModalProps {
  onExtend: () => void;
  timeUntilExpiry: number; // in seconds
}

export default function SessionExpirationModal({ 
  onExtend,
  timeUntilExpiry
}: SessionExpirationModalProps) {
  const [timeLeft, setTimeLeft] = useState(timeUntilExpiry);
  const [isExtending, setIsExtending] = useState(false);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start countdown
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleExtend = async () => {
    setIsExtending(true);
    try {
      // Call the extend session API
      const response = await fetch('/api/auth/session/extend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onExtend();
      } else {
        console.error('Failed to extend session');
        handleLogout();
      }
    } catch (error) {
      console.error('Error extending session:', error);
      handleLogout();
    } finally {
      setIsExtending(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-stone-900 mb-2">Session Expiring Soon</h2>
          <p className="text-stone-600 mb-4">
            Your session will expire in <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>.
          </p>
          <p className="text-stone-600 mb-6">
            Would you like to extend your session to avoid losing your work?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExtend}
              disabled={isExtending}
              className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isExtending ? 'Extending...' : 'Extend Session'}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-3 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}