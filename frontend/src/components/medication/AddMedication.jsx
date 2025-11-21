import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddMedication = () => {
  const [medicationData, setMedicationData] = useState({
    drug: "",
    description: "",
    status: "Active", // Status is fixed as "Active"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicationData((prev) => ({ ...prev, [name]: value }));
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
    Object.keys(medicationData).forEach((key) => {
      if (!medicationData[key]) newErrors[key] = `${key} is required`;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/medication/add",
        medicationData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Medication added successfully!");
        setMedicationData({ drug: "", description: "", status: "Active" });
        setTimeout(() => navigate("/admin-dashboard/medication"), 800);
      }
    } catch (error) {
      console.error("Add Medication Error:", error.response?.data || error);
      toast.error(
        error.response?.data?.error || "Server error while adding medication"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        to="/admin-dashboard/medication"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Back
      </Link>

      <h3 className="text-2xl font-bold mb-6 text-center">
        Add New Medication
      </h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow-md"
      >
        {/* Drug Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Drug Name</label>
          <input
            type="text"
            name="drug"
            value={medicationData.drug}
            onChange={handleChange}
            placeholder="Enter drug name"
            className={`p-2 border rounded ${
              errors.drug ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.drug && (
            <p className="text-red-500 text-sm mt-1">{errors.drug}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={medicationData.description}
            onChange={handleChange}
            placeholder="Enter a short description"
            rows="3"
            className={`p-2 border rounded ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* No status input field as status is defaulted to "Active" */}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded font-medium transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Medication"}
        </button>
      </form>
    </div>
  );
};

export default AddMedication;
