import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditEmployee = () => {
  const { id } = useParams(); // Employee _id
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    cellNo: "",
    role: "",
  });
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch employee data and roles on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch employee
        const empRes = await axios.get(
          `http://localhost:5000/api/employee/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (empRes.data.success) {
          const { firstName, lastName, email, address, cellNo, role } =
            empRes.data.employee;
          setEmployeeData({
            firstName,
            lastName,
            email,
            address,
            cellNo,
            role,
          });
        }

        // Fetch roles for dropdown
        const roleRes = await axios.get("http://localhost:5000/api/role/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (roleRes.data.success) setRoles(roleRes.data.roles);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err);
        toast.error(err.response?.data?.error || "Failed to fetch data");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    Object.keys(employeeData).forEach((key) => {
      if (!employeeData[key]) newErrors[key] = `${key} is required`;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/employee/${id}`,
        employeeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Employee updated successfully!");
        setTimeout(() => navigate("/admin-dashboard/employees"), 1000);
      }
    } catch (err) {
      console.error("Update employee error:", err.response?.data || err);
      toast.error(
        err.response?.data?.error || "Server error while updating employee"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return <div className="text-center mt-10">Loading employee data...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin-dashboard/employees"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
        >
          ← Back
        </Link>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
        Edit Employee
      </h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow"
      >
        {/* First Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={employeeData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={employeeData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={employeeData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={employeeData.address}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        {/* Cell Number */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Cell Number
          </label>
          <input
            type="text"
            name="cellNo"
            value={employeeData.cellNo}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.cellNo ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.cellNo && (
            <p className="text-red-500 text-sm mt-1">{errors.cellNo}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={employeeData.role}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.role ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.role}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg font-medium transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update Employee"}
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
