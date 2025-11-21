import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
} from "../controllers/employeeController.js";

const router = express.Router();

// Get all employees
router.get("/", authMiddleware, getEmployees);

// Get employee by ID
router.get("/:id", authMiddleware, getEmployeeById);

// Add new employee
router.post("/add", authMiddleware, addEmployee);

// Update employee
router.put("/:id", authMiddleware, updateEmployee);

// Delete employee
router.delete("/:id", authMiddleware, deleteEmployee);

export default router;
