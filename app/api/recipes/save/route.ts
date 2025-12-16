import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { recipeId } = await request.json();

        if (!recipeId) {
            return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
        }

        // Check if already saved
        const existingSave = await prisma.savedRecipe.findUnique({
            where: {
                userId_recipeId: {
                    userId,
                    recipeId,
                },
            },
        });

        if (existingSave) {
            // Unsave
            await prisma.savedRecipe.delete({
                where: {
                    id: existingSave.id,
                },
            });
            return NextResponse.json({ saved: false });
        } else {
            // Save
            await prisma.savedRecipe.create({
                data: {
                    userId,
                    recipeId,
                },
            });
            return NextResponse.json({ saved: true });
        }
    } catch (error) {
        console.error('Error toggling save recipe:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
