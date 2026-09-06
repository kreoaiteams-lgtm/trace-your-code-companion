import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUp,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Code2,
  Compass,
  GitBranch,
  Github,
  Home,
  Lightbulb,
  Menu,
  MessageCircleMore,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Users,
  X,
  BarChart3,
  Shield,
  Clock,
  Network,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRACE — Think better with your code" },
      {
        name: "description",
        content: "Connect your GitHub, ask questions about your code, and brainstorm with builders.",
      },
      { property: "og:title", content: "TRACE — Think better with your code" },
      {
        property: "og:description",
        content: "Connect your GitHub, ask questions about your code, and brainstorm with builders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TraceApp,
});

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Explore", icon: Network, href: "/explore" },
  { label: "Impact", icon: Shield, href: "/impact" },
  { label: "Sessions", icon: Clock, href: "/sessions" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Community", icon: Users, href: "/" },
];

const repositories = [
  { name: "trace-web", language: "TypeScript", color: "bg-repo-blue" },
  { name: "signal-api", language: "Python", color: "bg-repo-green" },
  { name: "design-system", language: "CSS", color: "bg-repo-pink" },
];

const conversations = [
  { title: "Improve our auth flow", time: "2h" },
  { title: "Caching strategy for API", time: "Yesterday" },
  { title: "Onboarding architecture", time: "Mon" },
];

const prompts = [
  { icon: Code2, title: "Review my code", detail: "Find bugs and suggest improvements", accent: "from-[oklch(0.92_0.04_160)] to-[oklch(0.96_0.02_200)]" },
  { icon: GitBranch, title: "Understand a repo", detail: "Trace logic across the codebase", accent: "from-[oklch(0.92_0.04_245)] to-[oklch(0.96_0.02_280)]" },
  { icon: Lightbulb, title: "Brainstorm an idea", detail: "Think it through with builders", accent: "from-[oklch(0.94_0.04_55)] to-[oklch(0.96_0.03_330)]" },
];

function TraceApp() {
  const [active, setActive] = useState("Home");
  const [question, setQuestion] = useState("");
  const [connected, setConnected] = useState(true);
  const [sent, setSent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const submit = () => {
    const value = question.trim();
    if (!value) return;
    setSent(value);
    setQuestion("");
  };

  return (
    <div className="mesh-bg min-h-screen text-foreground">
      <aside
        className={cn(
          "glass-sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col px-4 py-5 transition-transform duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-10 items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.55_0.18_245)] text-primary-foreground shadow-sm">
              <Sparkles className="size-4" />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight">TRACE</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X />
          </Button>
        </div>

        <nav className="mt-8 space-y-0.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => {
                  setActive(item.label);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal transition-all duration-200",
                  active === item.label
                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between px-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Your repositories</p>
            <Button variant="ghost" size="icon" className="size-7 rounded-md" aria-label="Add repository">
              <Plus className="size-3.5" />
            </Button>
          </div>
          <div className="space-y-0.5">
            {repositories.map((repo) => (
              <Button key={repo.name} variant="ghost" className="w-full justify-start gap-3 rounded-lg px-3 font-normal text-sm">
                <span className={cn("size-2.5 rounded-full ring-2 ring-white shadow-sm", repo.color)} />
                <span className="truncate">{repo.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-white/20 pt-4">
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-lg px-2 font-normal">
            <Avatar className="size-8 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-avatar to-[oklch(0.88_0.06_310)] text-xs font-semibold text-avatar-foreground">AK</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium">Alex Kim</span>
              <span className="block truncate text-xs text-muted-foreground">@alexbuilds</span>
            </span>
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
              <Menu />
            </Button>
            <button className="hidden items-center gap-2 rounded-lg bg-white/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/60 md:flex" type="button">
              <Search className="size-4" />
              <span>Search anything</span>
              <kbd className="ml-4 rounded-md border border-border/50 bg-white/60 px-1.5 py-0.5 text-[10px] font-medium">⌘ K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Help"><CircleHelp className="size-4" /></Button>
            <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Notifications"><Bell className="size-4" /></Button>
            <Button
              variant={connected ? "outline" : "default"}
              className={cn("gap-2 rounded-lg", connected && "border-primary/20 bg-primary/5 hover:bg-primary/10")}
              onClick={() => setConnected((value) => !value)}
            >
              {connected ? <Check className="size-4 text-primary" /> : <Github />}
              <span className="hidden sm:inline">{connected ? "GitHub connected" : "Connect GitHub"}</span>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-10 md:py-16">
          <section className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="size-3.5" />
              Your thinking space
            </div>
            <h1 className="text-gradient font-serif text-4xl leading-tight font-medium text-balance md:text-6xl">
              What are you building today?
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              Ask anything about your code, untangle a tough problem, or invite fresh minds into an idea.
            </p>

            <div className="glass glow-on-hover mt-10 rounded-xl p-4 text-left transition-all duration-300 focus-within:shadow-[var(--shadow-card-hover)]">
              <Textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submit();
                  }
                }}
                placeholder="Ask TRACE anything about your work..."
                className="min-h-28 resize-none border-0 bg-transparent p-3 text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
              />
              <div className="flex items-center justify-between border-t border-border/30 px-1 pt-3">
                <Button variant="ghost" size="sm" className="gap-2 rounded-lg text-muted-foreground">
                  <span className="size-2.5 rounded-full bg-repo-blue ring-2 ring-white shadow-sm" />
                  trace-web
                  <ChevronDown className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  onClick={submit}
                  disabled={!question.trim()}
                  aria-label="Send question"
                  className="rounded-lg bg-gradient-to-br from-primary to-[oklch(0.55_0.18_245)] shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <ArrowUp className="size-4" />
                </Button>
              </div>
            </div>
            {sent && (
              <div className="glass mt-4 flex items-start gap-3 rounded-xl px-4 py-3 text-left text-sm border-primary/20">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                <p><span className="font-medium">TRACE is exploring:</span> {sent}</p>
              </div>
            )}
          </section>

          <section className="mt-14 grid gap-4 md:grid-cols-3" aria-label="Quick starts">
            {prompts.map((prompt) => {
              const Icon = prompt.icon;
              return (
                <button
                  type="button"
                  key={prompt.title}
                  onClick={() => setQuestion(prompt.title + ": ")}
                  className="glass group flex min-h-28 items-start gap-4 rounded-xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm transition-transform duration-300 group-hover:scale-110", prompt.accent)}>
                    <Icon className="size-4 text-foreground/70" />
                  </span>
                  <span>
                    <span className="block font-medium">{prompt.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-muted-foreground">{prompt.detail}</span>
                  </span>
                </button>
              );
            })}
          </section>

          <section className="mt-16 grid gap-10 lg:grid-cols-[1.35fr_1fr]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-medium">Continue thinking</h2>
                <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground">View all</Button>
              </div>
              <div className="glass divide-y divide-border/30 overflow-hidden rounded-xl">
                {conversations.map((conversation, index) => (
                  <button
                    type="button"
                    key={conversation.title}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-all duration-200 hover:bg-white/40"
                  >
                    <span className={cn("flex size-10 items-center justify-center rounded-xl shadow-sm", index === 0 ? "bg-gradient-to-br from-warm to-[oklch(0.94_0.05_330)] text-warm-foreground" : "bg-white/60 text-muted-foreground")}>
                      <MessageCircleMore className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{conversation.title}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">trace-web · 6 messages</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-medium">Ideas in motion</h2>
                <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground">Explore</Button>
              </div>
              <div className="glass rounded-xl p-6 border-community-dot/20">
                <div className="flex items-center gap-2 text-xs font-medium text-community-foreground">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-community-dot opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-community-dot" />
                  </span>
                  LIVE BRAINSTORM
                </div>
                <h3 className="mt-4 font-serif text-xl font-medium">A calmer way to review pull requests</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Maya is looking for thoughtful feedback on a new async review flow.</p>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {['MR', 'JL', 'SK'].map((name) => (
                      <Avatar key={name} className="size-8 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-avatar to-[oklch(0.88_0.06_310)] text-[10px] font-semibold text-avatar-foreground">{name}</AvatarFallback>
                      </Avatar>
                    ))}
                    <span className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-white/70 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur-sm">+8</span>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg border-primary/20 bg-primary/5 text-primary hover:bg-primary/10">Join discussion</Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-overlay backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}