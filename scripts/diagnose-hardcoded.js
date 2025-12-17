
const { PrismaClient } = require('@prisma/client');

// HARDCODED URL TO BYPASS ALL ENV ISSUES
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://neondb_owner:npg_RpVbdYXk2sP0@ep-blue-sea-a17l3fkr-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
        }
    }
});

async function main() {
    try {
        console.log('\n=== DIAGNOSIS: RECIPE OWNER ===');

        // 1. Find the specific recipe "test"
        const recipe = await prisma.recipe.findFirst({
            where: { title: 'test' },
            include: { author: true }
        });

        if (!recipe) {
            console.log('CRITICAL: Recipe "test" NOT FOUND in database.');
        } else {
            console.log(`RECIPE FOUND: "${recipe.title}" (ID: ${recipe.id})`);
            console.log(`AUTHOR: ${recipe.author?.name}`);
            console.log(`AUTHOR ID: ${recipe.authorId}`);
            console.log(`AUTHOR EMAIL: ${recipe.author?.email}`);
            console.log(`AUTHOR CLERK ID: ${recipe.author?.clerkId}`);
        }

        console.log('\n=== DIAGNOSIS: ALL USERS NAMED VARCHASVA ===');
        const users = await prisma.user.findMany({
            where: { name: { contains: 'Varchasva', mode: 'insensitive' } },
            include: { _count: { select: { recipes: true } } }
        });

        users.forEach(u => {
            console.log(`USER: ${u.name}`);
            console.log(`   ID: ${u.id}`);
            console.log(`   Email: ${u.email}`);
            console.log(`   ClerkID: ${u.clerkId}`);
            console.log(`   Recipe Count: ${u._count.recipes}`);
            console.log('-------------------');
        });

    } catch (e) {
        console.error('FATAL ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
