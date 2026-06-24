import prisma from "../db";
import { readdirSync, renameSync } from "fs";
import path from "path";

// Usage: npx ts-node --transpile-only src/scripts/renameSprites.ts <imageDir>
// Renames files like "001.png" → "blue-eyes-white-dragon.png" using monsterNumber from the DB.

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")  // non-alphanumeric runs → hyphen
        .replace(/^-+|-+$/g, "");      // trim leading/trailing hyphens
}

async function main() {
    const [, , imageDir] = process.argv;
    if (!imageDir) {
        console.error("Usage: npx ts-node --transpile-only src/scripts/renameSprites.ts <imageDir>");
        process.exit(1);
    }

    const resolvedDir = path.resolve(imageDir);

    // Load all monsters that have a monsterNumber set.
    const monsters = await prisma.monster.findMany({
        where: { monsterNumber: { not: null } },
        select: { monsterNumber: true, name: true },
    });

    const numberToName = new Map<number, string>(
        monsters.map(m => [m.monsterNumber!, m.name])
    );

    const files = readdirSync(resolvedDir).filter(f => /^\d+\.png$/i.test(f));
    console.log(`Found ${files.length} numbered PNG files in ${resolvedDir}`);

    let renamed = 0;
    let skipped = 0;

    for (const file of files) {
        const cardNumber = parseInt(file, 10);
        const monsterName = numberToName.get(cardNumber);

        if (!monsterName) {
            console.warn(`  ⚠️  No DB monster for card #${cardNumber} (${file})`);
            skipped++;
            continue;
        }

        const slug = slugify(monsterName);
        const oldPath = path.join(resolvedDir, file);
        const newPath = path.join(resolvedDir, `${slug}.png`);

        renameSync(oldPath, newPath);
        console.log(`  ${file} → ${slug}.png`);
        renamed++;
    }

    console.log(`\n✅ Done. Renamed ${renamed}, skipped ${skipped}.`);
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});