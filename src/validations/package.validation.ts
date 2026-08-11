import { z } from "zod";

const createPackageValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    productIds: z.array(z.string()),
  }),
});

const updatePackageValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    productIds: z.array(z.string()).optional(),
  }),
});

export const PackageValidation = {
  createPackageValidationSchema,
  updatePackageValidationSchema,
};