import { Router } from "express";
import { searchFusionRecipesByPrefix } from "../controllers/fusionRecipeController";

const router = Router();

router.get("/search", searchFusionRecipesByPrefix);

export default router;