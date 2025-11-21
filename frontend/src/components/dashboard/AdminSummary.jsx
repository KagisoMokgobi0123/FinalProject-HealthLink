import { FaPills, FaUsers, FaBed } from "react-icons/fa";
import SummaryCard from "./SummaryCard";

const AdminSummary = () => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Dashboard Overview
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={<FaUsers className="text-3xl text-teal-600" />}
          text="Total Employees"
          number={13}
          className="bg-white shadow rounded-lg p-4 flex items-center gap-4"
        />
        <SummaryCard
          icon={<FaBed className="text-3xl text-teal-600" />}
          text="Total Beds"
          number={15}
          className="bg-white shadow rounded-lg p-4 flex items-center gap-4"
        />
        <SummaryCard
          icon={<FaPills className="text-3xl text-teal-600" />}
          text="Total Medication"
          number={34}
          className="bg-white shadow rounded-lg p-4 flex items-center gap-4"
        />
      </div>
    </div>
  );
};

export default AdminSummary;
