import express from "express";

const router = express.Router();

router.post("/register");
router.post("/login");
router.post("/refresh-token");
router.delete("/logout");

export default router;
