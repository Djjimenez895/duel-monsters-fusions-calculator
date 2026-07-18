import { findFusionRecipesByMaterialNamePrefix } from "../repositories/fusionRecipeRepository";
import logger from "../logger";

export async function getFusionRecipesByMaterialNamePrefix(materialNamePrefix: string) {
    logger.info(`Searching for fusions for the monster: ${materialNamePrefix}`);
    const recipes = await findFusionRecipesByMaterialNamePrefix(materialNamePrefix);
    logger.info(`Found ${recipes.length} recipe(s) for ${materialNamePrefix}`);

    return recipes.map((recipe) => ({
        fusionResult: recipe.resultMonster,
        materials: recipe.materials.map((m) => m.materialMonster),
    }));
}
