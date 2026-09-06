import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Github,
  Link2,
  ArrowRight,
  FolderGit2,
  Star,
  GitFork,
  Search,
  Loader2,
  CheckCircle2,
  Globe,
  Lock,
} from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Connect a Repository — TraceAI" },
      {
        name: "description",
        content:
          "Paste a public repo URL or pick from your GitHub repositories to start analyzing.",
      },
    ],
  }),
  component: ConnectRepoPage,
});

// Some realistic sample repos for the "Your Repos" list
const mockUserRepos = [
  {
    name: "trace-web",
    fullName: "alexbuilds/trace-web",
    description: "Main TraceAI web application",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 42,
    forks: 8,
    isPrivate: false,
    updatedAt: "2 hours ago",
  },
  {
    name: "signal-api",
    fullName: "alexbuilds/signal-api",
    description: "Real-time signal processing API",
    language: "Go",
    languageColor: "#00ADD8",
    stars: 128,
    forks: 23,
    isPrivate: false,
    updatedAt: "1 day ago",
  },
  {
    name: "design-system",
    fullName: "alexbuilds/design-system",
    description: "Shared component library and design tokens",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 15,
    forks: 3,
    isPrivate: true,
    updatedAt: "3 days ago",
  },
  {
    name: "ml-pipeline",
    fullName: "alexbuilds/ml-pipeline",
    description: "End-to-end ML training and serving pipeline",
    language: "Python",
    languageColor: "#3572A5",
    stars: 67,
    forks: 12,
    isPrivate: false,
    updatedAt: "1 week ago",
  },
  {
    name: "infra-configs",
    fullName: "alexbuilds/infra-configs",
    description: "Terraform and K8s configurations",
    language: "HCL",
    languageColor: "#844FBA",
    stars: 4,
    forks: 1,
    isPrivate: true,
    updatedAt: "2 weeks ago",
  },
];

function ConnectRepoPage() {
  const { isAuthenticated, user, setActiveRepo } = useAuth();
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [search, setSearch] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedRepo, setConnectedRepo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"url" | "repos">("url");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const filteredRepos = mockUserRepos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      repo.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleConnect = (repoName: string) => {
    setIsConnecting(true);
    setConnectedRepo(repoName);
    setTimeout(() => {
      setActiveRepo(repoName);
      navigate({ to: "/" });
    }, 1800);
  };

  const handleUrlSubmit = () => {
    if (!repoUrl.trim()) return;
    // Extract repo name from URL
    const parts = repoUrl
      .replace(/\.git$/, "")
      .replace(/\/$/, "")
      .split("/");
    const name = parts[parts.length - 1] || "unknown-repo";
    handleConnect(name);
  };

  const isValidUrl =
    repoUrl.trim().startsWith("https://github.com/") && repoUrl.trim().length > 20;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[420px] flex-col justify-between p-12 bg-foreground text-background relative overflow-hidden shrink-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/logo.png"
              alt="TraceAI"
              className="size-10 rounded-lg object-cover invert"
            />
            <span className="text-2xl font-medium tracking-tight">TraceAI</span>
          </div>
          <p className="text-background/60 text-sm mt-1">
            Connect a repository to unlock codebase intelligence.
          </p>
        </div>

        <div className="relative z-10 space-y-8">
          {[
            {
              step: "1",
              title: "Connect your repo",
              desc: "Paste a public URL or select from your GitHub repos",
            },
            {
              step: "2",
              title: "We build the graph",
              desc: "TraceAI maps every function, file, and dependency",
            },
            {
              step: "3",
              title: "Start exploring",
              desc: "Ask questions, run impact analysis, trace sessions",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 group">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background/10 text-sm font-semibold text-background/80">
                {item.step}
              </div>
              <div>
                <h3 className="text-sm font-medium text-background">{item.title}</h3>
                <p className="text-sm text-background/50 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-xs text-background/40">
            Signed in as{" "}
            <span className="text-background/60 font-medium">@{user?.username}</span>
          </p>
        </div>
      </div>

      {/* Right panel — repo connection */}
      <div className="flex flex-1 flex-col px-6 py-10 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          {/* Mobile header */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/logo.png" alt="TraceAI" className="size-8 rounded-md object-cover" />
            <span className="text-xl font-medium tracking-tight">TraceAI</span>
          </div>

          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Connect a repository
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose how you want to connect your codebase to TraceAI.
          </p>

          {/* Tab selector */}
          <div className="mt-8 flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1 w-fit">
            <button
              onClick={() => setActiveTab("url")}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                activeTab === "url"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Link2 className="size-4" />
              Paste URL
            </button>
            <button
              onClick={() => setActiveTab("repos")}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                activeTab === "repos"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Github className="size-4" />
              Your Repos
            </button>
          </div>

          {/* URL Tab */}
          {activeTab === "url" && (
            <div className="mt-6 space-y-4 fade-in">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-foreground">Public repository URL</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Paste a GitHub repository URL to start analyzing. Works with any public repo.
                </p>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="url"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && isValidUrl && handleUrlSubmit()}
                      placeholder="https://github.com/owner/repository"
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
                      disabled={isConnecting}
                    />
                    {isValidUrl && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500" />
                    )}
                  </div>
                  <Button
                    onClick={handleUrlSubmit}
                    disabled={!isValidUrl || isConnecting}
                    className="rounded-lg px-6 gap-2 bg-foreground text-background hover:bg-foreground/90"
                  >
                    {isConnecting && connectedRepo ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Connecting…
                      </>
                    ) : (
                      <>
                        Connect
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "https://github.com/facebook/react",
                    "https://github.com/vercel/next.js",
                    "https://github.com/denoland/deno",
                  ].map((url) => (
                    <button
                      key={url}
                      onClick={() => setRepoUrl(url)}
                      className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {url.split("/").slice(-2).join("/")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Repos Tab */}
          {activeTab === "repos" && (
            <div className="mt-6 space-y-4 fade-in">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your repositories…"
                  className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
                />
              </div>

              {/* Repo list */}
              <div className="space-y-2">
                {filteredRepos.map((repo) => (
                  <button
                    key={repo.name}
                    onClick={() => handleConnect(repo.name)}
                    disabled={isConnecting}
                    className={cn(
                      "w-full rounded-xl border bg-card p-4 text-left transition-all hover:bg-accent/30 hover:shadow-md group",
                      isConnecting && connectedRepo === repo.name
                        ? "border-foreground/30 bg-accent/20"
                        : "border-border/60",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50">
                          <FolderGit2 className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {repo.name}
                            </span>
                            {repo.isPrivate ? (
                              <span className="flex items-center gap-1 rounded-full border border-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                <Lock className="size-2.5" /> Private
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 rounded-full border border-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                <Globe className="size-2.5" /> Public
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {repo.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {isConnecting && connectedRepo === repo.name ? (
                          <Loader2 className="size-5 animate-spin text-foreground" />
                        ) : (
                          <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground pl-[52px]">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: repo.languageColor }}
                        />
                        {repo.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="size-3" /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="size-3" /> {repo.forks}
                      </span>
                      <span>Updated {repo.updatedAt}</span>
                    </div>
                  </button>
                ))}

                {filteredRepos.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
                    <Search className="size-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No repositories matching "{search}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
