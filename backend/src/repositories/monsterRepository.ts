import prisma from "../db";

export async function findAllMonsters() {
    return prisma.monster.findMany({ orderBy: {name: "asc"} });
}

