import prisma from "../db";

// Usage: npx ts-node --transpile-only src/scripts/updateImageUrls.ts

const BUCKET = "duel-monster-images";

// Strips any path suffix (e.g. /rest/v1/) to get the bare project base URL.
function baseUrl(rawUrl: string): string {
    const url = new URL(rawUrl);
    return `${url.protocol}//${url.host}`;
}

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function main() {
    const supabaseBase = baseUrl(process.env.SUPABASE_URL!);
    const storageBase = `${supabaseBase}/storage/v1/object/public/${BUCKET}`;

    const monsters = await prisma.monster.findMany({
        select: { id: true, name: true },
    });

    console.log(`Updating imageUrl for ${monsters.length} monsters...`);

    let updated = 0;
    for (const monster of monsters) {
        const slug = slugify(monster.name);
        const imageUrl = `${storageBase}/${slug}.png`;

        await prisma.monster.update({
            where: { id: monster.id },
            data: { imageUrl },
        });

        updated++;
    }

    console.log(`✅ Done. Updated ${updated} monsters.`);
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});