import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "./models/Role.js";
import connectDB from "./db/db.js";

dotenv.config();

const seedRoles = async () => {
  try {
    await connectDB();

    const roles = [
      {
        role: "admin",
        roleDescription: "Administrator with full access",
        roleStatus: "Active",
      },
      {
        role: "employee",
        roleDescription: "Employee with limited access",
        roleStatus: "Active",
      },
      {
        role: "doctor",
        roleDescription: "Doctor with medical privileges",
        roleStatus: "Active",
      },
      {
        role: "nurse",
        roleDescription: "Nurse with patient care privileges",
        roleStatus: "Active",
      },
      {
        role: "staff",
        roleDescription: "General staff with restricted access",
        roleStatus: "Active",
      },
    ];

    // Clear existing roles (optional)
    await Role.deleteMany();

    // Insert new roles
    await Role.insertMany(roles);

    console.log("Roles seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding roles:", error);
    process.exit(1);
  }
};

seedRoles();
