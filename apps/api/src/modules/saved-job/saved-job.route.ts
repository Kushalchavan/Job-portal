import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import {
  getSavedJobsController,
  saveJobController,
  unsaveJobController,
} from "./saved-job.controller";

const router = Router();

router.post("/:jobId", verifyJWT, requireRole("USER"), saveJobController);

router.get("/", verifyJWT, requireRole("USER"), getSavedJobsController);

router.delete("/:jobId", verifyJWT, requireRole("USER"), unsaveJobController);

export default router;
