import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  FileCode2,
  GitBranch,
  GitPullRequest,
  MessageSquare,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ppt")({
  head: () => ({ meta: [{ title: "TraceAI · Product Walkthrough" }] }),
  component: PresentationPage,
});

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
    {children}
  </div>
);

const RepoPill = ({ name = "trace-your-code-companion" }: { name?: string }) => (
  <div className="flex items-center gap-2 text-xs text-slate-500">
    <span className="size-2 rounded-full bg-emerald-500" />
    {name}
    <span className="text-slate-300">/</span>
    <span>main</span>
  </div>
);

const slides = [
  {
    kicker: "TraceAI / product walkthrough",
    title: "Think better with your code.",
    subtitle:
      "A calm workspace for understanding repositories, asking sharper questions, and making safer changes.",
    content: (
      <div className="grid w-full max-w-3xl grid-cols-3 gap-4">
        <Card className="p-5">
          <Network className="mb-8 size-5 text-emerald-600" />
          <p className="font-medium">See structure</p>
          <p className="mt-2 text-sm text-slate-500">Map dependencies before you touch the code.</p>
        </Card>
        <Card className="p-5">
          <MessageSquare className="mb-8 size-5 text-blue-600" />
          <p className="font-medium">Ask contextually</p>
          <p className="mt-2 text-sm text-slate-500">Brainstorm with the repository in view.</p>
        </Card>
        <Card className="p-5">
          <ShieldCheck className="mb-8 size-5 text-amber-600" />
          <p className="font-medium">Change safely</p>
          <p className="mt-2 text-sm text-slate-500">Understand impact before committing.</p>
        </Card>
      </div>
    ),
  },
  {
    kicker: "01 / the problem",
    title: "Repository context is scattered.",
    subtitle:
      "Search finds strings. Teams need relationships, history, and a place to reason together.",
    content: (
      <div className="grid w-full max-w-3xl gap-3">
        <Card className="flex items-center gap-4 p-5">
          <Search className="size-5 text-slate-400" />
          <span className="text-slate-600">Where is this function used?</span>
          <span className="ml-auto text-xs text-red-500">unknown</span>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <GitPullRequest className="size-5 text-slate-400" />
          <span className="text-slate-600">What will this pull request break?</span>
          <span className="ml-auto text-xs text-red-500">unclear</span>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <Users className="size-5 text-slate-400" />
          <span className="text-slate-600">Can someone else pick up this investigation?</span>
          <span className="ml-auto text-xs text-red-500">context lost</span>
        </Card>
      </div>
    ),
  },
  {
    kicker: "02 / workspace",
    title: "One repository. Many conversations.",
    subtitle:
      "Keep architecture questions, bug investigations, and feature ideas organized under the codebase they belong to.",
    content: (
      <Card className="w-full max-w-3xl overflow-hidden">
        <div className="flex">
          <aside className="w-56 border-r border-slate-200 bg-slate-50 p-4">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Your repositories
            </p>
            {["trace-web", "signal-api", "design-system"].map((repo, i) => (
              <div key={repo} className="mb-3">
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-2 text-sm",
                    i === 0 && "bg-white font-medium shadow-sm",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      ["bg-blue-500", "bg-emerald-500", "bg-pink-500"][i],
                    )}
                  />
                  {repo}
                </div>
                {i === 0 && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-2 text-xs text-slate-500">
                    <div className="rounded px-2 py-1 text-slate-900">Architecture brainstorm</div>
                    <div className="px-2 py-1">Auth flow review</div>
                    <div className="px-2 py-1 text-emerald-600">+ New conversation</div>
                  </div>
                )}
              </div>
            ))}
          </aside>
          <div className="flex-1 p-7">
            <RepoPill />
            <h3 className="mt-16 text-2xl font-medium">
              What in <span className="underline decoration-slate-300">trace-web</span> bothers you?
            </h3>
          </div>
        </div>
      </Card>
    ),
  },
  {
    kicker: "03 / connect",
    title: "Start with the repository.",
    subtitle: "Sign in, connect a GitHub repository, and move straight into a focused workspace.",
    content: (
      <Card className="w-full max-w-2xl p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs text-slate-400">CONNECT A REPOSITORY</p>
            <h3 className="mt-2 text-xl font-medium">Choose your codebase</h3>
          </div>
          <GitBranch className="size-6 text-slate-400" />
        </div>
        <div className="mt-6 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400">
          https://github.com/owner/repository
        </div>
        <Button className="mt-4 rounded-xl bg-slate-950">
          Connect repository <ArrowRight className="ml-2 size-4" />
        </Button>
      </Card>
    ),
  },
  {
    kicker: "04 / conversation",
    title: "Brainstorm with the code in view.",
    subtitle:
      "The chat is not a blank prompt. It carries repository, branch, and conversation context into every question.",
    content: (
      <Card className="w-full max-w-3xl p-7">
        <RepoPill />
        <div className="mt-8 space-y-5">
          <div className="ml-auto max-w-md rounded-2xl rounded-tr-sm bg-slate-100 px-4 py-3 text-sm">
            How should we refactor the authentication flow without breaking sessions?
          </div>
          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Sparkles className="size-4" />
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-600">
              Start at <code className="rounded bg-slate-100 px-1">AuthProvider</code>, then trace
              its consumers. I found three session boundaries to preserve before changing the store.
            </p>
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400">
          Reply to TraceAI...
        </div>
      </Card>
    ),
  },
  {
    kicker: "05 / graph intelligence",
    title: "See the shape of the codebase.",
    subtitle:
      "Entire Graph turns repository structure into an inspectable map of files, symbols, callers, and dependencies.",
    content: (
      <Card className="w-full max-w-3xl p-7">
        <div className="flex items-center justify-between">
          <RepoPill />
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
            Graph verified
          </span>
        </div>
        <div className="relative mx-auto mt-10 h-52 max-w-xl">
          <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4 text-center text-xs font-medium text-emerald-800">
            AuthProvider
          </div>
          {["Login", "AppLayout", "Sessions", "Connect"].map((label, i) => (
            <div
              key={label}
              className={cn(
                "absolute rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm",
                ["left-4 top-4", "right-4 top-4", "left-4 bottom-4", "right-4 bottom-4"][i],
              )}
            >
              <FileCode2 className="mr-1 inline size-3 text-slate-400" />
              {label}
            </div>
          ))}
          <div className="absolute inset-8 border border-dashed border-slate-300" />
        </div>
      </Card>
    ),
  },
  {
    kicker: "06 / impact analysis",
    title: "Know the blast radius before you edit.",
    subtitle:
      "TraceAI pairs deterministic graph results with a readable risk summary for the change you are considering.",
    content: (
      <Card className="w-full max-w-3xl p-7">
        <div className="flex items-start justify-between">
          <div>
            <RepoPill />
            <h3 className="mt-5 text-xl font-medium">Impact report: useAuth</h3>
            <p className="mt-1 text-sm text-slate-500">Generated from the current graph</p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Medium risk
          </span>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            ["23", "Direct callers"],
            ["142", "Transitive reach"],
            ["8", "Co-changed files"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-4">
              <p className="text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </Card>
    ),
  },
  {
    kicker: "07 / sessions",
    title: "Make investigation reusable.",
    subtitle:
      "Save the questions, findings, and files explored so a teammate can continue without starting over.",
    content: (
      <Card className="w-full max-w-3xl overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <p className="text-xs uppercase tracking-widest text-slate-400">Trace sessions</p>
          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-medium">Recent investigations</h3>
            <span className="text-xs text-emerald-600">3 saved</span>
          </div>
        </div>
        {["Auth migration review", "Graph cleanup plan", "Release risk check"].map((item, i) => (
          <div
            key={item}
            className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-medium">
              0{i + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item}</p>
              <p className="mt-1 text-xs text-slate-400">trace-web · main · {i + 2} findings</p>
            </div>
            <Check className="size-4 text-emerald-500" />
          </div>
        ))}
      </Card>
    ),
  },
  {
    kicker: "08 / analytics",
    title: "Turn code history into signals.",
    subtitle:
      "Spot complexity, risk, and velocity trends without leaving the repository workspace.",
    content: (
      <Card className="w-full max-w-3xl p-7">
        <div className="flex justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Code health</p>
            <h3 className="mt-2 text-xl font-medium">Risk trend · last 30 days</h3>
          </div>
          <BarChart3 className="size-5 text-slate-400" />
        </div>
        <div className="mt-10 flex h-40 items-end gap-3 border-b border-l border-slate-200 px-4">
          {[35, 48, 40, 62, 55, 76, 68, 88, 72, 94, 80, 84].map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-emerald-400/70"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between text-xs text-slate-400">
          <span>Aug 08</span>
          <span>Sep 06</span>
        </div>
      </Card>
    ),
  },
  {
    kicker: "09 / trustworthy workflow",
    title: "Evidence first. Suggestions second.",
    subtitle:
      "TraceAI keeps graph findings, repository context, and AI reasoning visible so developers can verify before acting.",
    content: (
      <div className="grid w-full max-w-3xl gap-3 md:grid-cols-3">
        <Card className="p-5">
          <Terminal className="mb-7 size-5 text-slate-500" />
          <p className="font-medium">Entire Graph</p>
          <p className="mt-2 text-sm text-slate-500">Structural evidence from the repository.</p>
        </Card>
        <Card className="p-5">
          <GitBranch className="mb-7 size-5 text-slate-500" />
          <p className="font-medium">Git history</p>
          <p className="mt-2 text-sm text-slate-500">Branch and commit context for changes.</p>
        </Card>
        <Card className="p-5">
          <Sparkles className="mb-7 size-5 text-slate-500" />
          <p className="font-medium">AI guidance</p>
          <p className="mt-2 text-sm text-slate-500">Ideas grounded in the evidence above.</p>
        </Card>
      </div>
    ),
  },
  {
    kicker: "10 / the outcome",
    title: "From question to confident change.",
    subtitle: "TraceAI gives every developer a clearer path through a complex codebase.",
    content: (
      <Card className="w-full max-w-3xl bg-slate-950 p-8 text-white">
        <div className="flex items-center gap-3 text-sm text-white/60">
          <CircleDot className="size-4 text-emerald-400" /> trace-your-code-companion <span>/</span>{" "}
          main
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["01", "Connect", "Bring a repository into focus."],
            ["02", "Understand", "Ask and inspect with context."],
            ["03", "Ship", "Change with a smaller blast radius."],
          ].map(([number, title, copy]) => (
            <div key={number}>
              <p className="text-xs text-emerald-400">{number}</p>
              <h3 className="mt-3 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">{copy}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-sm text-white/45">TraceAI · Think better with your code.</p>
      </Card>
    ),
  },
];

function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];
  const next = () => setCurrentSlide((index) => Math.min(index + 1, slides.length - 1));
  const prev = () => setCurrentSlide((index) => Math.max(index - 1, 0));

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 md:px-12 md:py-10">
        <header className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TraceAI" className="size-8 rounded-lg object-cover" />
            <span className="font-semibold tracking-tight">TraceAI</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Product walkthrough</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </header>
        <main className="flex flex-1 flex-col justify-center py-12 md:py-16">
          <div className="mx-auto w-full max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
              {slide.kicker}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-medium leading-tight tracking-[-0.04em] md:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
              {slide.subtitle}
            </p>
            <div className="mt-12 flex min-h-[300px] items-center justify-center">
              {slide.content}
            </div>
          </div>
        </main>
        <footer className="flex items-center justify-between border-t border-slate-200 pt-5">
          <div className="flex gap-1.5">
            {slides.map((item, index) => (
              <button
                type="button"
                aria-label={`Go to page ${index + 1}`}
                key={item.kicker}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === currentSlide ? "w-9 bg-slate-950" : "w-2 bg-slate-300",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              disabled={currentSlide === 0}
              className="rounded-xl border-slate-200 bg-white"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              disabled={currentSlide === slides.length - 1}
              className="rounded-xl border-slate-200 bg-white"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
