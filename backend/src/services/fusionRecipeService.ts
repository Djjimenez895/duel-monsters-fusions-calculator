import { findFusionRecipesByMaterialNamePrefix } from "../repositories/fusionRecipeRepository";
import { duelistLabels } from "../utils/duelistLabels";
import logger from "../logger";

type MonsterWithDrops = Awaited<ReturnType<typeof findFusionRecipesByMaterialNamePrefix>>[number]["resultMonster"];

function mapMonster(monster: MonsterWithDrops) {
    return {
        ...monster,
        monsterCardDrops: monster.monsterCardDrops.map((drop) => ({
            ...drop,
            duelistName: duelistLabels[drop.duelistName],
        })),
        monsterVictoryBonuses: monster.monsterVictoryBonuses.map((bonus) => ({
            ...bonus,
            duelistName: duelistLabels[bonus.duelistName],
        })),
    };
}

export async function getFusionRecipesByMaterialNamePrefix(materialNamePrefix: string) {
    logger.info(`Searching for fusions for the monster: ${materialNamePrefix}`);
    const recipes = await findFusionRecipesByMaterialNamePrefix(materialNamePrefix);
    logger.info(`Found ${recipes.length} recipe(s) for ${materialNamePrefix}`);

    return recipes.map((recipe) => ({
        fusionResult: mapMonster(recipe.resultMonster),
        materials: recipe.materials.map((m) => mapMonster(m.materialMonster)),
    }));
}
