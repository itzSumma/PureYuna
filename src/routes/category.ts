import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { CategoryValidation } from "../validations/category.validation";

const router = Router();

// পাবলিক রাউট (সবাই ক্যাটাগরি লিস্ট দেখতে পারবে)
router.get("/", CategoryController.getAllCategories);

// অ্যাডমিন প্রোটেক্টেড এবং ভ্যালিডেটেড রাউট (শুধু অ্যাডমিন ক্যাটাগরি তৈরি করতে পারবে)
router.post(
  "/",
  auth("ADMIN"),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory
);

router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(CategoryValidation.updateCategoryValidationSchema),
  CategoryController.updateCategory
);

router.delete("/:id", auth("ADMIN"), CategoryController.deleteCategory);

export default router;