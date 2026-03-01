import { useAuth } from "@/context/Authcontext";
import axios from "axios";
import { useNavigate } from "react-router";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        { email, password },
        { withCredentials: true },
      );

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
