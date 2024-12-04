import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["to-do", "progress", "done"],
      default: "to-do",
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("task", taskSchema);
