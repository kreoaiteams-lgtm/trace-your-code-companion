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
        content:
          "Connect your GitHub, ask questions about your code, and brainstorm with builders.",
      },
      { property: "og:title", content: "TRACE — Think better with your code" },
      {
        property: "og:description",
        content:
          "Connect your GitHub, ask questions about your code, and brainstorm with builders.",
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
  { icon: Code2, title: "Review my code", detail: "Find bugs and suggest improvements" },
  { icon: GitBranch, title: "Understand a repo", detail: "Trace logic across the codebase" },
  { icon: Lightbulb, title: "Brainstorm an idea", detail: "Think it through with builders" },
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
            <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background shadow-sm">
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
                    ? "bg-foreground text-background font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Your repositories
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-md"
              aria-label="Add repository"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <div className="space-y-0.5">
            {repositories.map((repo) => (
              <Button
                key={repo.name}
                variant="ghost"
                className="w-full justify-start gap-3 rounded-lg px-3 font-normal text-sm"
              >
                <span className="size-2.5 rounded-full bg-foreground ring-2 ring-background shadow-sm" />
                <span className="truncate">{repo.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-white/20 pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-lg px-2 font-normal"
          >
            <Avatar className="size-8 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-foreground text-xs font-semibold text-background">
                AK
              </AvatarFallback>
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
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu />
            </Button>
            <button
              className="hidden items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
              type="button"
            >
              <Search className="size-4" />
              <span>Search anything</span>
              <kbd className="ml-4 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                ⌘ K
              </kbd>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Help">
              <CircleHelp className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-lg"
              onClick={() => setConnected((value) => !value)}
            >
              {connected ? <Check className="size-4" /> : <Github />}
              <span className="hidden sm:inline">
                {connected ? "GitHub connected" : "Connect GitHub"}
              </span>
            </Button>
          </div>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center px-5 py-12 md:px-10">
          <section className="mx-auto w-full max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-foreground" />
              TraceAI
            </div>
            <h1 className="font-serif text-4xl leading-tight font-medium tracking-tight text-foreground text-balance md:text-6xl">
              What can we trace?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Ask about a codebase, investigate a risk, or understand what a change will break.
            </p>

            <div className="mt-10 rounded-2xl border border-foreground/15 bg-background p-3 text-left shadow-[0_20px_70px_-35px_rgba(0,0,0,0.45)] transition-shadow focus-within:border-foreground/40 focus-within:shadow-[0_24px_80px_-30px_rgba(0,0,0,0.35)]">
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-lg text-muted-foreground"
                >
                  <span className="size-2.5 rounded-full bg-foreground ring-2 ring-background shadow-sm" />
                  trace-web
                  <ChevronDown className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  onClick={submit}
                  disabled={!question.trim()}
                  aria-label="Send question"
                  className="rounded-lg bg-foreground text-background shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <ArrowUp className="size-4" />
                </Button>
              </div>
            </div>
            {sent && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
                <Sparkles className="mt-0.5 size-4 shrink-0" />
                <p>
                  <span className="font-medium">TRACE is exploring:</span> {sent}
                </p>
              </div>
            )}
          </section>

          <section className="mt-10 grid gap-3 md:grid-cols-3" aria-label="Quick starts">
            {prompts.map((prompt) => {
              const Icon = prompt.icon;
              return (
                <button
                  type="button"
                  key={prompt.title}
                  onClick={() => setQuestion(prompt.title + ": ")}
                  className="group flex min-h-24 items-start gap-4 rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-foreground/30 hover:bg-muted"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-4" />
                  </span>
                  <span>
                    <span className="block font-medium">{prompt.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                      {prompt.detail}
                    </span>
                  </span>
                </button>
              );
            })}
          </section>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-overlay backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
