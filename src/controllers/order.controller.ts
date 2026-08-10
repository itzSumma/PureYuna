import { Request, Response } from "express";
import { OrderService } from "../services/order";
import sendResponse from "../utils/sendResponse";

const createOrder = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.createOrderIntoDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.getAllOrdersFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Orders fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const OrderController = {
  createOrder,
  getAllOrders,
};