import { useState } from "react";
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit2, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useChatHistory, ChatSession } from "@/hooks/useChatHistory";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  onSessionSelect: (session: ChatSession) => void;
  currentSessionId: string | null;
}

export const ChatSidebar = ({ onSessionSelect, currentSessionId }: ChatSidebarProps) => {
  const {
    sessions,
    createNewSession,
    deleteSession,
    updateSession,
    clearAllSessions,
  } = useChatHistory();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleNewChat = () => {
    const newSession = createNewSession();
    onSessionSelect(newSession);
    setIsOpen(false);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(sessionId);
  };

  const handleEditSession = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveEdit = (sessionId: string) => {
    if (editingTitle.trim()) {
      updateSession(sessionId, { title: editingTitle.trim() });
    }
    setEditingSessionId(null);
    setEditingTitle("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, sessionId: string) => {
    if (e.key === "Enter") {
      handleSaveEdit(sessionId);
    } else if (e.key === "Escape") {
      setEditingSessionId(null);
      setEditingTitle("");
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out",
          "md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-sidebar-foreground">AI Chatbot</h2>
              <ThemeToggle />
            </div>
            <Button
              onClick={handleNewChat}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Chat Sessions */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-1">
              {sessions.length === 0 ? (
                <div className="text-center text-sidebar-foreground/60 py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No chat sessions yet</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors",
                      currentSessionId === session.id && "bg-sidebar-accent"
                    )}
                    onClick={() => {
                      onSessionSelect(session);
                      setIsOpen(false);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 text-sidebar-foreground/60 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      {editingSessionId === session.id ? (
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => handleSaveEdit(session.id)}
                          onKeyDown={(e) => handleKeyPress(e, session.id)}
                          className="h-6 px-1 text-sm"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <p className="text-sm font-medium text-sidebar-foreground truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-sidebar-foreground/60">
                            {formatDate(session.updatedAt)}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleEditSession(session, e)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={(e) => handleDeleteSession(session.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllSessions}
              className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <Settings className="h-4 w-4" />
              Clear All Chats
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
