import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import auth from "../middleware/auth";
import { validateOrder, orderValidationSchema } from "../validations/order.validation";

const router = Router();

// ১. অর্ডার তৈরি করার রাউট (Zod ভ্যালিডেশন এবং Auth সহ)
router.post(
  "/", 
  auth("CUSTOMER", "ADMIN"), 
  validateOrder(orderValidationSchema), 
  OrderController.createOrder
);

// ২. সব অর্ডার দেখার রাউট (শুধু অ্যাডমিনের জন্য)
router.get(
  "/", 
  auth("ADMIN"), 
  OrderController.getAllOrders
);

// ৩. অর্ডারের স্ট্যাটাস আপডেট করার রাউট (শুধু অ্যাডমিনের জন্য)
router.patch(
  "/:id/status", 
  auth("ADMIN"), 
  OrderController.updateOrderStatus
);

export default router;