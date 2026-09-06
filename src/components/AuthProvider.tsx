import { createContext, useContext, useState, type ReactNode } from "react";

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
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("trace-user");
    return stored ? JSON.parse(stored) : null;
  });

  const [activeRepo, setActiveRepo] = useState<string>("trace-web");
  const [conversations, setConversations] = useState<Record<string, string[]>>({
    "trace-web": ["Architecture brainstorm", "Auth flow review"],
    "signal-api": ["API reliability ideas"],
    "design-system": ["Accessibility audit"],
  });
  const [activeConversation, setActiveConversationState] = useState("Architecture brainstorm");

  const setActiveConversation = (conversation: string) => {
    setActiveConversationState(conversation);
  };

  const addConversation = (repo: string, title = "New conversation") => {
    const current = conversations[repo] ?? [];
    const nextTitle = current.includes(title) ? `${title} ${current.length + 1}` : title;
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
    localStorage.setItem("trace-user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("trace-user");
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
