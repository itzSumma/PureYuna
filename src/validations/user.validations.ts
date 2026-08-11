import { z } from "zod";

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
  }),
});

export const UserValidation = {
  registerValidationSchema,
  loginValidationSchema,
  updateProfileValidationSchema,
};