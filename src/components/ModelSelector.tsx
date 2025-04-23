
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAvailableModels, OllamaModel } from "@/utils/ollama";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelName: string) => void;
}

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getModels = async () => {
      try {
        setIsLoading(true);
        const availableModels = await fetchAvailableModels();
        setModels(availableModels);
        
        // Set default model if not already set and models are available
        if (availableModels.length > 0 && !selectedModel) {
          onModelChange(availableModels[0].name);
        }
        setError(null);
      } catch (err) {
        setError("Failed to load models. Is Ollama running?");
        console.error("Error loading models:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getModels();
  }, [onModelChange, selectedModel]);

  return (
    <div className="w-full max-w-xs">
      <Select 
        value={selectedModel} 
        onValueChange={onModelChange}
        disabled={isLoading || models.length === 0}
      >
        <SelectTrigger className="w-full bg-white/5 border border-gray-700 focus:ring-blue-500">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.name} value={model.name}>
              {model.name}
            </SelectItem>
          ))}
          {models.length === 0 && !isLoading && (
            <SelectItem value="none" disabled>
              {error || "No models available"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ModelSelector;
