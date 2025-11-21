import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.get("http://localhost:5000/api/employee/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setEmployees(response.data.employees || []);
      } else {
        toast.error(response.data.error || "Failed to fetch employees");
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to fetch employee data");
    } finally {
      setLoading(false);
    }
  };

  // Delete an employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(employees.filter((emp) => emp._id !== id));
      toast.success("Employee deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete employee");
    }
  };

  // Define DataTable columns
  const columns = [
    { name: "First Name", selector: (row) => row.firstName, sortable: true },
    { name: "Last Name", selector: (row) => row.lastName, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Address", selector: (row) => row.address || "-", sortable: true },
    { name: "Cell No", selector: (row) => row.cellNo || "-", sortable: true },
    { name: "Role", selector: (row) => row.role?.role || "-", sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <Link
            to={`/admin-dashboard/edit-employee/${row._id}`}
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

  // Filter employees by search
  const filteredEmployees = employees.filter((emp) => {
    const searchTerm = search.toLowerCase();
    return (
      emp.firstName?.toLowerCase().includes(searchTerm) ||
      emp.lastName?.toLowerCase().includes(searchTerm) ||
      emp.email?.toLowerCase().includes(searchTerm) ||
      emp.address?.toLowerCase().includes(searchTerm) ||
      emp.cellNo?.toLowerCase().includes(searchTerm) ||
      emp.role?.role?.toLowerCase().includes(searchTerm)
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
          Manage Employees
        </h3>
        <div className="flex gap-2 flex-col sm:flex-row items-center">
          <input
            type="text"
            placeholder="Search by name, email, role, or cell"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            to="/admin-dashboard/add-employee"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition"
          >
            Add New Employee
          </Link>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        pagination
        highlightOnHover
        striped
        responsive
        progressPending={loading}
        noHeader
        defaultSortField="firstName"
      />
    </div>
  );
};

export default EmployeeList;
