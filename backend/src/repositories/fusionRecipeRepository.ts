import prisma from "../db";

const monsterSelect = {
    name: true,
    attribute: true,
    monsterLevel: true,
    type: true,
    description: true,
    attackPoints: true,
    defensePoints: true,
    imageUrl: true,
};

export async function findFusionRecipesByMaterialName(materialName: string) {
    return prisma.fusionRecipe.findMany({
        where: {
            materials: {
                some: {
                    materialMonster: {
                        name: { startsWith: materialName, mode: "insensitive" },
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
    });
}