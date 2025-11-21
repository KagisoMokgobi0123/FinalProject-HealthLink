import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddEmployee = () => {
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
  const navigate = useNavigate();

  // Fetch roles for dropdown
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/role/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setRoles(res.data.roles);
      } catch (err) {
        console.error("Error fetching roles:", err);
        toast.error("Failed to fetch roles");
      }
    };
    fetchRoles();
  }, []);

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
      const response = await axios.post(
        "http://localhost:5000/api/employee/add",
        employeeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Employee added successfully!");
        setTimeout(() => navigate("/admin-dashboard/employees"), 800);
      }
    } catch (err) {
      console.error("Add employee error:", err.response?.data || err);
      toast.error(
        err.response?.data?.error || "Server error while adding employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        to="/admin-dashboard/employees"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Back
      </Link>

      <h3 className="text-2xl font-bold mb-6 text-center">Add New Employee</h3>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow-md"
      >
        {/* First Name */}
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            value={employeeData.firstName}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={employeeData.lastName}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={employeeData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={employeeData.address}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        {/* Cell No */}
        <div>
          <label className="block mb-1 font-medium">Cell No</label>
          <input
            type="text"
            name="cellNo"
            value={employeeData.cellNo}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.cellNo ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.cellNo && (
            <p className="text-red-500 text-sm mt-1">{errors.cellNo}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={employeeData.role}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
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
          className={`w-full bg-blue-600 text-white py-2 rounded font-medium transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
