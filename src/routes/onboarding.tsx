import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "@/components/AuthProvider";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Welcome to TraceAI" }],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }

    const timer = window.setTimeout(() => navigate({ to: "/connect" }), 1400);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="text-center">
        <img
          src="/logo.png"
          alt=""
          className="mx-auto mb-6 size-14 rounded-2xl object-cover invert"
        />
        <h1 className="text-3xl font-medium tracking-tight">
          Hi {user?.username || "there"}, welcome to Trace.
        </h1>
      </div>
    </main>
  );
}
