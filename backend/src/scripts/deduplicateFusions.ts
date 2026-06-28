import prisma from "../db";

// Usage: npx ts-node --transpile-only src/scripts/deduplicateFusions.ts
// Finds and removes duplicate fusion recipes (same result + same materials).
// Keeps the recipe with the lowest ID in each duplicate group.

async function main() {
    const recipes = await prisma.fusionRecipe.findMany({
        include: {
            resultMonster: { select: { name: true } },
            materials: { select: { materialMonsterId: true } },
        },
        orderBy: { id: "asc" },
    });

    // Build a fingerprint: "resultId:mat1Id:mat2Id" (materials sorted so order doesn't matter)
    const seen = new Map<string, number>(); // fingerprint → first recipe id
    const duplicateIds: number[] = [];

    for (const recipe of recipes) {
        const sortedMaterials = recipe.materials
            .map(m => m.materialMonsterId)
            .sort((a, b) => a - b)
            .join(":");
        const fingerprint = `${recipe.resultMonsterId}:${sortedMaterials}`;

        if (seen.has(fingerprint)) {
            console.log(`  Duplicate: "${recipe.resultMonster.name}" (recipe #${recipe.id}, keeping #${seen.get(fingerprint)})`);
            duplicateIds.push(recipe.id);
        } else {
            seen.set(fingerprint, recipe.id);
        }
    }

    if (duplicateIds.length === 0) {
        console.log("No duplicates found.");
        await prisma.$disconnect();
        return;
    }

    console.log(`\nFound ${duplicateIds.length} duplicate recipe(s). Deleting...`);

    // Must delete materials first due to FK constraint.
    await prisma.fusionRecipeMaterial.deleteMany({
        where: { fusionRecipeId: { in: duplicateIds } },
    });

    await prisma.fusionRecipe.deleteMany({
        where: { id: { in: duplicateIds } },
    });

    console.log(`✅ Done. Removed ${duplicateIds.length} duplicate recipe(s).`);
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});