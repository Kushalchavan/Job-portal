import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validation.middleware";
import {
  applyToJobController,
  getApplicantsByJobController,
  getMyApplicationsController,
  updateApplicationStatusController,
  withdrawApplicationController,
} from "./application.controller";
import { applyJobSchema } from "@repo/schemas";

const router = Router();

router.post(
  "/",
  verifyJWT,
  requireRole("USER"),
  validate(applyJobSchema),
  applyToJobController,
);

router.get(
  "/me",
  verifyJWT,
  requireRole("USER"),
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
  requireRole("USER"),
  withdrawApplicationController,
);

export default router;