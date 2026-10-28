import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workoutType: {
      type: String,
      required: true,
      enum: [
        "Running",
        "Cycling",
        "Walking",
        "Gym",
        "Yoga",
        "Swimming",
        "Other",
      ],
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    caloriesBurned: {
      type: Number,
      required: true,
      min: 0,
    },

    distance: {
      type: Number,
      min: 0,
      default: 0,
    },

    date: {
      type: Date,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;