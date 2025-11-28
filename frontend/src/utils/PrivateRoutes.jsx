import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Replace with spinner if needed
  }

  // If user is logged in, render children; otherwise redirect to login
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
