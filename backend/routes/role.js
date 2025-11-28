import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole,
} from "../controllers/roleController.js";

const router = express.Router();

// Public route: get all roles (for signup)
router.get("/", getRoles);

// Protected routes
router.get("/:id", authMiddleware, getRoleById);
router.post("/add", authMiddleware, addRole);
router.put("/:id", authMiddleware, updateRole);
router.delete("/:id", authMiddleware, deleteRole);

export default router;
