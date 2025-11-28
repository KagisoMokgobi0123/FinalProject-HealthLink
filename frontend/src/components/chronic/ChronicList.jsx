import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EditChronic from "./EditChronic";

export default function ChronicList() {
  const [chronics, setChronics] = useState([]);
  const [filteredChronics, setFilteredChronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChronicId, setEditingChronicId] = useState(null);
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  const fetchChronics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/chronic`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChronics(res.data.chronics || []);
      setFilteredChronics(res.data.chronics || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch chronic conditions", {
        position: "bottom-right",
      });
      setChronics([]);
      setFilteredChronics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChronics();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = chronics.filter(
      (c) =>
        c.chronicName.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
    );
    setFilteredChronics(filtered);
  }, [search, chronics]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to deactivate this chronic condition?"
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/chronic/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Chronic condition deactivated successfully", {
        position: "bottom-right",
      });
      fetchChronics();
    } catch (err) {
      console.error(err);
      toast.error("Failed to deactivate chronic condition", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Chronic Condition Management
        </h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/add-chronic")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add New Chronic Condition
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredChronics.length > 0 ? (
              filteredChronics.map((chronic) => (
                <tr key={chronic._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{chronic.chronicName}</td>
                  <td className="py-2 px-4">{chronic.description}</td>
                  <td className="py-2 px-4 capitalize">
                    {chronic.status || "Active"}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setEditingChronicId(chronic._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(chronic._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No chronic conditions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingChronicId && (
        <EditChronic
          id={editingChronicId}
          isOpen={Boolean(editingChronicId)}
          onClose={() => setEditingChronicId(null)}
          onUpdate={fetchChronics}
        />
      )}
    </div>
  );
}
