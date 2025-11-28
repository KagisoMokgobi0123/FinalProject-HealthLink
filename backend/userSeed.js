import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Role from "./models/Role.js";
import connectDB from "./db/db.js";

dotenv.config();

const userRegister = async () => {
  try {
    await connectDB();

    // Get the admin role
    const adminRole = await Role.findOne({ role: "admin" });
    if (!adminRole) {
      console.error("Admin role not found. Make sure roles are seeded first.");
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin", 10);

    // Create new admin user
    const newUser = new User({
      FirstName: "Bob",
      LastName: "Stone",
      idNo: 1212125454082,
      address: "14 Wise Street, Greystone",
      phone: 612345643,
      email: "Admin@gmail.com",
      password: hashedPassword,
      role: adminRole._id,
    });

    await newUser.save();

    console.log("Admin user created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
};

userRegister();
