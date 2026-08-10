import prisma from "../lib/prisma";

const addToWishlistIntoDB = async (userId: string, productId: string) => {
  const result = await prisma.wishlist.create({
    data: {
      userId,
      productId,
    },
    include: {
      product: true,
    },
  });
  return result;
};

const getWishlistFromDB = async (userId: string) => {
  const result = await prisma.wishlist.findMany({
    where: {
      userId,
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });
  return result;
};

const removeFromWishlistFromDB = async (userId: string, wishlistId: string) => {
  
  const isExist = await prisma.wishlist.findFirst({
    where: {
      id: wishlistId,
      userId,
    },
  });

  if (!isExist) {
    throw new Error("Wishlist item not found or unauthorized!");
  }

  const result = await prisma.wishlist.delete({
    where: {
      id: wishlistId,
    },
  });
  return result;
};

export const WishlistService = {
  addToWishlistIntoDB,
  getWishlistFromDB,
  removeFromWishlistFromDB,
};