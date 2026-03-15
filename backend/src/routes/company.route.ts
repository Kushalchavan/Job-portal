import express from "express";
import {
  createCompanyController,
  deleteCompanyController,
  getAllCompaniesController,
  getCompanyByIdController,
  updateCompanyController,
} from "../controller/company.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  createCompanySchema,
  updateCompanySchema,
} from "../validations/company.validation";

const router = express.Router();

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
router.get("/:id", verifyJWT,getCompanyByIdController);
router.delete(
  "/:id",
  verifyJWT,
  requireRole("RECRUITER"),
  deleteCompanyController,
);

export default router;
