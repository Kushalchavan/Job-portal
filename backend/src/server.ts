import express from "express";
import type { Request, Response } from "express";
import { errorHandler } from "./middlewares/error.middleware";
import morgan from "morgan";
import { env } from "./config/env";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// All routes here
app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

// Error handler
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Application is running successfully on port ${env.port}`);
});
