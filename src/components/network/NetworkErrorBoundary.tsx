'use client';

import React from 'react';

interface NetworkErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
  onError?: (error: Error) => void;
}

export class NetworkErrorBoundary extends React.Component<NetworkErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: NetworkErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.props.onError) this.props.onError(error);
    console.error('NetworkErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          Something went wrong. Please check your network connection and try again.
        </div>
      );
    }
    return this.props.children;
  }
}
