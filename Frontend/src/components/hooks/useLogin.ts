import api from "@/api";
import { useAuth } from "@/context/Authcontext";
import { useNavigate } from "react-router";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data) {
        // Update global state
        const userData = res.data.data.user;
        setUser(userData);

        navigate("/");
      }
    } catch (err: any) {
      console.error("Login failed", err);
    }
  };

  return { login };
};
