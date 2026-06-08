import { Router } from "express";
import {
  getCandidatePipelineController,
  getCandidatesByStatusController,
  getJobMatchesController,
  getResumeMatchesController,
  getTopCandidatesController,
  updateMatchStatusController,
  getCandidateProfileController,
} from "./matching.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

router.get(
  "/:jobId/matches",
  verifyJWT,
  requireRole("RECRUITER"),
  getJobMatchesController,
);
router.get(
  "/:jobId/top-candidates",
  verifyJWT,
  requireRole("RECRUITER"),
  getTopCandidatesController,
);
router.get(
  "/resume/:resumeId/matches",
  verifyJWT,
  requireRole("RECRUITER"),
  getResumeMatchesController,
);
router.patch(
  "/:matchId/status",
  verifyJWT,
  requireRole("RECRUITER"),
  updateMatchStatusController,
);
router.get(
  "/:jobId/candidates",
  verifyJWT,
  requireRole("RECRUITER"),
  getCandidatesByStatusController,
);
router.get(
  "/:jobId/pipeline",
  verifyJWT,
  requireRole("RECRUITER"),
  getCandidatePipelineController,
);
router.get(
  "/candidate/:resumeId",
  verifyJWT,
  requireRole("RECRUITER"),
  getCandidateProfileController,
);

export default router;
