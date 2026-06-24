import type { FusionRecipeDTO } from "../dtos/fusionRecipeDTO";
import { findFusionRecipesByMaterialName } from "../repositories/fusionRecipeRepository";
import logger from "../logger";

export async function getFusionRecipesByMaterial(materialName: string): Promise<FusionRecipeDTO[]> {
    logger.info(`Searching for fusions for the monster: ${materialName}`);
    const recipes = await findFusionRecipesByMaterialName(materialName);
    logger.info(`Found ${recipes.length} recipe(s) for ${materialName}`);

    return recipes.map((recipe) => ({
        fusionResult: recipe.resultMonster,
        materials: recipe.materials.map((m) => m.materialMonster),
    }));
}
