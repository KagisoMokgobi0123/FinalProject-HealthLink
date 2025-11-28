import Role from "../models/Role.js";

// GET ALL ROLES
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("Get Roles Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// GET ROLE BY ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role)
      return res.status(404).json({ success: false, error: "Role not found" });
    return res.status(200).json({ success: true, role });
  } catch (error) {
    console.error("Get Role Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ADD ROLE (Admin Only)
export const addRole = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ success: false, error: "Only admin can add roles" });

    const { role, roleDescription } = req.body;
    if (!role || !roleDescription)
      return res
        .status(400)
        .json({ success: false, error: "Role and description required" });

    const newRole = new Role({ role, roleDescription });
    await newRole.save();

    return res
      .status(201)
      .json({ success: true, message: "Role created", role: newRole });
  } catch (error) {
    console.error("Add Role Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// UPDATE ROLE (Admin Only)
export const updateRole = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ success: false, error: "Only admin can update roles" });

    const role = await Role.findById(req.params.id);
    if (!role)
      return res.status(404).json({ success: false, error: "Role not found" });

    const { role: roleName, roleDescription, roleStatus } = req.body;

    if (roleName) role.role = roleName;
    if (roleDescription) role.roleDescription = roleDescription;
    if (roleStatus) role.roleStatus = roleStatus;

    await role.save();

    return res
      .status(200)
      .json({ success: true, message: "Role updated", role });
  } catch (error) {
    console.error("Update Role Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// SOFT DELETE ROLE (Admin Only)
export const deleteRole = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ success: false, error: "Only admin can delete roles" });

    const role = await Role.findById(req.params.id);
    if (!role)
      return res.status(404).json({ success: false, error: "Role not found" });

    role.roleStatus = "Inactive";
    await role.save();

    return res
      .status(200)
      .json({ success: true, message: "Role deactivated successfully" });
  } catch (error) {
    console.error("Delete Role Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
