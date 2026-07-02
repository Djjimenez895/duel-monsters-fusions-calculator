import prisma from "../db";

const monsterSelect = {
    name: true,
    attribute: true,
    monsterLevel: true,
    monsterNumber: true,
    type: true,
    description: true,
    attackPoints: true,
    defensePoints: true,
    imageUrl: true,
};

/* Returns fusion recipes that contain the given prefix in the materials. 
   For example, entering "fie" would return the fusion recipe: 
   Fiend Sword + Judge Man = Gaia the Fierce Knight 
*/
export async function findFusionRecipesByMaterialNamePrefix(materialNamePrefix: string) {
    return prisma.fusionRecipe.findMany({
        where: {
            materials: {
                some: {
                    materialMonster: {
                        name: { startsWith: materialNamePrefix, mode: "insensitive" },
                    },
                },
            },
        },
        select: {
            resultMonster: { select: monsterSelect },
            materials: {
                select: {
                    materialMonster: { select: monsterSelect },
                },
            },
        },
        orderBy: {
            resultMonster: { attackPoints: "desc" },
        },
    });
}