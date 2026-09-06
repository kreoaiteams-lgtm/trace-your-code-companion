import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Github, ArrowRight, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — TraceAI" },
      { name: "description", content: "Sign in to TraceAI and start exploring your code." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  const finishLogin = (name: string, username: string) => {
    login({ name, username });
    navigate({ to: "/onboarding" });
  };

  const handleGitHubLogin = () => {
    setError("");
    setIsConnecting(true);
    // Replace this simulated provider flow with GitHub OAuth when credentials are connected.
    setTimeout(() => finishLogin("Alex Kim", "alexbuilds"), 700);
  };

  const handleManualLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    const username = email.split("@")[0] || "trace-user";
    finishLogin(email.split("@")[0] || "Trace user", username);
  };

  return (
    <main className="flex min-h-screen bg-white text-slate-950">
      <section className="relative hidden flex-1 overflow-hidden border-r border-slate-200 bg-slate-50 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-slate-200/60 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <img src="/logo.png" alt="TraceAI" className="size-10 rounded-xl object-cover" />
          <span className="text-2xl font-semibold tracking-tight">TraceAI</span>
        </div>
        <div className="relative max-w-lg">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            Codebase intelligence
          </p>
          <h1 className="text-6xl font-medium leading-[1.02] tracking-[-0.05em]">
            Understand your code. Ship with confidence.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-500">
            Explore repositories, ask better questions, and find the safest path through complex
            code.
          </p>
        </div>
        <p className="relative text-xs text-slate-400">TraceAI · Private by design</p>
      </section>

      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-[46%]">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-3">
              <img src="/logo.png" alt="TraceAI" className="size-9 rounded-lg object-cover" />
              <span className="text-xl font-semibold tracking-tight">TraceAI</span>
            </div>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Continue to your code workspace.</p>
          </div>

          <Button
            type="button"
            onClick={handleGitHubLogin}
            disabled={isConnecting}
            className="h-12 w-full gap-3 rounded-xl bg-slate-950 text-white hover:bg-slate-800"
          >
            {isConnecting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Github className="size-5" />
            )}
            {isConnecting ? "Connecting…" : "Continue with GitHub"}
            {!isConnecting && <ArrowRight className="ml-auto size-4" />}
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            <span>or continue with email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleManualLogin} className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-slate-100 text-slate-950 hover:bg-slate-200"
            >
              Sign in with email
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">TraceAI · Private by design</p>
        </div>
      </section>
    </main>
  );
}
