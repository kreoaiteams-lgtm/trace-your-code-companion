import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Archive,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileSearch,
  HelpCircle,
  Pause,
  Play,
  Search,
  Share2,
  Sparkles,
  Tag,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  mockSessions,
  getSeverityColor,
  type TraceSession,
  type SessionFinding,
} from "@/lib/mock-data";
import { readTraceSessions, updateTraceSession } from "@/lib/trace-store";

export const Route = createFileRoute("/sessions")({
  head: () => ({
    meta: [
      { title: "Session Manager — TraceAI" },
      {
        name: "description",
        content: "Manage your code exploration sessions powered by Entire Checkpoints.",
      },
    ],
  }),
  component: SessionManager,
});

const statusConfig: Record<
  string,
  { icon: typeof Play; label: string; color: string; bg: string }
> = {
  active: { icon: Play, label: "Active", color: "text-emerald-600", bg: "bg-emerald-100" },
  paused: { icon: Pause, label: "Paused", color: "text-amber-600", bg: "bg-amber-100" },
  completed: { icon: CheckCircle2, label: "Completed", color: "text-blue-600", bg: "bg-blue-100" },
  shared: { icon: Share2, label: "Shared", color: "text-purple-600", bg: "bg-purple-100" },
};

const fallbackStatus = {
  icon: Play,
  label: "Active",
  color: "text-emerald-600",
  bg: "bg-emerald-100",
};

function FindingCard({ finding }: { finding: SessionFinding }) {
  const typeIcons: Record<string, typeof Sparkles> = {
    risk: Sparkles,
    insight: BookOpen,
    suggestion: HelpCircle,
    warning: Sparkles,
  };
  const Icon = typeIcons[finding.type] || Sparkles;

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: getSeverityColor(finding.severity) + "18" }}
        >
          <Icon className="size-4" style={{ color: getSeverityColor(finding.severity) }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">{finding.title}</h4>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize text-white"
              style={{ backgroundColor: getSeverityColor(finding.severity) }}
            >
              {finding.severity}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {finding.description}
          </p>
          {finding.affectedFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {finding.affectedFiles.map((file) => (
                <span key={file} className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono">
                  {file.split("/").pop()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SessionManager() {
  const [selectedSession, setSelectedSession] = useState<TraceSession | null>(null);
  const [sessions, setSessions] = useState<TraceSession[]>(() => readTraceSessions());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const refresh = () => setSessions(readTraceSessions());
    window.addEventListener("traceai:sessions-updated", refresh);
    return () => window.removeEventListener("traceai:sessions-updated", refresh);
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const createNewTrace = () => {
    const title = window.prompt("Name this trace session", "New codebase investigation");
    if (!title?.trim()) return;
    const session: TraceSession = {
      id: `trace-${Date.now()}`,
      title: title.trim(),
      description: "New trace session ready for investigation.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "You",
      authorAvatar: "YO",
      status: "active",
      filesExplored: [],
      questionsAsked: [],
      findings: [],
      checkpointId: `ckpt-local-${Date.now().toString(36)}`,
      tags: ["trace"],
    };
    const next = [session, ...readTraceSessions()];
    window.localStorage.setItem("traceai.sessions.v1", JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("traceai:sessions-updated"));
    setSelectedSession(session);
  };

  const shareSession = async () => {
    if (!selectedSession) return;
    const shareText = `TraceAI checkpoint ${selectedSession.checkpointId}: ${selectedSession.title}`;
    if (navigator.clipboard) await navigator.clipboard.writeText(shareText);
    window.alert("Checkpoint reference copied to your clipboard.");
  };

  const resumeSession = () => {
    if (!selectedSession) return;
    const updated = updateTraceSession(selectedSession.id, { status: "active" });
    if (updated) setSelectedSession(updated);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sessions List */}
      <div className="w-96 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium">Trace Sessions</h2>
            <Button size="sm" className="gap-1.5" onClick={createNewTrace}>
              <Sparkles className="size-3.5" />
              New Trace
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
            {["all", "active", "paused", "completed", "shared"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "flex-1 rounded px-2 py-1.5 text-xs font-medium capitalize transition-colors",
                  filterStatus === status
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredSessions.map((session) => {
            const status = statusConfig[session.status] ?? fallbackStatus;
            const StatusIcon = status.icon;

            return (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-4 text-left transition-colors border-b border-border/50 hover:bg-muted/50",
                  selectedSession?.id === session.id && "bg-accent",
                )}
              >
                <Avatar className="size-9 border border-border mt-0.5">
                  <AvatarFallback className="bg-avatar text-xs font-semibold text-avatar-foreground">
                    {session.authorAvatar}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium truncate">{session.title}</h3>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {session.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <span
                      className={cn(
                        "flex items-center gap-1 text-[11px] font-medium",
                        status.color,
                      )}
                    >
                      <StatusIcon className="size-3" />
                      {status.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatDate(session.updatedAt)}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <FileSearch className="size-3" />
                      {session.filesExplored.length} files
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Session Detail */}
      <div className="flex-1 overflow-y-auto">
        {!selectedSession ? (
          <div className="flex items-center justify-center h-full text-center px-8">
            <div>
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted">
                <Archive className="size-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-medium">Session Manager</h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Each trace session captures your exploration path — files visited, questions asked,
                and findings discovered. Sessions are backed by Entire Checkpoints for seamless
                handoff.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-8">
            {/* Session Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const status = statusConfig[selectedSession.status] ?? fallbackStatus;
                    const StatusIcon = status.icon;
                    return (
                      <span
                        className={cn(
                          "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          status.bg,
                          status.color,
                        )}
                      >
                        <StatusIcon className="size-3" />
                        {status.label}
                      </span>
                    );
                  })()}
                  <span className="text-xs text-muted-foreground">
                    Checkpoint:{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded">
                      {selectedSession.checkpointId}
                    </code>
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-medium">{selectedSession.title}</h2>
                <p className="mt-1 text-muted-foreground">{selectedSession.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={shareSession}>
                  <Share2 className="size-4" />
                  Share
                </Button>
                <Button className="gap-2" onClick={resumeSession}>
                  <Play className="size-4" />
                  Resume
                </Button>
              </div>
            </div>

            {/* Session Meta */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Author</span>
                </div>
                <p className="font-medium text-sm">{selectedSession.author}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Started</span>
                </div>
                <p className="font-medium text-sm">{formatDate(selectedSession.createdAt)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileSearch className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Files Explored</span>
                </div>
                <p className="font-medium text-sm">{selectedSession.filesExplored.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Findings</span>
                </div>
                <p className="font-medium text-sm">{selectedSession.findings.length}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-6">
              <Tag className="size-4 text-muted-foreground" />
              {selectedSession.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Files Explored */}
            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <h3 className="font-serif text-lg font-medium mb-4 flex items-center gap-2">
                <FileSearch className="size-5" />
                Files Explored
              </h3>
              <div className="space-y-1">
                {selectedSession.filesExplored.map((file, i) => (
                  <div
                    key={file}
                    className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted/50 transition-colors"
                  >
                    <span className="flex size-6 items-center justify-center rounded text-xs font-medium bg-muted text-muted-foreground">
                      {i + 1}
                    </span>
                    <code className="text-sm font-mono">{file}</code>
                    <ChevronRight className="size-3 ml-auto text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            {/* Questions Asked */}
            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <h3 className="font-serif text-lg font-medium mb-4 flex items-center gap-2">
                <HelpCircle className="size-5" />
                Questions Asked
              </h3>
              <div className="space-y-3">
                {selectedSession.questionsAsked.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      Q
                    </div>
                    <p className="text-sm">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings */}
            <div className="mb-6">
              <h3 className="font-serif text-lg font-medium mb-4 flex items-center gap-2">
                <Sparkles className="size-5" />
                Findings ({selectedSession.findings.length})
              </h3>
              <div className="space-y-3">
                {selectedSession.findings.map((finding, i) => (
                  <FindingCard key={i} finding={finding} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
