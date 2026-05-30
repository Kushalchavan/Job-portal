import { Router } from "express";
import { getJobMatchesController } from "./matching.controller";

const router = Router();

router.get("/:jobId/matches", getJobMatchesController);

export default router;
