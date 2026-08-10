import { Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import { WishlistService } from "../services/wishlist";

// উইশলিস্টে যোগ করা
const addToWishlist = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user.userId || req.user.id; // টোকেন অনুযায়ী সঠিক ফিল্ড ধরা হলো
    const { productId } = req.body;

    const result = await WishlistService.addToWishlistIntoDB(userId, productId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Product added to wishlist successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// ইউজারের উইশলিস্ট ফেচ করা
const getWishlist = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user.userId || req.user.id;
    const result = await WishlistService.getWishlistFromDB(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Wishlist fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// উইশলিস্ট থেকে প্রোডাক্ট ডিলিট করা
const removeFromWishlist = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user.userId || req.user.id;
    const id = req.params.id as string;

    const result = await WishlistService.removeFromWishlistFromDB(userId, id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product removed from wishlist successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const WishlistController = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};