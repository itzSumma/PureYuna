import { Request, Response } from "express";
import { ProductService } from "../services/product";
import sendResponse from "../utils/sendResponse";

const createProduct = async (req: Request, res: Response) => {
  try {
    const result = await ProductService.createProductIntoDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    // এখানে req.query পাস করা হয়েছে এবং টাইপ এরর এড়াতে টাইপ কাস্টিং দেওয়া হয়েছে
    const result = await ProductService.getAllProductsFromDB(req.query as any);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Products fetched successfully",
      meta: result.meta, // এখন এখানে কোনো লাল দাগ বা এরর আসবে না
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ProductService.getProductByIdFromDB(id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ProductService.updateProductInDB(id as string, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ProductService.deleteProductFromDB(id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};