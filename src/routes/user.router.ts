import express, { Request, Response, NextFunction } from "express";
import verifyAccessToken from "../middleware/verify.access.token";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();
router.get(
  "/me",
  verifyAccessToken,
  asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.payload?.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      res.send(user);
    } catch (error) {
      next(error);
    }
  })
);
export default router;
