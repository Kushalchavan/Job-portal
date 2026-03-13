import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import morgan from "morgan";
import { env } from "./config/env";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import companyRoutes from "./routes/company.route";
import applicationRoutes from "./routes/application.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// All routes here
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/applications", applicationRoutes);

// Error handler
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Application is running successfully on port ${env.port}`);
});
