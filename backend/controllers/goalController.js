import Goal from "../models/Goal.js";
import Workout from "../models/Workout.js";

export const createGoal = async (req, res) => {
  try {
    const { title, goalType, target, startDate, endDate } = req.body;

    if (!title || !goalType || !target || !startDate || !endDate) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const goal = await Goal.create({
      userId: req.userId,
      title,
      goalType,
      target,
      startDate,
      endDate,
    });

    res.status(201).json({
      message: "Goal created successfully",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create goal",
      error: error.message,
    });
  }
};
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: goals.length,
      goals,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch goals",
      error: error.message,
    });
  }
};
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOneAndUpdate(
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

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    res.status(200).json({
      message: "Goal updated successfully",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update goal",
      error: error.message,
    });
  }
};
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    res.status(200).json({
      message: "Goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete goal",
      error: error.message,
    });
  }
};
export const getGoalProgress = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the goal belonging to the logged-in user
    const goal = await Goal.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    // Find workouts within the goal's date range
    const workouts = await Workout.find({
      userId: req.userId,
      date: {
        $gte: goal.startDate,
        $lte: goal.endDate,
      },
    });

    let completed = 0;

    // Calculate completed value based on goal type
    if (goal.goalType === "workouts") {
      completed = workouts.length;
    }

    if (goal.goalType === "distance") {
      completed = workouts.reduce(
        (total, workout) => total + (workout.distance || 0),
        0
      );
    }

    if (goal.goalType === "calories") {
      completed = workouts.reduce(
        (total, workout) => total + (workout.caloriesBurned || 0),
        0
      );
    }

    if (goal.goalType === "duration") {
      completed = workouts.reduce(
        (total, workout) => total + (workout.duration || 0),
        0
      );
    }

    const percentage = Math.min(
      Math.round((completed / goal.target) * 100),
      100
    );

    const remaining = Math.max(goal.target - completed, 0);

    // Automatically mark goal as completed
    if (completed >= goal.target && goal.status !== "completed") {
      goal.status = "completed";
      await goal.save();
    }

    res.status(200).json({
      goal: {
        id: goal._id,
        title: goal.title,
        goalType: goal.goalType,
        target: goal.target,
        startDate: goal.startDate,
        endDate: goal.endDate,
        status: goal.status,
      },
      progress: {
        completed,
        remaining,
        percentage,
      },
      workoutsCount: workouts.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate goal progress",
      error: error.message,
    });
  }
};