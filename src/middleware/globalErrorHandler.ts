import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  let errorSources = [
    {
      path: "",
      message: err?.message || "Something went wrong",
    },
  ];

  // ১. Zod Error (400)
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorSources = err.issues.map((issue: any) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  } 
  // ২. Prisma Duplicate Key Error (409)
  else if (err.code === "P2002") {
    statusCode = 409;
    message = "Duplicate key error. This record already exists.";
    errorSources = [
      {
        path: err.meta?.target ? (err.meta.target as string[]).join(".") : "",
        message: "A record with this value already exists.",
      },
    ];
  }
  // ৩. Prisma Record Not Found (404)
  else if (err.code === "P2025") {
    statusCode = 404;
    message = "Requested record not found.";
    errorSources = [
      {
        path: "",
        message: err.message || "Record not found",
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
  });
};

export default globalErrorHandler;