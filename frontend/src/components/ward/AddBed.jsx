import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddBed = () => {
  const [ward, setWard] = useState({ bed_type: "", ward: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWard((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(ward).forEach((key) => {
      if (!ward[key]) newErrors[key] = `${key} is required`;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      // Only send bed_type and ward; bedStatus comes from schema default
      const response = await axios.post(
        "http://localhost:5000/api/ward/add",
        ward,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Bed added successfully!");
        setWard({ bed_type: "", ward: "" });
        setTimeout(() => navigate("/admin-dashboard/ward"), 1000);
      }
    } catch (error) {
      console.error("AddBed Error:", error.response?.data);
      toast.error(
        error.response?.data?.error || "Server error while adding bed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        to="/admin-dashboard/ward"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Back
      </Link>
      <h3 className="text-2xl font-bold mb-6 text-center">Add New Bed</h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow-md"
      >
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Bed Type</label>
          <select
            name="bed_type"
            value={ward.bed_type}
            onChange={handleChange}
            className={`p-2 border rounded ${
              errors.bed_type ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Bed Type</option>
            <option value="manual">Manual</option>
            <option value="fully electric">Fully Electric</option>
            <option value="standard">Standard</option>
            <option value="bariatric">Bariatric</option>
          </select>
          {errors.bed_type && (
            <p className="text-red-500 text-sm mt-1">{errors.bed_type}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Ward</label>
          <select
            name="ward"
            value={ward.ward}
            onChange={handleChange}
            className={`p-2 border rounded ${
              errors.ward ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Ward</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          {errors.ward && (
            <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
          )}
        </div>

        <button
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded font-medium transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Bed"}
        </button>
      </form>
    </div>
  );
};

export default AddBed;
