import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Replace with spinner
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user's role is an object, use role.role to compare
  const userRoleName = user.role?.role || user.role;

  // If user does not have the required role, redirect to unauthorized page
  if (!requiredRole.includes(userRoleName)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed, render children
  return children;
};

export default RoleBaseRoutes;
