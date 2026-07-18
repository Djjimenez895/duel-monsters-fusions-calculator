import type { MonsterAttribute } from "./monster-attributes";
import type { MonsterType } from "./monster-type";

export interface MonsterCardDropDTO {
    duelistName: string;
    dropChance: number;
}

export interface MonsterVictoryBonusDTO {
    duelistName: string;
    winsRequired: number;
}

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
    monsterCardDrops: MonsterCardDropDTO[];
    monsterVictoryBonuses: MonsterVictoryBonusDTO[];
}

export interface FusionRecipeDTO {
    materials: MonsterDTO[];
    fusionResult: MonsterDTO;
}