import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addMedication,
  getMedications,
  updateMedication,
  deleteMedication,
  getMedicationById,
} from "../controllers/medicationController.js";

const router = express.Router();

// Get all medications
router.get("/", authMiddleware, getMedications);
// Get medication by id
router.get("/:id", authMiddleware, getMedicationById);

// Add new medication
router.post("/add", authMiddleware, addMedication);

// Update medication
router.put("/:id", authMiddleware, updateMedication);

// Delete medication
router.delete("/:id", authMiddleware, deleteMedication);

export default router;
