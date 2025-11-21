import { StrictMode } from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthContext } from "./context/authContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContext>
    <App />
  </AuthContext>
);
