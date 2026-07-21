import { execSync } from "child_process";
import path from "path";

const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
}

// Strip Prisma-specific query params (e.g. ?schema=...) that psql doesn't understand
const db = rawUrl.split("?")[0];

const seedDir = path.join(__dirname, "../db_seed_data");

const files = ["card_data.sql", "seed_card_drop_data.sql", "seed_victory_bonuses_data.sql"];

for (const file of files) {
    console.log(`Running ${file}...`);
    execSync(`psql "${db}" -f "${path.join(seedDir, file)}"`, { stdio: "inherit" });
}

console.log("Seeding complete.");