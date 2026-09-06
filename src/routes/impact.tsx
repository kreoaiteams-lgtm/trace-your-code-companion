import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  FileCode,
  Flame,
  GitBranch,
  Loader2,
  Network,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  mockImpactReports,
  getRiskColor,
  getRiskLabel,
  type GraphNode,
  type ImpactReport,
} from "@/lib/mock-data";
import { entireGraphData } from "@/lib/entire-graph-data";
import { createTraceSession } from "@/lib/trace-store";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact Analyzer — TraceAI" },
      {
        name: "description",
        content: "Analyze the blast radius of code changes and generate risk reports.",
      },
    ],
  }),
  component: ImpactAnalyzer,
});

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    safe: "bg-emerald-100 text-emerald-700 border-emerald-200",
    moderate: "bg-blue-100 text-blue-700 border-blue-200",
    high: "bg-amber-100 text-amber-700 border-amber-200",
    critical: "bg-red-100 text-red-700 border-red-200",
  };

  const icons: Record<string, typeof ShieldCheck> = {
    safe: ShieldCheck,
    moderate: Shield,
    high: ShieldAlert,
    critical: Flame,
  };

  const Icon = icons[severity] || Shield;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
        styles[severity],
      )}
    >
      <Icon className="size-3" />
      {severity}
    </span>
  );
}

function ImpactAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<ImpactReport | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["direct", "transitive", "callers", "callees", "cochanges"]),
  );
  const [checkpointSaved, setCheckpointSaved] = useState(false);

  // Live Entire Graph state
  const [symbolQuery, setSymbolQuery] = useState("");
  const [liveGraphData, setLiveGraphData] = useState<any | null>(null);
  const [liveGraphLoading, setLiveGraphLoading] = useState(false);
  const [liveGraphError, setLiveGraphError] = useState<string | null>(null);

  const filteredFiles = entireGraphData.nodes
    .filter(
      (n) =>
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.path.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => b.riskScore - a.riskScore);

  const runLiveGraphAnalysis = async (symbol: string) => {
    if (!symbol.trim()) return;
    setLiveGraphLoading(true);
    setLiveGraphError(null);
    setLiveGraphData(null);

    try {
      const res = await fetch(`/api/graph-impact?symbol=${encodeURIComponent(symbol)}`);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLiveGraphData(data);
    } catch (err) {
      console.error("Live graph analysis failed:", err);
      setLiveGraphError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLiveGraphLoading(false);
    }
  };

  const analyzeFile = (node: GraphNode) => {
    setSelectedFile(node.id);
    setCheckpointSaved(false);

    // Also trigger a live graph analysis for the file's main symbol
    const symbolName = node.label.replace(/\.\w+$/, "");
    setSymbolQuery(symbolName);
    runLiveGraphAnalysis(symbolName);

    const existing = mockImpactReports.find((r) => r.targetFile === node.path);
    if (existing) {
      setActiveReport(existing);
      return;
    }

    const deps = entireGraphData.nodes.filter((candidate) =>
      entireGraphData.edges.some((edge) => edge.source === candidate.id && edge.target === node.id),
    );
    const transitive = new Set<string>();
    const visited = new Set<string>();

    function collectTransitive(id: string) {
      if (visited.has(id)) return;
      visited.add(id);
      const dts = entireGraphData.nodes.filter((candidate) =>
        entireGraphData.edges.some((edge) => edge.source === candidate.id && edge.target === id),
      );
      dts.forEach((d) => {
        transitive.add(d.path);
        collectTransitive(d.id);
      });
    }

    deps.forEach((d) => collectTransitive(d.id));

    const report: ImpactReport = {
      targetFile: node.path,
      riskScore: node.riskScore,
      blastRadius: deps.length + transitive.size,
      directDependents: deps.map((d) => d.path),
      transitiveDependents: Array.from(transitive),
      affectedTests: [`${node.label.replace(/\.\w+$/, "")}.test.ts`],
      suggestions: [
        node.riskScore > 60
          ? "Consider adding integration tests before modifying"
          : "Low-risk change — proceed with standard review",
        node.dependentCount > 10
          ? "High fan-out: changes here affect many consumers"
          : "Limited blast radius",
        node.complexity > 5
          ? "High complexity: consider refactoring before modification"
          : "Manageable complexity",
      ],
      severity:
        node.riskScore >= 75
          ? "critical"
          : node.riskScore >= 50
            ? "high"
            : node.riskScore >= 25
              ? "moderate"
              : "safe",
      createdAt: new Date().toISOString(),
    };

    setActiveReport(report);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const saveCheckpoint = () => {
    if (!activeReport) return;
    createTraceSession({
      title: `Impact review: ${activeReport.targetFile.split("/").pop()}`,
      description: `Risk ${activeReport.riskScore}/100 with a blast radius of ${activeReport.blastRadius} files.`,
      filesExplored: [
        activeReport.targetFile,
        ...activeReport.directDependents,
        ...activeReport.transitiveDependents,
      ],
      findings: activeReport.suggestions.map((suggestion, index) => ({
        type: index === 0 ? "risk" : "suggestion",
        title: index === 0 ? "Impact analysis completed" : "Recommended follow-up",
        description: suggestion,
        affectedFiles: [activeReport.targetFile],
        severity: activeReport.severity === "critical" ? "critical" : "medium",
      })),
      questionsAsked: [`What breaks if ${activeReport.targetFile} changes?`],
    });
    setCheckpointSaved(true);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* File List */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-serif text-lg font-medium mb-3">Select a target</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Live Symbol Search */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5 mb-2">
              <Network className="size-3.5 text-emerald-500" />
              <span className="text-[11px] font-semibold uppercase text-emerald-600 tracking-wider">Live Graph</span>
            </div>
            <div className="relative">
              <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search symbol (e.g. useAuth)..."
                value={symbolQuery}
                onChange={(e) => setSymbolQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runLiveGraphAnalysis(symbolQuery);
                }}
                className="w-full rounded-md border border-emerald-500/30 bg-emerald-500/5 py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredFiles.map((node) => (
            <button
              key={node.id}
              onClick={() => analyzeFile(node)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border/50 hover:bg-muted/50",
                selectedFile === node.id && "bg-accent",
              )}
            >
              <div
                className="flex size-8 items-center justify-center rounded-md"
                style={{ backgroundColor: getRiskColor(node.riskScore) + "18" }}
              >
                <FileCode className="size-4" style={{ color: getRiskColor(node.riskScore) }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{node.label}</p>
                <p className="text-xs text-muted-foreground truncate">{node.path}</p>
              </div>
              <div
                className="flex size-7 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: getRiskColor(node.riskScore) }}
              >
                {node.riskScore}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Report */}
      <div className="flex-1 overflow-y-auto">
        {!activeReport ? (
          <div className="flex items-center justify-center h-full text-center px-8">
            <div>
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted">
                <Target className="size-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-medium">Impact Analyzer</h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Select a file from the list to analyze its blast radius. TraceAI will map every
                dependency chain and calculate the risk of modifying it.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <SeverityBadge severity={activeReport.severity} />
                  <span className="text-xs text-muted-foreground">
                    Generated {new Date(activeReport.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-medium mt-2">{activeReport.targetFile}</h2>
                {activeReport.targetFunction && (
                  <p className="text-muted-foreground mt-1">
                    Function:{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                      {activeReport.targetFunction}
                    </code>
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={saveCheckpoint}
                disabled={checkpointSaved}
              >
                <Shield className="size-4" />
                {checkpointSaved ? "Checkpoint saved" : "Save as Checkpoint"}
              </Button>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Risk Score",
                  value: activeReport.riskScore,
                  color: getRiskColor(activeReport.riskScore),
                  suffix: "/100",
                },
                {
                  label: "Blast Radius",
                  value: activeReport.blastRadius,
                  color: "#6366f1",
                  suffix: " files",
                },
                {
                  label: "Direct Deps",
                  value: activeReport.directDependents.length,
                  color: "#f59e0b",
                  suffix: "",
                },
                {
                  label: "Affected Tests",
                  value: activeReport.affectedTests.length,
                  color: "#8b5cf6",
                  suffix: "",
                },
              ].map((card) => (
                <div key={card.label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="mt-1 text-3xl font-bold" style={{ color: card.color }}>
                    {card.value}
                    <span className="text-sm font-normal text-muted-foreground">{card.suffix}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Blast Radius Visualization */}
            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <h3 className="font-serif text-lg font-medium mb-4">Blast Radius Map</h3>
              <div className="flex items-center justify-center py-6">
                <div className="relative">
                  {/* Rings */}
                  {[180, 130, 80].map((r, i) => (
                    <div
                      key={r}
                      className="absolute rounded-full border-2 border-dashed"
                      style={{
                        width: r * 2,
                        height: r * 2,
                        left: `calc(50% - ${r}px)`,
                        top: `calc(50% - ${r}px)`,
                        borderColor: ["#fee2e2", "#fef3c7", "#dbeafe"][i],
                        backgroundColor: ["#fef2f2", "#fffbeb", "#eff6ff"][i],
                        opacity: 0.5,
                      }}
                    />
                  ))}

                  {/* Center node */}
                  <div
                    className="relative mx-auto flex size-12 items-center justify-center rounded-full text-white font-bold text-sm z-10"
                    style={{ backgroundColor: getRiskColor(activeReport.riskScore) }}
                  >
                    <Zap className="size-5" />
                  </div>

                  {/* Direct dependents */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {activeReport.directDependents.slice(0, 6).map((dep, i) => {
                      const angle =
                        (2 * Math.PI * i) / Math.min(activeReport.directDependents.length, 6);
                      const x = Math.cos(angle) * 80;
                      const y = Math.sin(angle) * 80;
                      return (
                        <div
                          key={dep}
                          className="absolute flex items-center justify-center size-8 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-700 text-[10px] font-bold z-10"
                          style={{ transform: `translate(${x}px, ${y}px)` }}
                          title={dep}
                        >
                          {dep.split("/").pop()?.charAt(0).toUpperCase()}
                        </div>
                      );
                    })}
                  </div>

                  {/* Transitive dependents */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {activeReport.transitiveDependents.slice(0, 8).map((dep, i) => {
                      const angle =
                        (2 * Math.PI * i) / Math.min(activeReport.transitiveDependents.length, 8) +
                        0.3;
                      const x = Math.cos(angle) * 140;
                      const y = Math.sin(angle) * 140;
                      return (
                        <div
                          key={dep}
                          className="absolute flex items-center justify-center size-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[9px] font-semibold z-10"
                          style={{ transform: `translate(${x}px, ${y}px)` }}
                          title={dep}
                        >
                          {dep.split("/").pop()?.charAt(0).toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-amber-300" /> Direct dependents
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-blue-200" /> Transitive
                </div>
              </div>
            </div>

            {/* Direct Dependents */}
            <div className="rounded-xl border border-border bg-card mb-4">
              <button
                className="flex w-full items-center justify-between p-4 text-left"
                onClick={() => toggleSection("direct")}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" />
                  <h3 className="font-medium">
                    Direct Dependents ({activeReport.directDependents.length})
                  </h3>
                </div>
                {expandedSections.has("direct") ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </button>
              {expandedSections.has("direct") && (
                <div className="border-t border-border px-4 pb-4">
                  {activeReport.directDependents.map((dep) => (
                    <div
                      key={dep}
                      className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                    >
                      <ArrowRight className="size-3 text-amber-500" />
                      <code className="text-sm font-mono">{dep}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transitive */}
            <div className="rounded-xl border border-border bg-card mb-4">
              <button
                className="flex w-full items-center justify-between p-4 text-left"
                onClick={() => toggleSection("transitive")}
              >
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-blue-500" />
                  <h3 className="font-medium">
                    Transitive Dependents ({activeReport.transitiveDependents.length})
                  </h3>
                </div>
                {expandedSections.has("transitive") ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </button>
              {expandedSections.has("transitive") && (
                <div className="border-t border-border px-4 pb-4">
                  {activeReport.transitiveDependents.map((dep) => (
                    <div
                      key={dep}
                      className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                    >
                      <ArrowRight className="size-3 text-blue-500" />
                      <code className="text-sm font-mono">{dep}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-serif text-lg font-medium mb-4">AI Suggestions</h3>
              <div className="space-y-3">
                {activeReport.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {i + 1}
                    </div>
                    <p className="text-sm text-foreground">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Entire Graph Section */}
            <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Network className="size-5 text-emerald-500" />
                <h3 className="font-serif text-lg font-medium">Live Entire Graph Analysis</h3>
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>

              {liveGraphLoading && (
                <div className="flex items-center gap-3 py-8 justify-center text-muted-foreground">
                  <Loader2 className="size-5 animate-spin text-emerald-500" />
                  <span className="text-sm">Querying Entire Graph engine…</span>
                </div>
              )}

              {liveGraphError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600">
                  <p className="font-medium">Graph query failed</p>
                  <p className="text-xs mt-1 text-red-500/80">{liveGraphError}</p>
                </div>
              )}

              {liveGraphData && !liveGraphLoading && (
                <div className="space-y-4">
                  {/* Focus Symbol */}
                  {liveGraphData.focus && (
                    <div className="rounded-lg bg-background border border-border p-4">
                      <p className="text-xs font-medium uppercase text-muted-foreground mb-1">Focus Symbol</p>
                      <code className="text-sm font-mono font-semibold text-foreground">{liveGraphData.focus.qualified_name || liveGraphData.focus.name}</code>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="bg-muted px-1.5 py-0.5 rounded">{liveGraphData.focus.kind}</span>
                        <span>{liveGraphData.focus.file_path}:{liveGraphData.focus.start_line}</span>
                        <span>{liveGraphData.focus.language}</span>
                      </div>
                    </div>
                  )}

                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Callers", value: liveGraphData.callers?.total ?? 0, color: "#f59e0b" },
                      { label: "Callees", value: liveGraphData.callees?.total ?? 0, color: "#6366f1" },
                      { label: "Co-Changes", value: liveGraphData.co_changes?.total ?? 0, color: "#8b5cf6" },
                      { label: "Type Users", value: liveGraphData.type_consumers?.total ?? 0, color: "#22c55e" },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-lg bg-background border border-border p-3 text-center">
                        <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                        <p className="text-[10px] uppercase font-medium text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Callers */}
                  {liveGraphData.callers?.entries?.length > 0 && (
                    <div className="rounded-lg border border-border bg-background">
                      <button className="flex w-full items-center justify-between p-3 text-left" onClick={() => toggleSection("callers")}>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="size-4 text-amber-500" />
                          <h4 className="text-sm font-medium">Who calls this ({liveGraphData.callers.total})</h4>
                        </div>
                        {expandedSections.has("callers") ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                      </button>
                      {expandedSections.has("callers") && (
                        <div className="border-t border-border px-3 pb-3">
                          {liveGraphData.callers.entries.map((entry: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                              <ArrowRight className="size-3 text-amber-500" />
                              <div className="min-w-0">
                                <code className="text-xs font-mono font-medium">{entry.endpoint?.name}</code>
                                {entry.endpoint?.file_path && (
                                  <p className="text-[10px] text-muted-foreground truncate">{entry.endpoint.file_path}:{entry.endpoint.start_line}</p>
                                )}
                              </div>
                              <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">depth {entry.depth}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Callees */}
                  {liveGraphData.callees?.entries?.length > 0 && (
                    <div className="rounded-lg border border-border bg-background">
                      <button className="flex w-full items-center justify-between p-3 text-left" onClick={() => toggleSection("callees")}>
                        <div className="flex items-center gap-2">
                          <Zap className="size-4 text-indigo-500" />
                          <h4 className="text-sm font-medium">What it calls ({liveGraphData.callees.total})</h4>
                        </div>
                        {expandedSections.has("callees") ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                      </button>
                      {expandedSections.has("callees") && (
                        <div className="border-t border-border px-3 pb-3">
                          {liveGraphData.callees.entries.map((entry: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                              <ArrowRight className="size-3 text-indigo-500" />
                              <div className="min-w-0">
                                <code className="text-xs font-mono font-medium">{entry.endpoint?.qualified_name || entry.endpoint?.name}</code>
                                {entry.endpoint?.file_path && (
                                  <p className="text-[10px] text-muted-foreground truncate">{entry.endpoint.file_path}</p>
                                )}
                                {entry.endpoint?.external && <span className="ml-1 text-[10px] text-blue-500">(external)</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Co-Changes */}
                  {liveGraphData.co_changes?.entries?.length > 0 && (
                    <div className="rounded-lg border border-border bg-background">
                      <button className="flex w-full items-center justify-between p-3 text-left" onClick={() => toggleSection("cochanges")}>
                        <div className="flex items-center gap-2">
                          <GitBranch className="size-4 text-purple-500" />
                          <h4 className="text-sm font-medium">Co-Changed Files ({liveGraphData.co_changes.total})</h4>
                        </div>
                        {expandedSections.has("cochanges") ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                      </button>
                      {expandedSections.has("cochanges") && (
                        <div className="border-t border-border px-3 pb-3">
                          {liveGraphData.co_changes.entries.map((entry: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                              <ArrowRight className="size-3 text-purple-500" />
                              <div className="min-w-0">
                                <code className="text-xs font-mono font-medium">{entry.endpoint?.name}</code>
                                <p className="text-[10px] text-muted-foreground">{entry.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Graph Stats */}
                  {liveGraphData.stats && (
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground pt-2 border-t border-border/50">
                      <span>Graph: {liveGraphData.stats.files} files · {liveGraphData.stats.symbols} symbols · {liveGraphData.stats.relations} relations</span>
                      <span className="ml-auto">{liveGraphData.total_latency_ms}ms</span>
                    </div>
                  )}
                </div>
              )}

              {!liveGraphData && !liveGraphLoading && !liveGraphError && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Select a file or search a symbol to run live graph analysis.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
