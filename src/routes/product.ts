import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { ProductValidation } from "../validations/product.validation";

const router = Router();

// পাবলিক রাউট (যে কেউ দেখতে পারবে)
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);

// অ্যাডমিন প্রোটেক্টেড রাউট (সঠিক স্কিমা নামসহ ভ্যালিডেশন মিডলওয়্যার)
router.post(
  "/", 
  auth("ADMIN"), 
  validateRequest(ProductValidation.createProductValidationSchema), 
  ProductController.createProduct
);

router.patch(
  "/:id", 
  auth("ADMIN"), 
  validateRequest(ProductValidation.updateProductValidationSchema), 
  ProductController.updateProduct
);

router.delete("/:id", auth("ADMIN"), ProductController.deleteProduct);

export default router;