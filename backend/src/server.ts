import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import morgan from "morgan";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import companyRoutes from "./routes/company.route";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// All routes here
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/companies", companyRoutes);

// Error handler
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Application is running successfully on port ${env.port}`);
});
