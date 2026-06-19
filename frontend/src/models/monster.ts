import type { MonsterAttribute } from "./monster-attributes";
import type { MonsterType } from "./monster-type";

/** Repesents a monster card in Duel Monsters.
 * 
 */
export interface Monster { 
    name: string;
    attribute: MonsterAttribute;
    monsterLevel: number;
    type: MonsterType[];
    description: string;
    attackPoints: number;
    defensePoints: number;
    imageUrl?: string;
}