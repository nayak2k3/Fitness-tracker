import express from "express";
import {
  addWater,
  getTodayWater,
  deleteWater,
} from "../controllers/waterController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addWater);
router.get("/today", authMiddleware, getTodayWater);
router.delete("/:id", authMiddleware, deleteWater);

export default router;