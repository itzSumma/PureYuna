import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { UserValidation } from "../validations/user.validations"; // আপনার প্রজেক্টের ইউজার ভ্যালিডেশন স্কিমা

const router = Router();

// ১. পাবলিক রাউট (রেজিস্ট্রেশন ও লগইন) - জড ভ্যালিডেশন সহ
router.post(
  "/register",
  validateRequest(UserValidation.registerValidationSchema),
  UserController.registerUser
);

router.post(
  "/login",
  validateRequest(UserValidation.loginValidationSchema),
  UserController.loginUser
);

// ২. প্রোটেক্টেড রাউট (লগইন করা ইউজার নিজের প্রোফাইল দেখতে এবং আপডেট করতে পারবে)
router.get(
  "/profile",
  auth("CUSTOMER", "ADMIN"), // যেকোনো অথেনটিকেটেড ইউজার
  UserController.getMyProfile
);

router.patch(
  "/profile",
  auth("CUSTOMER", "ADMIN"),
  validateRequest(UserValidation.updateProfileValidationSchema),
  UserController.updateMyProfile
);

export const userRoutes = router;