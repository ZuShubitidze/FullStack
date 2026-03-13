import api, { setTokenInApi } from "@/api";
import { useAuth } from "@/context/Authcontext";
import { useNavigate } from "react-router";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useAuth();

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data) {
        // Update global state
        const userData = res.data.data.user;
        const token = res.data.data.accessToken;
        setUser(userData);
        console.log("Token being set:", token, "Token");
        setAccessToken(token);
        setTokenInApi(token);

        navigate("/");
      }
    } catch (err: any) {
      console.error("Login failed", err);
    }
  };

  return { login };
};
