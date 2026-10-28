import Workout from "../models/Workout.js";

export const createWorkout = async (req, res) => {
  try {
    const {
      workoutType,
      duration,
      caloriesBurned,
      distance,
      date,
      notes,
    } = req.body;

    const workout = await Workout.create({
      userId: req.userId,
      workoutType,
      duration,
      caloriesBurned,
      distance,
      date,
      notes,
    });

    res.status(201).json({
      message: "Workout created successfully",
      workout,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create workout",
      error: error.message,
    });
  }
};
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.userId,
    }).sort({ date: -1 });

    res.status(200).json({
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch workouts",
      error: error.message,
    });
  }
};
export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const workout = await Workout.findOneAndUpdate(
      {
        _id: id,
        userId: req.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json({
      message: "Workout updated successfully",
      workout,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update workout",
      error: error.message,
    });
  }
};
export const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const workout = await Workout.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json({
      message: "Workout deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete workout",
      error: error.message,
    });
  }
};
export const getRecentWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.userId,
    })
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json({
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recent workouts",
      error: error.message,
    });
  }
};