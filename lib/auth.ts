import { auth } from '@clerk/nextjs/server';
import { prisma } from './prisma';

/**
 * Get the current authenticated user from the database
 * Returns null if user is not authenticated or not found in database
 */
export async function getCurrentUser() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    });

    return user;
}
