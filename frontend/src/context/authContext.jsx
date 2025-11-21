import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const userContext = createContext();

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      // if (!token) {
      //   // No token found, user is not logged in
      //   setUser(null);
      //   setLoading(false);
      //   return;
      // }

      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "http://localhost:5000/api/auth/verify",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.success) {
            setUser(response.data.user);
          }
        } else {
          // localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        // Handle API errors
        if (error.response) {
          console.log("API error:", error.response.status, error.response.data);
        } else {
          console.log("Error:", error.message);
        }
        // Clear invalid token
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <userContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
