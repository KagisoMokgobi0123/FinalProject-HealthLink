import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addChronic,
  getChronics,
  updateChronic,
  deleteChronic,
  getChronicById,
} from "../controllers/chronicsController.js"; // Assuming you have a chronicController.js

const router = express.Router();

// Get all chronic conditions
router.get("/", authMiddleware, getChronics);

// Get chronic condition by id
router.get("/:id", authMiddleware, getChronicById);

// Add new chronic condition
router.post("/add", authMiddleware, addChronic);

// Update chronic condition
router.put("/:id", authMiddleware, updateChronic);

// Delete chronic condition
router.delete("/:id", authMiddleware, deleteChronic);

export default router;
