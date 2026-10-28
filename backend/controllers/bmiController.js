import User from "../models/User.js";

export const calculateBMI = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.height || !user.weight) {
      return res.status(400).json({
        message: "Height and weight are required",
      });
    }

    // Height is stored in centimeters
    const heightInMeters = user.height / 100;

    const bmi = user.weight / (heightInMeters * heightInMeters);

    let category;

    if (bmi < 18.5) {
      category = "Underweight";
    } else if (bmi < 25) {
      category = "Normal weight";
    } else if (bmi < 30) {
      category = "Overweight";
    } else {
      category = "Obese";
    }

    res.status(200).json({
      bmi: Number(bmi.toFixed(2)),
      category,
      height: user.height,
      weight: user.weight,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate BMI",
      error: error.message,
    });
  }
};