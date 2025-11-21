import mongoose from "mongoose";

// Define the schema for allergies
const allergySchema = new mongoose.Schema(
  {
    allergyName: {
      type: String,
      required: true,
      trim: true, // Only trimming whitespace from the start and end
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // Default value for status
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Enable Mongoose's automatic 'createdAt' and 'updatedAt'
  }
);

// Create the model
const Allergy = mongoose.model("Allergy", allergySchema);

export default Allergy;
