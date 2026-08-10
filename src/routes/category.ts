import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

const router = Router();

router.post("/", CategoryController.createCategory);
router.get("/", CategoryController.getAllCategories);

export default router;