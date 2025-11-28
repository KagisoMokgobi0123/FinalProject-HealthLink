import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAllergies,
  getAllergyById,
  addAllergy,
  updateAllergy,
  deleteAllergy,
} from "../controllers/allergyController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllergies);
router.get("/:id", authMiddleware, getAllergyById);
router.post("/add", authMiddleware, addAllergy);
router.put("/:id", authMiddleware, updateAllergy);
router.delete("/:id", authMiddleware, deleteAllergy);

export default router;
