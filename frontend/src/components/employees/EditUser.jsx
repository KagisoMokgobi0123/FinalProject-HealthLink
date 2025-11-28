import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditUserModal({ id, isOpen, onClose, onUpdate }) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState({
    FirstName: "",
    LastName: "",
    status: "pending",
  });
  const [status, setStatus] = useState("pending");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setLoading(true);

      const fetchUser = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${API_URL}/api/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
          setStatus(res.data.user.status);
        } catch (err) {
          console.error(err);
          toast.error(err.response?.data?.error || "Failed to fetch user", {
            position: "bottom-right",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/user/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Status updated successfully!", {
        position: "bottom-right",
      });
      onUpdate();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to update status", {
        position: "bottom-right",
      });
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          visible ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative transform transition-transform duration-300 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Update Status</h2>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status Badge */}
            <div className="text-center mb-2">
              <span
                className={`px-3 py-1 rounded-full text-white font-semibold ${
                  user.status === "active"
                    ? "bg-green-500"
                    : user.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={user.FirstName}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                value={user.LastName}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-colors"
            >
              Update Status
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
