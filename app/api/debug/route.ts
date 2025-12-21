import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Test database connection
        const recipeCount = await prisma.recipe.count();
        const userCount = await prisma.user.count();

        // Get a sample recipe
        const sampleRecipe = await prisma.recipe.findFirst({
            select: {
                id: true,
                title: true,
                createdAt: true,
            }
        });

        return NextResponse.json({
            status: 'success',
            database: {
                connected: true,
                recipeCount,
                userCount,
                sampleRecipe,
            },
            environment: {
                nodeEnv: process.env.NODE_ENV,
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            environment: {
                nodeEnv: process.env.NODE_ENV,
                hasDatabaseUrl: !!process.env.DATABASE_URL,
            },
        }, { status: 500 });
    }
}
