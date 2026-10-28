import express from "express";
import { calculateBMI } from "../controllers/bmiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, calculateBMI);

export default router;