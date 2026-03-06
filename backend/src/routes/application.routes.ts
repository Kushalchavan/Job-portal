import express from "express";
import {
  applyToJobController,
  getApplicantsByJobController,
  getMyApplicationsController,
  updateApplicationStatusController,
} from "../controller/application.controller";
import { requireRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validation.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import { applyJobSchema } from "../validations/application.validation";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  requireRole("CANDIDATE"),
  validate(applyJobSchema),
  applyToJobController,
);

router.get(
  "/me",
  verifyJWT,
  requireRole("CANDIDATE"),
  getMyApplicationsController,
);

router.get(
  "/job/:jobId",
  verifyJWT,
  requireRole("RECRUITER"),
  getApplicantsByJobController,
);

router.patch(
  "/:id/status",
  verifyJWT,
  requireRole("RECRUITER"),
  updateApplicationStatusController,
);

router.delete(
  "/:id",
  verifyJWT,
  requireRole("CANDIDATE"),
  updateApplicationStatusController,
);

export default router;
