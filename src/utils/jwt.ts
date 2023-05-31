import jwt from "jsonwebtoken";
import { User, PrismaClient } from "@prisma/client";

export const accessTokenSecretKey = "access-token-secret-key";
export const refreshTokenSecretKey = "refresh-token-secret-key";
const prisma = new PrismaClient();

export function generateAccessToken(user: User): string {
  const token = jwt.sign({ userId: user.id }, accessTokenSecretKey, {
    expiresIn: "15m",
  });
  return token;
}

export function generateRefreshToken(user: User): string {
  const token = jwt.sign({ userId: user.id }, refreshTokenSecretKey, {
    expiresIn: "7d",
  });
  return token;
}

export function verifyToken(token: string, secretKey: string): string | object {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export async function extractUserFromToken(
  token: string,
  secretKey: string
): Promise<User | undefined | null> {
  const decoded: any = verifyToken(token, secretKey);
  const userId = decoded.userId;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}
