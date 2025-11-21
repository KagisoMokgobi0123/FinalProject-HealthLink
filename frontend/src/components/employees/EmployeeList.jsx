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

      const response = await axios.get("http://localhost:5000/api/employee", {
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
      setEmployees(employees.filter((employee) => employee._id !== id));
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
    { name: "Phone", selector: (row) => row.cellNo, sortable: true },
    { name: "Role", selector: (row) => row.role?.role, sortable: true }, // Show role name
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`inline-block py-1 px-2 rounded-full text-xs ${
            row.employeeStatus === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.employeeStatus}
        </span>
      ),
      sortable: true,
    },
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

  // Filter employees by name, email, or status
  const filteredEmployees = employees.filter((employee) => {
    const searchTerm = search.toLowerCase();
    return (
      employee.firstName?.toLowerCase().includes(searchTerm) ||
      employee.lastName?.toLowerCase().includes(searchTerm) ||
      employee.email?.toLowerCase().includes(searchTerm) ||
      employee.employeeStatus?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Title + Search + Add */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          Manage Employees
        </h3>
        <div className="flex gap-2 flex-col sm:flex-row items-center">
          <input
            type="text"
            placeholder="Search by name, email, or status"
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
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
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
    </div>
  );
};

export default EmployeeList;
