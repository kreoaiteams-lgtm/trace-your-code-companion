import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowUp, Bug, FolderOpen, Hammer, Mic, Plus, RefreshCw, Telescope, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

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

function TraceApp() {
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const { isAuthenticated, activeRepo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const prompts = getRepoPrompts(activeRepo);

  const handleSubmit = () => {
    if (!question.trim() || isSubmitting) return;
    setSubmittedQuestion(question);
    setIsSubmitting(true);
    setShowResponse(false);
    
    // Simulate AI thinking then responding
    setTimeout(() => {
      setIsSubmitting(false);
      setShowResponse(true);
      setResponseMessage("I can certainly help you with that! Let's take a look at the current architecture in " + activeRepo + "...");
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-[calc(100vh-48px)] lg:h-screen w-full flex-col items-center relative overflow-hidden bg-background fade-in">
      <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 pb-[140px] pt-12">
        {/* Action Cards or Chat Area */}
        {!isSubmitting && !showResponse ? (
          <>
            {/* Center Hero */}
            <div className="flex flex-col items-center text-center slide-up mb-12">
              <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                What in <span className="underline decoration-muted-foreground/40 underline-offset-4 font-semibold">{activeRepo}</span> bothers you?
              </h1>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 stagger-children">
              {prompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <button
                    type="button"
                    key={prompt.title + index}
                    onClick={() => setQuestion(prompt.title + ": ")}
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
          </>
        ) : (
          <div className="w-full flex flex-col items-start gap-6 px-4">
            {/* User message */}
            <div className="self-end bg-accent/20 px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm border border-border/50">
              {submittedQuestion}
            </div>
            
            {/* AI Response */}
            <div className="flex items-start gap-4 max-w-[85%]">
              <div className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="size-4" />
              </div>
              <div className="pt-1.5">
                {isSubmitting ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                    <span className="pulse-glow size-2 rounded-full bg-foreground" />
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed typewriter">
                    {responseMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Input Dock */}
      <div className="absolute bottom-6 left-0 right-0 z-20 mx-auto w-full max-w-[800px] px-6">
        <div className={cn(
          "flex flex-col rounded-xl border bg-card shadow-2xl shadow-black/5 overflow-hidden transition-all duration-300",
          isSubmitting ? "border-foreground/30 shadow-foreground/10" : "border-border"
        )}>
          {/* Input Header */}
          <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 border-b border-border/40">
            <FolderOpen className="size-3.5 text-muted-foreground" />
            <span className="text-[12px] font-medium text-foreground/90">{activeRepo}</span>
          </div>

          {/* Text Area */}
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Do anything"
            className="w-full resize-none bg-transparent px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none min-h-[60px] transition-all duration-300"
            disabled={isSubmitting}
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-4 text-muted-foreground">
              <button className="flex size-6 items-center justify-center rounded hover:bg-accent transition-colors">
                <Plus className="size-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex size-7 items-center justify-center rounded hover:bg-accent text-muted-foreground transition-colors">
                <Mic className="size-4" />
              </button>
              <button
                onClick={handleSubmit}
                className={cn(
                  "flex size-7 items-center justify-center rounded-full transition-all duration-300",
                  question.trim() 
                    ? "bg-foreground text-background hover:scale-105 active:scale-95 shadow-md shadow-foreground/20" 
                    : "bg-muted text-muted-foreground"
                )}
                disabled={!question.trim() || isSubmitting}
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
