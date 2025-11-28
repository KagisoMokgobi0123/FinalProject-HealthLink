import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getChronics,
  getChronicById,
  addChronic,
  updateChronic,
  deleteChronic,
} from "../controllers/chronicController.js";

const router = express.Router();

router.get("/", authMiddleware, getChronics);
router.get("/:id", authMiddleware, getChronicById);
router.post("/add", authMiddleware, addChronic);
router.put("/:id", authMiddleware, updateChronic);
router.delete("/:id", authMiddleware, deleteChronic);

export default router;
