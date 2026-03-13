import api, { setTokenInApi } from "@/api";
import type { User } from "@/types/user.interface";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync token with Axios instance
  useEffect(() => {
    import("@/api").then((module) => module.setTokenInApi(accessToken || null));
  }, [accessToken]);

  // Check if user is logged in on every page load
  const checkAuth = async (token: string) => {
    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      }); // Interceptor now handles Bearer
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
        const token = res.data.accessToken;
        if (token) {
          setAccessToken(token);
          setTokenInApi(token);
          // 2. Once we have the token, get user details
          await checkAuth(token); // Pass token directly
        }
      } catch (error) {
        setUser(null);
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
      setAccessToken(null);
      setTokenInApi(null); // Clear Axios header
      window.location.href = "/login"; // Redirect to login
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, loading, accessToken, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
