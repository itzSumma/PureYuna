import { Router, Request, Response } from "express";
import prisma from "@/lib/prisma";

const router = Router();

// Get all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;