import { Router } from "express";
import categoryRouter from "./category";
import productRouter from "./product";
import packageRouter from "./package";
import orderRouter from "./order";
const router = Router();

router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/packages", packageRouter);
router.use("/orders", orderRouter);
export default router;
