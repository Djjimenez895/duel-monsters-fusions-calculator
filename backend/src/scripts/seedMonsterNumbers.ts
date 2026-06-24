import prisma from "../db";

// Sample usage: npx ts-node --transpile-only src/scripts/seedMonsterNumbers.ts

const SMW_API = "https://yugipedia.com/api.php";

// Same alias strategy as seedFusions.ts — wiki names that can't be prefix-matched to DB names.
// DB names that appear truncated below are stored that way in the DB (the seed used short names).
const DM1_ALIASES: Record<string, string> = {
    // Already-existing aliases from seedFusions
    "B-Eye White Dragon": "Blue-Eyes White Dragon",
    "Dark Magician": "Dark Magician",
    "Red-Eyes B. Dragon": "Red-Eyes Black Dragon",
    "B-Eyes Ultimate Dragon": "Blue-Eyes Ultimate Dragon",
    "The Little Swordsm": "Swordsman of Aile",
    "Unknown Warrior of Fiend": "Unknown Warrior",
    "Candle of Destiny": "Candle of Fate",
    "Phantom Thief": "Bewitching Phantom",
    "Wicked Mirror": "Archfiend Mirror",
    "Ancient Tree of Enlightenment": "Ancient Tree",
    "Life Eater": "That Which Feeds",
    "Chronolord": "Necrolancer",
    "Sea King Dragon": "Furious Sea King",
    "Versago the Destroyer": "Versago Destroyer",
    // New aliases for DM1-specific/abbreviated card names not resolvable by prefix matching
    "Blackland Dragon": "Blackland Fire Dra",      // Blackland Fire Dragon
    "Sword Arm Dragon": "Sword Arm of Drago",      // Sword Arm of Dragon
    "Exodia Forbidden": "Exod. of Forbidden",      // Exodia the Forbidden One
    "Wicked Worm Beast": "The Wicked Worm B",      // The Wicked Worm Beast
    "2-Headed King Rex": "Two-headed King Re",      // Two-Headed King Rex
    "Saggi the Clown": "Saggi the Dark Clo",       // Saggi the Dark Clown
    "Gaia Dragon Champ": "Gaia the Dragon Champion",
    "Gaia Fierce Knight": "Gaia the Fierce Knight",
    "Illusion Faceless": "Faceless Mage",           // Illusionist Faceless Mage
    "Perfect Great Moth": "Perfectly Ultimate",     // Perfectly Ultimate Great Moth
    "Cocoon Evolution": "Cocoon of Evolutio",       // Cocoon of Evolution
    "Soldier of Stone": "Giant Soldier of Stone",
    "Castle of Dark": "Castle of D. Magic",         // Castle of Dark Illusions/Magic
    "Wings of Flame": "Wings of Wicked Fl",         // Wings of Wicked Flame
    "Curtain of Dark": "Curtain of the Dar",        // Curtain of the Dark Ones
    "Goddess Third Eye": "All-seeing Goddess",      // Goddess with the Third Eye
    "Supporter Shadows": "Supporter in the S",      // Supporter in the Shadows
    "Yamatano Scroll": "Yamatano Dragon Sc",        // Yamatano Dragon Scroll
    "B-Eyed Sil. Zombie": "B.eye Silv. Zombie",    // Blue-Eyed Silver Zombie
    "Rhaimundos Red": "Rhaimundos of the",          // Rhaimundos of the Red Sword
    "Melting Red Shadow": "The Melting Red Sh",     // The Melting Red Shadow
    "Dark King Abyss": "Dark King of the A",        // Dark King of the Abyss
    "Archfiend Marmot": "Air Marmot of Nefa",       // Air/Archfiend Marmot of Nefa
    "Twin Long Rods #1": "Twin Long Rods#1",        // DB stores without space before #
    "Thunder Kid": "Kaminarikozou",                 // Japanese romanized name in DB
    "Kagemusha Blue": "B. Flame Kagemusha",         // Kagemusha of the Blue Flame
    "2-Mouth Darkruler": "Two-mouth Darkrule",      // Two-Mouth Darkruler
    "Roar Ocean Snake": "Roaring Ocean Snak",       // Roaring Ocean Snake
    "Dark Titan Terror": "Dark Titan of Terr",      // Dark Titan of Terror
    "Guardian Labyrinth": "Guardian of the La",     // Guardian of the Labyrinth
    "D. Assailant": "Dark Assailant",
    "Beastking of Swamp": "Beastking of the S",     // Beastking of the Swamps
    "Princess Tsurugi": "Princess of Tsurug",       // Princess of Tsurugi
    "Sectarian Secret": "Sectarian of Secre",       // Sectarian of Secrets
    "Ground Attacker": "Terra Bugroth",             // Ground Attacker Bugroth (DB uses Japanese name)
    "Protector Throne": "Protector of the T",       // Protector of the Throne
    "Dragoness Wicked": "Dragoness the Wick",       // Dragoness the Wicked Knight
    "Cyber Soldier Dark": "Cyber Soldier of D",     // Cyber Soldier of Darkworld
    "Dragon Ersatz Head": "Dragon Piper",           // Dragon Piper (TCG name for Dragon Ersatz)
    "3-Legged Zombies": "Three-legged Zombies",
};

interface SMWCard {
    cardNumber: number;
    name: string;
}

// Fetches all DM1 card numbers and names from Yugipedia's Semantic MediaWiki API.
// The API accepts the same #ask query used on the wiki page and returns JSON.
async function fetchDM1Cards(): Promise<SMWCard[]> {
    const query = [
        "[[Card number::+]]",
        "[[Release::Yu-Gi-Oh! Duel Monsters (video game)]]",
        "|?Card number=#",
        "|?English name=Card",
        "|limit=500",
        "|sort=Card number",
    ].join("");

    const url = `${SMW_API}?action=ask&query=${encodeURIComponent(query)}&format=json&api_version=3`;

    console.log("Fetching card list from Yugipedia SMW API...");
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Yugipedia API returned ${res.status}`);

    // The API returns results as { "0": { "CardName (DM1)": { printouts: {...} } }, "1": {...}, ... }
    // Each outer value is itself an object with one key (the card's fulltext title).
    // printouts["#"] and printouts["Card"] are plain string arrays, not object arrays.
    const json = await res.json() as {
        query: {
            results: Record<string, Record<string, {
                printouts: {
                    "#": string[];
                    "Card": string[];
                };
            }>>;
        };
    };

    const cards: SMWCard[] = [];
    for (const outerEntry of Object.values(json.query.results)) {
        for (const result of Object.values(outerEntry)) {
            const numberArr = result.printouts["#"];
            const nameArr = result.printouts["Card"];
            if (!numberArr?.length || !nameArr?.length) continue;

            cards.push({
                cardNumber: parseInt(numberArr[0], 10),
                name: nameArr[0],
            });
        }
    }

    return cards.sort((a, b) => a.cardNumber - b.cardNumber);
}

async function main() {
    const cards = await fetchDM1Cards();
    console.log(`Fetched ${cards.length} cards from Yugipedia.`);

    // Load all monsters from DB and build a name → id map.
    const allMonsters = await prisma.monster.findMany({ select: { id: true, name: true } });
    const exactMap = new Map<string, number>(allMonsters.map(m => [m.name, m.id]));

    // Resolves a wiki name to a DB monster ID using alias → exact → prefix matching.
    function resolveId(wikiName: string): number | null {
        const alias = DM1_ALIASES[wikiName];
        if (alias && exactMap.has(alias)) return exactMap.get(alias)!;
        if (exactMap.has(wikiName)) return exactMap.get(wikiName)!;
        const lower = wikiName.toLowerCase();
        for (const [dbName, id] of exactMap) {
            if (dbName.toLowerCase().startsWith(lower)) return id;
        }
        return null;
    }

    let updated = 0;
    let skipped = 0;

    for (const card of cards) {
        const id = resolveId(card.name);
        if (!id) {
            console.warn(`  ⚠️  No DB match for #${card.cardNumber}: "${card.name}"`);
            skipped++;
            continue;
        }

        await prisma.monster.update({
            where: { id },
            data: { monsterNumber: card.cardNumber },
        });

        updated++;
    }

    console.log(`\n✅ Done. Updated ${updated} monsters, skipped ${skipped}.`);
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});