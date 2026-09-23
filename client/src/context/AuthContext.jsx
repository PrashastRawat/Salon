import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);