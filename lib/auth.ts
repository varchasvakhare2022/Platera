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

                if (email) {
                    // Check for existing user by email first (Robust linking)
                    const existingUser = await prisma.user.findUnique({
                        where: { email }
                    });

                    if (existingUser) {
                        // Link to existing user
                        user = await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { clerkId: userId }
                        });
                    } else {
                        // Create new user
                        user = await prisma.user.create({
                            data: {
                                clerkId: userId,
                                email: email,
                                name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Chef',
                                profileImage: clerkUser.imageUrl,
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Lazy sync failed:', error);
        }
    }

    // SELF-HEALING: Check for duplicate accounts with same email and MERGE them
    // This fixes the "Split Account" issue where recipes belong to an old ID
    if (user && user.email) {
        try {
            // Find ALL users with this email
            const duplicates = await prisma.user.findMany({
                where: { email: user.email },
                include: { _count: { select: { recipes: true } } }
            });

            if (duplicates.length > 1) {
                console.log(`[AUTH] Found ${duplicates.length} users for email ${user.email}. Merging...`);

                // Identify the "Master" account (Current Session User)
                const masterUser = user;

                // Identify "Stale" accounts (Everyone else)
                const staleUsers = duplicates.filter(u => u.id !== masterUser.id);

                for (const stale of staleUsers) {
                    if (stale._count.recipes > 0) {
                        console.log(`[AUTH] Migrating ${stale._count.recipes} recipes from ${stale.id} to ${masterUser.id}`);
                        await prisma.recipe.updateMany({
                            where: { authorId: stale.id },
                            data: { authorId: masterUser.id }
                        });
                        await prisma.review.updateMany({
                            where: { userId: stale.id },
                            data: { userId: masterUser.id }
                        });
                        await prisma.savedRecipe.deleteMany({ where: { userId: stale.id } }); // Delete duplicates
                        await prisma.comment.updateMany({
                            where: { userId: stale.id },
                            data: { userId: masterUser.id }
                        });
                    }
                    // Delete the stale user
                    await prisma.user.delete({ where: { id: stale.id } });
                    console.log(`[AUTH] Deleted stale user ${stale.id}`);
                }
            }
        } catch (mergeError) {
            console.error('[AUTH] Merge failed:', mergeError);
        }
    }

    return user;
}
