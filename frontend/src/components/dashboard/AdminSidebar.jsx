import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaCogs,
  FaTachometerAlt,
  FaHospital,
  FaPills,
  FaBiohazard,
  FaHeartbeat,
  FaUserShield,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    icon: FaTachometerAlt,
    path: "",
    activeBg: "bg-teal-800",
    hoverBg: "hover:bg-teal-600",
  },
  {
    name: "Employee",
    icon: FaUsers,
    path: "employees",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Ward",
    icon: FaHospital,
    path: "ward",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Add Bed",
    icon: FaHospital,
    path: "add-bed",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Medication",
    icon: FaPills,
    path: "medication",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Allergies",
    icon: FaBiohazard,
    path: "allergies",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Chronics",
    icon: FaHeartbeat,
    path: "chronic",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Role",
    icon: FaUserShield,
    path: "role",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Settings",
    icon: FaCogs,
    path: "settings",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
];

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-gray-200 flex flex-col shadow-lg transform
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:flex`}
    >
      {/* Header */}
      <div className="p-6 bg-teal-600 text-white border-b border-gray-700">
        <h3 className="text-xl font-semibold tracking-wide">Ward Management</h3>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {menuItems.map(({ name, icon: Icon, path, activeBg, hoverBg }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${hoverBg} ${
                isActive ? `${activeBg} text-white` : "text-gray-200"
              }`
            }
            onClick={() => setIsOpen(false)} // close sidebar on mobile
          >
            <Icon className="text-lg" />
            <span>{name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
