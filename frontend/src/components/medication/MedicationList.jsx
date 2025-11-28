import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditMedication from "./EditMedication";

export default function MedicationList() {
  const [medications, setMedications] = useState([]);
  const [filteredMeds, setFilteredMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/medication`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedications(res.data.medications || []);
      setFilteredMeds(res.data.medications || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch medications", { position: "bottom-right" });
      setMedications([]);
      setFilteredMeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = medications.filter(
      (m) =>
        m.drug.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query)
    );
    setFilteredMeds(filtered);
  }, [search, medications]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this medication?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/medication/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Medication deactivated successfully", {
        position: "bottom-right",
      });
      fetchMedications();
    } catch (err) {
      console.error(err);
      toast.error("Failed to deactivate medication", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Medication Management
        </h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/add-medication")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add Medication
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by drug or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Drug</th>
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
            ) : filteredMeds.length > 0 ? (
              filteredMeds.map((med) => (
                <tr key={med._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{med.drug}</td>
                  <td className="py-2 px-4">{med.description}</td>
                  <td className="py-2 px-4 capitalize">
                    {med.status || "Active"}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setEditingId(med._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(med._id)}
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
                  No medications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingId && (
        <EditMedication
          id={editingId}
          isOpen={Boolean(editingId)}
          onClose={() => setEditingId(null)}
          onUpdate={fetchMedications}
        />
      )}
    </div>
  );
}
