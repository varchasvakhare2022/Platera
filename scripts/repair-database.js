
const { PrismaClient } = require('@prisma/client');

// Use the legacy datasources syntax which is more robust
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://neondb_owner:npg_RpVbdYXk2sP0@ep-blue-sea-a17l3fkr-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
        }
    }
});

async function main() {
    try {
        console.log('--- DIAGNOSIS STARTED ---');
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
            // Find orphan (has recipes)
            const sourceUser = users.find(u => u._count.recipes > 0);

            // Find current target (no recipes, assuming this is likely the "active" broken one)
            // Ideally we would check process.env for current ID but we are outside app context.
            // We assume the one with 0 recipes is the new one the user is complaining about.
            const targetUser = users.find(u => u.id !== sourceUser?.id);

            if (sourceUser && targetUser) {
                console.log(`MERGING: Moving recipes from ${sourceUser.name} (${sourceUser.id}) -> ${targetUser.name} (${targetUser.id})`);

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

                // 3. Delete Orphan User
                try {
                    await prisma.savedRecipe.deleteMany({ where: { userId: sourceUser.id } });
                    await prisma.comment.deleteMany({ where: { userId: sourceUser.id } });
                    await prisma.user.delete({ where: { id: sourceUser.id } });
                    console.log('DELETED: Orphan source user removed.');
                    console.log('SUCCESS: Account merge complete.');
                } catch (delErr) {
                    console.error('WARNING: Could not delete source user, but recipes are moved.', delErr);
                }

            } else {
                console.log('SKIPPING: Could not safely identify Source and Target users.');
            }
        } else {
            console.log('NO DUPLICATES FOUND.');
        }

    } catch (e) {
        console.error('FATAL ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
