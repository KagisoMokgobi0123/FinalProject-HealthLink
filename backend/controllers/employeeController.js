import Employee from "../models/Employee.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptj";

// GET ALL EMPLOYEES
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("role", "role roleDescription")
      .sort({ createdAt: -1 })
      .select("-password"); // hide password

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Get Employees Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Fetching employees server error" });
  }
};

// GET EMPLOYEE BY ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id)
      .populate("role", "role roleDescription")
      .select("-password");

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Get Employee Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Fetching employee failed" });
  }
};

// ADD NEW EMPLOYEE
export const addEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, password, address, cellNo, role } =
      req.body;

    if (!firstName || !password || !lastName || !email || !role) {
      return res.status(400).json({
        success: false,
        error: "First name, last name, password, email, and role are required",
      });
    }

    // Check if email already exists
    const emailExists = await Employee.findOne({ email });
    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    // Check role exists
    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return res.status(404).json({ success: false, error: "Role not found" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      cellNo,
      role,
    });

    await newEmployee.save();
    newEmployee.password = undefined;

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: newEmployee,
    });
  } catch (error) {
    console.error("Add Employee Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Adding employee server error" });
  }
};

// UPDATE EMPLOYEE
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, address, cellNo, role } =
      req.body;

    const employee = await Employee.findById(id);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });

    if (role) {
      const roleExists = await Role.findById(role);
      if (!roleExists)
        return res
          .status(404)
          .json({ success: false, error: "Role not found" });
      employee.role = role;
    }

    if (firstName) employee.firstName = firstName;
    if (lastName) employee.lastName = lastName;
    if (email) employee.email = email;

    if (password) {
      employee.password = await bcrypt.hash(password, 10);
    }

    if (address) employee.address = address;
    if (cellNo) employee.cellNo = cellNo;

    await employee.save();
    employee.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error("Update Employee Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Updating employee server error" });
  }
};

// DELETE EMPLOYEE
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee)
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });

    await Employee.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Delete Employee Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Deleting employee server error" });
  }
};
