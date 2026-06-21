import { readFileSync } from "fs";
import path from "path";
import prisma from "../db";

// Sample Usage: npx ts-node --transpile-only src/scripts/seedFusions.ts C:\Users\user\Downloads\dm1_fusions.txt
// This file relies on the raw text versions of the Duel Monsters Fusions yugipedia page. 
// At the time of writing this script, the link for this page is: https://yugipedia.com/wiki/List_of_Yu-Gi-Oh!_Duel_Monsters_Fusions

// The wiki uses DM1 in-game display names, which are truncated to ~18 characters and sometimes
// abbreviated (e.g. "D.Magician" instead of "Dark Magician"). Where the abbreviation can't be
// matched by a simple prefix check against the DB name, we map it explicitly here.
// If the script reports unresolved names that you know are in the DB, add them here.
const DM1_ALIASES: Record<string, string> = {
    "B.eye White Dragon": "Blue-Eyes White Dragon",
    "D.Magician": "Dark Magician",
    "Red-eyes B. Dragon": "Red-Eyes Black Dragon",
    "B.eye Ultimate Drag": "Blue-Eyes Ultimate Dragon",
    "The Little Swordsm": "Swordsman of Aile",
    "Unknown Warrior of": "Unknown Warrior",
    "Candle of Destiny":  "Candle of Fate",
    "Phantom Thief":      "Bewitching Phantom",
    "Wicked Mirror":      "Archfiend Mirror",
    "Ancient Tree of En": "Ancient Tree",
    "Life Eater":         "That Which Feeds",
    "Chronolord":         "Necrolancer",
    "Sea King of Fury":   "Furious Sea King",
    "Versago the Destro": "Versago Destroyer",
};

// Extracts all monster display names from a block of wiki text.
// The wiki encodes monster references as [[ArticleName (DM1)|DisplayName]].
// We only care about the DisplayName (the part after the pipe).
function extractMonsterNames(text: string): string[] {
    const names: string[] = [];
    const matches = text.matchAll(/\[\[[^\]]*\|([^\]]+)\]\]/g);
    for (const m of matches) {
        names.push(m[1].trim());
    }
    return names;
}

// Parses the {{DM Fusion Material}} template inside a single wiki section and returns
// the fusion groups it defines. Each group has two sides (m1 and m2): any monster from
// m1 can fuse with any monster from m2 to produce the section's result monster.
//
// The template format looks like this:
//   {{DM Fusion Material
//   | f1_m1 = #039: "[[Curse of Dragon (DM1)|Curse of Dragon]]"
//   | f1_m2 =
//   * #038: "[[Gaia The Fierce Kn (DM1)|Gaia The Fierce Kn]]"
//   * #021: "[[Mystic Horseman (DM1)|Mystic Horseman]]"
//   }}
// Multiple groups (f1, f2, f3...) can exist in one template, each with their own m1/m2 lists.
function parseTemplateGroups(sectionText: string): Array<{ m1: string[]; m2: string[] }> {
    const templateStart = sectionText.indexOf("{{DM Fusion Material");
    const templateEnd = sectionText.lastIndexOf("}}");
    if (templateStart === -1 || templateEnd === -1) return [];

    const content = sectionText.slice(templateStart + "{{DM Fusion Material".length, templateEnd);
    const lines = content.split("\n");

    // Walk line by line to collect each key, value block.
    // A line starting with | begins a new parameter; subsequent lines (bullet points) are
    // continuations of the current parameter's value.
    const params = new Map<string, string>();
    let currentKey: string | null = null;
    const currentLines: string[] = [];

    const flush = () => {
        if (currentKey) params.set(currentKey, currentLines.join("\n"));
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("|")) {
            flush();
            currentLines.length = 0;
            const eqIdx = trimmed.indexOf("=");
            if (eqIdx === -1) { currentKey = null; continue; }
            currentKey = trimmed.slice(1, eqIdx).trim();
            currentLines.push(trimmed.slice(eqIdx + 1));
        } else if (currentKey) {
            currentLines.push(line);
        }
    }
    flush();

    // Collect all group numbers that appear (f1, f2, f3...) by scanning the parameter keys.
    const groupNums = new Set<number>();
    for (const key of params.keys()) {
        const m = key.match(/^f(\d+)_m[12]$/);
        if (m) groupNums.add(Number(m[1]));
    }

    const groups: Array<{ m1: string[]; m2: string[] }> = [];
    for (const n of Array.from(groupNums).sort((a, b) => a - b)) {
        const m1 = extractMonsterNames(params.get(`f${n}_m1`) ?? "");
        const m2 = extractMonsterNames(params.get(`f${n}_m2`) ?? "");
        if (m1.length > 0 && m2.length > 0) {
            groups.push({ m1, m2 });
        }
    }
    return groups;
}

async function main() {
    const wikiFilePath = process.argv[2];
    if (!wikiFilePath) {
        console.error("Usage: npx ts-node src/scripts/seedFusions.ts <path-to-wiki-markup.txt>");
        process.exit(1);
    }

    const markup = readFileSync(path.resolve(wikiFilePath), "utf-8");

    // Each section header identifies the fusion result monster, e.g.: == 037: "Gaia the Dragon Ch" ==
    const sectionRegex = /==\s*\d+:\s*"([^"]+)"\s*==/g;
    const sections: Array<{ name: string; start: number }> = [];
    let match;
    while ((match = sectionRegex.exec(markup)) !== null) {
        sections.push({ name: match[1].trim(), start: match.index });
    }
    console.log(`Found ${sections.length} fusion result sections.`);

    // Expand each fusion group into individual (result, m1, m2) pairs using a cartesian product.
    // For example, if a group has 6 m1 options and 42 m2 options, that produces 252 individual pairs
    // because any monster from m1 can fuse with any monster from m2 to produce the result.
    const fusionPairs: Array<{ result: string; m1: string; m2: string }> = [];
    for (let i = 0; i < sections.length; i++) {
        const { name: resultName, start } = sections[i];
        const end = sections[i + 1]?.start ?? markup.length;
        const groups = parseTemplateGroups(markup.slice(start, end));
        for (const { m1, m2 } of groups) {
            for (const mat1 of m1) {
                for (const mat2 of m2) {
                    fusionPairs.push({ result: resultName, m1: mat1, m2: mat2 });
                }
            }
        }
    }
    console.log(`Expanded to ${fusionPairs.length} individual fusion pairs.`);

    // Load all monsters from the DB once and build a name → id lookup map.
    const allMonsters = await prisma.monster.findMany({ select: { id: true, name: true } });
    const exactMap = new Map<string, number>(allMonsters.map(m => [m.name, m.id]));

    // Resolves a wiki display name to a DB monster ID using three strategies in order:
    // 1. Explicit alias — for abbreviations that can't be prefix-matched (e.g. "D.Magician")
    // 2. Exact match — wiki name matches DB name exactly
    // 3. Prefix match — DB name starts with wiki name, which handles names truncated by DM1's
    //    18-character display limit (e.g. "Masaki the Legenda" → "Masaki the Legendary Swordsman")
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

    // Warn about any names we couldn't resolve so the user knows what was skipped.
    // Common causes: card not yet in the DB, or a new abbreviation needing an alias entry.
    const allWikiNames = new Set<string>(fusionPairs.flatMap(p => [p.result, p.m1, p.m2]));
    const unresolved = [...allWikiNames].filter(n => resolveId(n) === null);
    if (unresolved.length > 0) {
        console.warn(`\n⚠️  Could not resolve ${unresolved.length} monster name(s) — their fusions will be skipped:`);
        for (const n of unresolved) console.warn(`   - "${n}"`);
        console.warn(`   (Add entries to DM1_ALIASES in the script if these are abbreviations.)\n`);
    }

    // Load all existing recipes from the DB upfront so we can check for duplicates in O(1)
    // without hitting the DB on every iteration.
    //
    // Each recipe is fingerprinted as "resultId:smallerMaterialId:largerMaterialId".
    // Sorting the two material IDs before joining means (Dragon A + Dragon B) and
    // (Dragon B + Dragon A) produce the same key, so order doesn't matter.
    const existingRecipes = await prisma.fusionRecipe.findMany({
        select: { resultMonsterId: true, materials: { select: { materialMonsterId: true } } },
    });
    const existingKeys = new Set<string>();
    for (const r of existingRecipes) {
        const [a, b] = r.materials.map(m => m.materialMonsterId).sort((x, y) => x - y);
        if (a !== undefined && b !== undefined) {
            existingKeys.add(`${r.resultMonsterId}:${a}:${b}`);
        }
    }

    function recipeKey(resultId: number, m1Id: number, m2Id: number): string {
        const [a, b] = [m1Id, m2Id].sort((x, y) => x - y);
        return `${resultId}:${a}:${b}`;
    }

    let inserted = 0;
    let skipped = 0;
    let duplicates = 0;

    for (const pair of fusionPairs) {
        const resultId = resolveId(pair.result);
        const m1Id = resolveId(pair.m1);
        const m2Id = resolveId(pair.m2);

        // Skip if any monster in the trio couldn't be resolved to a DB id.
        if (!resultId || !m1Id || !m2Id) {
            skipped++;
            continue;
        }

        // Skip if this exact recipe already exists in the DB.
        const key = recipeKey(resultId, m1Id, m2Id);
        if (existingKeys.has(key)) {
            duplicates++;
            continue;
        }

        // Insert the recipe and both of its materials in a single transaction via Prisma's
        // nested write. Prisma automatically sets fusion_recipe_id on the material rows.
        await prisma.fusionRecipe.create({
            data: {
                resultMonsterId: resultId,
                materials: {
                    create: [
                        { materialMonsterId: m1Id },
                        { materialMonsterId: m2Id },
                    ],
                },
            },
        });

        existingKeys.add(key);
        inserted++;
        if (inserted % 100 === 0) console.log(`  Inserted ${inserted} recipes...`);
    }

    if (duplicates > 0) console.log(`  Skipped ${duplicates} already-existing recipes.`);
    console.log(`\n✅ Done. Inserted ${inserted} fusion recipes, skipped ${skipped} (unresolved names).`);
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
