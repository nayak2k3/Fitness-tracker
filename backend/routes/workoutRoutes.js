import express from "express";
import {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  getRecentWorkouts
} from "../controllers/workoutController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createWorkout);

router.get("/", authMiddleware, getWorkouts);

router.put("/:id", authMiddleware, updateWorkout);

router.delete("/:id", authMiddleware, deleteWorkout);

router.get("/recent", authMiddleware, getRecentWorkouts);

export default router;