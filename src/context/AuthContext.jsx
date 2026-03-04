import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_BASE = "/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("uc_token") || null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // On mount, verify token
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE}/auth/me`)
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        // Token invalid
        localStorage.removeItem("uc_token");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem("uc_token", t);
    setToken(t);
    setUser(u);
    return u;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem("uc_token", t);
    setToken(t);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem("uc_token");
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
