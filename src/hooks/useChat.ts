import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useChatHistory, ChatSession } from "@/hooks/useChatHistory";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    currentSessionId,
    getCurrentSession,
    createNewSession,
    addMessageToSession,
  } = useChatHistory();

  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  // Update current session when currentSessionId changes
  useEffect(() => {
    const session = getCurrentSession();
    setCurrentSession(session);
  }, [currentSessionId, getCurrentSession]);

  const sendMessage = async (content: string) => {
    let session = currentSession;
    
    // Create new session if none exists
    if (!session) {
      session = createNewSession();
      setCurrentSession(session);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message to session
    addMessageToSession(session.id, userMessage);
    setIsLoading(true);

    try {
      const response = await fetch("https://n8n-royanrosyad.southeastasia.cloudapp.azure.com/webhook/be908beb-b583-438b-a73f-680c0e3ea47d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          timestamp: new Date().toISOString(),
          user_id: "web_user",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.output || data.response || data.message || "I received your message, but couldn't generate a response.",
        isUser: false,
        timestamp: new Date(),
      };

      // Add assistant message to session
      addMessageToSession(session.id, assistantMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };

      // Add error message to session
      if (session) {
        addMessageToSession(session.id, errorMessage);
      }
      
      toast({
        title: "Connection Error",
        description: "Failed to send message. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages: currentSession?.messages || [],
    isLoading,
    sendMessage,
    currentSession,
    setCurrentSession,
  };
};