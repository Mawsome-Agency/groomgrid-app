# Load Testing Metrics Collection Endpoints

This document describes the API endpoints for collecting load testing metrics from various sources including the database, Stripe, and system monitoring tools.

## Endpoint Overview

### Public Endpoints

1. `GET /api/load-testing` - Collect all load testing metrics
2. `GET /api/load-testing/[metricType]` - Collect specific type of metrics
3. `POST /api/load-testing` - Submit load test results

### Admin Endpoints

1. `GET /api/admin/load-testing` - Admin access to load testing metrics
2. `GET /api/admin/load-testing/[id]` - Get specific load test details
3. `DELETE /api/admin/load-testing/[id]` - Delete a load test

## Authentication and Security

### Public Endpoints
- No authentication required
- Rate limited to 10 requests per minute per IP
- Designed for external load testing tools

### Admin Endpoints
- Require admin authentication
- Higher rate limits (100 requests per minute)
- Access to historical data and configurations

## Rate Limiting

All endpoints implement rate limiting to prevent abuse:

- Public endpoints: 10 requests per minute per IP
- Specific metrics endpoints: 15 requests per minute per IP
- Admin endpoints: 100 requests per minute per admin user
- Submission endpoints: 5 requests per minute per IP

## Response Formats

### GET /api/load-testing

```json
{
  "metrics": {
    "timestamp": "2026-04-14T22:30:00Z",
    "database": {
      "queryPerformance": {
        "avgQueryTime": 45.2,
        "slowQueries": 2,
        "totalQueries": 120
      },
      "connectionPool": {
        "activeConnections": 8,
        "idleConnections": 12,
        "totalConnections": 20
      },
      "replication": {
        "lag": null,
        "status": "standalone"
      }
    },
    "stripe": {
      "apiPerformance": {
        "avgResponseTime": 120,
        "successRate": 98.5,
        "errorCount": 2
      },
      "webhookDelivery": {
        "pending": 0,
        "failed": 1,
        "successRate": 99.2
      },
      "rateLimits": {
        "remainingRequests": -1,
        "resetTimestamp": null
      }
    },
    "system": {
      "cpu": {
        "usagePercent": 25.4,
        "loadAverage": [0.45, 0.32, 0.28]
      },
      "memory": {
        "usedBytes": 1073741824,
        "totalBytes": 4294967296,
        "usagePercent": 25.0
      },
      "disk": {
        "usedBytes": 10737418240,
        "totalBytes": 53687091200,
        "usagePercent": 20.0
      },
      "network": {
        "rxBytes": 1024000,
        "txBytes": 512000
      }
    },
    "metadata": {
      "nodeId": "server-01",
      "uptimeSeconds": 3600,
      "version": "1.2.3"
    }
  }
}
```

### GET /api/load-testing/[metricType]

```json
{
  "metricType": "database",
  "metrics": {
    "queryPerformance": {
      "avgQueryTime": 45.2,
      "slowQueries": 2,
      "totalQueries": 120
    },
    "connectionPool": {
      "activeConnections": 8,
      "idleConnections": 12,
      "totalConnections": 20
    },
    "replication": {
      "lag": null,
      "status": "standalone"
    }
  },
  "timestamp": "2026-04-14T22:30:00Z"
}
```

### POST /api/load-testing

```json
{
  "message": "Load test results received successfully",
  "receivedAt": "2026-04-14T22:30:00Z"
}
```

## Error Responses

All endpoints return standardized error responses:

### 403 Unauthorized
```json
{
  "error": "Unauthorized: Admin access required"
}
```

### 429 Rate Limit Exceeded
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 45
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to collect metrics"
}
```

## Implementation Details

### Database Metrics Collection

Collects performance metrics from PostgreSQL using:
- `pg_stat_statements` for query performance
- `pg_stat_activity` for connection pool information
- Replication status monitoring

### Stripe Metrics Collection

Collects metrics from the Stripe API:
- Balance information
- Charge success/failure rates
- Webhook delivery performance
- Rate limit information

### System Metrics Collection

Collects system-level metrics using Node.js built-in modules:
- CPU usage and load averages
- Memory utilization
- Disk space usage
- Network I/O (requires additional libraries for accurate measurements)

## Security Considerations

1. **Rate Limiting**: Prevents denial of service attacks
2. **Authentication**: Admin endpoints require proper authentication
3. **Data Exposure**: Metrics are aggregated and don't expose sensitive business data
4. **Input Validation**: POST endpoints validate submitted data
5. **Error Handling**: Generic error messages to prevent information leakage

## Testing

Unit tests are available in:
- `src/lib/__tests__/rate-limit.test.ts`
- `src/lib/load-testing/__tests__/metrics.test.ts`
- `src/app/api/admin/load-testing/__tests__/route.test.ts`

Integration tests are available in:
- `e2e/performance.spec.ts`