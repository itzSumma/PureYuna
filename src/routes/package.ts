import { Router } from "express";
import { PackageController } from "../controllers/package.controller";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { PackageValidation } from "../validations/package.validation";

const router = Router();

// পাবলিক রাউট (সবাই প্যাকেজ দেখতে পারবে)
router.get("/", PackageController.getAllPackages);

// অ্যাডমিন প্রোটেক্টেড এবং ভ্যালিডেটেড রাউট (প্যাকেজ তৈরি)
router.post(
  "/",
  auth("ADMIN"),
  validateRequest(PackageValidation.createPackageValidationSchema),
  PackageController.createPackage
);

export default router;