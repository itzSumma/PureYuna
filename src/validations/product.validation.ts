import { z } from "zod";

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive("Price must be greater than 0"),
    stock: z.number().int().nonnegative("Stock cannot be negative"),
    categoryId: z.string().min(1, "Category ID is required"),
    skinType: z.string().min(1, "Skin type is required"),
    targetAudience: z.string().min(1, "Target audience is required"),
    productType: z.string().min(1, "Product type is required"),
    image: z.string().min(1, "Image is required"),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().optional(),
    skinType: z.string().optional(),
    targetAudience: z.string().optional(),
    productType: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};