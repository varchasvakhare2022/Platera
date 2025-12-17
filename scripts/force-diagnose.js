
const { PrismaClient } = require('@prisma/client');

// Force-feeding the connection string from the previous context
// postgresql://neondb_owner:npg_RpVbdYXk2sP0@ep-blue-sea-a17l3fkr-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://neondb_owner:npg_RpVbdYXk2sP0@ep-blue-sea-a17l3fkr-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
        }
    }
});

async function main() {
    try {
        console.log('--- FORCE DIAGNOSIS ---');

        // 1. Find "test" recipe
        const recipes = await prisma.recipe.findMany({
            where: {
                OR: [
                    { title: { contains: 'test', mode: 'insensitive' } },
                    { title: { contains: 'Egg', mode: 'insensitive' } } // Assuming user made an egg recipe
                ]
            },
            include: { author: true }
        });

        console.log(`FOUND ${recipes.length} RECIPES:`);
        recipes.forEach(r => {
            console.log(` - Recipe: "${r.title}" (ID: ${r.id})`);
            console.log(`   Owner: ${r.author.name} (ID: ${r.authorId}) (Clerk: ${r.author.clerkId})`);
        });

        // 2. Find ALL users named Varchasva
        const users = await prisma.user.findMany({
            where: { name: { contains: 'Varchasva', mode: 'insensitive' } },
            include: { _count: { select: { recipes: true } } }
        });

        console.log('\nFOUND USERS:');
        users.forEach(u => {
            console.log(` - User: ${u.name} | ID: ${u.id}`);
            console.log(`   ClerkID: ${u.clerkId}`);
            console.log(`   Recipe Count: ${u._count.recipes}`);
            console.log(`   Email: ${u.email}`);
        });

    } catch (e) {
        console.error('ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
