import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddBed({ onUpdate }) {
  const [ward, setWard] = useState("A");
  const [bedType, setBedType] = useState("General");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const bedOptions = ["General", "ICU", "Semi-Private", "Private", "Deluxe"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${API_URL}/api/ward/add`;
      console.log("Posting to:", url);

      await axios.post(
        url,
        { ward, bed_type: bedType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Ward added successfully", { position: "bottom-right" });

      if (onUpdate) onUpdate(); // optional callback

      // Redirect to WardList after adding
      navigate("/admin-dashboard/ward");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add ward", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Ward</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ward Dropdown */}
        <select
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>

        {/* Bed Type Dropdown */}
        <select
          value={bedType}
          onChange={(e) => setBedType(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          {bedOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex-1 bg-green-600 text-white p-3 rounded hover:bg-green-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Ward"}
          </button>

          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/ward")}
            className="flex-1 bg-gray-500 text-white p-3 rounded hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
