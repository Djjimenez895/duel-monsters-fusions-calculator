import type { Monster } from "../models/monster";
import { findAllMonsters } from "../repositories/monsterRepository";
import logger from "../logger";

export async function getMonsters(): Promise<Monster[]> {
    logger.info("Returning all monsters from the DB.");
    return findAllMonsters();
}