import { Router } from "express";
import { validate } from "../../middlewares/validation.middleware";
import { getMe, loginController, registerController } from "./auth.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { loginSchema, registerSchema } from "../../validations/auth.validation";
import { authRateLimiter } from "../../middlewares/rate-limit.middlware";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  registerController,
);

router.post("/login", authRateLimiter, validate(loginSchema), loginController);
router.get("/me", verifyJWT, getMe);

export default router;
