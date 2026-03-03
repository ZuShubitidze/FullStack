import api from "@/api";
import type { User } from "@/types/user.interface";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState<boolean>();

  // Check if user is logged in on every page load
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me", {
        withCredentials: true,
      });
      // To see what backend sent
      console.log("Full Axios Response:", res.data);

      const userData = res.data.data?.user;
      console.log(res.data.data?.user);
      console.log(res.data);

      setUser(userData);
    } catch (err: any) {
      if (err.response?.status !== 401) {
        console.error("Auth check failed:", err.message);
      }

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      window.location.href = "/login"; // Redirect to login
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
