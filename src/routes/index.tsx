import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowUp,
  Bug,
  FolderOpen,
  Hammer,
  Mic,
  RefreshCw,
  Telescope,
  Sparkles,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";
import { createServerFn } from "@tanstack/react-start";

const chatAction = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { messages: Array<{ role: string; content: string }> } }) => {
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      throw new Error("SARVAM_API_KEY is not configured in the environment");
    }

    const { messages } = data;
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages payload");
    }

    const sarvamResponse = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        model: "sarvam-105b",
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!sarvamResponse.ok) {
      const errorText = await sarvamResponse.text();
      console.error("Sarvam API Error:", errorText);
      throw new Error(`Sarvam API returned status ${sarvamResponse.status}`);
    }

    return await sarvamResponse.json();
  });

function renderMarkdown(text: string): string {
  let html = text
    // Escape HTML entities first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Code blocks (```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) =>
      `<pre class="bg-muted/60 rounded-lg p-3 overflow-x-auto text-xs my-2"><code>${code.trim()}</code></pre>`)
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>')
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Tables — simple conversion
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(Boolean).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) return ''; // separator row
      const tag = 'td';
      return `<tr>${cells.map(c => `<${tag} class="border border-border/40 px-2 py-1 text-xs">${c}</${tag}>`).join('')}</tr>`;
    })
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p class="my-1.5">')
    // Single newlines
    .replace(/\n/g, '<br/>');

  // Wrap table rows
  if (html.includes('<tr>')) {
    html = html.replace(/(<tr>[\s\S]*?<\/tr>(?:<br\/>)?)+/g, (match) =>
      `<table class="border-collapse my-2 w-full text-left">${match.replace(/<br\/>/g, '')}</table>`);
  }

  // Wrap loose <li> in <ul>
  html = html.replace(/(<li[^>]*>[\s\S]*?<\/li>(?:<br\/>)?)+/g, (match) =>
    `<ul class="my-1">${match.replace(/<br\/>/g, '')}</ul>`);

  return `<p class="my-1.5">${html}</p>`;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "TraceAI" }, { name: "description", content: "What should we work on?" }],
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

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function TraceApp() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const { isAuthenticated, activeRepo, activeConversation } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [activeRepo, activeConversation]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setInput((current) => current || "Voice input is not supported in this browser.");
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setInput((current) => (current ? `${current} ${transcript}` : transcript));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  if (!isAuthenticated) return null;

  const prompts = getRepoPrompts(activeRepo);

  const handleSubmit = async (text: string = input) => {
    if (!text.trim() || isThinking) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsThinking(true);

    // Build the message history for the API
    const apiMessages = [
      {
        role: "system" as const,
        content: `You are TraceAI, an expert codebase intelligence assistant. The user is currently working in the "${activeRepo}" repository. Help them analyze architecture, find bugs, refactor code, and understand dependencies. Be concise, specific, and technical. Use markdown formatting when helpful.`,
      },
      ...updatedMessages.map((m) => ({
        role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      })),
    ];

    try {
      const data = await chatAction({ data: { messages: apiMessages } });

      const content =
        data?.choices?.[0]?.message?.content ??
        "I wasn't able to generate a response. Please try again.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `I can certainly help you with that! Let's take a look at the current architecture in ${activeRepo}. (Note: AI backend is currently unavailable — this is a fallback response. Error: ${(err as Error).message})`,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
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
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "url('/chat-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 w-full overflow-y-auto pb-[180px] scroll-smooth z-10">
        <div className="mx-auto w-full max-w-3xl px-6 pt-12 flex flex-col">
          {isInitialScreen ? (
            <div className="flex w-full flex-col items-center justify-center pt-[22vh]">
              {/* Center Hero */}
              <div className="flex flex-col items-center text-center slide-up mb-12">
                <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  What in{" "}
                  <span className="underline decoration-muted-foreground/40 underline-offset-4 font-semibold">
                    {activeRepo}
                  </span>{" "}
                  bothers you?
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
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {msg.role === "ai" && (
                    <div className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center shrink-0 shadow-md mr-4 mt-0.5">
                      <Sparkles className="size-4" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "px-4 py-3 text-[15px] leading-relaxed max-w-[85%]",
                      msg.role === "user"
                        ? "bg-muted text-foreground rounded-2xl rounded-tr-sm"
                        : "text-foreground prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:my-2 max-w-none",
                    )}
                  >
                    {msg.role === "ai" ? (
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                    ) : (
                      msg.content
                    )}
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
        <div
          className={cn(
            "flex flex-col border bg-card shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden transition-all duration-300",
            isThinking ? "border-foreground/20 shadow-foreground/5" : "border-border/60",
            isInitialScreen ? "rounded-2xl" : "rounded-[28px]",
          )}
        >
          {/* Input Header */}
          {isInitialScreen && (
            <div className="flex items-center gap-2 bg-muted/20 px-4 py-2 border-b border-border/30">
              <FolderOpen className="size-3.5 text-muted-foreground" />
              <span className="text-[12px] font-medium text-muted-foreground">{activeRepo}</span>
              <span className="text-[12px] text-muted-foreground/50">/</span>
              <span className="text-[12px] font-medium text-foreground/70">
                {activeConversation}
              </span>
            </div>
          )}

          <div className="flex items-end p-2">
            {/* Text Area */}
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isInitialScreen ? "Do anything..." : "Reply to TraceAI..."}
              className="flex-1 w-full resize-none bg-transparent px-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-300"
              disabled={isThinking}
              rows={1}
              style={{
                height: "auto",
                minHeight: "40px",
                maxHeight: "150px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />

            {/* Right Buttons */}
            <div className="flex items-center gap-1 pb-1 pl-1">
              {isInitialScreen && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isThinking}
                  aria-label={isListening ? "Stop voice input" : "Start voice input"}
                  className={cn(
                    "size-8 rounded-full hover:bg-muted text-muted-foreground",
                    isListening && "bg-red-500/15 text-red-500 hover:bg-red-500/20",
                  )}
                >
                  <Mic className={cn("size-4", isListening && "animate-pulse")} />
                </Button>
              )}
              <button
                onClick={() => handleSubmit(input)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-all duration-300",
                  input.trim()
                    ? "bg-foreground text-background hover:scale-105 active:scale-95 shadow-md shadow-foreground/20"
                    : "bg-muted text-muted-foreground/50",
                )}
                disabled={!input.trim() || isThinking}
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3 px-1">
          <p className="text-[11px] text-muted-foreground/60">
            TraceAI can make mistakes. Consider verifying important information.
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600/80 dark:text-emerald-500/70 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <ShieldCheck className="size-3" />
            <span>Local &amp; Private</span>
          </div>
        </div>
      </div>
    </div>
  );
}
