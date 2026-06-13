import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import { requestIdMiddleware } from "./middlewares/request-id.middleware";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { requestLoggerMiddleware } from "./middlewares/request-logger.middleware";
import { register } from "./config/metrics";
import { swaggerSpec, swaggerUi } from "./docs/swagger";

// Import routes here
import resumeRoutes from "./modules/resumes/resume.route";
import matchingRoutes from "./modules/matching/matching.route";
import dashboardRoute from "./modules/dashboard/dashboard.route";
import analyticsRoute from "./modules/analytics/analytics.route";
import notificationRoutes from "./modules/notification/notification.route";
import companyRoutes from "./modules/company/company.route";
import jobRoutes from "./modules/job/job.route";
import applicationRoutes from "./modules/application/application.route";
import authRoutes from "./modules/auth/auth.route";
import savedJobRoutes from "./modules/saved-job/saved-job.route";
import adminRoutes from "./modules/admin/admin.route";

const app = express();

/// Middlewares
app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({
    status: "ok",
  });
});

/// Metrics endpoint
app.get("/metrics", async (_, res) => {
  res.set("Content-Type", register.contentType);

  res.end(await register.metrics());
});

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// All routes here
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/resumes", resumeRoutes);
app.use("/api/v1/matching", matchingRoutes);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/analytics", analyticsRoute);
app.use("/api/v1/saved-jobs", savedJobRoutes);
app.use("/api/v1/admin", adminRoutes);

// Error handler
app.use(errorHandler);

export default app;
