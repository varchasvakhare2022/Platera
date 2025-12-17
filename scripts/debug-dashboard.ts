
import { prisma } from '../lib/prisma';

async function main() {
    console.log('Fetching users...');
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users.`);

    if (users.length === 0) {
        console.log('No users found.');
        return;
    }

    const userId = users[0].clerkId;
    console.log(`Testing dashboard query for ClerkID: ${userId}`);

    try {
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            include: {
                recipes: {
                    include: {
                        _count: {
                            select: { reviews: true, comments: true }
                        },
                        author: {
                            select: { id: true, name: true, profileImage: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                savedRecipes: {
                    include: {
                        recipe: {
                            include: {
                                _count: {
                                    select: { reviews: true, comments: true }
                                },
                                author: {
                                    select: { id: true, name: true, profileImage: true }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                reviews: {
                    include: {
                        recipe: {
                            select: { id: true, title: true, images: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        console.log('Query successful!');
        console.log('User recipes:', user?.recipes.length);
        console.log('User saved:', user?.savedRecipes.length);
        console.log('User reviews:', user?.reviews.length);

    } catch (error) {
        console.error('Query failed:', error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
