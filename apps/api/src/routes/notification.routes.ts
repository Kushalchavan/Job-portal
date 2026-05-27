import express from "express";
import {
  getNotifications,
  readNotification,
} from "../controller/notification.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = express.Router();

router.get("/", verifyJWT, requireRole("USER"), getNotifications);
router.patch("/:id/read", verifyJWT, requireRole("USER"), readNotification);

export default router;
