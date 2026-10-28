import Workout from "../models/Workout.js";

export const getStats = async (req, res) => {
  try {
    const userId = req.userId;

    const workouts = await Workout.find({ userId });

    const totalWorkouts = workouts.length;

    const totalDuration = workouts.reduce(
      (sum, workout) => sum + workout.duration,
      0
    );

    const totalCalories = workouts.reduce(
      (sum, workout) => sum + workout.caloriesBurned,
      0
    );

    const totalDistance = workouts.reduce(
      (sum, workout) => sum + (workout.distance || 0),
      0
    );

    const workoutTypes = {};

    workouts.forEach((workout) => {
      workoutTypes[workout.workoutType] =
        (workoutTypes[workout.workoutType] || 0) + 1;
    });

    res.status(200).json({
      totalWorkouts,
      totalDuration,
      totalCalories,
      totalDistance,
      workoutTypes
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get statistics",
      error: error.message
    });
  }
};
export const getWeeklyStats = async (req, res) => {
  try {
    const userId = req.userId;

    const today = new Date();

    // Start of the current week (Monday)
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();

    const difference = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(startOfWeek.getDate() - difference);
    startOfWeek.setHours(0, 0, 0, 0);

    // End of the current week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const workouts = await Workout.find({
      userId,
      date: {
        $gte: startOfWeek,
        $lt: endOfWeek
      }
    });

    const weeklyStats = {
      Monday: {
        workouts: 0,
        calories: 0,
        duration: 0
      },
      Tuesday: {
        workouts: 0,
        calories: 0,
        duration: 0
      },
      Wednesday: {
        workouts: 0,
        calories: 0,
        duration: 0
      },
      Thursday: {
        workouts: 0,
        calories: 0,
        duration: 0
      },
      Friday: {
        workouts: 0,
        calories: 0,
        duration: 0
      },
      Saturday: {
        workouts: 0,
        calories: 0,
        duration: 0
      },
      Sunday: {
        workouts: 0,
        calories: 0,
        duration: 0
      }
    };

    workouts.forEach((workout) => {
      const workoutDate = new Date(workout.date);

      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];

      const dayName = dayNames[workoutDate.getDay()];

      weeklyStats[dayName].workouts += 1;
      weeklyStats[dayName].calories += workout.caloriesBurned || 0;
      weeklyStats[dayName].duration += workout.duration || 0;
    });

    res.status(200).json({
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      weeklyStats
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get weekly statistics",
      error: error.message
    });
  }
};