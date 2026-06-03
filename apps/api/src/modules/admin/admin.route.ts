import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import {
  blockUserController,
  getAllUsersController,
  unblockUserController,
  getAdminDashboardController,
} from "./admin.controller";

const router = Router();

router.get("/users", verifyJWT, requireRole("ADMIN"), getAllUsersController);

router.patch(
  "/users/:id/block",
  verifyJWT,
  requireRole("ADMIN"),
  blockUserController,
);

router.patch(
  "/users/:id/unblock",
  verifyJWT,
  requireRole("ADMIN"),
  unblockUserController,
);

router.get(
  "/dashboard",
  verifyJWT,
  requireRole("ADMIN"),
  getAdminDashboardController,
);

export default router;
