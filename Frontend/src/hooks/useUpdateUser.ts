import api from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      imageUrl,
    }: {
      userId: string;
      imageUrl: string;
    }) => {
      const { data } = await api.put(`/auth/update-profile`, {
        userId,
        imageUrl,
      });
      return data;
    },
    onSuccess: () => {
      // Invalidate the user query to show the new picture everywhere
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile picture updated!");
    },
  });
};
