import { useState, FormEvent, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  content: string;
  isUser: boolean;
};

const AIChatFeature = () => {
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hello! I'm your AutoDrive Assistant. How can I help you find your perfect vehicle today?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { content: input, isUser: true }]);
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const responses = [
        "I can help you find the perfect vehicle based on your preferences. Could you tell me what type of vehicle you're looking for?",
        "Great question! We have several options that might interest you. What's your budget range?",
        "Based on your interests, I'd recommend checking out our inventory of SUVs. They offer great space and versatility.",
        "Would you like me to show you our current inventory of these models?",
        "I can schedule a test drive for you. When would you like to come in?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { content: randomResponse, isUser: false }]);
    }, 1000);
    
    // Clear input
    setInput("");
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get Expert Guidance Anytime</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered assistant can help you find the perfect vehicle based on your needs and preferences.
          </p>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-primary text-white flex items-center">
            <span className="material-icons mr-2">smart_toy</span>
            <span className="font-semibold">AutoDrive Assistant</span>
          </div>
          
          <div className="p-6 h-80 overflow-y-auto border-b">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isUser ? "justify-end" : ""} mb-4`}>
                <div className={`${
                  message.isUser 
                    ? "bg-gray-100 rounded-lg rounded-br-none" 
                    : "bg-primary text-white rounded-lg rounded-bl-none"
                  } p-3 max-w-xs`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 flex items-center">
            <Input
              type="text"
              placeholder="Type your question here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button 
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark transition"
            >
              <span className="material-icons">send</span>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AIChatFeature;
