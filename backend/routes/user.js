import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  approveUser,
} from "../controllers/userController.js";

const router = express.Router();

// Add new user (signup) — NO auth required
router.post("/add", addUser);

// Protect all other routes
router.use(authMiddleware);

// Get all users
router.get("/", getUsers);

// Get single user
router.get("/:id", getUserById);

// Update user
router.put("/:id", updateUser);

// Soft delete
router.delete("/:id", deleteUser);

// Approve user
router.put("/approve/:id", authMiddleware, adminMiddleware, approveUser);

export default router;
