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
  Network,
  Zap,
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
    const parts = repoUrl.replace(/\.git$/, "").replace(/\/$/, "").split("/");
    const name = parts[parts.length - 1] || "unknown-repo";
    handleConnect(name);
  };

  const isValidUrl =
    repoUrl.trim().startsWith("https://github.com/") && repoUrl.trim().length > 20;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-gray-900 px-6">
      <div className="w-full max-w-2xl py-16">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/logo.png" alt="TraceAI" className="size-10 rounded-xl object-cover" />
          <span className="text-2xl font-medium tracking-tight text-gray-900">TraceAI</span>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Connect a repository
        </h1>
        <p className="mt-2 text-gray-500">
          Choose how you want to connect your codebase to TraceAI.
        </p>

        {/* Steps */}
        <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
          {["Connect repo", "Build graph", "Start exploring"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                i === 0 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
              )}>
                {i + 1}
              </div>
              <span className={i === 0 ? "text-gray-900 font-medium" : ""}>{step}</span>
            </div>
          ))}
        </div>

        {/* Tab selector */}
        <div className="mt-10 flex items-center gap-1 rounded-xl bg-gray-100 p-1 w-fit">
          <button
            onClick={() => setActiveTab("url")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all",
              activeTab === "url"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            <Link2 className="size-4" />
            Paste URL
          </button>
          <button
            onClick={() => setActiveTab("repos")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all",
              activeTab === "repos"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            <Github className="size-4" />
            Your Repos
          </button>
        </div>

        {/* URL Tab */}
        {activeTab === "url" && (
          <div className="mt-6 space-y-4 fade-in">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="size-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900">Public repository URL</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4">
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
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
                    disabled={isConnecting}
                  />
                  {isValidUrl && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500" />
                  )}
                </div>
                <Button
                  onClick={handleUrlSubmit}
                  disabled={!isValidUrl || isConnecting}
                  className="rounded-xl px-6 gap-2 bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
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
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
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
          <div className="mt-6 space-y-3 fade-in">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your repositories…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
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
                    "w-full rounded-2xl border bg-white p-4 text-left transition-all hover:shadow-md group",
                    isConnecting && connectedRepo === repo.name
                      ? "border-gray-900/20 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-gray-100">
                        <FolderGit2 className="size-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {repo.name}
                          </span>
                          {repo.isPrivate ? (
                            <span className="flex items-center gap-1 rounded-full border border-gray-200 px-1.5 py-0.5 text-[10px] text-gray-400">
                              <Lock className="size-2.5" /> Private
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full border border-gray-200 px-1.5 py-0.5 text-[10px] text-gray-400">
                              <Globe className="size-2.5" /> Public
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {repo.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {isConnecting && connectedRepo === repo.name ? (
                        <Loader2 className="size-5 animate-spin text-gray-900" />
                      ) : (
                        <ArrowRight className="size-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 pl-[52px]">
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
                <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                  <Search className="size-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    No repositories matching "{search}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-gray-400">
          Signed in as <span className="font-medium text-gray-600">@{user?.username}</span> · TraceAI
        </p>
      </div>
    </div>
  );
}
