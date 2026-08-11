import express, { Application, Request, Response } from "express";
import cors from "cors";
import mainRouter from "./routes/index";
import notFound from "./middleware/notFound"; // ব্র্যাকেট ছাড়া ইম্পোর্ট (যদি default export হয়ে থাকে)
import globalErrorHandler from "./middleware/globalErrorHandler"; // ব্র্যাকেট ছাড়া ইম্পোর্ট

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

// Main API Router
app.use("/api/v1", mainRouter);

// Not Found Handler
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;