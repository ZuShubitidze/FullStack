import { getPreview } from "@/components/GetPreview";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getAIResponseHistory,
  useGenerateAIResponse,
} from "@/hooks/useGenerateAIResponse";
import type { AIRequest } from "@/types/aiRequest.interface";
import { useState } from "react";

const AIPage = () => {
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [date, setDate] = useState<string>();
  const [response, setResponse] = useState<string>();

  // Generate Response
  const { mutateAsync: generateResponse, isPending } = useGenerateAIResponse();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await generateResponse(prompt);
    setDate(result.AIResponse.sdkHttpResponse.headers.date);
    setResponse(result.reply);
    setPrompt("");
    console.log(result);
  };
  const reply = response?.replaceAll("*", "");
  const convertedDate = new Date(date!).toLocaleString("en-US", {
    dateStyle: "long",
  });

  // Get AI Requests History
  const { AIResponseHistory } = getAIResponseHistory();
  // Get AI Request
  const handleGetAIResponse = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const fullItem: AIRequest | undefined = AIResponseHistory.find(
      (item) => item.id === id,
    );

    if (fullItem) {
      setResponse(fullItem.text);
    }
  };

  if (isPending) return <SkeletonCard />;

  // Capital of France
  return (
    <main className="flex flex-col md:flex-row gap-20 md:gap-30 lg:gap-40">
      {/* Question Section */}
      <section className="w-100 lg:w-120 mb-10 md:mb-0">
        <h1>Ask AI:</h1>
        {/* Form Input */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <Textarea
            placeholder="Type your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit" disabled={isPending}>
            Generate Response
          </Button>
        </form>
        {/* AI Answer */}
        {response && (
          <section className="mt-10">
            <span>Date: {convertedDate}</span>
            <p>{reply}</p>
          </section>
        )}
      </section>
      {/* History Section */}
      <section className="w-140">
        {/* Show / Close Button */}
        <Button
          onClick={() => {
            {
              showHistory ? setShowHistory(false) : setShowHistory(true);
            }
          }}
        >
          {showHistory ? "Close History" : "Show History"}
        </Button>
        {/* Requests History */}
        {showHistory && (
          <ul className="mt-4">
            {AIResponseHistory &&
              AIResponseHistory.map(({ createdAt, text, id }) => (
                <li key={id} className="p-4 border-2">
                  <span>
                    Date:{" "}
                    {new Date(createdAt).toLocaleString("en-US", {
                      dateStyle: "long",
                    })}
                  </span>
                  <p>{getPreview(text, 300)}</p>
                  {text.length > 300 && (
                    <Button
                      className="mt-2"
                      onClick={(e) => handleGetAIResponse(e, id)}
                    >
                      See Full Answer
                    </Button>
                  )}
                </li>
              ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default AIPage;
