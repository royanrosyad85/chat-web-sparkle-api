import { useState, useEffect } from "react";

export interface ChatSession {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export const useChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions");
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
      setSessions(parsedSessions);
      
      // Set current session to the most recent one
      if (parsedSessions.length > 0) {
        setCurrentSessionId(parsedSessions[0].id);
      }
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("chatSessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  const createNewSession = (): ChatSession => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession;
  };

  const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, ...updates, updatedAt: new Date() }
          : session
      )
    );
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  const addMessageToSession = (sessionId: string, message: ChatSession['messages'][0]) => {
    setSessions(prev => 
      prev.map(session => {
        if (session.id === sessionId) {
          const updatedMessages = [...session.messages, message];
          // Auto-generate title from first user message
          const title = session.messages.length === 0 && message.isUser
            ? message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "")
            : session.title;
          
          return {
            ...session,
            messages: updatedMessages,
            title,
            updatedAt: new Date(),
          };
        }
        return session;
      })
    );
  };

  const getCurrentSession = (): ChatSession | null => {
    return sessions.find(session => session.id === currentSessionId) || null;
  };

  const clearAllSessions = () => {
    setSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem("chatSessions");
  };

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    updateSession,
    deleteSession,
    addMessageToSession,
    getCurrentSession,
    clearAllSessions,
  };
};
