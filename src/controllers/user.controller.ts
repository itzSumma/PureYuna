import { Request, Response } from "express";
import { UserService } from "../services/user";

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

export const UserController = {
  registerUser,
  loginUser,
};