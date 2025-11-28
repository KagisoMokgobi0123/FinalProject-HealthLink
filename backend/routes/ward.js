import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getWards,
  getWardById,
  addWard,
  updateWard,
  deleteWard,
} from "../controllers/wardController.js";

const router = express.Router();

// Get all wards/beds
router.get("/", authMiddleware, getWards);

// Get ward/bed by ID
router.get("/:id", authMiddleware, getWardById);

// Add ward/bed (Admin only)
router.post("/add", authMiddleware, addWard);

// Update ward/bed (Admin only)
router.put("/:id", authMiddleware, updateWard);

// Soft delete ward/bed (Admin only)
router.delete("/:id", authMiddleware, deleteWard);

export default router;
