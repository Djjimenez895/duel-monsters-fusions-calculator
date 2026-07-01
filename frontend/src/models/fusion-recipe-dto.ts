import type { MonsterAttribute } from "./monster-attributes";
import type { MonsterType } from "./monster-type";

export interface MonsterDTO {
    name: string;
    monsterNumber: number | null;
    attribute: MonsterAttribute;
    monsterLevel: number | null;
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