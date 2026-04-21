import api from "@/api";
import { useAuth } from "@/context/Authcontext";
import type { AIRequest } from "@/types/aiRequest.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGenerateAIResponseChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prompt: string) => {
      const { data } = await api.post("/geminiAI/chat", {
        prompt,
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
