import api, { setTokenInApi } from "@/api";
import { useAuth } from "@/context/Authcontext";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Login {
  email: string;
  password: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setAccessToken } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: Login) => {
      const { data } = await api.post("/auth/login", { email, password });
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
      toast.error(error.message || "Login failed");
    },
  });
};
