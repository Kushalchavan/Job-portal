import { Router } from "express";
import { requireRole } from "../../middlewares/role.middleware";
import { getNotifications, readNotification } from "./notification.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyJWT, requireRole("USER"), getNotifications);
router.patch("/:id/read", verifyJWT, requireRole("USER"), readNotification);

export default router;
