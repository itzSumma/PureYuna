import { z } from "zod";

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    stock: z.number(),
    categoryId: z.string(),
    skinType: z.string().optional(),
    targetAudience: z.string().optional(),
    productType: z.string().optional(),
    image: z.string().optional(),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    stock: z.number().optional(),
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