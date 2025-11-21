import { FaBars } from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const Navbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center h-16 md:h-20 px-4 md:px-8 bg-teal-600 text-white shadow">
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <FaBars />
      </button>

      {/* Welcome message */}
      <p className="text-base md:text-lg font-medium">
        Welcome {user?.FirstName || "User"}
      </p>

      {/* Logout button */}
      <button
        onClick={logout}
        className="bg-white text-teal-700 font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-md shadow hover:bg-gray-100 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
