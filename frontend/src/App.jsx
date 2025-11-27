import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";

// Admin components
import AdminSummary from "./components/dashboard/AdminSummary";
import EmployeeList from "./components/employees/EmployeeList";
import AddEmployee from "./components/employees/AddEmployee";
import EditEmployee from "./components/employees/EditEmployee";
import WardList from "./components/ward/WardList";
import AddBed from "./components/ward/AddBed";
import EditBed from "./components/ward/EditBed";
import MedicationList from "./components/medication/MedicationList";
import AddMedication from "./components/medication/AddMedication";
import EditMedication from "./components/medication/EditMedication";
import AllergyList from "./components/allergies/AllergyList";
import AddAllergy from "./components/allergies/AddAllergy";
import EditAllergy from "./components/allergies/EditAllergy";
import ChronicList from "./components/chronic/ChronicList";
import AddChronics from "./components/chronic/AddChronic";
import EditChronics from "./components/chronic/EditChronic";
import RoleList from "./components/role/RoleList";
import AddRole from "./components/role/AddRoles";
import EditRole from "./components/role/EditRole";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/authContext";

function App() {
  const { user } = useAuth();

  // Default redirect based on role
  const getDefaultRoute = () => {
    if (!user) return "/login";
    return user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard";
  };

  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Admin protected routes */}
        <Route
          path="/admin-dashboard/*"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="edit-employee/:id" element={<EditEmployee />} />
          <Route path="ward" element={<WardList />} />
          <Route path="add-bed" element={<AddBed />} />
          <Route path="edit-bed/:id" element={<EditBed />} />
          <Route path="medication" element={<MedicationList />} />
          <Route path="add-medication" element={<AddMedication />} />
          <Route path="edit-medication/:id" element={<EditMedication />} />
          <Route path="allergies" element={<AllergyList />} />
          <Route path="add-allergy" element={<AddAllergy />} />
          <Route path="edit-allergy/:id" element={<EditAllergy />} />
          <Route path="chronic" element={<ChronicList />} />
          <Route path="add-chronic" element={<AddChronics />} />
          <Route path="edit-chronic/:id" element={<EditChronics />} />
          <Route path="role" element={<RoleList />} />
          <Route path="add-role" element={<AddRole />} />
          <Route path="edit-role/:id" element={<EditRole />} />
        </Route>

        {/* Employee protected route */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
