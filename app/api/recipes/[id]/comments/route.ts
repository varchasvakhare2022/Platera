import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sanitizeText } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

/**
 * GET /api/recipes/[id]/comments
 * Get all comments for a recipe
 */
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;

        // Fetch top-level comments with their replies
        const comments = await prisma.comment.findMany({
            where: {
                recipeId: params.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(comments);
    } catch (error) {
        logger.error('Error fetching comments', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

/**
 * POST /api/recipes/[id]/comments
 * Create a comment on a recipe
 */
export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { content, parentId } = body;

        // Validation
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
        }

        if (content.length > 1000) {
            return NextResponse.json({ error: 'Comment must be less than 1000 characters' }, { status: 400 });
        }

        // Sanitize content
        const sanitizedContent = sanitizeText(content.trim());

        // If parentId is provided, verify it exists and belongs to this recipe
        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
            });

            if (!parentComment || parentComment.recipeId !== params.id) {
                return NextResponse.json({ error: 'Invalid parent comment' }, { status: 400 });
            }
        }

        const comment = await prisma.comment.create({
            data: {
                content: sanitizedContent,
                userId: user.id,
                recipeId: params.id,
                parentId: parentId || null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
            },
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        logger.error('Error creating comment', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
