import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddEmployee() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user`);
      // Filter users with status "pending"
      const pending = res.data.filter((user) => user.status === "pending");
      setPendingUsers(pending);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch pending users.");
    }
  };

  const handleApprove = async (userId) => {
    const confirm = window.confirm(
      "Are you sure you want to approve this employee?"
    );
    if (!confirm) return;

    try {
      setLoading(true);
      await axios.put(`${API_URL}/api/user/${userId}`, {
        status: "active",
      });
      toast.success("Employee approved successfully!");
      fetchPendingUsers(); // Refresh list
    } catch (err) {
      console.error("Approval failed:", err);
      toast.error("Failed to approve employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">Pending Employee Approvals</h1>
      {pendingUsers.length === 0 ? (
        <p className="text-gray-700">No pending employees to approve.</p>
      ) : (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4 space-y-4">
          {pendingUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 border rounded"
            >
              <div>
                <p className="font-semibold">
                  {user.FirstName} {user.LastName}
                </p>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">ID No: {user.idNo}</p>
              </div>
              <button
                onClick={() => handleApprove(user._id)}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                {loading ? "Approving..." : "Approve"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
