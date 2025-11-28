import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getMedications,
  getMedicationById,
  addMedication,
  updateMedication,
  deleteMedication,
} from "../controllers/medicationController.js";

const router = express.Router();

router.get("/", authMiddleware, getMedications);
router.get("/:id", authMiddleware, getMedicationById);
router.post("/add", authMiddleware, addMedication);
router.put("/:id", authMiddleware, updateMedication);
router.delete("/:id", authMiddleware, deleteMedication);

export default router;
