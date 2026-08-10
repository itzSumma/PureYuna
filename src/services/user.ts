import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ১. রেজিস্টার লজিক
const registerUserIntoDB = async (payload: any) => {
  // পাসওয়ার্ড হাশ করা
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role || "CUSTOMER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return result;
};

// ২. লগইন লজিক
const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new Error("User not found!");
  }

  // পাসওয়ার্ড ম্যাচ করা
  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Incorrect password!");
  }

  // JWT টোকেন জেনারেট করা (সিক্রেট কি .env ফাইলে রাখতে হবে)
  const secretKey = process.env.JWT_SECRET || "super-secret-key";
  const token = jwt.sign(
    { email: user.email, role: user.role, userId: user.id },
    secretKey,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const UserService = {
  registerUserIntoDB,
  loginUser,
};