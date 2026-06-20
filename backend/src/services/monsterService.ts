import type { Monster } from "../models/monster";
import { findAllMonsters } from "../repositories/monsterRepository";

export async function getMonsters(): Promise<Monster[]> {
    return findAllMonsters();
}