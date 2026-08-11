import { z } from "zod";

const createPackageValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive("Price must be a positive number"),
    images: z.array(z.string()).optional(),
    image: z.string().optional(),
    productIds: z.array(z.string()).min(1, "At least one product ID is required"),
  }),
});

const updatePackageValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    images: z.array(z.string()).optional(),
    image: z.string().optional(),
    productIds: z.array(z.string()).optional(),
  }),
});

export const PackageValidation = {
  createPackageValidationSchema,
  updatePackageValidationSchema,
};