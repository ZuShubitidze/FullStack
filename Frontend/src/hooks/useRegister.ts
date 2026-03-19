import api, { setTokenInApi } from "@/api";
import { useAuth } from "@/context/Authcontext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useRegister2 = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post(`/auth/register`, {
        name,
        email,
        password,
      });

      if (res.data) {
        // Update global state
        const userData = res.data.data.user;
        setUser(userData);

        console.log("Registration Successful");

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

interface Register {
  name: string;
  email: string;
  password: string;
}

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser, setAccessToken } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ name, email, password }: Register) => {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      return data;
    },
    onSuccess: (data) => {
      // Update global auth state
      setUser(data.data.user);
      console.log("Token being set - ", data.data.accessToken);
      setAccessToken(data.data.accessToken);
      setTokenInApi(data.data.accessToken);

      // Update the React Query cache for the 'me' query
      queryClient.setQueryData(["user"], data.data.user);
      console.log(data);

      toast.success(data.message);

      navigate("/posts");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed");
    },
  });
};
