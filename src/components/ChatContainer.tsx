
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { OllamaMessage, OllamaResponse, streamChat } from "@/utils/ollama";
import ChatHeader from "./ChatHeader";
import MessageList, { Message } from "./MessageList";
import MessageInput from "./MessageInput";
import { useToast } from "@/components/ui/use-toast";

export const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedModel) {
      toast({
        title: "No model selected",
        description: "Please select an AI model first.",
        variant: "destructive",
      });
      return;
    }

    // Create a new user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Add temporary assistant message that will be updated during streaming
    const assistantMessageId = uuidv4();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    // Update messages state with both messages
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsProcessing(true);

    // Prepare chat history for Ollama API
    const chatHistory: OllamaMessage[] = [
      ...messages
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      { role: "user", content }
    ];

    try {
      // Stream the response
      await streamChat(
        selectedModel,
        chatHistory,
        (response: OllamaResponse) => {
          // Update assistant message with streamed content
          setMessages((currentMessages) => {
            return currentMessages.map((msg) => {
              if (msg.id === assistantMessageId) {
                return {
                  ...msg,
                  content: msg.content + (response.message?.content || ""),
                  isStreaming: !response.done,
                };
              }
              return msg;
            });
          });

          // When streaming is complete
          if (response.done) {
            setIsProcessing(false);
          }
        }
      );
    } catch (error) {
      console.error("Error in chat stream:", error);
      
      // Update the assistant message to show the error
      setMessages((currentMessages) => {
        return currentMessages.map((msg) => {
          if (msg.id === assistantMessageId) {
            return {
              ...msg,
              content: "Error: Failed to communicate with Ollama. Is the server running?",
              isStreaming: false,
            };
          }
          return msg;
        });
      });
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to Ollama API. Make sure Ollama is running on your system.",
        variant: "destructive",
      });
      
      setIsProcessing(false);
    }
  }, [messages, selectedModel, toast]);

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-900">
      <ChatHeader 
        selectedModel={selectedModel} 
        onModelChange={setSelectedModel} 
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={messages} />
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={isProcessing || !selectedModel} 
        />
      </div>
    </div>
  );
};

export default ChatContainer;
