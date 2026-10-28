import express from "express";
import {
  getStats,
  getWeeklyStats
} from "../controllers/statsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getStats);
router.get("/weekly", authMiddleware, getWeeklyStats);

export default router;