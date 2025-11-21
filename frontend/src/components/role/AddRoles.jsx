import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddRole = () => {
  const [roleData, setRoleData] = useState({
    role: "",
    roleDescription: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const newErrors = {};
    Object.keys(roleData).forEach((key) => {
      if (!roleData[key]) newErrors[key] = `${key} is required`;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/role/add",
        roleData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Role added successfully!");
        setRoleData({ role: "", roleDescription: "" });
        setTimeout(() => navigate("/admin-dashboard/role"), 800);
      }
    } catch (error) {
      console.error("AddRole Error:", error.response?.data || error);
      toast.error(
        error.response?.data?.error || "Server error while adding role"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        to="/admin-dashboard/role"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Back
      </Link>

      <h3 className="text-2xl font-bold mb-6 text-center">Add New Role</h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow-md"
      >
        {/* Role Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Role Name</label>
          <input
            type="text"
            name="role"
            value={roleData.role}
            onChange={handleChange}
            placeholder="Enter role name"
            className={`p-2 border rounded ${
              errors.role ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        {/* Role Description */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Role Description</label>
          <textarea
            name="roleDescription"
            value={roleData.roleDescription}
            onChange={handleChange}
            placeholder="Enter a short description"
            rows="3"
            className={`p-2 border rounded ${
              errors.roleDescription ? "border-red-500" : "border-gray-300"
            }`}
          ></textarea>
          {errors.roleDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.roleDescription}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded font-medium transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Role"}
        </button>
      </form>
    </div>
  );
};

export default AddRole;
