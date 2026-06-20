import type { FusionRecipeDTO } from "../dtos/fusionRecipeDTO";
import { findFusionRecipesByMaterialName } from "../repositories/fusionRecipeRepository";

export async function getFusionRecipesByMaterial(materialName: string): Promise<FusionRecipeDTO[]> {
    const recipes = await findFusionRecipesByMaterialName(materialName);

    return recipes.map((recipe) => ({
        fusionResult: recipe.resultMonster,
        materials: recipe.materials.map((m) => m.materialMonster),
    }));
}
