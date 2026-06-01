import { Router } from "express";
import { validate } from "../../middlewares/validation.middleware";
import { getMe, loginController, registerController } from "./auth.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { loginSchema, registerSchema } from "../../validations/auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.get("/me", verifyJWT, getMe);

export default router;
