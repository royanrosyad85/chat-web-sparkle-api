import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatBubble = ({ message, isUser, timestamp }: ChatBubbleProps) => {
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 shadow-chat transition-smooth",
          isUser
            ? "bg-chat-bubble-user text-chat-bubble-user-foreground"
            : "bg-chat-bubble-assistant text-chat-bubble-assistant-foreground border border-border"
        )}
      >
        <p className="text-sm leading-relaxed">{message}</p>
        <p className="text-xs opacity-70 mt-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};