import { Router } from "express";
import { PackageController } from "../controllers/package.controller";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { PackageValidation } from "../validations/package.validation";

const router = Router();

// পাবলিক রাউট
router.get("/", PackageController.getAllPackages);

// অ্যাডমিন রাউট - প্যাকেজ তৈরি
router.post(
  "/",
  auth("ADMIN"),
  validateRequest(PackageValidation.createPackageValidationSchema),
  PackageController.createPackage
);

// অ্যাডমিন রাউট - প্যাকেজ আপডেট
router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(PackageValidation.updatePackageValidationSchema),
  PackageController.updatePackage
);

// অ্যাডমিন রাউট - প্যাকেজ ডিলিট
router.delete(
  "/:id",
  auth("ADMIN"),
  PackageController.deletePackage
);

export default router;