import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditBed = () => {
  const { id } = useParams(); // Bed ID from URL
  const navigate = useNavigate();

  const [bed, setBed] = useState({
    bed_type: "",
    ward: "",
    bedStatus: "available",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch bed data on mount
  useEffect(() => {
    const fetchBed = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ward/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const { bed_type, ward, bedStatus } = response.data.bed;
          setBed({
            bed_type: bed_type || "",
            ward: ward || "",
            bedStatus: bedStatus || "available",
          });
        }
      } catch (err) {
        console.error("Error fetching bed:", err.response?.data || err);
        toast.error(err.response?.data?.error || "Failed to fetch bed data");
      } finally {
        setFetching(false);
      }
    };

    fetchBed();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBed((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    Object.keys(bed).forEach((key) => {
      if (!bed[key]) newErrors[key] = `${key} is required`;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/ward/${id}`,
        bed,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Bed updated successfully!");
        setTimeout(() => navigate("/admin-dashboard/ward"), 1000);
      }
    } catch (err) {
      console.error("Update bed error:", err.response?.data || err);
      toast.error(
        err.response?.data?.error || "Server error while updating bed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center mt-10">Loading bed data...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin-dashboard/ward"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
        >
          ← Back
        </Link>
        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
        Edit Bed
      </h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow"
      >
        {/* Bed Type */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Bed Type
          </label>
          <select
            name="bed_type"
            value={bed.bed_type}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
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

        {/* Ward */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Ward</label>
          <select
            name="ward"
            value={bed.ward}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
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

        {/* Status */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Status</label>
          <select
            name="bedStatus"
            value={bed.bedStatus}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.bedStatus ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
          {errors.bedStatus && (
            <p className="text-red-500 text-sm mt-1">{errors.bedStatus}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg font-medium transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update Bed"}
        </button>
      </form>
    </div>
  );
};

export default EditBed;
