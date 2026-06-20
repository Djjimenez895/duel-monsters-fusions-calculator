import type { MonsterAttribute } from "./monster-attributes";
import type { MonsterType } from "./monster-type";

/** Repesents a monster card in Duel Monsters.
 *
 */
export interface Monster {
    id: number;
    name: string;
    attribute: MonsterAttribute;
    monsterLevel: number;
    type: MonsterType[];
    description: string | null;
    attackPoints: number | null;
    defensePoints: number | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}