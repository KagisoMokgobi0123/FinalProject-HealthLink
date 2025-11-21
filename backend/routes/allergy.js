import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addAllergy,
  getAllergies,
  updateAllergy,
  deleteAllergy,
  getAllergyById,
} from "../controllers/allergyController.js";

const router = express.Router();

// Get all allergies
router.get("/", authMiddleware, getAllergies);

// Get allergy by id
router.get("/:id", authMiddleware, getAllergyById);

// Add new allergy
router.post("/add", authMiddleware, addAllergy);

// Update allergy
router.put("/:id", authMiddleware, updateAllergy);

// Delete allergy
router.delete("/:id", authMiddleware, deleteAllergy);

export default router;
