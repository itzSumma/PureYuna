import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const auth = (...roles: string[]) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      // ১. রিকোয়েস্ট হেডারের Authorization থেকে টোকেন সংগ্রহ করা
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      // সাধারণত টোকেনটি "Bearer <token>" ফরম্যাটে থাকে, তাই Bearer আলাদা করে টোকেন নিতে হবে
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token missing!",
        });
      }

      // ২. টোকেন ভেরিফাই করা
      const secretKey = process.env.JWT_SECRET as string;
      const verifiedUser = jwt.verify(token, secretKey) as JwtPayload;

      // ৩. ইউজারের রিকোয়েস্টে ইউজার ডেটা সেট করা
      req.user = verifiedUser;

      // ৪. যদি নির্দিষ্ট কোনো রোল (যেমন: ADMIN) চেক করার প্রয়োজন হয়
      if (roles.length && !roles.includes(verifiedUser.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You do not have permission.",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token!",
      });
    }
  };
};

export default auth;