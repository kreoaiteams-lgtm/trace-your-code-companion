import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Github, ArrowRight, Zap, Shield, BarChart3, Network } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — TraceAI" },
      { name: "description", content: "Connect your GitHub account to get started with TraceAI." },
    ],
  }),
  component: LoginPage,
});

const features = [
  {
    icon: Network,
    title: "Dependency Graph",
    description: "Visualize your entire codebase architecture at a glance",
    color: "text-blue-400",
  },
  {
    icon: Shield,
    title: "Impact Analysis",
    description: "Understand the blast radius of every change you make",
    color: "text-emerald-400",
  },
  {
    icon: BarChart3,
    title: "Code Analytics",
    description: "Track code health, complexity, and team velocity",
    color: "text-purple-400",
  },
  {
    icon: Zap,
    title: "AI Insights",
    description: "Get intelligent suggestions powered by your code context",
    color: "text-amber-400",
  },
];

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleGitHubLogin = () => {
    setIsConnecting(true);
    // Simulate GitHub OAuth flow
    setTimeout(() => {
      login({
        name: "Alex Kim",
        username: "alexbuilds",
      });
      navigate({ to: "/connect" });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-foreground text-background relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo.png" alt="TraceAI" className="size-10 rounded-lg object-cover invert" />
            <span className="text-2xl font-medium tracking-tight">TraceAI</span>
          </div>
          <p className="text-background/60 text-sm mt-1">Understand your code. Ship with confidence.</p>
        </div>

        <div className="relative z-10 space-y-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex items-start gap-4 group">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background/10 transition-colors group-hover:bg-background/15">
                  <Icon className="size-5 text-background/80" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-background">{feature.title}</h3>
                  <p className="text-sm text-background/50 mt-0.5">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-10">
          <p className="text-xs text-background/40">
            © 2026 TraceAI · Privacy · Terms
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <img src="/logo.png" alt="TraceAI" className="size-8 rounded-md object-cover" />
            <span className="text-xl font-medium tracking-tight">TraceAI</span>
          </div>

          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connect your GitHub account to start tracing your repositories.
          </p>

          <div className="mt-8 space-y-3">
            <Button
              onClick={handleGitHubLogin}
              disabled={isConnecting}
              className="w-full gap-3 rounded-xl py-6 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-all"
            >
              {isConnecting ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                  Connecting to GitHub…
                </>
              ) : (
                <>
                  <Github className="size-5" />
                  Continue with GitHub
                  <ArrowRight className="size-4 ml-auto" />
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or connect with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              onClick={() => {
                // Entire.io integration placeholder
                setIsConnecting(true);
                setTimeout(() => {
                  login({ name: "Alex Kim", username: "alexbuilds" });
                  navigate({ to: "/connect" });
                }, 1500);
              }}
              disabled={isConnecting}
            >
              <Network className="size-4 text-blue-500" />
              Entire.io
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              onClick={() => {
                // Databricks integration placeholder
                setIsConnecting(true);
                setTimeout(() => {
                  login({ name: "Alex Kim", username: "alexbuilds" });
                  navigate({ to: "/connect" });
                }, 1500);
              }}
              disabled={isConnecting}
            >
              <Zap className="size-4 text-red-500" />
              Databricks
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to TraceAI's{" "}
            <a href="#" className="underline underline-offset-2 hover:text-foreground">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
