
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Manual .env parser
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '..', '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key === 'DATABASE_URL') {
                    // Remove quotes if present
                    let val = valueParts.join('=').trim();
                    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
                    process.env.DATABASE_URL = val;
                    return;
                }
            }
        }
    } catch (e) {
        console.error('ENV ERROR:', e.message);
    }
}

loadEnv();

const prisma = new PrismaClient();

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
