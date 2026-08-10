import prisma from "../lib/prisma";

const createProductIntoDB = async (payload: any) => {
  const result = await (prisma.product as any).create({
    data: payload,
  });
  return result;
};

const getAllProductsFromDB = async () => {
  const result = await (prisma.product as any).findMany({
    where: { isDeleted: false },
    include: { category: true },
  });
  return result;
};

const getProductByIdFromDB = async (id: string) => {
  const result = await (prisma.product as any).findFirst({
    where: { id, isDeleted: false },
    include: { category: true },
  });
  return result;
};

const updateProductInDB = async (id: string, payload: any) => {
  const result = await (prisma.product as any).update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteProductFromDB = async (id: string) => {
  const result = await (prisma.product as any).update({
    where: { id },
    data: { isDeleted: true },
  });
  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProductsFromDB,
  getProductByIdFromDB,
  updateProductInDB,
  deleteProductFromDB,
};