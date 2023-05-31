import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";

const accessTokenSecretKey = "access-token-secret-key";

const verifyAccessToken = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    res.status(401).json({ error: "Access token not provided" });
    return;
  }

  try {
    const payload = jwt.verify(accessToken, accessTokenSecretKey) as JwtPayload;
    req.payload = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid access token" });
  }
};

export default verifyAccessToken;
