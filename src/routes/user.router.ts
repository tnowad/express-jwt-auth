import express from "express";

const router = express.Router();

router.get("/me");
router.get("/private");

export default router;
