import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate(
      "role"
    );
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        error: `Account is ${user.status}. Contact admin.`,
      });
    }

    if (!user.password) {
      return res
        .status(500)
        .json({ success: false, error: "User has no password set" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, error: "Incorrect login details" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        error: "JWT_SECRET is not set in environment",
      });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role?._id },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        FirstName: user.FirstName,
        LastName: user.LastName,
        email: user.email,
        role: user.role?.role || "unknown",
        roleId: user.role?._id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

// VERIFY TOKEN
const verify = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export { login, verify };
