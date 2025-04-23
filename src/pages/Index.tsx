
import ChatContainer from "@/components/ChatContainer";

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <div className="container mx-auto flex-1 max-w-4xl">
        <ChatContainer />
      </div>
      
      <footer className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
        <p>Breeze Chat • Connect with your local Ollama models</p>
      </footer>
    </div>
  );
};

export default Index;
