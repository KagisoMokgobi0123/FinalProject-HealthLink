import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/dashboard/AdminSummary";
import EmployeeList from "./components/employees/EmployeeList";
import WardList from "./components/ward/WardList";
import MedicationList from "./components/medication/MedicationList";
import AllergyList from "./components/allergies/AllergyList";
import ChronicList from "./components/chronic/ChronicList";
import RoleList from "./components/role/RoleList";
import AddBed from "./components/ward/AddBed";
import EditRole from "./components/role/EditRole";
import AddRole from "./components/role/AddRoles";
import AddEmployee from "./components/employees/AddEmployee";
import EditEmployee from "./components/employees/EditEmployee";
import AddMedication from "./components/medication/AddMedication";
import EditMedication from "./components/medication/EditMedication";
import AddChronics from "./components/chronic/AddChronic";
import EditChronics from "./components/chronic/EditChronic";
import AddAllergy from "./components/allergies/AddAllergy";
import EditAllergy from "./components/allergies/EditAllergy";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditBed from "./components/ward/EditBed";

function App() {
  return (
    <BrowserRouter>
      {/* Toast Notifications (GLOBAL) */}
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
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />

        {/* Admin routes with auth + role protection */}
        <Route
          path="/admin-dashboard"
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
          <Route path="ward" element={<WardList />} />
          <Route path="add-bed" element={<AddBed />} />
          <Route path="edit-bed/:id" element={<EditBed />} />
          <Route path="medication" element={<MedicationList />} />
          <Route path="allergies" element={<AllergyList />} />
          <Route path="chronic" element={<ChronicList />} />
          <Route path="role" element={<RoleList />} />
          <Route path="edit-role/:id" element={<EditRole />} />
          <Route path="add-role" element={<AddRole />} />
          <Route path="edit-employee/:id" element={<EditEmployee />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="edit-medication/:id" element={<EditMedication />} />
          <Route path="add-medication" element={<AddMedication />} />
          <Route path="edit-chronic/:id" element={<EditChronics />} />
          <Route path="add-chronic" element={<AddChronics />} />
          <Route path="edit-allergy/:id" element={<EditAllergy />} />
          <Route path="add-allergy" element={<AddAllergy />} />
        </Route>

        {/* Employee dashboard */}
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
