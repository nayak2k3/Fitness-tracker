import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import bmiRoutes from "./routes/bmiRoutes.js";
import waterRoutes from "./routes/waterRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bmi", bmiRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Fitness Tracker API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});