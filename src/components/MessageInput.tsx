
import { useState, FormEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Enter (without shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="relative flex items-end">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Please select an AI model first" : "Type your message..."}
          className="pr-12 resize-none min-h-[60px] max-h-[200px] border border-gray-300 dark:border-gray-600 rounded-lg"
          disabled={disabled}
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 bottom-2 rounded-full h-8 w-8 p-0"
          disabled={disabled || !input.trim()}
        >
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {disabled && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
          Please select an AI model to start chatting
        </p>
      )}
    </form>
  );
};

export default MessageInput;
