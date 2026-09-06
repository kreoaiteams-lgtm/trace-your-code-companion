import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowUp, Bug, FolderOpen, Hammer, Mic, Plus, RefreshCw, Telescope, Sparkles, User as UserIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TraceAI" },
      { name: "description", content: "What should we work on?" },
    ],
  }),
  component: TraceApp,
});

const getRepoPrompts = (repo: string) => {
  if (repo === "signal-api") {
    return [
      { icon: Telescope, title: "Analyze signal-api architecture", color: "text-blue-400" },
      { icon: Hammer, title: "Add new endpoints", color: "text-purple-400" },
      { icon: RefreshCw, title: "Optimize database queries", color: "text-green-400" },
      { icon: Bug, title: "Fix failing integration tests", color: "text-orange-400" },
    ];
  } else if (repo === "design-system") {
    return [
      { icon: Telescope, title: "Audit component accessibility", color: "text-blue-400" },
      { icon: Hammer, title: "Create new DatePicker component", color: "text-purple-400" },
      { icon: RefreshCw, title: "Update color tokens", color: "text-green-400" },
      { icon: Bug, title: "Fix responsive layout bugs", color: "text-orange-400" },
    ];
  }
  return [
    { icon: Telescope, title: "Analyze trace-web architecture", color: "text-blue-400" },
    { icon: Hammer, title: "Implement new feature", color: "text-purple-400" },
    { icon: RefreshCw, title: "Refactor state management", color: "text-green-400" },
    { icon: Bug, title: "Fix failing tests in trace-web", color: "text-orange-400" },
  ];
};

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

function TraceApp() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  
  const { isAuthenticated, activeRepo } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  if (!isAuthenticated) return null;

  const prompts = getRepoPrompts(activeRepo);

  const handleSubmit = (text: string = input) => {
    if (!text.trim() || isThinking) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    
    // Simulate AI thinking then responding
    setTimeout(() => {
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "ai", 
        content: `I can certainly help you with that! Let's take a look at the current architecture in ${activeRepo}...` 
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isInitialScreen = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-48px)] lg:h-screen w-full flex-col relative overflow-hidden bg-background fade-in">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/chat-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          mixBlendMode: "luminosity"
        }}
      />
      
      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto pb-[180px] scroll-smooth z-10"
      >
        <div className="mx-auto w-full max-w-3xl px-6 pt-12 flex flex-col">
          {isInitialScreen ? (
            <div className="flex w-full flex-col items-center justify-center pt-[10vh]">
              {/* Center Hero */}
              <div className="flex flex-col items-center text-center slide-up mb-12">
                <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  What in <span className="underline decoration-muted-foreground/40 underline-offset-4 font-semibold">{activeRepo}</span> bothers you?
                </h1>
              </div>

              {/* Action Cards */}
              <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 stagger-children">
                {prompts.map((prompt, index) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      type="button"
                      key={prompt.title + index}
                      onClick={() => setInput(prompt.title)}
                      className="group flex items-center gap-3 rounded-xl border border-border/40 bg-card/40 p-3 text-left transition-all duration-300 hover:bg-accent/30 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/10"
                    >
                      <Icon className={`size-4 shrink-0 ${prompt.color} opacity-80`} />
                      <span className="text-[13px] font-medium leading-tight text-foreground/80 group-hover:text-foreground">
                        {prompt.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 slide-up w-full">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex w-full",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "ai" && (
                    <div className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center shrink-0 shadow-md mr-4 mt-0.5">
                      <Sparkles className="size-4" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "px-4 py-3 text-[15px] leading-relaxed max-w-[85%]",
                    msg.role === "user" 
                      ? "bg-muted text-foreground rounded-2xl rounded-tr-sm"
                      : "text-foreground"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isThinking && (
                <div className="flex w-full justify-start items-center fade-in">
                  <div className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center shrink-0 shadow-md mr-4">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium h-10">
                    <span className="pulse-glow size-2 rounded-full bg-foreground" />
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Input Dock */}
      <div className="absolute bottom-6 left-0 right-0 z-20 mx-auto w-full max-w-3xl px-6">
        <div className={cn(
          "flex flex-col rounded-2xl border bg-card shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden transition-all duration-300",
          isThinking ? "border-foreground/20 shadow-foreground/5" : "border-border/60"
        )}>
          {/* Input Header */}
          <div className="flex items-center gap-2 bg-muted/20 px-4 py-2 border-b border-border/30">
            <FolderOpen className="size-3.5 text-muted-foreground" />
            <span className="text-[12px] font-medium text-muted-foreground">{activeRepo}</span>
          </div>

          {/* Text Area */}
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Do anything..."
            className="w-full resize-none bg-transparent px-4 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none min-h-[40px] transition-all duration-300 mt-1"
            disabled={isThinking}
            rows={1}
            style={{
              height: "auto",
              minHeight: "40px",
              maxHeight: "150px"
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-muted text-muted-foreground">
                <Plus className="size-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-muted text-muted-foreground">
                <Mic className="size-4" />
              </Button>
              <button
                onClick={() => handleSubmit(input)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-all duration-300",
                  input.trim() 
                    ? "bg-foreground text-background hover:scale-105 active:scale-95 shadow-md shadow-foreground/20" 
                    : "bg-muted text-muted-foreground/50"
                )}
                disabled={!input.trim() || isThinking}
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="text-center mt-3">
          <p className="text-[11px] text-muted-foreground/60">TraceAI can make mistakes. Consider verifying important information.</p>
        </div>
      </div>
    </div>
  );
}
