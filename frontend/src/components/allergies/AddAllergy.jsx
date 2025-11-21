import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddAllergy = () => {
  const [allergyData, setAllergyData] = useState({
    allergyName: "",
    description: "",
    status: "active", // Default status is set here
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset form state when navigating away or on component unmount
  useEffect(() => {
    return () => {
      setAllergyData({
        allergyName: "",
        description: "",
        status: "active", // Default status
      });
      setErrors({});
    };
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAllergyData((prev) => ({ ...prev, [name]: value }));
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
    Object.keys(allergyData).forEach((key) => {
      if (!allergyData[key]) newErrors[key] = `${key} is required`;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Prepare the data (status is included with the default value)
      const dataToSend = {
        allergyName: allergyData.allergyName,
        description: allergyData.description,
        status: allergyData.status, // Defaulted to "active"
      };

      const response = await axios.post(
        "http://localhost:5000/api/allergy/add", // Endpoint for adding allergies
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Allergy added successfully!");
        setAllergyData({
          allergyName: "",
          description: "",
          status: "active", // Reset to default status
        });
        setTimeout(() => navigate("/admin-dashboard/allergies"), 1000); // Redirect to Allergy list page
      }
    } catch (error) {
      console.error("Add Allergy Error:", error.response?.data || error);
      toast.error(
        error.response?.data?.error || "Server error while adding allergy"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        to="/admin-dashboard/allergies"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Back
      </Link>

      <h3 className="text-2xl font-bold mb-6 text-center">Add New Allergy</h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow-md"
      >
        {/* Allergy Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Allergy Name</label>
          <input
            type="text"
            name="allergyName"
            value={allergyData.allergyName}
            onChange={handleChange}
            placeholder="Enter allergy name"
            className={`p-2 border rounded ${
              errors.allergyName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.allergyName && (
            <p className="text-red-500 text-sm mt-1">{errors.allergyName}</p>
          )}
        </div>

        {/* Allergy Description */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Allergy Description</label>
          <textarea
            name="description"
            value={allergyData.description}
            onChange={handleChange}
            placeholder="Enter allergy description"
            rows="3"
            className={`p-2 border rounded ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Removed the status input field since it defaults to "active" */}
        {/* Status is handled by the default value in the state (status: "active") */}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded font-medium transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Allergy"}
        </button>
      </form>
    </div>
  );
};

export default AddAllergy;
