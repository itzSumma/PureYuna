import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import auth from "../middleware/auth";
import { validateOrder, orderValidationSchema } from "../validations/order.validation";

const router = Router();

// ১. কাস্টমার যেন নিজের অর্ডার দেখতে পারে (অবশ্যই নিচে থাকা আইডি রাউটের উপরে দিতে হবে)
router.get(
  "/my-orders", 
  auth("CUSTOMER", "ADMIN"), 
  OrderController.getMyOrders
);

// ২. অর্ডার তৈরি করার রাউট (Zod ভ্যালিডেশন এবং Auth সহ)
router.post(
  "/", 
  auth("CUSTOMER", "ADMIN"), 
  validateOrder(orderValidationSchema), 
  OrderController.createOrder
);

// ৩. সব অর্ডার দেখার রাউট (শুধু অ্যাডমিনের জন্য)
router.get(
  "/", 
  auth("ADMIN"), 
  OrderController.getAllOrders
);

// ৪. অর্ডারের স্ট্যাটাস আপডেট করার রাউট (শুধু অ্যাডমিনের জন্য)
router.patch(
  "/:id/status", 
  auth("ADMIN"), 
  OrderController.updateOrderStatus
);

export default router;