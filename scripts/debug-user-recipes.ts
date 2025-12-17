
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- USERS ---');
    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: { recipes: true }
            }
        }
    });
    console.table(users.map(u => ({
        id: u.id,
        clerkId: u.clerkId,
        name: u.name,
        email: u.email,
        recipeCount: u._count.recipes
    })));

    console.log('\n--- RECIPES ---');
    const recipes = await prisma.recipe.findMany({
        include: { author: true }
    });
    console.table(recipes.map(r => ({
        id: r.id,
        title: r.title,
        authorId: r.authorId,
        authorName: r.author?.name || 'UNKNOWN'
    })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
