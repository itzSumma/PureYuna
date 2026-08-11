import prisma from "../lib/prisma";

const addToWishlistIntoDB = async (userId: string, productId: string) => {
  // ১. চেক করা প্রোডাক্টটি ইতিমধ্যে উইশলিস্টে আছে কি না
  const isExist = await prisma.wishlist.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (isExist) {
    const error: any = new Error("Product is already in your wishlist!");
    error.statusCode = 409; // Conflict Status Code
    throw error;
  }

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
    const error: any = new Error("Wishlist item not found or unauthorized!");
    error.statusCode = 404;
    throw error;
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