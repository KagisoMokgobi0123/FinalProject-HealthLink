import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EditAllergy from "./EditAllergy";

export default function AllergyList() {
  const [allergies, setAllergies] = useState([]);
  const [filteredAllergies, setFilteredAllergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAllergyId, setEditingAllergyId] = useState(null);
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  const fetchAllergies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/allergy`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllergies(res.data.allergies || []);
      setFilteredAllergies(res.data.allergies || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch allergies", { position: "bottom-right" });
      setAllergies([]);
      setFilteredAllergies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllergies();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = allergies.filter(
      (a) =>
        a.allergyName.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
    );
    setFilteredAllergies(filtered);
  }, [search, allergies]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this allergy?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/allergy/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Allergy deactivated successfully", {
        position: "bottom-right",
      });
      fetchAllergies();
    } catch (err) {
      console.error(err);
      toast.error("Failed to deactivate allergy", { position: "bottom-right" });
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Allergy Management</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/add-allergy")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add New Allergy
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
              <th className="py-2 px-4 text-left">Allergy Name</th>
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
            ) : filteredAllergies.length > 0 ? (
              filteredAllergies.map((allergy) => (
                <tr key={allergy._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{allergy.allergyName}</td>
                  <td className="py-2 px-4">{allergy.description}</td>
                  <td className="py-2 px-4 capitalize">
                    {allergy.status || "Active"}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setEditingAllergyId(allergy._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(allergy._id)}
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
                  No allergies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingAllergyId && (
        <EditAllergy
          id={editingAllergyId}
          isOpen={Boolean(editingAllergyId)}
          onClose={() => setEditingAllergyId(null)}
          onUpdate={fetchAllergies}
        />
      )}
    </div>
  );
}
