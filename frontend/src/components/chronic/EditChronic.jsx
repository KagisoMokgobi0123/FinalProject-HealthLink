import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditChronic = () => {
  const { id } = useParams(); // Get the chronic condition ID from the URL
  const navigate = useNavigate();

  const [chronicData, setChronicData] = useState({
    chronicName: "", // Ensure it matches the API schema field
    description: "",
    status: "Active", // Default to "Active"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch chronic condition data on mount
  useEffect(() => {
    const fetchChronic = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chronic/${id}`, // Endpoint to fetch chronic condition
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const { chronicName, description, status } = response.data.chronic;
          setChronicData({
            chronicName: chronicName || "",
            description: description || "",
            status: status || "Active",
          });
        } else {
          toast.error(
            response.data.error || "Failed to fetch chronic condition data"
          );
        }
      } catch (err) {
        console.error("Error fetching chronic condition:", err);
        toast.error(
          err.response?.data?.error || "Failed to fetch chronic condition data"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchChronic();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChronicData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    Object.keys(chronicData).forEach((key) => {
      if (!chronicData[key]) newErrors[key] = `${key} is required`;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/chronic/${id}`, // Endpoint to update chronic condition
        chronicData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Chronic condition updated successfully!");
        setTimeout(() => navigate("/admin-dashboard/chronic"), 1000); // Redirect to chronic conditions list
      }
    } catch (err) {
      console.error("Update chronic condition error:", err);
      toast.error(
        err.response?.data?.error ||
          "Server error while updating chronic condition"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center mt-10">Loading chronic condition data...</div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin-dashboard/chroniclist"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
        >
          ← Back
        </Link>
        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
        Edit Chronic Condition
      </h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow"
      >
        {/* Chronic Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Chronic Name
          </label>
          <input
            type="text"
            name="chronicName"
            value={chronicData.chronicName}
            onChange={handleChange}
            className={
              errors.chronicName
                ? "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition border-red-500"
                : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition border-gray-300"
            }
          />
          {errors.chronicName && (
            <p className="text-red-500 text-sm mt-1">{errors.chronicName}</p>
          )}
        </div>

        {/* Chronic Description */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={chronicData.description}
            onChange={handleChange}
            className={
              errors.description
                ? "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition border-red-500"
                : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition border-gray-300"
            }
            rows={3}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={chronicData.status}
            onChange={handleChange}
            className={
              errors.status
                ? "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition border-red-500"
                : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition border-gray-300"
            }
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg font-medium transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update Chronic Condition"}
        </button>
      </form>
    </div>
  );
};

export default EditChronic;
