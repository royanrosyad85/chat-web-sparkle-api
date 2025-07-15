import { useEffect, useRef } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";

const Index = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[80vh] px-4">
              <div className="text-center max-w-md">
                <h1 className="text-4xl font-normal mb-8 text-foreground">
                  How can I help you today?
                </h1>
              </div>
            </div>
          ) : (
            <div className="py-8">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="max-w-3xl mx-auto px-4 py-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-background p-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
            <div className="text-center mt-3">
              <p className="text-xs text-muted-foreground">
                AI can make mistakes. Please double-check responses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
