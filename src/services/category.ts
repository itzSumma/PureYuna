import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


const createCategoryIntoDB = async (payload: { name: string }) => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

// All Categories Fetch  for services
const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};