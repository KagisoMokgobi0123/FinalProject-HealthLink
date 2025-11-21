import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditMedication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicationData, setMedicationData] = useState({
    drug: "",
    description: "",
    status: "Active",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch medication data on mount
  useEffect(() => {
    const fetchMedication = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/medication/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const { drug, description, status } = response.data.medication;
          setMedicationData({
            drug: drug || "",
            description: description || "",
            status: status || "Active",
          });
        }
      } catch (err) {
        console.error("Error fetching medication:", err.response?.data || err);
        toast.error(
          err.response?.data?.error || "Failed to fetch medication data"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchMedication();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicationData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    Object.keys(medicationData).forEach((key) => {
      if (!medicationData[key]) newErrors[key] = `${key} is required`;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/medication/${id}`,
        medicationData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Medication updated successfully!");
        setTimeout(() => navigate("/admin-dashboard/medication"), 1000);
      }
    } catch (err) {
      console.error("Update medication error:", err.response?.data || err);
      toast.error(
        err.response?.data?.error || "Server error while updating medication"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center mt-10">Loading medication data...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin-dashboard/medication"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
        >
          ← Back
        </Link>
        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
        Edit Medication
      </h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow"
      >
        {/* Drug Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Drug</label>
          <input
            type="text"
            name="drug"
            value={medicationData.drug}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.drug ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.drug && (
            <p className="text-red-500 text-sm mt-1">{errors.drug}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={medicationData.description}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
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
            value={medicationData.status}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.status ? "border-red-500" : "border-gray-300"
            }`}
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
          {loading ? "Updating..." : "Update Medication"}
        </button>
      </form>
    </div>
  );
};

export default EditMedication;
