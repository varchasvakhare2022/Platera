
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
                    console.log('ENV: DATABASE_URL loaded manually.');
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
        console.log('--- DIAGNOSIS STARTED (FINAL JS) ---');
        console.log(`Connecting to: ${process.env.DATABASE_URL?.substring(0, 20)}...`);

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: 'Varchasva', mode: 'insensitive' } },
                    { name: { contains: 'Khare', mode: 'insensitive' } }
                ]
            },
            include: {
                _count: {
                    select: { recipes: true }
                }
            }
        });

        users.forEach(u => {
            console.log(`USER | Name: ${u.name} | ID: ${u.id} | Email: ${u.email} | ClerkID: ${u.clerkId} | Recipes: ${u._count.recipes}`);
        });

        if (users.length > 1) {
            console.log('\n--- ATTEMPTING MERGE ---');

            // Source: Has recipes
            const sourceUser = users.find(u => u._count.recipes > 0);

            // Target: No recipes (Assumption: This is the active broken session)
            // Ideally we check created date, picking the newer one as target if it has newer clerkId
            // But simply "Not Source" is a safe heuristic for 2 users.
            const targetUser = users.find(u => u.id !== sourceUser?.id);

            if (sourceUser && targetUser) {
                console.log(`MERGE PLAN: ${sourceUser.name} (${sourceUser.id}) -> ${targetUser.name} (${targetUser.id})`);

                // 1. Move Recipes
                const updateRecipes = await prisma.recipe.updateMany({
                    where: { authorId: sourceUser.id },
                    data: { authorId: targetUser.id }
                });
                console.log(`MOVED: ${updateRecipes.count} recipes.`);

                // 2. Move Reviews
                const updateReviews = await prisma.review.updateMany({
                    where: { userId: sourceUser.id },
                    data: { userId: targetUser.id }
                });
                console.log(`MOVED: ${updateReviews.count} reviews.`);

                // 3. Delete Orphan
                try {
                    await prisma.savedRecipe.deleteMany({ where: { userId: sourceUser.id } });
                    await prisma.comment.deleteMany({ where: { userId: sourceUser.id } });
                    await prisma.user.delete({ where: { id: sourceUser.id } });
                    console.log('SUCCESS: Orphan account deleted. Merge complete.');
                } catch (delErr) {
                    console.error('WARNING: Cleanup failed:', delErr);
                }

            } else {
                console.log('SKIPPING: Could not identify Source (Recipes > 0) and Target (Other).');
            }
        } else {
            console.log('NO DUPLICATES FOUND: Check list above.');
        }

    } catch (e) {
        console.error('FATAL ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
