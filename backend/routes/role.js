import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addRole,
  getRoles,
  updateRole,
  deleteRole,
  getRoleById,
} from "../controllers/roleController.js";

const router = express.Router();

// Get all roles
router.get("/", authMiddleware, getRoles);
// Get role by id
router.get("/:id", authMiddleware, getRoleById);

// Add new role
router.post("/add", authMiddleware, addRole);

// Update role
router.put("/:id", authMiddleware, updateRole);

// Delete role
router.delete("/:id", authMiddleware, deleteRole);

export default router;
