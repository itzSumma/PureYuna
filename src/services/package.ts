import prisma from "../lib/prisma";

const createPackageIntoDB = async (payload: any) => {
  const { productIds, ...packageData } = payload;

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

export const PackageService = {
  createPackageIntoDB,
  getAllPackagesFromDB,
};