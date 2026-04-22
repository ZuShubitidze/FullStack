import api from "@/api";
import { useAuth } from "@/context/Authcontext";
import type { AIRequest } from "@/types/aiRequest.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Chat {
  prompt: string;
  image: File | null;
}

export const useGenerateAIResponseChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ prompt, image }: Chat) => {
      const formData = new FormData();
      formData.append("prompt", prompt);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await api.post("/geminiAI/chat", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AIResponses"] });
    },
  });
};

export const getAIResponseHistory = () => {
  const { user } = useAuth();

  const { data: AIResponseHistory = [] } = useQuery({
    queryKey: ["AIResponses"],
    queryFn: async () => {
      const { data } = await api.get("/geminiAI/getAIRequests");
      return data as AIRequest[];
    },
    enabled: !!user,
  });

  return { AIResponseHistory };
};
