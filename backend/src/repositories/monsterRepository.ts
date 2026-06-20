import prisma from "../db";
import type { Monster } from "../models/monster";

export async function findAllMonsters(): Promise<Monster[]> {
    return prisma.monster.findMany({ orderBy: {name: "asc"} });
}

