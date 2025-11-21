import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddChronic = () => {
  const [chronicData, setChronicData] = useState({
    chronicName: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset form state when navigating away or on component unmount
  useEffect(() => {
    return () => {
      setChronicData({
        chronicName: "",
        description: "",
      });
      setErrors({});
    };
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setChronicData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields (no startDate validation needed now)
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
      const token = localStorage.getItem("token");

      // Prepare the data
      const dataToSend = {
        chronicName: chronicData.chronicName,
        description: chronicData.description,
      };

      const response = await axios.post(
        "http://localhost:5000/api/chronic/add", // Endpoint for adding chronic conditions
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Chronic condition added successfully!");
        setChronicData({
          chronicName: "",
          description: "",
        });
        setTimeout(() => navigate("/admin-dashboard/chronic"), 800); // Redirect to Chronic list page
      }
    } catch (error) {
      console.error("AddChronic Error:", error.response?.data || error);
      toast.error(
        error.response?.data?.error ||
          "Server error while adding chronic condition"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        to="/admin-dashboard/chronic"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Back
      </Link>

      <h3 className="text-2xl font-bold mb-6 text-center">
        Add New Chronic Condition
      </h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow-md"
      >
        {/* Condition Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Chronic Name</label>
          <input
            type="text"
            name="chronicName"
            value={chronicData.chronicName}
            onChange={handleChange}
            placeholder="Enter condition name"
            className={`p-2 border rounded ${
              errors.chronicName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.chronicName && (
            <p className="text-red-500 text-sm mt-1">{errors.chronicName}</p>
          )}
        </div>

        {/* Condition Description */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Condition Description</label>
          <textarea
            name="description"
            value={chronicData.description}
            onChange={handleChange}
            placeholder="Enter condition description"
            rows="3"
            className={`p-2 border rounded ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded font-medium transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Chronic Condition"}
        </button>
      </form>
    </div>
  );
};

export default AddChronic;
