import { Request, Response } from "express";
import { getMonsters } from "../services/monsterService";
import logger from "../logger";

export async function getMonstersController(_req: Request, res: Response) {
    try {
        const monsters = await getMonsters();
        res.json(monsters);
    } catch (error) {
        logger.error("Failed to retrieve monsters", { error });
        res.status(500).json({ message: "Failed to retrieve monsters." });
    }
}