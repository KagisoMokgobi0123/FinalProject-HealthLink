import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";

const AllergyList = () => {
  const [allergies, setAllergies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all allergies
  useEffect(() => {
    fetchAllergies();
  }, []);

  const fetchAllergies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.get("http://localhost:5000/api/allergy", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAllergies(response.data.allergies || []);
      } else {
        toast.error(response.data.error || "Failed to fetch allergies");
      }
    } catch (err) {
      console.error("Error fetching allergies:", err);
      toast.error("Failed to fetch allergy data");
    } finally {
      setLoading(false);
    }
  };

  // Delete an allergy
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this allergy?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/allergy/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllergies(allergies.filter((allergy) => allergy._id !== id));
      toast.success("Allergy deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete allergy");
    }
  };

  // Define DataTable columns
  const columns = [
    {
      name: "Allergy Name",
      selector: (row) => row.allergyName,
      sortable: true,
    },
    { name: "Description", selector: (row) => row.description, sortable: true },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`inline-block py-1 px-2 rounded-full text-xs ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <Link
            to={`/admin-dashboard/edit-allergy/${row._id}`}
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

  // Filter allergies by name, description, or status
  const filteredAllergies = allergies.filter((allergy) => {
    const searchTerm = search.toLowerCase();
    return (
      allergy.allergyName?.toLowerCase().includes(searchTerm) ||
      allergy.description?.toLowerCase().includes(searchTerm) ||
      allergy.status?.toLowerCase().includes(searchTerm)
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
          Manage Allergies
        </h3>
        <div className="flex gap-2 flex-col sm:flex-row items-center">
          <input
            type="text"
            placeholder="Search by name, description, or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            to="/admin-dashboard/add-allergy"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition"
          >
            Add New Allergy
          </Link>
        </div>
      </div>

      {/* DataTable */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <DataTable
          columns={columns}
          data={filteredAllergies}
          pagination
          highlightOnHover
          striped
          responsive
          progressPending={loading}
          noHeader
          defaultSortField="allergyName"
        />
      </div>
    </div>
  );
};

export default AllergyList;
