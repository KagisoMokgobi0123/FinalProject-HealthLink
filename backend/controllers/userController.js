import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";

// ADD NEW USER (Signup)
export const addUser = async (req, res) => {
  try {
    const { FirstName, LastName, idNo, email, password, role, phone, address } =
      req.body;

    // Validate required fields
    if (!FirstName || !LastName || !idNo || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, error: "Required fields missing" });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ success: false, error: "Email exists" });

    // Check if role exists
    const roleExists = await Role.findById(role);
    if (!roleExists)
      return res.status(404).json({ success: false, error: "Role not found" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      FirstName,
      LastName,
      idNo,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      address,
      status: "pending", // default pending until admin approves
    });

    await newUser.save();
    newUser.password = undefined;

    // Send email to admin for approval
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Employee Signup - Approval Required",
      text: `${FirstName} ${LastName} has registered. Please approve.`,
      html: `<p><strong>${FirstName} ${LastName}</strong> has registered. Please approve in the admin panel.</p>`,
    });

    // Send email to employee notifying waiting for approval
    await sendEmail({
      to: email,
      subject: "Registration Received - Waiting for Approval",
      text: "Your registration is received and pending admin approval.",
      html: `<p>Hi <strong>${FirstName}</strong>, your registration is received and pending admin approval.</p>`,
    });

    return res.status(201).json({
      success: true,
      message: "User created. Pending admin approval.",
      user: newUser,
    });
  } catch (error) {
    console.error("Add User Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// APPROVE USER (Admin only)
export const approveUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    if (user.status === "active")
      return res
        .status(400)
        .json({ success: false, error: "User already approved" });

    user.status = "active";
    await user.save();

    // Notify the employee
    await sendEmail({
      to: user.email,
      subject: "Your Registration Has Been Approved",
      text: `Hi ${user.FirstName}, your registration has been approved. You can now log in.`,
      html: `<p>Hi <strong>${user.FirstName}</strong>,</p>
             <p>Your registration has been <strong>approved</strong>. You can now log in to your account.</p>`,
    });

    return res.status(200).json({
      success: true,
      message: `User ${user.FirstName} ${user.LastName} approved successfully.`,
    });
  } catch (error) {
    console.error("Approve User Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// GET ALL USERS (Employees)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("role", "role roleDescription")
      .sort({ createdAt: -1 })
      .select("-password");

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("role", "role roleDescription")
      .select("-password");

    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/// UPDATE USER STATUS (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res
        .status(400)
        .json({ success: false, error: "Status is required" });
    }

    const validStatuses = ["pending", "active", "inactive"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid status value" });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    // // Only admin can update status
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     error: "Only admin can update user status",
    //   });
    // }

    // Update status
    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.FirstName} ${user.LastName} status updated to ${status}`,
      user: {
        FirstName: user.FirstName,
        LastName: user.LastName,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update User Status Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// SOFT DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    user.status = "inactive";
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "User deactivated successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
