import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validation.middleware";
import {
  createJobController,
  deleteJobController,
  getJobByIdController,
  getJobsController,
  updateJobController,
} from "./job.controller";
import { createJobSchema, updateJobSchema } from "@repo/schemas";

const router = Router();

router.post(
  "/",
  verifyJWT,
  requireRole("RECRUITER"),
  validate(createJobSchema),
  createJobController,
);

router.put(
  "/:id",
  verifyJWT,
  requireRole("RECRUITER"),
  validate(updateJobSchema),
  updateJobController,
);

router.get("/", getJobsController);

router.get("/:id", getJobByIdController);

router.delete("/:id", verifyJWT, requireRole("RECRUITER"), deleteJobController);

export default router;
