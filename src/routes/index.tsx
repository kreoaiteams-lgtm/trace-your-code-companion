import { createFileRoute } from "@tanstack/react-router";
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
  { label: "Home", icon: Home },
  { label: "Explore", icon: Compass },
  { label: "Brainstorms", icon: Lightbulb },
  { label: "Community", icon: Users },
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
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar px-4 py-5 transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-10 items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-3.5" />
            </div>
            <span className="font-serif text-xl font-semibold">TRACE</span>
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

        <nav className="mt-8 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => {
                  setActive(item.label);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full justify-start gap-3 px-3 font-normal",
                  active === item.label && "bg-accent text-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between px-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Your repositories</p>
            <Button variant="ghost" size="icon" className="size-7" aria-label="Add repository">
              <Plus className="size-3.5" />
            </Button>
          </div>
          <div className="space-y-0.5">
            {repositories.map((repo) => (
              <Button key={repo.name} variant="ghost" className="w-full justify-start gap-3 px-3 font-normal">
                <span className={cn("size-2 rounded-full", repo.color)} />
                <span className="truncate">{repo.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-border pt-4">
          <Button variant="ghost" className="w-full justify-start gap-3 px-2 font-normal">
            <Avatar className="size-8 border border-border">
              <AvatarFallback className="bg-avatar text-xs font-semibold text-avatar-foreground">AK</AvatarFallback>
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
              <Menu />
            </Button>
            <button className="hidden items-center gap-2 text-sm text-muted-foreground md:flex" type="button">
              <Search className="size-4" />
              <span>Search anything</span>
              <kbd className="ml-4 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Help"><CircleHelp /></Button>
            <Button variant="ghost" size="icon" aria-label="Notifications"><Bell /></Button>
            <Button
              variant={connected ? "outline" : "default"}
              className="gap-2"
              onClick={() => setConnected((value) => !value)}
            >
              {connected ? <Check className="size-4 text-success" /> : <Github />}
              <span className="hidden sm:inline">{connected ? "GitHub connected" : "Connect GitHub"}</span>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-10 md:py-14">
          <section className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-medium text-primary">Your thinking space</p>
            <h1 className="font-serif text-4xl leading-tight font-medium text-balance md:text-6xl">
              What are you building today?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Ask anything about your code, untangle a tough problem, or invite fresh minds into an idea.
            </p>

            <div className="mt-9 rounded-lg border border-border bg-card p-3 text-left shadow-soft focus-within:border-ring focus-within:shadow-focus">
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
                className="min-h-28 resize-none border-0 bg-transparent p-3 text-base shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center justify-between border-t border-border px-1 pt-3">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full bg-repo-blue" />
                  trace-web
                  <ChevronDown className="size-3.5" />
                </Button>
                <Button size="icon" onClick={submit} disabled={!question.trim()} aria-label="Send question">
                  <ArrowUp />
                </Button>
              </div>
            </div>
            {sent && (
              <div className="mt-4 flex items-start gap-3 rounded-md border border-success/25 bg-success-soft px-4 py-3 text-left text-sm">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-success" />
                <p><span className="font-medium">TRACE is exploring:</span> {sent}</p>
              </div>
            )}
          </section>

          <section className="mt-12 grid gap-3 md:grid-cols-3" aria-label="Quick starts">
            {prompts.map((prompt) => {
              const Icon = prompt.icon;
              return (
                <button
                  type="button"
                  key={prompt.title}
                  onClick={() => setQuestion(prompt.title + ": ")}
                  className="group flex min-h-28 items-start gap-4 rounded-lg border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-ring hover:shadow-soft"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Icon className="size-4" />
                  </span>
                  <span>
                    <span className="block font-medium">{prompt.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-muted-foreground">{prompt.detail}</span>
                  </span>
                </button>
              );
            })}
          </section>

          <section className="mt-14 grid gap-10 lg:grid-cols-[1.35fr_1fr]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-medium">Continue thinking</h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground">View all</Button>
              </div>
              <div className="divide-y divide-border border-y border-border">
                {conversations.map((conversation, index) => (
                  <button
                    type="button"
                    key={conversation.title}
                    className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className={cn("flex size-9 items-center justify-center rounded-md", index === 0 ? "bg-warm text-warm-foreground" : "bg-muted text-muted-foreground")}>
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
                <Button variant="ghost" size="sm" className="text-muted-foreground">Explore</Button>
              </div>
              <div className="rounded-lg border border-border bg-community p-5">
                <div className="flex items-center gap-2 text-xs font-medium text-community-foreground">
                  <span className="size-2 rounded-full bg-community-dot" />
                  LIVE BRAINSTORM
                </div>
                <h3 className="mt-4 font-serif text-xl font-medium">A calmer way to review pull requests</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Maya is looking for thoughtful feedback on a new async review flow.</p>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {['MR', 'JL', 'SK'].map((name) => (
                      <Avatar key={name} className="size-7 border-2 border-community">
                        <AvatarFallback className="bg-avatar text-[10px] font-semibold text-avatar-foreground">{name}</AvatarFallback>
                      </Avatar>
                    ))}
                    <span className="flex size-7 items-center justify-center rounded-full border-2 border-community bg-background text-[10px] text-muted-foreground">+8</span>
                  </div>
                  <Button variant="outline" size="sm">Join discussion</Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}