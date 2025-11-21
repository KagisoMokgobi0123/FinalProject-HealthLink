import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addBed,
  getBeds,
  updateBed,
  deleteBed,
  getBedById,
} from "../controllers/wardController.js";

const router = express.Router();

// Get all beds
router.get("/", authMiddleware, getBeds);
// Get bed by id
router.get("/:id", authMiddleware, getBedById);

// Add new bed
router.post("/add", authMiddleware, addBed);

// Update bed
router.put("/:id", authMiddleware, updateBed);

// Delete bed
router.delete("/:id", authMiddleware, deleteBed);

export default router;
