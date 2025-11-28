import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditChronic({ id, isOpen, onClose, onUpdate }) {
  const [chronicName, setChronicName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (isOpen && id) fetchChronic();
  }, [isOpen, id]);

  const fetchChronic = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/chronic/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const chronic = res.data.chronic;
      setChronicName(chronic.chronicName);
      setDescription(chronic.description);
      setStatus(chronic.status || "Active");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch chronic details", {
        position: "bottom-right",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/chronic/${id}`,
        { chronicName, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Chronic condition updated successfully", {
        position: "bottom-right",
      });

      onUpdate(); // refresh list
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to update chronic condition", {
        position: "bottom-right",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Edit Chronic Condition</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block font-semibold">Chronic Name:</label>
            <input
              type="text"
              value={chronicName}
              onChange={(e) => setChronicName(e.target.value)}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block font-semibold">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded h-32 focus:ring focus:ring-blue-300"
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
