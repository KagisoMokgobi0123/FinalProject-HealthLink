import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddAllergy({ onUpdate }) {
  const [allergyName, setAllergyName] = useState("");
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
        `${API_URL}/api/allergy/add`,
        { allergyName, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Allergy added successfully", { position: "bottom-right" });
      if (onUpdate) onUpdate();
      navigate("/admin-dashboard/allergies");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add allergy", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Allergy</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={allergyName}
          onChange={(e) => setAllergyName(e.target.value)}
          placeholder="Allergy Name"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className={`w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Allergy"}
        </button>
      </form>
    </div>
  );
}
