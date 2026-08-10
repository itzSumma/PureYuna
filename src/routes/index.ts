import { Router } from "express";
import category from "./category";
// অন্যান্য রাউটগুলো এভাবে ইম্পোর্ট করতে পারੋ:
// import users from "./users";
// import products from "./products";

const router = Router();

// সব রাউট এখানে রেজিস্টার হবে
router.use("/categories", category);
// router.use("/users", users);
// router.use("/products", products);

export default router;