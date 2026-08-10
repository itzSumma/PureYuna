import { Router } from "express";
import categoryRouter from "./category";
import productRouter from "./product";

const router = Router();

router.use("/categories", categoryRouter);
router.use("/products", productRouter);

export default router;
