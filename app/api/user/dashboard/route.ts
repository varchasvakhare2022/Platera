import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch User Basic Info
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                createdAt: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Fetch User's Recipes
        const recipes = await prisma.recipe.findMany({
            where: { authorId: user.id },
            include: {
                _count: {
                    select: { reviews: true, comments: true }
                },
                author: {
                    select: { id: true, name: true, profileImage: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // 3. Fetch Saved Recipes
        const savedRecipes = await prisma.savedRecipe.findMany({
            where: { userId: user.id },
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
        });

        // 4. Fetch User's Reviews
        const reviews = await prisma.review.findMany({
            where: { userId: user.id },
            include: {
                recipe: {
                    select: { id: true, title: true, images: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate Stats
        const stats = {
            totalRecipes: recipes.length,
            totalReviews: reviews.length,
            totalSaved: savedRecipes.length,
            // Calculate total reviews received on user's recipes
            totalReviewsReceived: recipes.reduce((acc, recipe) => acc + recipe._count.reviews, 0)
        };

        // Format Saved Recipes to match Recipe interface
        const formattedSavedRecipes = savedRecipes.map(saved => ({
            ...saved.recipe,
            savedAt: saved.createdAt
        }));

        return NextResponse.json({
            user,
            recipes,
            savedRecipes: formattedSavedRecipes,
            reviews,
            stats
        });

    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
