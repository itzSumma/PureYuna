// src/validations/order.validation.ts
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const orderValidationSchema = z.object({
  shippingAddress: z.string().min(5, 'Shipping address is required'),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().positive('Quantity must be at least 1')
    })
  ).min(1, 'Order must contain at least one item')
});

// ভ্যালিডেশন মিডলওয়্যার
export const validateOrder = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: "Validation Error",
      errors: error.errors.map((e: any) => e.message) 
    });
  }
};