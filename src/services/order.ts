import prisma from "../lib/prisma";

const createOrderIntoDB = async (userId: string, payload: any) => {
  try {
    const { items: orderItems, ...orderData } = payload;

    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const formattedOrderItems = [];

      for (const item of orderItems) {
        // ১. অ্যাটমিক ও কন্ডিশনাল স্টক আপডেট (Race condition এবং overselling রোধ করতে)
        const updatedProduct = await tx.product.updateMany({
          where: {
            id: item.productId,
            isDeleted: false,
            stock: {
              gte: item.quantity, // পর্যাপ্ত স্টক থাকলেই কেবল ডিক্রিমেন্ট হবে
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updatedProduct.count === 0) {
          throw new Error(`Product with ID ${item.productId} is out of stock, deleted, or unavailable.`);
        }

        // ২. প্রোডাক্টের সঠিক বর্তমান প্রাইস নিয়ে আসার জন্য
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        totalAmount += product.price * item.quantity;
        
        formattedOrderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // ৩. ফাইনাল অর্ডার তৈরি করা
      const order = await tx.order.create({
        data: {
          ...orderData,
          totalAmount: totalAmount,
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

const getMyOrdersFromDB = async (userId: string) => {
  try {
    const result = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return result;
  } catch (error: any) {
    console.log("Get My Orders Error:", error);
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
  getMyOrdersFromDB,
  getAllOrdersFromDB,
  updateOrderStatusInDB,
};