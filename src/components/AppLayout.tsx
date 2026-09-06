import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Menu,
  MoreHorizontal,
  Plus,
  X,
  BarChart3,
  Shield,
  Clock,
  Network,
  LogOut,
  Settings,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Impact", icon: Shield, href: "/impact" },
  { label: "Sessions", icon: Clock, href: "/sessions" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
];



export function AppLayout({ children }: { children: ReactNode }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    user,
    logout,
    activeRepo,
    setActiveRepo,
    conversations,
    activeConversation,
    setActiveConversation,
    addConversation,
  } = useAuth();

  return (
    <div className="mesh-bg min-h-screen text-foreground flex">
      <aside
        className={cn(
          "glass-sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col px-4 py-5 transition-transform duration-300 ease-out lg:translate-x-0 bg-sidebar border-r border-sidebar-border",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center px-2 mb-2">
          <h2 className="font-sans text-2xl font-bold tracking-tighter">trace</h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden absolute top-4 right-3 hover:bg-muted size-8"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="space-y-0.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href));
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
              onClick={() => window.location.assign("/connect")}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <div className="space-y-0.5">
            {Object.keys(conversations).map((repoName, i) => {
              const isActive = activeRepo === repoName;
              const colors = ["bg-repo-blue", "bg-repo-green", "bg-repo-pink", "bg-foreground"];
              const color = colors[i % colors.length];
              
              return (
                <div key={repoName} className="space-y-0.5">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveRepo(repoName)}
                    className={cn(
                      "w-full justify-start gap-2 rounded-lg px-3 font-normal text-sm transition-all duration-200",
                      isActive
                        ? "bg-muted text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span className={cn("size-2.5 rounded-full shadow-sm", color)} />
                    <span className="truncate">{repoName}</span>
                    <ChevronDown
                      className={cn(
                        "ml-auto size-3.5 transition-transform",
                        isActive && "rotate-180",
                      )}
                    />
                  </Button>
                  {isActive && (
                    <div className="ml-3 border-l border-border pl-2">
                      {(conversations[repoName] ?? []).map((conversation) => (
                        <button
                          type="button"
                          key={conversation}
                          onClick={() => setActiveConversation(conversation)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                            activeConversation === conversation
                              ? "bg-foreground/10 text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <MessageSquare className="size-3 shrink-0" />
                          <span className="truncate">{conversation}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => addConversation(repoName)}
                        className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Plus className="size-3" /> New conversation
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-auto border-t border-border pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 rounded-lg px-2 font-normal hover:bg-muted transition-all duration-200 group"
              >
                <Avatar className="size-8 border border-border shadow-sm group-hover:scale-105 transition-transform">
                  <AvatarFallback className="bg-foreground text-xs font-semibold text-background">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-medium">{user?.name || "User"}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    @{user?.username || "user"}
                  </span>
                </span>
                <MoreHorizontal className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="size-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={logout}
              >
                <LogOut className="size-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64 w-full flex flex-col">
        <main className="flex-1 overflow-auto w-full relative">{children}</main>
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
