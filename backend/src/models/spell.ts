import { SpellType } from "./spell-type";

/* Represents a spell card in Duel Monsters. */
export interface Spell { 
    id: number; 
    name: string; 
    cardNumber: number | null;
    type: SpellType;
    description: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}