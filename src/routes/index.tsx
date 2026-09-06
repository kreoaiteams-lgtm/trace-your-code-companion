import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, Bug, ChevronDown, Cloud, FolderOpen, Hammer, Mic, Plus, RefreshCw, Sparkles, Telescope } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TraceAI" },
      { name: "description", content: "What should we work on?" },
    ],
  }),
  component: TraceApp,
});

const prompts = [
  { icon: Telescope, title: "Explore and understand code", color: "text-blue-400" },
  { icon: Hammer, title: "Build a new feature, app, or tool", color: "text-purple-400" },
  { icon: RefreshCw, title: "Review code and suggest changes", color: "text-green-400" },
  { icon: Bug, title: "Fix issues and failures", color: "text-orange-400" },
];

function TraceApp() {
  const [question, setQuestion] = useState("");

  return (
    <div className="flex h-[calc(100vh-48px)] lg:h-screen w-full flex-col items-center relative overflow-hidden bg-background">
      {/* Top Left Badge */}
      <div className="absolute left-6 top-6 z-10 hidden lg:block">
        <button className="flex items-center gap-1.5 rounded-full bg-accent/30 px-3 py-1 text-[13px] font-medium text-foreground hover:bg-accent/50 transition-colors border border-border/20">
          <Sparkles className="size-3.5 text-purple-400" />
          Get Plus
        </button>
      </div>

      <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 pb-[140px] pt-12">
        {/* Center Hero */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            How can <span className="underline decoration-muted-foreground/40 underline-offset-4">TraceAI</span> help you today?
          </h1>
        </div>

        {/* Action Cards */}
        <div className="mt-12 grid w-full grid-cols-2 gap-3 md:grid-cols-4">
          {prompts.map((prompt) => {
            const Icon = prompt.icon;
            return (
              <button
                type="button"
                key={prompt.title}
                onClick={() => setQuestion(prompt.title + ": ")}
                className="group flex h-32 flex-col items-start justify-between rounded-xl border border-border/40 bg-card/40 p-4 text-left transition-all hover:bg-accent/30"
              >
                <Icon className={`size-4 ${prompt.color} opacity-80`} />
                <span className="text-[13px] font-medium leading-tight text-foreground/80 group-hover:text-foreground">
                  {prompt.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Input Dock */}
      <div className="absolute bottom-6 left-0 right-0 z-20 mx-auto w-full max-w-[800px] px-6">
        <div className="flex flex-col rounded-xl border border-border bg-card shadow-2xl shadow-black/5 overflow-hidden">
          {/* Input Header */}
          <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 border-b border-border/40">
            <FolderOpen className="size-3.5 text-muted-foreground" />
            <span className="text-[12px] font-medium text-foreground/90">TraceAI</span>
          </div>

          {/* Text Area */}
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Do anything"
            className="w-full resize-none bg-transparent px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none min-h-[60px]"
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-4 text-muted-foreground">
              <button className="flex size-6 items-center justify-center rounded hover:bg-accent transition-colors">
                <Plus className="size-4" />
              </button>
              <button className="flex items-center gap-1.5 text-[12px] font-medium text-orange-400 hover:opacity-80 transition-opacity">
                <span className="flex size-4 items-center justify-center rounded-full border border-orange-400/50 text-[10px]">!</span>
                Full access
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                <span className="font-medium">5.4 Mini</span>
                <span className="text-muted-foreground/60">Light</span>
                <ChevronDown className="size-3" />
              </button>
              <button className="flex size-7 items-center justify-center rounded hover:bg-accent text-muted-foreground transition-colors">
                <Mic className="size-4" />
              </button>
              <button
                className="flex size-7 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                disabled={!question.trim()}
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
