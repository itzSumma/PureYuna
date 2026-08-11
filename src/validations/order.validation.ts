import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const orderValidationSchema = z.object({
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  phone: z.string().min(10, 'Phone number is required'), // এটি নতুন যোগ করা হলো
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().positive('Quantity must be at least 1'),
      price: z.number().positive('Price must be a positive number')
    })
  ).min(1, 'Order must contain at least one item')
});

export const validateOrder = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    const errorMessages = error?.errors 
      ? error.errors.map((e: any) => e.message) 
      : [error.message || "Validation failed"];

    res.status(400).json({ 
      success: false, 
      message: "Validation Error",
      errors: errorMessages 
    });
  }
};