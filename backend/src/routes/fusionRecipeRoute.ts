import { Router } from "express";
import { getFusionRecipesByMaterialController } from "../controllers/fusionRecipeController";

const router = Router();

router.get("/search", getFusionRecipesByMaterialController);

export default router;