import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddMedication({ onUpdate }) {
  const [drug, setDrug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/medication/add`,
        { drug, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Medication added successfully", {
        position: "bottom-right",
      });

      if (onUpdate) onUpdate();

      // Redirect to MedicationList
      navigate("/admin-dashboard/medication");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add medication", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Add New Medication
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Drug Name"
          value={drug}
          onChange={(e) => setDrug(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex-1 bg-green-600 text-white p-3 rounded hover:bg-green-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Medication"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/medication")}
            className="flex-1 bg-gray-500 text-white p-3 rounded hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
