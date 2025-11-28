import { FaBars } from "react-icons/fa";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-md">
      {/* Left: Sidebar toggle (mobile) */}
      <div className="flex items-center">
        <button
          className="text-gray-600 md:hidden mr-3"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <FaBars className="text-xl" />
        </button>
        <h1 className="text-lg font-semibold text-gray-700 hidden md:block">
          Ward Management System
        </h1>
      </div>

      {/* Right: User info / logout */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 hidden sm:inline">
          {user?.FirstName}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
