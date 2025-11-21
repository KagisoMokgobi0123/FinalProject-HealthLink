import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    cellNo: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    role: {
      type: mongoose.Schema.Types.ObjectId, // Foreign key to Role
      ref: "Role",
      required: true,
    },
    employeeStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Employee", EmployeeSchema);
