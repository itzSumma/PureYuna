import { Request, Response } from "express";
import { UserService } from "../services/user"; // আপনার প্রজেক্টের সার্ভিস পাথ অনুযায়ী ঠিক আছে

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.registerUserIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed!",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed!",
    });
  }
};

// নতুন যোগ করা: ইউজারের নিজের প্রোফাইল দেখার কন্ট্রোলার
const getMyProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId; // auth মিডলওয়эр থেকে ইউজার আইডি পাওয়া যাবে
    const result = await UserService.getMyProfileFromDB(userId);

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to get profile!",
    });
  }
};

// নতুন যোগ করা: ইউজারের প্রোফাইল আপডেট করার কন্ট্রোলার
const updateMyProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;
    const result = await UserService.updateMyProfileIntoDB(userId, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update profile!",
    });
  }
};

export const UserController = {
  registerUser,
  loginUser,
  getMyProfile,     // এখানে যুক্ত করা হলো
  updateMyProfile,  // এখানে যুক্ত করা হলো
};