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

  // Refresh Token and Check Auth
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const res = await api.get("/auth/refresh", { withCredentials: true });

        const token = res.data.accessToken;
        if (token && isMounted) {
          setTokenInApi(token);
          setAccessToken(token);

          const userRes = await api.get("auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser(userRes.data.data?.user);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();
    return () => {
      isMounted = false;
    };
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
