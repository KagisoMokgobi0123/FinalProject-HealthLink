import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    idNo: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    address: "",
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  useEffect(() => {
    // Fetch roles from backend
    axios
      .get(`${API_URL}/api/role`)
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.roles)) {
          setRoles(res.data.roles);
        } else {
          setRoles([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch roles:", err);
        toast.error("Failed to load roles");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let parsedValue = value;
    if (name === "idNo" || name === "phone") {
      parsedValue = value === "" ? undefined : Number(value);
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic frontend validation
    if (!formData.role) {
      toast.error("Please select a role");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/user/add`, formData);

      if (res.data.success) {
        toast.success(
          "Application submitted successfully. Wait for admin approval."
        );
        setFormData({
          FirstName: "",
          LastName: "",
          idNo: "",
          email: "",
          password: "",
          role: "",
          phone: "",
          address: "",
        });
      }
    } catch (err) {
      console.error("Add User Error:", err);

      // Show detailed backend errors if available
      if (err.response?.data?.details) {
        const details = Object.values(err.response.data.details)
          .map((d) => d.message)
          .join(", ");
        toast.error(`Validation failed: ${details}`);
      } else {
        toast.error(
          err.response?.data?.error || "Failed to submit application."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Employee Application
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="FirstName"
              placeholder="First Name"
              value={formData.FirstName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              name="LastName"
              placeholder="Last Name"
              value={formData.LastName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <input
            type="number"
            name="idNo"
            placeholder="ID Number"
            value={formData.idNo}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.role}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
