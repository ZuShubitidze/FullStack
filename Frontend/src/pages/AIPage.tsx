import api from "@/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const AIPage = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [geminiResponseData, setGeminiResponseData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleGenerateResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/geminiAI/generateResponse", {
        prompt,
      });
      setGeminiResponseData(response.data.reply);
      setPrompt("");
    } catch (error: any) {
      console.log("Error message is:", error.message, error);
    } finally {
      setLoading(false);
    }
  };
  console.log(geminiResponseData);

  // Capital of France
  return (
    <main>
      <h1>Ask AI:</h1>
      <form onSubmit={handleGenerateResponse} className="flex flex-col gap-10">
        <Textarea
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <p>{geminiResponseData}</p>
        <Button type="submit" disabled={loading}>
          Generate Response
        </Button>
      </form>
      {loading && <h1>Loading...</h1>}
    </main>
  );
};

export default AIPage;
