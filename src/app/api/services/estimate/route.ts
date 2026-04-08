import { NextRequest, NextResponse } from 'next/server';
import { SERVICES, SERVICE_MAP, formatPrice, formatDuration } from '@/lib/services';
import { estimateGroomingTime, isValidSize } from '@/lib/breed-intelligence';

/**
 * GET /api/services/estimate
 *
 * Returns service list with breed/size-aware duration estimates.
 *
 * Query params:
 *   service — service name (optional; if omitted, returns all services)
 *   breed   — dog breed (optional)
 *   size    — small | medium | large | giant (optional)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceName = searchParams.get('service');
  const breed = searchParams.get('breed');
  const size = searchParams.get('size');

  // If a specific service was requested
  if (serviceName) {
    const service = SERVICE_MAP[serviceName];
    if (!service) {
      return NextResponse.json(
        { error: `Unknown service: ${serviceName}` },
        { status: 400 },
      );
    }

    const estimate = estimateGroomingTime(serviceName, breed, size);

    return NextResponse.json({
      service: serviceName,
      estimate: {
        duration: estimate.duration,
        durationDisplay: formatDuration(estimate.duration),
        baseDuration: estimate.baseDuration,
        baseDurationDisplay: formatDuration(estimate.baseDuration),
        price: service.basePrice,
        priceDisplay: formatPrice(service.basePrice),
        size: estimate.size,
        adjusted: estimate.adjusted,
      },
    });
  }

  // Return all services with estimates
  const estimates = SERVICES.map((service) => {
    const estimate = estimateGroomingTime(service.name, breed, size);

    return {
      name: service.name,
      duration: estimate.duration,
      durationDisplay: formatDuration(estimate.duration),
      baseDuration: service.baseDuration,
      baseDurationDisplay: formatDuration(service.baseDuration),
      price: service.basePrice,
      priceDisplay: formatPrice(service.basePrice),
      adjusted: estimate.adjusted,
    };
  });

  return NextResponse.json({
    breed: breed || null,
    size: (size && isValidSize(size)) ? size : null,
    services: estimates,
  });
}
