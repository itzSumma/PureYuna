import { Router } from "express";
import { PackageController } from "../controllers/package.controller";

const router = Router();

router.post("/", PackageController.createPackage);
router.get("/", PackageController.getAllPackages);

export default router;