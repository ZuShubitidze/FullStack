import { getPreview } from "@/components/GetPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadToCloudinary } from "@/hooks/uploadToCloudinary";
import {
  getAIResponseHistory,
  useGenerateAIResponseChat,
} from "@/hooks/useGenerateAIResponse";
import type { AIRequest } from "@/types/aiRequest.interface";
import { useEffect, useState } from "react";

const AIPage = () => {
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [historyItem, setHistoryItem] = useState<string | null>();
  const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
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
  const {
    mutate,
    streamingText,
    isPending: isChatPending,
  } = useGenerateAIResponseChat();
  const handleSubmitChat = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageURL = "";

    if (image) {
      imageURL = await uploadToCloudinary(image, "users");
    }

    mutate({ prompt, imageURL });
    setPrompt("");
    setImage(null);
    setHistoryItem("");
  };

  // Get Chat History
  const { AIResponseHistory } = getAIResponseHistory();
  // Get specific AI Request from History
  const handleGetAIResponse = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const fullItem: AIRequest | undefined = AIResponseHistory.find(
      (item) => item.id === id,
    );
    if (fullItem) {
      setHistoryItem(fullItem.text);
    }
  };

  return (
    <main className="flex flex-col md:flex-row gap-10 md:gap-20 lg:gap-30 justify-around">
      {/* Chat */}
      <section className="w-140 lg:w-120 mb-10 md:mb-0">
        <h1>Chat With AI:</h1>
        {/* Form Input */}
        <form onSubmit={handleSubmitChat} className="flex flex-col gap-10">
          <Textarea
            placeholder="Type your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          {/* Image Input and Preview */}
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
        {isChatPending || streamingText ? (
          <section>
            <span>
              {new Date().toLocaleString("en-US", {
                dateStyle: "long",
              })}
            </span>
            <p>{streamingText || "Thinking. . ."}</p>
          </section>
        ) : historyItem ? (
          <p>{historyItem}</p>
        ) : (
          <p></p>
        )}
      </section>

      {/* Chat History */}
      <section className="w-140">
        {/* Show / Close History Button */}
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
