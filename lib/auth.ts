import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from './prisma';

/**
 * Get the current authenticated user from the database
 * Returns null if user is not authenticated or not found in database
 * Automatically creates user in DB if they exist in Clerk but not locally (Lazy Sync)
 */
export async function getCurrentUser() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    let user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    });

    // Lazy Sync: If user missing in DB but exists in Clerk, create them
    if (!user) {
        try {
            const clerkUser = await currentUser();
            if (clerkUser) {
                const email = clerkUser.emailAddresses[0]?.emailAddress;

                user = await prisma.user.create({
                    data: {
                        clerkId: userId,
                        email: email,
                        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Chef',
                        profileImage: clerkUser.imageUrl,
                    }
                });
            }
        } catch (error) {
            console.error('Lazy sync failed:', error);
        }
    }

    return user;
}
