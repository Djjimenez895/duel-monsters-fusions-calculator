import { findAllMonsters } from "../repositories/monsterRepository";
import logger from "../logger";

export async function getMonsters() {
    logger.info("Returning all monsters from the DB.");
    return findAllMonsters();
}