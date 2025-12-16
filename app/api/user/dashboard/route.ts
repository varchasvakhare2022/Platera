import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch User and their data
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

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate Stats
        const stats = {
            totalRecipes: user.recipes.length,
            totalReviews: user.reviews.length,
            totalSaved: user.savedRecipes.length,
            // Calculate total reviews received on user's recipes
            totalReviewsReceived: user.recipes.reduce((acc, recipe) => acc + recipe._count.reviews, 0)
        };

        // Format Saved Recipes to match Recipe interface
        const formattedSavedRecipes = user.savedRecipes.map(saved => ({
            ...saved.recipe,
            savedAt: saved.createdAt
        }));

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            },
            recipes: user.recipes,
            savedRecipes: formattedSavedRecipes,
            reviews: user.reviews,
            stats
        });

    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
