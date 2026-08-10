import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest"; 
import { WishlistValidation } from "../validations/wishlist.validation";

const router = Router();

router.post(
  "/",
  auth(), 
  validateRequest(WishlistValidation.createWishlistValidation),
  WishlistController.addToWishlist
);

router.get(
  "/",
  auth(),
  WishlistController.getWishlist
);

router.delete(
  "/:id",
  auth(),
  WishlistController.removeFromWishlist
);

export const WishlistRoutes = router;