
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="mb-4">
          <span className="text-4xl">💬</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Start a conversation
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          Send a message to begin chatting with your selected AI model.
          The model will respond based on your prompt.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "mb-4 p-4 rounded-lg max-w-[85%]",
            message.role === "user"
              ? "bg-blue-600 text-white ml-auto"
              : "bg-gray-200 dark:bg-gray-800 dark:text-gray-100"
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          <div 
            className={cn(
              "text-xs mt-2",
              message.role === "user" 
                ? "text-blue-200"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {message.isStreaming ? (
              "Generating..."
            ) : (
              new Date(message.timestamp).toLocaleTimeString()
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
