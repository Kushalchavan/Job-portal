import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import morgan from "morgan";
import { env } from "./config/env";
import cors from "cors";
import logger from "./config/logger";
import helmet from "helmet";
import compression from "compression";

// Import listeners and workers
import "./listeners/notification.listener";
import "./listeners/resume.listener";
import "./listeners/job.listener";
import "./listeners/matching.listener";
import "./workers/notification.worker";
import "./workers/email.worker";

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
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

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

// Start the server
app.listen(env.port, () => {
  logger.info(`Server is running on port ${env.port}`);
  logger.info("Press Ctrl+C to stop the server");
});
