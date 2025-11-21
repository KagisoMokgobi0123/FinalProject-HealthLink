import Role from "../models/Role.js";

// GET ALL ROLES
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("Get Roles Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Fetching roles server error" });
  }
};

// ⭐ GET ROLE BY ID
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({ success: false, error: "Role not found" });
    }

    return res.status(200).json({ success: true, role });
  } catch (error) {
    console.error("Get Role Error:", error);
    return res.status(500).json({
      success: false,
      error: "Fetching role failed",
    });
  }
};

// ADD NEW ROLE
export const addRole = async (req, res) => {
  try {
    const { role, roleDescription, roleStatus } = req.body;

    if (!role || !roleDescription) {
      return res.status(400).json({
        success: false,
        error: "Role and Role Description are required",
      });
    }

    const newRole = new Role({
      role,
      roleDescription,
      roleStatus: roleStatus || "Active",
    });

    await newRole.save();
    return res.status(201).json({
      success: true,
      message: "Role added successfully",
      role: newRole,
    });
  } catch (error) {
    console.error("Add Role Error:", error);
    return res.status(500).json({
      success: false,
      error: "Adding role server error",
      details: error.message,
    });
  }
};

// UPDATE ROLE
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, roleDescription, roleStatus } = req.body;

    const existingRole = await Role.findById(id);
    if (!existingRole)
      return res.status(404).json({ success: false, error: "Role not found" });

    if (role) existingRole.role = role;
    if (roleDescription) existingRole.roleDescription = roleDescription;
    if (roleStatus) existingRole.roleStatus = roleStatus;

    await existingRole.save();
    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      role: existingRole,
    });
  } catch (error) {
    console.error("Update Role Error:", error);
    return res.status(500).json({
      success: false,
      error: "Updating role server error",
    });
  }
};

// DELETE ROLE
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role)
      return res.status(404).json({ success: false, error: "Role not found" });

    await Role.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("Delete Role Error:", error);
    return res.status(500).json({
      success: false,
      error: "Deleting role server error",
    });
  }
};
