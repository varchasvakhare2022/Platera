
// Import from the project's centralized prisma instance
// We use relative path to avoid alias issues if tsconfig-paths is flaky
import { prisma } from '../lib/prisma';

async function main() {
    try {
        console.log('--- DIAGNOSIS STARTED (TS) ---');

        // Find potential duplicates
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

        // Log User Status
        users.forEach(u => {
            console.log(`USER | Name: ${u.name} | ID: ${u.id} | Email: ${u.email} | ClerkID: ${u.clerkId} | Recipes: ${u._count.recipes}`);
        });

        console.log('\n--- ATTEMPTING MERGE ---');

        // Identify Source (Has Recipes)
        const sourceUser = users.find(u => u._count.recipes > 0);

        // Identify Target (No Recipes, assuming current session)
        // If multiple exist, we pick the one that IS NOT the source.
        const targetUser = users.find(u => u.id !== sourceUser?.id);

        if (sourceUser && targetUser) {
            console.log(`MERGE PLAN: ${sourceUser.name} (${sourceUser.id}) -> ${targetUser.name} (${targetUser.id})`);

            // 1. Link Recipes
            const updateRecipes = await prisma.recipe.updateMany({
                where: { authorId: sourceUser.id },
                data: { authorId: targetUser.id }
            });
            console.log(`MOVED: ${updateRecipes.count} recipes.`);

            // 2. Link Reviews
            const updateReviews = await prisma.review.updateMany({
                where: { userId: sourceUser.id },
                data: { userId: targetUser.id }
            });
            console.log(`MOVED: ${updateReviews.count} reviews.`);

            // 3. Cleanup Orphan
            try {
                // Delete dependencies first
                await prisma.savedRecipe.deleteMany({ where: { userId: sourceUser.id } });
                await prisma.comment.deleteMany({ where: { userId: sourceUser.id } });

                // Delete user
                await prisma.user.delete({ where: { id: sourceUser.id } });
                console.log('SUCCESS: Orphan account deleted. Merge complete.');
            } catch (delErr) {
                console.error('WARNING: Cleanup failed (manual check required):', delErr);
            }

        } else {
            console.log('NO ACTION: Could not identify distinct Source and Target users.');
            if (users.length === 1) console.log('Only 1 user found. Recipe missing might be filtering issue?');
        }

    } catch (e) {
        console.error('FATAL ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
