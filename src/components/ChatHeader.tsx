
import { getTimeBasedGreeting } from "@/utils/timeUtils";
import ModelSelector from "./ModelSelector";

interface ChatHeaderProps {
  selectedModel: string;
  onModelChange: (modelName: string) => void;
}

export const ChatHeader = ({ selectedModel, onModelChange }: ChatHeaderProps) => {
  const greeting = getTimeBasedGreeting();
  
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {greeting}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chat with your local Ollama AI models
          </p>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
            Model:
          </span>
          <ModelSelector 
            selectedModel={selectedModel} 
            onModelChange={onModelChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
