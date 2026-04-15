/**
 * Type definitions for load testing metrics
 */

export interface DatabaseMetrics {
  queryPerformance: {
    avgQueryTime: number; // milliseconds
    slowQueries: number;
    totalQueries: number;
  };
  connectionPool: {
    activeConnections: number;
    idleConnections: number;
    totalConnections: number;
  };
  replication: {
    lag: number | null; // seconds
    status: 'healthy' | 'warning' | 'critical' | 'unknown' | 'standalone' | 'replicating';
  };
}

export interface StripeMetrics {
  apiPerformance: {
    avgResponseTime: number; // milliseconds
    successRate: number; // percentage 0-100
    errorCount: number;
  };
  webhookDelivery: {
    pending: number;
    failed: number;
    successRate: number; // percentage 0-100
  };
  rateLimits: {
    remainingRequests: number;
    resetTimestamp: number | null;
  };
}

export interface SystemMetrics {
  cpu: {
    usagePercent: number; // 0-100
    loadAverage: [number, number, number]; // 1, 5, 15 minute loads
  };
  memory: {
    usedBytes: number;
    totalBytes: number;
    usagePercent: number; // 0-100
  };
  disk: {
    usedBytes: number;
    totalBytes: number;
    usagePercent: number; // 0-100
  };
  network: {
    rxBytes: number;
    txBytes: number;
  };
}

export interface LoadTestMetrics {
  timestamp: string; // ISO timestamp
  database: DatabaseMetrics;
  stripe: StripeMetrics;
  system: SystemMetrics;
  metadata: {
    nodeId: string;
    uptimeSeconds: number;
    version: string;
  };
}

export interface LoadTestConfig {
  id: string;
  name: string;
  description?: string;
  targetRps: number; // requests per second
  durationSeconds: number;
  createdAt: string; // ISO timestamp
  createdBy: string; // user ID
}

export interface LoadTestResult {
  id: string;
  testId: string;
  startedAt: string; // ISO timestamp
  endedAt: string; // ISO timestamp
  metrics: LoadTestMetrics;
  status: 'running' | 'completed' | 'failed';
  error?: string;
}
