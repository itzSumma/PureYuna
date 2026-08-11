import { Request, Response } from "express";
import { CategoryService } from "../services/category";
import sendResponse from "../utils/sendResponse";

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const result = await CategoryService.createCategoryIntoDB({ name });
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.getAllCategoriesFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Categories fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.status(200).json({ success: true, message: "Single category" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ১. ক্যাটেগরি আপডেট কন্ট্রোলার (সার্ভিসের সাথে কানেক্ট করা হলো)
const updateCategory = async (req: Request, res: Response) => {
  try {
   const id = req.params.id as string;
    const payload = req.body;
    const result = await CategoryService.updateCategoryIntoDB(id, payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ২. ক্যাটেগরি ডিলিট কন্ট্রোলার (সার্ভিসের সাথে কানেক্ট করা হলো)
const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await CategoryService.deleteCategoryIntoDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};