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
    path: "/admin-dashboard",
    activeBg: "bg-teal-800",
    hoverBg: "hover:bg-teal-600",
  },
  {
    name: "Employee",
    icon: FaUsers,
    path: "/admin-dashboard/user",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Ward",
    icon: FaHospital,
    path: "/admin-dashboard/ward",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Add Bed",
    icon: FaHospital,
    path: "/admin-dashboard/add-bed",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Medication",
    icon: FaPills,
    path: "/admin-dashboard/medication",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Allergies",
    icon: FaBiohazard,
    path: "/admin-dashboard/allergies",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Chronics",
    icon: FaHeartbeat,
    path: "/admin-dashboard/chronic",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Role",
    icon: FaUserShield,
    path: "/admin-dashboard/role",
    activeBg: "bg-gray-800",
    hoverBg: "hover:bg-gray-800",
  },
  {
    name: "Settings",
    icon: FaCogs,
    path: "/admin-dashboard/settings",
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
            onClick={() => setIsOpen(false)}
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
