import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import EditBed from "./EditBed";
import { useNavigate } from "react-router-dom";

export default function WardList() {
  const [wards, setWards] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingWardId, setEditingWardId] = useState(null);
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  const fetchWards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/ward`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWards(res.data.wards || []);
      setFilteredWards(res.data.wards || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch wards", { position: "bottom-right" });
      setWards([]);
      setFilteredWards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = wards.filter(
      (w) =>
        w.ward.toLowerCase().includes(query) ||
        w.bed_type.toLowerCase().includes(query)
    );
    setFilteredWards(filtered);
  }, [search, wards]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this ward?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/ward/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ward deactivated successfully", {
        position: "bottom-right",
      });
      fetchWards();
    } catch (err) {
      console.error(err);
      toast.error("Failed to deactivate ward", { position: "bottom-right" });
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Ward Management</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/add-bed")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add New Ward
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by ward or bed type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Wards Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Ward Name</th>
              <th className="py-2 px-4 text-left">Bed Type</th>
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
            ) : filteredWards.length > 0 ? (
              filteredWards.map((ward) => (
                <tr key={ward._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{ward.ward}</td>
                  <td className="py-2 px-4">{ward.bed_type}</td>
                  <td className="py-2 px-4 capitalize">
                    {ward.bedStatus || "active"}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setEditingWardId(ward._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ward._id)}
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
                  No wards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingWardId && (
        <EditBed
          id={editingWardId}
          isOpen={Boolean(editingWardId)}
          onClose={() => setEditingWardId(null)}
          onUpdate={fetchWards}
        />
      )}
    </div>
  );
}
