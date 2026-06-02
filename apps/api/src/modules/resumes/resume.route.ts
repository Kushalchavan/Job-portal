import { Router } from "express";
import {
  uploadResumeController,
  getMyResumesController,
  getResumeByIdController,
  deleteResumeController,
} from "./resume.controller";
import { resumeUpload } from "../../config/multer";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

router.post(
  "/upload",
  verifyJWT,
  requireRole("USER"),
  resumeUpload.single("resume"),
  uploadResumeController,
);

router.get("/me", verifyJWT, requireRole("USER"), getMyResumesController);

router.get("/:id", verifyJWT, requireRole("USER"), getResumeByIdController);

router.delete("/:id", verifyJWT, requireRole("USER"), deleteResumeController);

export default router;
