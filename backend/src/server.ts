import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import morgan from "morgan";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// All routes here
app.use("/api/v1/auth", authRoutes);

// Error handler
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Application is running successfully on port ${env.port}`);
});
