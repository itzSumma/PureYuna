import { Request, Response } from "express";
import { PackageService } from "../services/package";
import sendResponse from "../utils/sendResponse";

const createPackage = async (req: Request, res: Response) => {
  try {
    const result = await PackageService.createPackageIntoDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Package created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPackages = async (req: Request, res: Response) => {
  try {
    const result = await PackageService.getAllPackagesFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Packages fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const PackageController = {
  createPackage,
  getAllPackages,
};