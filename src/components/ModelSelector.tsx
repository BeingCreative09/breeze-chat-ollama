
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchAvailableModels, OllamaModel } from '@/utils/ollama';
import { useToast } from '@/hooks/use-toast';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelName: string) => void;
}

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getModels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const availableModels = await fetchAvailableModels();
        
        if (availableModels.length === 0) {
          setError('No AI models found. Please install models using Ollama.');
          toast({
            title: 'No Models Found',
            description: 'Please install models using Ollama first.',
            variant: 'destructive',
          });
        } else {
          setModels(availableModels);
          if (!selectedModel && availableModels.length > 0) {
            onModelChange(availableModels[0].name);
          }
        }
      } catch (err) {
        setError('Unable to connect to Ollama. Is it running?');
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to Ollama. Make sure it\'s running on your system.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    getModels();
  }, [onModelChange, selectedModel, toast]);

  return (
    <div className="w-full max-w-xs">
      <Select 
        value={selectedModel} 
        onValueChange={onModelChange}
        disabled={isLoading || models.length === 0}
      >
        <SelectTrigger className="w-full bg-white/5 border border-gray-700 focus:ring-blue-500">
          <SelectValue placeholder={
            isLoading ? "Loading models..." : 
            error ? error :
            "Select a model"
          } />
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
