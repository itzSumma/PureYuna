import prisma from "../lib/prisma";

const createPackageIntoDB = async (payload: any) => {
  const { productIds, ...packageData } = payload;

  if (productIds && productIds.length > 0) {
    // ১. ডুপ্লিকেট productIds চেক করা
    const uniqueProductIds = [...new Set(productIds)];
    if (uniqueProductIds.length !== productIds.length) {
      throw new Error("Duplicate product IDs are not allowed in a package.");
    }

    // ২. প্রোডাক্টগুলো ডেটাবেজে বাস্তবে আছে কি না এবং সফট-ডিলিট করা কি না তা চেক করা
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isDeleted: false,
      },
    });

    if (products.length !== productIds.length) {
      throw new Error("One or more products are invalid, not found, or deleted.");
    }
  }

  const result = await prisma.package.create({
    data: {
      ...packageData,
      packageItems: {
        create: productIds.map((productId: string) => ({
          productId: productId,
        })),
      },
    },
    include: {
      packageItems: {
        include: {
          product: true,
        },
      },
    },
  });
  return result;
};

const getAllPackagesFromDB = async () => {
  const result = await prisma.package.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      packageItems: {
        include: {
          product: true,
        },
      },
    },
  });
  return result;
};

// প্যাকেজ আপডেট করার সার্ভিস
const updatePackageIntoDB = async (id: string, payload: any) => {
  const { productIds, ...packageData } = payload;

  const result = await prisma.$transaction(async (tx) => {
    // যদি নতুন productIds পাঠানো হয়, তবে ভ্যালিডেশন চেক করতে হবে
    if (productIds && productIds.length > 0) {
      // ১. ডুপ্লিকেট চেক
      const uniqueProductIds = [...new Set(productIds)];
      if (uniqueProductIds.length !== productIds.length) {
        throw new Error("Duplicate product IDs are not allowed in a package.");
      }

      // ২. অস্তিত্ব ও সফট-ডিলিট চেক
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          isDeleted: false,
        },
      });

      if (products.length !== productIds.length) {
        throw new Error("One or more products are invalid, not found, or deleted.");
      }

      // ৩. আগের আইটেমগুলো মুছে নতুনগুলো যুক্ত করবে
      await tx.packageItem.deleteMany({
        where: { packageId: id },
      });

      await tx.packageItem.createMany({
        data: productIds.map((productId: string) => ({
          packageId: id,
          productId: productId,
        })),
      });
    }

    // মৌলিক ডাটা আপডেট
    await tx.package.update({
      where: { id },
      data: packageData,
    });

    return await tx.package.findUnique({
      where: { id },
      include: {
        packageItems: {
          include: {
            product: true,
          },
        },
      },
    });
  });

  return result;
};

// প্যাকেজ ডিলিট (বা সফট ডিলিট) করার সার্ভিস
const deletePackageFromDB = async (id: string) => {
  const result = await prisma.package.delete({
    where: { id },
  });
  return result;
};

export const PackageService = {
  createPackageIntoDB,
  getAllPackagesFromDB,
  updatePackageIntoDB,
  deletePackageFromDB,
};