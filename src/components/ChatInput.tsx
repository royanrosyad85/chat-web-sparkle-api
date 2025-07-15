import { useState } from "react";
import { Send, Search, Brain, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-input rounded-3xl shadow-chat border border-border overflow-hidden">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything"
            disabled={isLoading}
            className={cn(
              "border-0 bg-transparent px-6 py-4 text-base placeholder:text-muted-foreground",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "pr-32"
            )}
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
              disabled={isLoading}
            >
              <Brain className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
              disabled={isLoading}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || isLoading}
              className={cn(
                "h-8 w-8 p-0 rounded-full ml-1",
                "bg-primary hover:bg-primary/90 disabled:bg-muted"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};