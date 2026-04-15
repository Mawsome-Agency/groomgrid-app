import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * Check if the current user is an admin
 * @returns true if user is admin, false otherwise
 */
export async function isAdminUser(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) return false;

    // Check if user has admin role in profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { role: true }
    });

    // Check for explicit admin role
    return profile?.role === 'ADMIN' || profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
