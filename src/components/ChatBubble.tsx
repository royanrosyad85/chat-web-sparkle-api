import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatBubble = ({ message, isUser, timestamp }: ChatBubbleProps) => {
  if (isUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-4 bg-chat-bubble-assistant">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-chat-bubble-user rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-4 h-4 bg-chat-bubble-user-foreground rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-chat-bubble-assistant-foreground whitespace-pre-wrap">
              {message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
          <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
        </div>
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-chat-bubble-assistant-foreground whitespace-pre-wrap">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};