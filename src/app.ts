import express, { Application, Request, Response } from "express";
import cors from "cors";
import mainRouter from "./routes/index";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to PureYuna API Server!",
  });
});


app.use("/api/v1", mainRouter);

export default app;