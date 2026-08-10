import prisma from "../lib/prisma";

const createProductIntoDB = async (payload: any) => {
  const result = await (prisma.product as any).create({
    data: payload,
  });
  return result;
};

const getAllProductsFromDB = async (query: any) => {
  const { search, category, skinType, targetAudience, productType, sort, page, limit } = query;

  const filters: any = { isDeleted: false };

  // ১. Search লজিক
  if (search) {
    filters.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  // ২. Filtering লজিক
  if (category) filters.categoryId = category;
  if (skinType) filters.skinType = skinType;
  if (targetAudience) filters.targetAudience = targetAudience;
  if (productType) filters.productType = productType;

  // ৩. Sorting লজিক
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") {
    orderBy = { price: "asc" };
  } else if (sort === "price-high") {
    orderBy = { price: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

  // ৪. Pagination লজিক
  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 12;
  const skip = (pageNumber - 1) * pageSize;

  const result = await (prisma.product as any).findMany({
    where: filters,
    include: { category: true },
    orderBy,
    skip,
    take: pageSize,
  });

  const total = await (prisma.product as any).count({ where: filters });

  return {
    meta: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
    data: result,
  };
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