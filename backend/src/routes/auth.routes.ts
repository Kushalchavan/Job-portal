import express from "express";
import {
  getMe,
  loginController,
  registerController,
} from "../controller/auth.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", verifyJWT, getMe);

export default router;
