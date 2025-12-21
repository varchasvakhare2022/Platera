import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logger } from '@/lib/logger';

/**
 * GET /api/user/saved-recipes
 * Get all saved recipes for the current user
 */
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const savedRecipes = await prisma.savedRecipe.findMany({
            where: {
                userId: user.id,
            },
            include: {
                recipe: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                clerkId: true,
                                name: true,
                                profileImage: true,
                            },
                        },
                        reviews: {
                            select: {
                                rating: true,
                            },
                        },
                        _count: {
                            select: {
                                reviews: true,
                                comments: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Calculate average rating for each recipe
        const recipesWithRating = savedRecipes.map((saved) => ({
            ...saved,
            recipe: {
                ...saved.recipe,
                avgRating:
                    saved.recipe.reviews.length > 0
                        ? saved.recipe.reviews.reduce((sum, r) => sum + r.rating, 0) /
                        saved.recipe.reviews.length
                        : 0,
            },
        }));

        return NextResponse.json({ savedRecipes: recipesWithRating });
    } catch (error) {
        logger.error('Error fetching saved recipes', error);
        return NextResponse.json(
            { error: 'Failed to fetch saved recipes' },
            { status: 500 }
        );
    }
}
