import api from "@/api";
import type { User } from "@/types/user.interface";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loading: boolean;
}

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(true);

  // Sync token with Axios instance
  useEffect(() => {
    import("@/api").then((module) => module.setTokenInApi(accessToken || null));
  }, [accessToken]);

  // Check if user is logged in on every page load
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me"); // Interceptor now handles Bearer
      setUser(res.data.data?.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh Token and Check Auth
  useEffect(() => {
    const init = async () => {
      try {
        // 1. Try to get a fresh AccessToken using the Refresh Cookie
        const res = await api.get("/auth/refresh");
        setAccessToken(res.data.accessToken);
        // 2. Once we have the token, get user details
        await checkAuth();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      // window.location.href = "/login"; // Redirect to login
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, loading, accessToken, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
