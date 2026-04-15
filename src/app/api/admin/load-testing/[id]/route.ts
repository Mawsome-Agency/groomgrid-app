import { NextRequest, NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/load-testing/auth';

/**
 * GET /api/admin/load-testing/[id]
 * Get details for a specific load test
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    if (!(await isAdminUser())) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' }, 
        { status: 403 }
      );
    }

    // In a real implementation, you would fetch from a database
    // For now, we'll return a placeholder
    const testData = {
      id: params.id,
      name: 'Sample Load Test',
      description: 'Placeholder test data',
      targetRps: 100,
      durationSeconds: 300,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    };

    return NextResponse.json({ test: testData });
  } catch (error) {
    console.error('Failed to fetch load test:', error);
    return NextResponse.json(
      { error: 'Failed to fetch load test' }, 
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/load-testing/[id]
 * Delete a specific load test
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    if (!(await isAdminUser())) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' }, 
        { status: 403 }
      );
    }

    // In a real implementation, you would delete from a database
    // For now, we'll just return success
    return NextResponse.json({ 
      message: `Load test ${params.id} deleted successfully` 
    });
  } catch (error) {
    console.error('Failed to delete load test:', error);
    return NextResponse.json(
      { error: 'Failed to delete load test' }, 
      { status: 500 }
    );
  }
}
