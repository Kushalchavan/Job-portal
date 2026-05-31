import { Router } from "express";
import {
  getJobMatchesController,
  getResumeMatchesController,
  getTopCandidatesController,
} from "./matching.controller";

const router = Router();

router.get("/:jobId/matches", getJobMatchesController);
router.get("/:jobId/top-candidates", getTopCandidatesController);
router.get("/resume/:resumeId/matches", getResumeMatchesController);

export default router;
