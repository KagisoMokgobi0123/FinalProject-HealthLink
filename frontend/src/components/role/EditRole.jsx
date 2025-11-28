import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roleData, setRoleData] = useState({
    role: "",
    roleDescription: "",
    roleStatus: "Active",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  // Fetch role data on mount
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/role/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          const { role, roleDescription, roleStatus } = response.data.role;
          setRoleData({
            role: role || "",
            roleDescription: roleDescription || "",
            roleStatus: roleStatus || "Active",
          });
        }
      } catch (err) {
        console.error("Error fetching role:", err.response?.data || err);
        toast.error(err.response?.data?.error || "Failed to fetch role data");
      } finally {
        setFetching(false);
      }
    };

    fetchRole();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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
      const response = await axios.put(`${API_URL}/api/role/${id}`, roleData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success("Role updated successfully!");
        setTimeout(() => navigate("/admin-dashboard/role"), 1000);
      }
    } catch (err) {
      console.error("Update role error:", err.response?.data || err);
      toast.error(
        err.response?.data?.error || "Server error while updating role"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center mt-10">Loading role data...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin-dashboard/role"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
        >
          ← Back
        </Link>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
        Edit Role
      </h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow"
      >
        {/* Role Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Role</label>
          <input
            type="text"
            name="role"
            value={roleData.role}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.role ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        {/* Role Description */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="roleDescription"
            value={roleData.roleDescription}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.roleDescription ? "border-red-500" : "border-gray-300"
            }`}
            rows={3}
          ></textarea>
          {errors.roleDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.roleDescription}
            </p>
          )}
        </div>

        {/* Role Status */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Status</label>
          <select
            name="roleStatus"
            value={roleData.roleStatus}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.roleStatus ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.roleStatus && (
            <p className="text-red-500 text-sm mt-1">{errors.roleStatus}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg font-medium transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update Role"}
        </button>
      </form>
    </div>
  );
};

export default EditRole;
