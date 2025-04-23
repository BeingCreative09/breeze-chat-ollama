/**
 * Utility functions for interacting with the Ollama API
 */

// Interface for Ollama API response
export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  message: OllamaMessage;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

// Default URL for local Ollama server
const OLLAMA_API_URL = "http://localhost:11434/api";

/**
 * Fetches list of available models from local Ollama server
 * @returns Promise with array of model information
 */
export const fetchAvailableModels = async (): Promise<OllamaModel[]> => {
  try {
    const response = await fetch('/api/api/tags');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Error fetching Ollama models:', error);
    throw error;
  }
};

/**
 * Send a chat request to the Ollama API
 * @param model The model name to use
 * @param messages Array of message objects with role and content
 * @param onResponse Callback function for handling streaming responses
 */
export const streamChat = async (
  model: string,
  messages: OllamaMessage[],
  onResponse: (response: OllamaResponse) => void
): Promise<void> => {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body stream not available");
    }

    // Process the streaming response
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Decode and parse each chunk
      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split("\n").filter(line => line.trim() !== "");
      
      for (const line of lines) {
        try {
          const parsedResponse = JSON.parse(line) as OllamaResponse;
          onResponse(parsedResponse);
        } catch (e) {
          console.error("Failed to parse response line:", e);
        }
      }
    }
  } catch (error) {
    console.error("Error streaming chat with Ollama:", error);
    throw error;
  }
};
