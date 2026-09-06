import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Check,
  CircleHelp,
  Github,
  Home,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  X,
  BarChart3,
  Shield,
  Clock,
  Network,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Explore", icon: Network, href: "/explore" },
  { label: "Impact", icon: Shield, href: "/impact" },
  { label: "Sessions", icon: Clock, href: "/sessions" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
];

const repositories = [
  { name: "trace-web", language: "TypeScript", color: "bg-repo-blue" },
  { name: "signal-api", language: "Python", color: "bg-repo-green" },
  { name: "design-system", language: "CSS", color: "bg-repo-pink" },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [connected, setConnected] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mesh-bg min-h-screen text-foreground flex">
      <aside
        className={cn(
          "glass-sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col px-4 py-5 transition-transform duration-300 ease-out lg:translate-x-0 bg-sidebar border-r border-sidebar-border",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-10 items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg shadow-sm">
              <img src="/logo.png" alt="TraceAI Logo" className="size-6 rounded object-cover" />
            </div>
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
            const isActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href));
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal transition-all duration-200",
                  isActive
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

        <div className="mt-auto border-t border-border pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-lg px-2 font-normal"
          >
            <Avatar className="size-8 border-2 border-border shadow-sm">
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

      <div className="flex-1 lg:pl-64 w-full flex flex-col">
        <header className="glass sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between px-5 md:px-8 border-b border-border/40 backdrop-blur-md">
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
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Help">
              <CircleHelp className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto w-full relative">
          {children}
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
