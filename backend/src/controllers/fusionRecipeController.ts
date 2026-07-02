import { Request, Response } from "express";
import { getFusionRecipesByMaterialNamePrefix } from "../services/fusionRecipeService";
import logger from "../logger";

export async function searchFusionRecipesByPrefix(req: Request, res: Response) {
    const { material } = req.query;

    if (!material || typeof material !== "string") {
        res.status(400).json({ message: "Query parameter 'material' is required." });
        return;
    }

    try {
        const recipes = await getFusionRecipesByMaterialNamePrefix(material);
        res.json(recipes);
    } catch (error) {
        logger.error("Failed to retrieve fusion recipes", { error });
        res.status(500).json({ message: "Failed to retrieve fusion recipes." });
    }
}