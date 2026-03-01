import { useAuth } from "@/context/Authcontext";
import axios from "axios";
import { useNavigate } from "react-router";

export const useRegister = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post("http://localhost:3000/auth/register", {
        name,
        email,
        password,
      });

      if (res.data) {
        // Update global state
        const userData = res.data.data.user;
        setUser(userData);

        navigate("/");
      }
    } catch (error: any) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message,
      );
    }
  };
  return { register };
};
