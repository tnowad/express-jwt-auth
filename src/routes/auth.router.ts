import express, { NextFunction } from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller";
import asyncHandler from "express-async-handler";
const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh-token", asyncHandler(refreshToken));
router.delete("/logout", asyncHandler(logout));

export default router;
