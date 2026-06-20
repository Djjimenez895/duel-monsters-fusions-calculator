import { Request, Response } from "express";
import { getMonsters } from "../services/monsterService";

export async function getMonstersController(_req: Request, res: Response) {
    try {
        const monsters = await getMonsters();
        res.json(monsters);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve monsters." });
    }
}