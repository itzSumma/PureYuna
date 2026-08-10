import prisma from "../lib/prisma";

const createOrderIntoDB = async (payload: any) => {
  try {
    const { orderItems, ...orderData } = payload;

    const result = await (prisma as any).order.create({
      data: {
        ...orderData,
        orderItems: {
          create: orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return result;
  } catch (error: any) {
    console.log("Order Creation Error:", error);
    throw error;
  }
};

const getAllOrdersFromDB = async () => {
  try {
    const result = await (prisma as any).order.findMany({
      include: {
        orderItems: true,
      },
    });
    return result;
  } catch (error: any) {
    console.log("Get Orders Error:", error);
    throw error;
  }
};


export const OrderService = {
  createOrderIntoDB,
  getAllOrdersFromDB,
};