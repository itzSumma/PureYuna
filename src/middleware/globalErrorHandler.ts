import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = err.message || "Something went wrong!";
  let errorSources = [
    {
      path: "",
      message: err?.message || "Something went wrong",
    },
  ];

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // stack: process.env.NODE_ENV === "development" ? err?.stack : undefined, // ডেভেলপমেন্ট মোডে স্ট্যাক দেখার জন্য
  });
};

export default globalErrorHandler;