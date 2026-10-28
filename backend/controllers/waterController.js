import Water from "../models/Water.js";

export const addWater = async (req, res) => {
  try {
    const { amount, date } = req.body;

    if (!amount) {
      return res.status(400).json({
        message: "Amount is required",
      });
    }

    const water = await Water.create({
      userId: req.userId,
      amount,
      date: date || new Date(),
    });

    res.status(201).json({
      message: "Water intake added successfully",
      water,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add water intake",
      error: error.message,
    });
  }
};
export const getTodayWater = async (req, res) => {
  try {
    const userId = req.userId;

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

    const totalWater = waterRecords.reduce(
      (total, record) => total + record.amount,
      0
    );

    res.status(200).json({
      date: startOfDay,
      totalWater,
      litres: Number((totalWater / 1000).toFixed(2)),
      records: waterRecords,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get today's water intake",
      error: error.message,
    });
  }
};
export const deleteWater = async (req, res) => {
  try {
    const { id } = req.params;

    const water = await Water.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!water) {
      return res.status(404).json({
        message: "Water record not found",
      });
    }

    res.status(200).json({
      message: "Water record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete water record",
      error: error.message,
    });
  }
};