import prisma from "../lib/prisma";

const createCategoryIntoDB = async (payload: { name: string }) => {
  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
  });

  return result;
};

// ১. ক্যাটেগরি আপডেট করার সার্ভিস
const updateCategoryIntoDB = async (id: string, payload: { name?: string }) => {
  const result = await prisma.category.update({
    where: {
      id,
      isDeleted: false,
    },
    data: payload,
  });

  return result;
};

// ২. ক্যাটেগরি ডিলিট (বা সফট ডিলিট / হার্ড ডিলিট) করার সার্ভিস
const deleteCategoryIntoDB = async (id: string) => {
  // যদি সফট ডিলিট (isDeleted: true) করতে চান:
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  // অথবা পাকাপাকিভাবে ডিলিট (Hard Delete) করতে চাইলে নিচের কোডটি ব্যবহার করতে পারেন:
  /*
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });
  */

  return result;
};

export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  updateCategoryIntoDB,
  deleteCategoryIntoDB,
};