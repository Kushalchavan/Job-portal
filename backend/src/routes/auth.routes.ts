import express from "express";
import {
  getMe,
  loginController,
  registerController,
} from "../controller/auth.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "../validations/auth.validation";

const router = express.Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.get("/me", verifyJWT, getMe);

export default router;
