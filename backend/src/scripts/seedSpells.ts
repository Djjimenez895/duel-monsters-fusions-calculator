import prisma from "../db";
import type { SpellType } from "../generated/prisma/client";

// Usage: npx ts-node --transpile-only src/scripts/seedSpells.ts

const SMW_API = "https://yugipedia.com/api.php";

interface DM1Spell {
    cardNumber: number;
    name: string;
    description: string;
}

// Fetches DM1 spell cards with card number, name, and game-specific description.
async function fetchDM1Spells(): Promise<DM1Spell[]> {
    const query = [
        "[[Card type::Spell Card]]",
        "[[Release::Yu-Gi-Oh! Duel Monsters (video game)]]",
        "|?Card number=#",
        "|?English name=Name",
        "|?Lore=Description",
        "|limit=100",
        "|sort=Card number",
    ].join("");

    const url = `${SMW_API}?action=ask&query=${encodeURIComponent(query)}&format=json&api_version=3`;
    console.log("Fetching DM1 spell list from Yugipedia...");

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Yugipedia API returned ${res.status}`);

    const json = await res.json() as {
        query: { results: Record<string, Record<string, { printouts: Record<string, any[]> }>> };
    };

    const spells: DM1Spell[] = [];
    for (const outerEntry of Object.values(json.query.results)) {
        for (const result of Object.values(outerEntry)) {
            const numberArr = result.printouts["#"];
            const nameArr = result.printouts["Name"];
            const descArr = result.printouts["Description"];
            if (!numberArr?.length || !nameArr?.length) continue;

            const rawDesc = descArr?.[0] ?? "";
            // Strip wiki link markup: [[link|label]] → label, [[word]] → word
            const description = rawDesc.replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, "$1");

            spells.push({
                cardNumber: parseInt(numberArr[0], 10),
                name: typeof nameArr[0] === "string" ? nameArr[0] : nameArr[0].fulltext,
                description,
            });
        }
    }

    return spells.sort((a, b) => a.cardNumber - b.cardNumber);
}

// Hard-coded spell types for all 50 DM1 spell cards.
// Querying Yugipedia for these hits wiki OR-filter restrictions, so we use known data instead.
function buildSpellTypeMap(): Map<string, SpellType> {
    const entries: [string, SpellType][] = [
        // Equip spells (#301–328, minus the non-equip exceptions below)
        ["Legendary Sword",     "Equip"],
        ["Sword of Dark",       "Equip"],
        ["Dark Energy",         "Equip"],
        ["Axe of Despair",      "Equip"],
        ["Lazer Cannon Armor",  "Equip"],
        ["Insect Armor Laser",  "Equip"],
        ["Elf's Light",         "Equip"],
        ["Beast Fangs",         "Equip"],
        ["Steel Shell",         "Equip"],
        ["Vile Germs",          "Equip"],
        ["Black Pendant",       "Equip"],
        ["Silver Bow & Arrow",  "Equip"],
        ["Horn of Light",       "Equip"],
        ["Horn of Unicorn",     "Equip"],
        ["Dragon Treasure",     "Equip"],
        ["Electro-Whip",        "Equip"],
        ["Cyber Shield",        "Equip"],
        ["Mystical Moon",       "Equip"],
        ["Malevolent Nuzzler",  "Equip"],
        ["Violet Crystal",      "Equip"],
        ["Book of Secret Art",  "Equip"],
        ["Invigoration",        "Equip"],
        ["Machine Conversion",  "Equip"],
        ["Raise Body Heat",     "Equip"],
        ["Follow Wind",         "Equip"],
        ["Power of Kaishin",    "Equip"],
        // Normal spells
        ["Elegant Egotist",     "Normal"],
        ["Stop Defense",        "Normal"],
        ["Dark Hole",           "Normal"],
        ["Raigeki",             "Normal"],
        ["Mooyan Curry",        "Normal"],
        ["Red Medicine",        "Normal"],
        ["Goblin's Remedy",     "Normal"],
        ["Soul of the Pure",    "Normal"],
        ["Dian Keto the Cure",  "Normal"],
        ["Sparks",              "Normal"],
        ["Hinotama",            "Normal"],
        ["Final Flame",         "Normal"],
        ["Ookazi",              "Normal"],
        ["Tremendous Fire",     "Normal"],
        ["Swords Revealing",    "Normal"],
        ["Dark-Pierce Light",   "Normal"],
        // Continuous spells
        ["Dragon Capture Jar",  "Continuous"],
        ["Spellbind Circle",    "Continuous"],
        // Field spells
        ["Forest",              "Field"],
        ["Wasteland",           "Field"],
        ["Mountain",            "Field"],
        ["Sogen",               "Field"],
        ["Umi",                 "Field"],
        ["Yami",                "Field"],
    ];
    return new Map(entries);
}

async function main() {
    const spells = await fetchDM1Spells();
    console.log(`Fetched ${spells.length} DM1 spell cards.`);

    const typeMap = buildSpellTypeMap();
    console.log(`Spell type map has ${typeMap.size} entries.`);

    let inserted = 0;
    let skipped = 0;

    for (const spell of spells) {
        const type = typeMap.get(spell.name);

        if (!type) {
            console.warn(`No spell type found for #${spell.cardNumber}: "${spell.name}" — skipping`);
            skipped++;
            continue;
        }

        await prisma.spell.upsert({
            where: { name: spell.name },
            create: {
                name: spell.name,
                cardNumber: spell.cardNumber,
                type,
                description: spell.description,
            },
            update: {
                cardNumber: spell.cardNumber,
                type,
                description: spell.description,
            },
        });

        inserted++;
    }

    console.log(`\nDone. Inserted/updated ${inserted} spells, skipped ${skipped}.`);
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});