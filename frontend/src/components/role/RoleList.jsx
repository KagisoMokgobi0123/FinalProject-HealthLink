import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all roles
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.get("http://localhost:5000/api/role/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setRoles(response.data.roles || []);
      } else {
        toast.error(response.data.error || "Failed to fetch roles");
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      toast.error("Failed to fetch role data");
    } finally {
      setLoading(false);
    }
  };

  // Delete a role
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/role/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(roles.filter((role) => role._id !== id));
      toast.success("Role deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete role");
    }
  };

  // Define DataTable columns
  const columns = [
    { name: "Role Name", selector: (row) => row.role, sortable: true },
    {
      name: "Description",
      selector: (row) => row.roleDescription,
      sortable: true,
    },
    { name: "Status", selector: (row) => row.roleStatus, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <Link
            to={`/admin-dashboard/edit-role/${row._id}`}
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

  // Filter roles by name, description, or status
  const filteredRoles = roles.filter((role) => {
    const searchTerm = search.toLowerCase();
    return (
      role.role?.toLowerCase().includes(searchTerm) ||
      role.roleDescription?.toLowerCase().includes(searchTerm) ||
      role.roleStatus?.toLowerCase().includes(searchTerm)
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
        <h3 className="text-2xl font-semibold text-gray-800">Manage Roles</h3>
        <div className="flex gap-2 flex-col sm:flex-row items-center">
          <input
            type="text"
            placeholder="Search by name, description, or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            to="/admin-dashboard/add-role"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition"
          >
            Add New Role
          </Link>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredRoles}
        pagination
        highlightOnHover
        striped
        responsive
        progressPending={loading}
        noHeader
        defaultSortField="role"
      />
    </div>
  );
};

export default RoleList;
