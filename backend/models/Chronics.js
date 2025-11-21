import mongoose from "mongoose";

const ChronicConditionSchema = new mongoose.Schema(
  {
    chronicName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ChronicCondition", ChronicConditionSchema);
