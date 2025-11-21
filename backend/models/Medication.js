import mongoose from "mongoose";

const MedicationSchema = new mongoose.Schema(
  {
    drug: { type: String, required: true, trim: true },
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

export default mongoose.model("Medication", MedicationSchema);
