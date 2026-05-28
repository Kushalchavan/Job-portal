import { Router } from "express";
import { uploadResume } from "./resume.controller";
import { resumeUpload } from "../../config/multer";

const router = Router();

router.post(
  "/upload",
  resumeUpload.single("resume"),
  uploadResume
);

export default router;