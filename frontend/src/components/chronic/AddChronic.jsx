import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddChronic() {
  const [chronicName, setChronicName] = useState("");
  const [description, setDescription] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chronicName.trim() || !description.trim()) {
      toast.error("All fields are required", { position: "bottom-right" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/chronic/add`,
        { chronicName, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Chronic condition added successfully", {
        position: "bottom-right",
      });

      navigate("/admin-dashboard/chronic");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add chronic condition", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mt-10">
        <h2 className="text-2xl font-bold mb-4">Add Chronic Condition</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Chronic Name:</label>
            <input
              type="text"
              value={chronicName}
              onChange={(e) => setChronicName(e.target.value)}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block font-semibold">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded h-32 focus:ring focus:ring-blue-300"
            ></textarea>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard/chronic")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Add Chronic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
