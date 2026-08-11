import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ১. রেজিস্টার লজিক
const registerUserIntoDB = async (payload: any) => {
  // পাসওয়ার্ড হাশ করা
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: "CUSTOMER", // সিকিউরিটি ফিক্স: কেউ চাইলেও এখন নিজে Admin হতে পারবে না, সবসময় CUSTOMER হবে
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

  // পাসওয়ার্ড ম্যাচ করা
  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Incorrect password!");
  }

  // JWT টোকেন জেনারেট করা
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

// ৩. নতুন যোগ করা: ডেটাবেজ থেকে নিজের প্রোফাইল নিয়ে আসার লজিক
const getMyProfileFromDB = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!result) {
    throw new Error("User profile not found!");
  }

  return result;
};

// ৪. নতুন যোগ করা: নিজের প্রোফাইল আপডেট করার লজিক
const updateMyProfileIntoDB = async (userId: string, payload: any) => {
  // সিকিউরিটির জন্য কেউ যেন সরাসরি রোল বা ইমেইল হুট করে পরিবর্তন করতে না পারে (প্রয়োজনীয় ফিল্ড ফিল্টার করা যেতে পারে)
  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return result;
};

export const UserService = {
  registerUserIntoDB,
  loginUser,
  getMyProfileFromDB,    // এখানে যুক্ত করা হলো
  updateMyProfileIntoDB, // এখানে যুক্ত করা হলো
};