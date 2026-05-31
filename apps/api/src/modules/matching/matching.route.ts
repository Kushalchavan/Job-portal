import { Router } from "express";
import {
  getCandidatePipelineController,
  getCandidatesByStatusController,
  getJobMatchesController,
  getResumeMatchesController,
  getTopCandidatesController,
  updateMatchStatusController,
} from "./matching.controller";

const router = Router();

router.get("/:jobId/matches", getJobMatchesController);
router.get("/:jobId/top-candidates", getTopCandidatesController);
router.get("/resume/:resumeId/matches", getResumeMatchesController);
router.patch("/:matchId/status", updateMatchStatusController);
router.get("/:jobId/candidates", getCandidatesByStatusController);
router.get("/:jobId/pipeline", getCandidatePipelineController);

export default router;
