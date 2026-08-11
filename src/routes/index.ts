import { Router } from "express";
import categoryRouter from "./category";
import productRouter from "./product";
import packageRouter from "./package";
import orderRouter from "./order";
import { userRoutes } from "./user";
import { WishlistRoutes } from "./wishlist"; 

const router = Router();

router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/packages", packageRouter);
router.use("/orders", orderRouter);
router.use("/auth", userRoutes);     
router.use("/users", userRoutes);   
router.use("/wishlists", WishlistRoutes); 

export default router;