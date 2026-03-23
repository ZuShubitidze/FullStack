import api, { setTokenInApi } from "@/api";
import { useAuth } from "@/context/Authcontext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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

      toast.success(`Welcome, ${data.data.user.name}`);

      navigate("/posts");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed");
    },
  });
};
