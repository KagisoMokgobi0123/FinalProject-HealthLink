import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    roleDescription: { type: String, required: true, trim: true },
    roleStatus: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Role", RoleSchema);
