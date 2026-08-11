import { Request, Response } from "express";
import { OrderService } from "../services/order";

const createOrder = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId; 

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! User ID not found.",
      });
    }

    const result = await OrderService.createOrderIntoDB(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create order!",
    });
  }
};

// নতুন যোগ করা: কাস্টমার যেন নিজের অর্ডার দেখতে পারে
const getMyOrders = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;
    const result = await OrderService.getMyOrdersFromDB(userId);

    res.status(200).json({
      success: true,
      message: "My orders retrieved successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to get my orders!",
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.getAllOrdersFromDB();
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to get orders!",
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const result = await OrderService.updateOrderStatusInDB(id, status);
    
    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update order status!",
    });
  }
};

export const OrderController = {
  createOrder,
  getMyOrders, // এটি এখানে যুক্ত করা হলো
  getAllOrders,
  updateOrderStatus,
};