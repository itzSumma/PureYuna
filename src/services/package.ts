import prisma from "../lib/prisma";

const createPackageIntoDB = async (payload: any) => {
  const result = await (prisma as any).package.create({
    data: payload,
  });
  return result;
};

const getAllPackagesFromDB = async () => {
  const result = await (prisma as any).package.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

export const PackageService = {
  createPackageIntoDB,
  getAllPackagesFromDB,
};