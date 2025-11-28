import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    // Attach user to request
    const user = await User.findById(decoded._id)
      .populate("role")
      .select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Only allow active users
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        error: `Account is ${user.status}. Contact admin.`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
};

export default authMiddleware;
