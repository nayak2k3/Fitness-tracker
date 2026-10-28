import Workout from "../models/Workout.js";
import Goal from "../models/Goal.js";
import Water from "../models/Water.js";
import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user profile
    const user = await User.findById(userId).select(
      "name email age height weight"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Get all workouts
    const workouts = await Workout.find({ userId });

    // Calculate workout statistics
    const totalWorkouts = workouts.length;

    const totalDuration = workouts.reduce(
      (sum, workout) => sum + (workout.duration || 0),
      0
    );

    const totalCalories = workouts.reduce(
      (sum, workout) => sum + (workout.caloriesBurned || 0),
      0
    );

    const totalDistance = workouts.reduce(
      (sum, workout) => sum + (workout.distance || 0),
      0
    );

    // Get active goals
    const activeGoals = await Goal.find({
      userId,
      status: "active",
    });

    // Get today's water intake
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const waterRecords = await Water.find({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const todayWater = waterRecords.reduce(
      (total, record) => total + (record.amount || 0),
      0
    );

    // Calculate BMI
    let bmi = null;

    if (user.height && user.weight) {
      const heightInMeters = user.height / 100;
      bmi = Number(
        (user.weight / (heightInMeters * heightInMeters)).toFixed(2)
      );
    }

    // Today's workouts
    const todayWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);

      return workoutDate >= startOfDay && workoutDate <= endOfDay;
    });

    const todayCalories = todayWorkouts.reduce(
      (sum, workout) => sum + (workout.caloriesBurned || 0),
      0
    );

    const todayDuration = todayWorkouts.reduce(
      (sum, workout) => sum + (workout.duration || 0),
      0
    );

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight,
      },

      summary: {
        totalWorkouts,
        totalDuration,
        totalCalories,
        totalDistance,
        activeGoals: activeGoals.length,
      },

      today: {
        workouts: todayWorkouts.length,
        calories: todayCalories,
        duration: todayDuration,
        water: todayWater,
      },

      health: {
        bmi,
      },

      goals: activeGoals,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
};