import prisma from "../db";

// Usage: npx ts-node --transpile-only src/scripts/updateImageUrls.ts [monsters|spells]
// Defaults to monsters if no argument is given.

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
    const [, , cardType = "monsters"] = process.argv;

    if (cardType !== "monsters" && cardType !== "spells") {
        console.error(`Unknown card type "${cardType}". Use "monsters" or "spells".`);
        process.exit(1);
    }

    const supabaseBase = baseUrl(process.env.SUPABASE_URL!);
    const storageBase = `${supabaseBase}/storage/v1/object/public/${BUCKET}`;

    if (cardType === "monsters") {
        const monsters = await prisma.monster.findMany({ select: { id: true, name: true } });
        console.log(`Updating imageUrl for ${monsters.length} monsters...`);
        for (const monster of monsters) {
            await prisma.monster.update({
                where: { id: monster.id },
                data: { imageUrl: `${storageBase}/${slugify(monster.name)}.png` },
            });
        }
        console.log(`✅ Done. Updated ${monsters.length} monsters.`);
    } else {
        const spells = await prisma.spell.findMany({ select: { id: true, name: true } });
        console.log(`Updating imageUrl for ${spells.length} spells...`);
        for (const spell of spells) {
            await prisma.spell.update({
                where: { id: spell.id },
                data: { imageUrl: `${storageBase}/${slugify(spell.name)}.png` },
            });
        }
        console.log(`✅ Done. Updated ${spells.length} spells.`);
    }

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});