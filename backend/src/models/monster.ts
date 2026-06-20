import type { MonsterAttribute, MonsterType } from "../generated/prisma/client";

/** Represents a monster card in Duel Monsters. */
export interface Monster {
    id: number;
    name: string;
    attribute: MonsterAttribute;
    monsterLevel: number | null;
    type: MonsterType[];
    description: string | null;
    attackPoints: number | null;
    defensePoints: number | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}