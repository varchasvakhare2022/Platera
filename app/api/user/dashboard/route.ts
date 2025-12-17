import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); // Or User not found
        }

        // No need to fetch user again, getCurrentUser returns full user object.
        // However, we need to ensure the select fields match what the frontend expects if we return `user` directly.
        // The original code selected specific fields. Prisma returns all by default.
        // We can just verify if we need to filter sensitive data.
        // getCurrentUser returns all fields.

        // Let's filter manually if needed, or arguably returning the full user object (excluding sensitive if any) is fine.
        // The original code only selected id, name, email, profileImage, createdAt.
        // We can construct a response object.

        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            createdAt: user.createdAt
        };

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

        // DEBUG DIAGNOSIS
        const duplicates = await prisma.user.findMany({
            where: { email: user.email },
            include: { _count: { select: { recipes: true } } }
        });

        const testRecipe = await prisma.recipe.findFirst({
            where: { title: 'test' },
            include: { author: { select: { id: true, email: true, clerkId: true } } }
        });

        const debug = {
            currentUser: { id: user.id, email: user.email, clerkId: user.clerkId },
            duplicates: duplicates.map(d => ({ id: d.id, recipes: d._count.recipes, clerkId: d.clerkId })),
            testRecipe: testRecipe ? {
                id: testRecipe.id,
                authorId: testRecipe.authorId,
                authorEmail: testRecipe.author?.email,
                isMatch: testRecipe.authorId === user.id
            } : 'NOT FOUND'
        };

        // WRITE DEBUG TO FILE
        try {
            const fs = require('fs');
            const path = require('path');
            const debugPath = path.join(process.cwd(), 'debug_output.json');
            fs.writeFileSync(debugPath, JSON.stringify(debug, null, 2));
        } catch (err) {
            console.error('Failed to write debug file', err);
        }

        return NextResponse.json({
            user: safeUser,
            recipes,
            savedRecipes: formattedSavedRecipes,
            reviews,
            stats,
            debug // Include debug info
        });

    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
