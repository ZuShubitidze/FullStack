import { getPreview } from "@/components/GetPreview";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getAIResponseHistory,
  useGenerateAIResponseChat,
} from "@/hooks/useGenerateAIResponse";
import type { AIRequest } from "@/types/aiRequest.interface";
import { useEffect, useState } from "react";

const AIPage = () => {
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [date, setDate] = useState<string>();
  const [chatResponse, setChatResponse] = useState<string>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setImage(null);
      setPreview(null);
    }
  };
  // Cleanup function to free up memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Generate Chat
  const { mutateAsync: generateChatResponse, isPending: isChatPending } =
    useGenerateAIResponseChat();
  const handleSubmitChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await generateChatResponse({ prompt, image });
    setDate(result.date);
    setChatResponse(result.reply);
    setPrompt("");
    console.log(result);
  };
  const chatReply = chatResponse?.replaceAll("*", "");
  const convertedDate = new Date(date!).toLocaleString("en-US", {
    dateStyle: "long",
  });

  // Get Chat History
  const { AIResponseHistory } = getAIResponseHistory();

  // Get Single AI Request
  const handleGetAIResponse = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const fullItem: AIRequest | undefined = AIResponseHistory.find(
      (item) => item.id === id,
    );
    if (fullItem) {
      setChatResponse(fullItem.text);
    }
  };

  if (isChatPending) return <SkeletonCard />;

  return (
    <main className="flex flex-col md:flex-row gap-20 md:gap-30 lg:gap-40">
      {/* Chat */}
      <section className="w-100 lg:w-120 mb-10 md:mb-0">
        <h1>Chat AI:</h1>
        {/* Form Input */}
        <form onSubmit={handleSubmitChat} className="flex flex-col gap-10">
          <Textarea
            placeholder="Type your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg border"
              />
              <Button
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
              >
                Remove
              </Button>
            </div>
          )}
          <Button type="submit" disabled={isChatPending}>
            Chat
          </Button>
        </form>
        {/* AI Answer */}
        {chatResponse && (
          <section className="mt-10">
            <span>Date: {convertedDate}</span>
            <p>{chatReply}</p>
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
          {showHistory ? "Close Chat History" : "Show Chat History"}
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
