import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import auth from "../middleware/auth";

const router = Router();

// ১. অর্ডার তৈরি করার রাউট (এখানে কাস্টমার বা অ্যাডমিন লগইন করা বাধ্যতামূলক করা হয়েছে)
router.post("/", auth("CUSTOMER", "ADMIN"), OrderController.createOrder);

// ২. সব অর্ডার দেখার রাউট (এটি শুধু অ্যাডমিনের জন্য সুরক্ষিত করা হলো)
router.get("/", auth("ADMIN"), OrderController.getAllOrders);

export default router;