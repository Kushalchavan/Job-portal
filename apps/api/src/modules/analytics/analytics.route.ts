import { Router } from "express";
import { getAnalyticsController } from "./analytics.controller";

const router = Router();

router.get("/", getAnalyticsController);

export default router;
