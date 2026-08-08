import { execSync } from "child_process";
import path from "path";
import prisma from "../src/db";

const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
}

// Strip Prisma-specific query params (e.g. ?schema=...) that psql doesn't understand
const db = rawUrl.split("?")[0];

const seedDir = path.join(__dirname, "../db_seed_data");

const files: { file: string; count: () => Promise<number> }[] = [
    { file: "card_data.sql",                       count: () => prisma.monster.count() },
    { file: "seed_card_drop_data.sql",              count: () => prisma.monsterCardDrop.count() },
    { file: "seed_victory_bonuses_data.sql",        count: () => prisma.monsterVictoryBonus.count() },
    { file: "seed_spell_card_drop_data.sql",        count: () => prisma.spellCardDrop.count() },
    { file: "seed_spell_victory_bonuses_data.sql",  count: () => prisma.spellVictoryBonus.count() },
];

async function main() {
    for (const { file, count } of files) {
        const before = await count();
        console.log(`Running ${file}...`);
        execSync(`psql "${db}" -f "${path.join(seedDir, file)}"`, { stdio: "inherit" });
        const after = await count();
        console.log(`  Inserted ${after - before} row(s) (${after - before === 0 ? "all skipped" : `${before} already existed`}).`);
    }

    await prisma.$disconnect();
    console.log("Seeding complete.");
}

main();