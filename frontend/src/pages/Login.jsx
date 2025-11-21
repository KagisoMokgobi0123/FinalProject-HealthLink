import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      console.log(response);
      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (error) {
      console.log(error);
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Server error");
      }
    }
  };
  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
      {" "}
      {/* Main Title */}{" "}
      <h1 className="text-4xl font-bold mb-8 text-white text-center">
        {" "}
        Ward Management System{" "}
      </h1>{" "}
      {/* Login Form */}{" "}
      <div className="bg-white p-8 w-full max-w-md shadow-lg rounded-md">
        {" "}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {" "}
          Login{" "}
        </h2>{" "}
        {error && <p className="text-red-500">{error}</p>}{" "}
        <form onSubmit={handleSubmit} className="space-y-5">
          {" "}
          <div>
            {" "}
            <label htmlFor="email" className="block text-gray-700 mb-2">
              {" "}
              Email{" "}
            </label>{" "}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label htmlFor="password" className="block text-gray-700 mb-2">
              {" "}
              Password{" "}
            </label>{" "}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />{" "}
            {/* Forgot Password Link */}{" "}
            <div className="text-right mt-2">
              {" "}
              <a
                href="/forgot-password"
                className="text-blue-700 hover:underline text-sm"
              >
                {" "}
                Forgot password?{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 hover:bg-teal-500 transition duration-200"
          >
            {" "}
            Login{" "}
          </button>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}
export default Login;
