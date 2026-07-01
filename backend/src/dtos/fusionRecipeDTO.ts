import type { MonsterAttribute, MonsterType } from "../generated/prisma/client";

export interface MonsterDTO {
    name: string;
    attribute: MonsterAttribute;
    monsterLevel: number | null;
    monsterNumber: number | null;
    type: MonsterType[];
    description: string | null;
    attackPoints: number | null;
    defensePoints: number | null;
    imageUrl: string | null;
}

export interface FusionRecipeDTO {
    materials: MonsterDTO[];
    fusionResult: MonsterDTO;
}