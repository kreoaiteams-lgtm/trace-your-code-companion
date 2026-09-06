import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { readTraceSessions } from "@/lib/trace-store";

export interface User {
  name: string;
  username: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  activeRepo: string;
  setActiveRepo: (repo: string) => void;
  activeConversation: string;
  conversations: Record<string, string[]>;
  setActiveConversation: (conversation: string) => void;
  addConversation: (repo: string, title?: string) => string;
  login: (user: User) => void; // Keep for fallback, though we use OAuth now
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeRepo, setActiveRepo] = useState<string>("");
  const [conversations, setConversations] = useState<Record<string, string[]>>({});
  const [activeConversation, setActiveConversationState] = useState<string>("");

  useEffect(() => {
    // 1. Setup Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setUser({
          name: metadata.full_name || metadata.name || session.user.email || "User",
          username: metadata.user_name || metadata.preferred_username || "trace-user",
          avatar: metadata.avatar_url,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setUser({
          name: metadata.full_name || metadata.name || session.user.email || "User",
          username: metadata.user_name || metadata.preferred_username || "trace-user",
          avatar: metadata.avatar_url,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // 2. Fetch real trace sessions
    const fetchSessions = async () => {
      const sessions = await readTraceSessions();
      
      const newConversations: Record<string, string[]> = {};
      sessions.forEach(session => {
        const repo = session.repository || "trace-web";
        if (!newConversations[repo]) newConversations[repo] = [];
        // Ensure unique titles if they are duplicated, though IDs are better
        if (!newConversations[repo].includes(session.title)) {
           newConversations[repo].push(session.title);
        }
      });
      
      setConversations(newConversations);
      
      // Auto-select first repo and conversation if none selected
      const repos = Object.keys(newConversations);
      if (repos.length > 0) {
        const firstRepo = repos[0];
        if (!activeRepo) setActiveRepo(firstRepo);
        if (!activeConversation && newConversations[firstRepo].length > 0) {
          setActiveConversationState(newConversations[firstRepo][0]);
        }
      }
    };

    fetchSessions();

    const handleUpdate = () => fetchSessions();
    window.addEventListener("traceai:sessions-updated", handleUpdate);
    return () => window.removeEventListener("traceai:sessions-updated", handleUpdate);
  }, [activeRepo, activeConversation]);

  const setActiveConversation = (conversation: string) => {
    setActiveConversationState(conversation);
  };

  const addConversation = (repo: string, title = "New conversation") => {
    const current = conversations[repo] ?? [];
    const nextTitle = current.includes(title) ? `${title} ${current.length + 1}` : title;
    
    // We update local state optimistically, the trace-store event will refresh it
    setConversations((previous) => ({
      ...previous,
      [repo]: [...(previous[repo] ?? []), nextTitle],
    }));
    setActiveRepo(repo);
    setActiveConversationState(nextTitle);
    return nextTitle;
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        activeRepo,
        setActiveRepo,
        activeConversation,
        conversations,
        setActiveConversation,
        addConversation,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
