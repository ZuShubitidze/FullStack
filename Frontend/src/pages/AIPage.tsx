import api from "@/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const AIPage = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [geminiResponseData, setGeminiResponseData] = useState<any>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const handleGenerateResponse = async () => {
    setLoading(true);
    const response = await api.post("/geminiAI/generateResponse", {
      prompt,
    });
    setGeminiResponseData(
      response.data.reply
    );
    console.log(geminiResponseData)
    setLoading(false);
    setPrompt("");
  };
  if (loading) return <p>Loading...</p>;

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
    </main>
  );
};

export default AIPage;
