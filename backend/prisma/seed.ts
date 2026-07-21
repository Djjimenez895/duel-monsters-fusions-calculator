import { execSync } from "child_process";
import path from "path";

const db = process.env.DATABASE_URL;

if (!db) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
}

const seedDir = path.join(__dirname, "../db_seed_data");

const files = ["card_data.sql", "seed_card_drop_data.sql", "seed_victory_bonuses_data.sql"];

for (const file of files) {
    console.log(`Running ${file}...`);
    execSync(`psql "${db}" -f "${path.join(seedDir, file)}"`, { stdio: "inherit" });
}

console.log("Seeding complete.");