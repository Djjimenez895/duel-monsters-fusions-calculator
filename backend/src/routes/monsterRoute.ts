import { Router } from "express";
import { getMonstersController } from "../controllers/monsterController";

const router = Router();

router.get("/", getMonstersController);

export default router;