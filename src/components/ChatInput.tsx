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
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative bg-input rounded-3xl shadow-chat border border-border overflow-hidden">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message here..."
          disabled={isLoading}
          className={cn(
            "border-0 bg-transparent px-6 py-4 text-base placeholder:text-muted-foreground",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "pr-16"
          )}
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isLoading}
            className={cn(
              "h-8 w-8 p-0 rounded-full",
              "bg-primary hover:bg-primary/90 disabled:bg-muted disabled:opacity-50"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};