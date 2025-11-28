import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditBed({ id, isOpen, onClose, onUpdate }) {
  const [loading, setLoading] = useState(true);
  const [ward, setWard] = useState("A");
  const [bedType, setBedType] = useState("General");
  const [status, setStatus] = useState("active");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const bedOptions = ["General", "ICU", "Semi-Private", "Private", "Deluxe"];

  useEffect(() => {
    if (isOpen) {
      const fetchWard = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const res = await axios.get(`${API_URL}/api/ward/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWard(res.data.ward.ward);
          setBedType(res.data.ward.bed_type);
          setStatus(res.data.ward.bedStatus || "active");
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch ward", { position: "bottom-right" });
        } finally {
          setLoading(false);
        }
      };
      fetchWard();
    }
  }, [id, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/ward/${id}`,
        { ward, bed_type: bedType, bedStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Ward updated successfully", { position: "bottom-right" });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to update ward", {
        position: "bottom-right",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Ward</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
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

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-between gap-2">
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white p-3 rounded hover:bg-yellow-600 transition-colors"
              >
                Update Ward
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
