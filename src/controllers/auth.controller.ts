import { PrismaClient, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  refreshTokenSecretKey,
  verifyToken,
} from "../utils/jwt";
const prisma = new PrismaClient();

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password }: any = req.body;
    const newUser: User = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
    res.json(newUser);
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: any = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
  } else {
    if (user.password === password) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      user.access_token = accessToken;
      user.refresh_token = refreshToken;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...user,
        },
      });

      res.send({ accessToken, refreshToken });
    }
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { refreshToken }: any = req.body;

  try {
    const decoded: any = verifyToken(refreshToken, refreshTokenSecretKey);
    const userId = decoded.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.refresh_token != refreshToken) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      },
    });

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {};

export { register, login, refreshToken, logout };
