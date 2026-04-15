'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseUnsavedChangesProps {
  initialValue?: boolean;
}

export function useUnsavedChanges({ initialValue = false }: UseUnsavedChangesProps = {}) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(initialValue);

  // Listen for auto-save requests
  useEffect(() => {
    const handleAutoSaveRequest = () => {
      if (hasUnsavedChanges) {
        // Trigger the onSave callback if provided
        window.dispatchEvent(new CustomEvent('performAutoSave'));
      }
    };

    window.addEventListener('autoSaveRequested', handleAutoSaveRequest);
    return () => {
      window.removeEventListener('autoSaveRequested', handleAutoSaveRequest);
    };
  }, [hasUnsavedChanges]);

  const markAsDirty = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markAsClean = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return {
    hasUnsavedChanges,
    markAsDirty,
    markAsClean,
  };
}