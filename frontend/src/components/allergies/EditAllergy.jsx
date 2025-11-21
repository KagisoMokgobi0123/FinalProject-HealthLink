import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditAllergy = () => {
  const { id } = useParams(); // Get the allergy ID from the URL
  const navigate = useNavigate();

  const [allergyData, setAllergyData] = useState({
    allergyName: "", // Ensure it matches the API schema field
    description: "",
    status: "active", // Default to "active"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch allergy data on mount
  useEffect(() => {
    const fetchAllergy = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/allergy/${id}`, // Endpoint to fetch allergy data
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const { allergyName, description, status } = response.data.allergy;
          setAllergyData({
            allergyName: allergyName || "",
            description: description || "",
            status: status || "active",
          });
        } else {
          toast.error(response.data.error || "Failed to fetch allergy data");
        }
      } catch (err) {
        console.error("Error fetching allergy:", err);
        toast.error(
          err.response?.data?.error || "Failed to fetch allergy data"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchAllergy();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAllergyData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    Object.keys(allergyData).forEach((key) => {
      if (!allergyData[key]) newErrors[key] = `${key} is required`;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/allergy/${id}`, // Endpoint to update allergy data
        allergyData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Allergy updated successfully!");
        setTimeout(() => navigate("/admin-dashboard/allergies"), 1000); // Redirect to allergy list
      }
    } catch (err) {
      console.error("Update allergy error:", err);
      toast.error(
        err.response?.data?.error || "Server error while updating allergy"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center mt-10">Loading allergy data...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin-dashboard/allergies"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
        >
          ← Back
        </Link>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
        Edit Allergy
      </h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow"
      >
        {/* Allergy Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Allergy Name
          </label>
          <input
            type="text"
            name="allergyName"
            value={allergyData.allergyName}
            onChange={handleChange}
            className={
              errors.allergyName
                ? "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition border-red-500"
                : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition border-gray-300"
            }
          />
          {errors.allergyName && (
            <p className="text-red-500 text-sm mt-1">{errors.allergyName}</p>
          )}
        </div>

        {/* Allergy Description */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={allergyData.description}
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
            value={allergyData.status}
            onChange={handleChange}
            className={
              errors.status
                ? "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition border-red-500"
                : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition border-gray-300"
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
          {loading ? "Updating..." : "Update Allergy"}
        </button>
      </form>
    </div>
  );
};

export default EditAllergy;
