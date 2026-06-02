import { Router } from "express";

import {
  getDashboardStatsController,
  getRecruiterDashboardStatsController,
} from "./dashboard.controller";

import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

router.get("/stats", getDashboardStatsController);

router.get(
  "/recruiter",
  verifyJWT,
  requireRole("RECRUITER"),
  getRecruiterDashboardStatsController,
);

export default router;
