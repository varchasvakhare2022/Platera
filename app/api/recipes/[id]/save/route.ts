import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logger } from '@/lib/logger';

/**
 * POST /api/recipes/[id]/save
 * Toggle save/unsave a recipe for the current user
 */
export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const params = await props.params;
        const recipeId = params.id;

        // Check if recipe exists
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
        });

        if (!recipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        // Check if already saved
        const existingSave = await prisma.savedRecipe.findUnique({
            where: {
                userId_recipeId: {
                    userId: user.id,
                    recipeId: recipeId,
                },
            },
        });

        if (existingSave) {
            // Unsave - delete the saved recipe
            await prisma.savedRecipe.delete({
                where: {
                    userId_recipeId: {
                        userId: user.id,
                        recipeId: recipeId,
                    },
                },
            });

            return NextResponse.json({
                saved: false,
                message: 'Recipe removed from saved',
            });
        } else {
            // Save - create new saved recipe
            await prisma.savedRecipe.create({
                data: {
                    userId: user.id,
                    recipeId: recipeId,
                },
            });

            return NextResponse.json({
                saved: true,
                message: 'Recipe saved successfully',
            });
        }
    } catch (error) {
        logger.error('Error toggling recipe save', error);
        return NextResponse.json(
            { error: 'Failed to save recipe' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/recipes/[id]/save
 * Check if recipe is saved by current user
 */
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ saved: false });
        }

        const params = await props.params;
        const recipeId = params.id;

        const savedRecipe = await prisma.savedRecipe.findUnique({
            where: {
                userId_recipeId: {
                    userId: user.id,
                    recipeId: recipeId,
                },
            },
        });

        return NextResponse.json({ saved: !!savedRecipe });
    } catch (error) {
        logger.error('Error checking recipe save status', error);
        return NextResponse.json({ saved: false });
    }
}
