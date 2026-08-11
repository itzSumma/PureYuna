import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import auth from "../middleware/auth"; // আপনার অথেন্টিকেশন ও রোল মিডলওয়্যার ইম্পোর্ট করুন

const router = Router();

// পাবলিক রাউট (যে কেউ দেখতে পারবে)
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);

// অ্যাডমিন প্রোটেক্টেড রাউট (শুধু ADMIN রোল হোল্ডাররাই এগুলো করতে পারবে)
router.post("/", auth("ADMIN"), ProductController.createProduct);
router.patch("/:id", auth("ADMIN"), ProductController.updateProduct);
router.delete("/:id", auth("ADMIN"), ProductController.deleteProduct);

export default router;