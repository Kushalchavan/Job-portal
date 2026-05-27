import express from "express";
import {
  createJobController,
  deleteJobController,
  getJobByIdController,
  getJobsController,
  updateJobController,
} from "../controller/job.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  createJobSchema,
  updateJobSchema,
} from "../validations/job.validation";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

router.get("/", getJobsController);
router.get("/:id", getJobByIdController);

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

router.delete("/:id", verifyJWT, requireRole("RECRUITER"), deleteJobController);

export default router;
