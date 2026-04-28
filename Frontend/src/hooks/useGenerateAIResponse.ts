import api from "@/api";
import { useAuth } from "@/context/Authcontext";
import type { AIRequest } from "@/types/aiRequest.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Chat {
  prompt: string;
  image: File | null;
}

export const useGenerateAIResponseChat = () => {
  const queryClient = useQueryClient();
  const [streamingText, setStreamingText] = useState<string>(""); // Track live response

  const mutation = useMutation({
    mutationFn: async ({ prompt, image }: Chat) => {
      setStreamingText("");

      const formData = new FormData();
      formData.append("prompt", prompt);
      if (image) formData.append("image", image);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/geminiAI/chat`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // Proccess SSE format "data: text\n\n"
        const cleanChunk = chunk.replace(/data: /g, "").replace(/\n\n/g, "");

        accumulated += cleanChunk;
        setStreamingText(accumulated); // Update UI in real-time
      }
      return accumulated;
    },
    onSuccess: () => {
      // Invalidate history
      queryClient.invalidateQueries({ queryKey: ["AIResponses"] });
    },
  });

  return { ...mutation, streamingText };

  // return useMutation({
  //   mutationFn: async ({ prompt, image }: Chat) => {
  //     const formData = new FormData();
  //     formData.append("prompt", prompt);
  //     if (image) {
  //       formData.append("image", image);
  //     }

  //     const { data } = await api.post("/geminiAI/chat", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     return data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["AIResponses"] });
  //   },
  // });
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
