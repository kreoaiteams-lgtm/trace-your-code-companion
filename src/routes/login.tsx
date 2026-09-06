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
    navigate({ to: "/connect" });
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
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] shadow-2xl shadow-white/5">
            <img src="/logo.png" alt="" className="size-9 rounded-lg object-cover invert" />
          </div>
          <h1 className="text-3xl font-medium tracking-tight">TraceAI</h1>
        </div>

        <section className="rounded-2xl border border-white/12 bg-white/[0.045] p-6 shadow-2xl shadow-black/40">
          <div className="mb-6">
            <h2 className="text-lg font-medium">Sign in</h2>
            <p className="mt-1 text-sm text-white/50">Continue to your code workspace.</p>
          </div>

          <Button
            type="button"
            onClick={handleGitHubLogin}
            disabled={isConnecting}
            className="h-12 w-full gap-3 rounded-xl bg-white text-black hover:bg-white/90"
          >
            {isConnecting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Github className="size-5" />
            )}
            {isConnecting ? "Connecting…" : "Continue with GitHub"}
            {!isConnecting && <ArrowRight className="ml-auto size-4" />}
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-white/35">
            <div className="h-px flex-1 bg-white/10" />
            <span>or continue with email</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleManualLogin} className="space-y-4">
            <label className="block text-sm text-white/70">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 h-11 w-full rounded-xl border border-white/12 bg-black/40 px-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/40"
              />
            </label>
            <label className="block text-sm text-white/70">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="mt-2 h-11 w-full rounded-xl border border-white/12 bg-black/40 px-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/40"
              />
            </label>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-white/10 text-white hover:bg-white/15"
            >
              Sign in with email
            </Button>
          </form>
        </section>

        <p className="mt-6 text-center text-xs text-white/35">
          TraceAI · Understand your code. Ship with confidence.
        </p>
      </div>
    </main>
  );
}
