import Router from "express";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validation.middleware";
import {
  createCompanyController,
  deleteCompanyController,
  getAllCompaniesController,
  getCompanyByIdController,
  updateCompanyController,
} from "./company.controller";
import { createCompanySchema, updateCompanySchema } from "./company.schema";

const router = Router();

router.post(
  "/",
  verifyJWT,
  requireRole("RECRUITER"),
  validate(createCompanySchema),
  createCompanyController,
);
router.put(
  "/:id",
  verifyJWT,
  requireRole("RECRUITER"),
  validate(updateCompanySchema),
  updateCompanyController,
);
router.get(
  "/my",
  verifyJWT,
  requireRole("RECRUITER"),
  getAllCompaniesController,
);
router.get("/:id", verifyJWT, getCompanyByIdController);
router.delete(
  "/:id",
  verifyJWT,
  requireRole("RECRUITER"),
  deleteCompanyController,
);

export default router;
