import prisma from "../lib/prisma";

const createOrderIntoDB = async (userId: string, payload: any) => {
  try {
    const { orderItems, ...orderData } = payload;

    const result = await prisma.order.create({
      data: {
        ...orderData,
        userId: userId, // টোকেন বা পেলোড থেকে আসা userId এখানে যুক্ত হবে
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
        user: true, // চাইলে ইউজারের তথ্যও সাথে দেখতে পাবে
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
    const result = await prisma.order.findMany({
      include: {
        orderItems: true,
        user: true,
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