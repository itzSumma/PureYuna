import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status"; // যদি http-status ইনস্টল করা না থাকে, সরাসরি নাম্বার (যেমন: 404) ব্যবহার করতে পারেন

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API Not Found!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
};

export default notFound;