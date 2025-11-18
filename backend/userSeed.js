import User from "./models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectDB } from "./db/db.js";
import dotenv from "dotenv";

dotenv.config();

const userRegister = async () => {
  try {
    await connectDB();

    const hashPassword = await bcrypt.hash("admin", 10);

    const newUser = new User({
      FirstName: "Bob",
      LastName: "Stone",
      cellNo: "0612345643",
      idNo: "1212125454082",
      email: "Admin@gmail.com",
      password: hashPassword,
      role: "admin",
    });

    await newUser.save();
    console.log("Admin user created successfully.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

userRegister();
