import express from 'express';
import type { Request, Response } from "express";
import { errorHandler } from './middlewares/error.middleware';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(morgan("dev"));

// All routes here
app.get("/", (req: Request, res:Response) => {
    res.send("hello world")
})

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Application is running successfully on port ${PORT}`)
})