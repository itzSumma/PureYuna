import prisma from "../lib/prisma";

const createOrderIntoDB = async (userId: string, payload: any) => {
  try {
    // Zod স্কিমার সাথে মিল রেখে items কে orderItems নামে রিসিভ করা হলো
    const { items: orderItems, ...orderData } = payload;

    // ট্রানজাকশন ব্যবহার করে স্টক কমানো এবং অর্ডার তৈরি একসাথে করা
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const formattedOrderItems = [];

      for (const item of orderItems) {
        // ১. প্রোডাক্টের বর্তমান স্টক চেক করা
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // ২. স্টক কমানো
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });

        totalAmount += item.price * item.quantity;
        formattedOrderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      }

      // ৩. ফাইনাল অর্ডার তৈরি করা
      const order = await tx.order.create({
        data: {
          ...orderData,
          totalAmount: orderData.totalAmount || totalAmount,
          userId: userId,
          orderItems: {
            create: formattedOrderItems,
          },
        },
        include: {
          orderItems: true,
          user: true,
        },
      });

      return order;
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

const updateOrderStatusInDB = async (orderId: string, status: any) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderItems: true,
        user: true,
      },
    });
    return updatedOrder;
  } catch (error: any) {
    console.log("Update Order Status Error:", error);
    throw error;
  }
};

export const OrderService = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  updateOrderStatusInDB,
};