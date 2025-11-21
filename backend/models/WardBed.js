import mongoose from "mongoose";

const WardBedSchema = new mongoose.Schema(
  {
    bed_type: { type: String, required: true },
    ward: { type: String, required: true },
    bedStatus: { type: String, default: "available" },
  },
  { timestamps: true }
);

export default mongoose.model("WardBed", WardBedSchema);
