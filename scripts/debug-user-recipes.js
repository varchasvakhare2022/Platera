
const { PrismaClient } = require('@prisma/client');

// Use correct property for recent Prisma versions
const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://neondb_owner:npg_RpVbdYXk2sP0@ep-blue-sea-a17l3fkr-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function main() {
  try {
    console.log('--- ALL USERS ---');
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { recipes: true }
        }
      }
    });

    users.forEach(u => {
      console.log(`User: ${u.name} | ID: ${u.id} | Email: ${u.email} | ClerkID: ${u.clerkId} | Recipes: ${u._count.recipes}`);
    });

    console.log('\n--- ALL RECIPES ---');
    const recipes = await prisma.recipe.findMany({
      include: { author: true }
    });

    recipes.forEach(r => {
      console.log(`Recipe: ${r.title} | ID: ${r.id} | Author: ${r.author?.name} (${r.authorId}) | Created: ${r.createdAt}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
