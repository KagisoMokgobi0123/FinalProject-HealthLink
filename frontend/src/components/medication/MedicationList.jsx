import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";

const MedicationList = () => {
  const [medications, setMedications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all medications
  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.get(
        "http://localhost:5000/api/medication/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMedications(response.data.medications || []);
      } else {
        toast.error(response.data.error || "Failed to fetch medications");
      }
    } catch (err) {
      console.error("Error fetching medications:", err);
      toast.error("Failed to fetch medication data");
    } finally {
      setLoading(false);
    }
  };

  // Delete a medication
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medication?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/medication/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedications(medications.filter((med) => med._id !== id));
      toast.success("Medication deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete medication");
    }
  };

  // Define DataTable columns
  const columns = [
    { name: "Drug Name", selector: (row) => row.drug, sortable: true },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <Link
            to={`/admin-dashboard/edit-medication/${row._id}`}
            className="px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  // Filter medications by drug name, description, or status
  const filteredMedications = medications.filter((med) => {
    const searchTerm = search.toLowerCase();
    return (
      med.drug?.toLowerCase().includes(searchTerm) ||
      med.description?.toLowerCase().includes(searchTerm) ||
      med.status?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin-dashboard"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
        >
          ← Back
        </Link>
      </div>

      {/* Title + Search + Add */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          Manage Medications
        </h3>
        <div className="flex gap-2 flex-col sm:flex-row items-center">
          <input
            type="text"
            placeholder="Search by drug name, description, or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            to="/admin-dashboard/add-medication"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition"
          >
            Add New Medication
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll for DataTable */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredMedications}
          pagination
          highlightOnHover
          striped
          responsive
          progressPending={loading}
          noHeader
          defaultSortField="drug"
        />
      </div>
    </div>
  );
};

export default MedicationList;
