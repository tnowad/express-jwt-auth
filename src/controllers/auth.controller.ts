import { PrismaClient, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
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

const login = async (req: Request, res: Response, next: NextFunction) => {};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const logout = async (req: Request, res: Response, next: NextFunction) => {};

export { register, login, refreshToken, logout };
