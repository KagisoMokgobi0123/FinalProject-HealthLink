import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditMedication({ id, isOpen, onClose, onUpdate }) {
  const [loading, setLoading] = useState(true);
  const [drug, setDrug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (isOpen) {
      const fetchMedication = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const res = await axios.get(`${API_URL}/api/medication/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const med = res.data.medication;
          setDrug(med.drug);
          setDescription(med.description);
          setStatus(med.status || "Active");
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch medication", {
            position: "bottom-right",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchMedication();
    }
  }, [id, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/medication/${id}`,
        { drug, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Medication updated successfully", {
        position: "bottom-right",
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to update medication", {
        position: "bottom-right",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Medication</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Drug Name */}
            <input
              type="text"
              value={drug}
              onChange={(e) => setDrug(e.target.value)}
              placeholder="Drug Name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            {/* Description */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="flex justify-between gap-2">
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white p-3 rounded hover:bg-yellow-600 transition-colors"
              >
                Update Medication
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-gray-500 text-white p-3 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
