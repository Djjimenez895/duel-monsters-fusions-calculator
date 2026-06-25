import { SpellType } from "./spell-type";

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