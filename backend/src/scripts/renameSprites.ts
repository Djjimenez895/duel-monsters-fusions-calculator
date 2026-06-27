import prisma from "../db";
import { readdirSync, renameSync } from "fs";
import path from "path";

// Usage: npx ts-node --transpile-only src/scripts/renameSprites.ts <imageDir> [monsters|spells]
// Renames files like "001.png" → "blue-eyes-white-dragon.png" using card number from the DB.
// Defaults to monsters if no card type is specified.

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")  // non-alphanumeric runs → hyphen
        .replace(/^-+|-+$/g, "");      // trim leading/trailing hyphens
}

async function main() {
    const [, , imageDir, cardType = "monsters"] = process.argv;
    if (!imageDir) {
        console.error("Usage: npx ts-node --transpile-only src/scripts/renameSprites.ts <imageDir> [monsters|spells]");
        process.exit(1);
    }

    if (cardType !== "monsters" && cardType !== "spells") {
        console.error(`Unknown card type "${cardType}". Use "monsters" or "spells".`);
        process.exit(1);
    }

    const resolvedDir = path.resolve(imageDir);

    let numberToName: Map<number, string>;

    if (cardType === "monsters") {
        const rows = await prisma.monster.findMany({
            where: { monsterNumber: { not: null } },
            select: { monsterNumber: true, name: true },
        });
        numberToName = new Map(rows.map(r => [r.monsterNumber!, r.name]));
    } else {
        const rows = await prisma.spell.findMany({
            where: { cardNumber: { not: null } },
            select: { cardNumber: true, name: true },
        });
        numberToName = new Map(rows.map(r => [r.cardNumber!, r.name]));
    }

    console.log(`Loaded ${numberToName.size} ${cardType} from DB.`);

    const files = readdirSync(resolvedDir).filter(f => /^\d+\.png$/i.test(f));
    console.log(`Found ${files.length} numbered PNG files in ${resolvedDir}`);

    let renamed = 0;
    let skipped = 0;

    for (const file of files) {
        const cardNumber = parseInt(file, 10);
        const cardName = numberToName.get(cardNumber);

        if (!cardName) {
            console.warn(`  ⚠️  No DB ${cardType} for card #${cardNumber} (${file})`);
            skipped++;
            continue;
        }

        const slug = slugify(cardName);
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