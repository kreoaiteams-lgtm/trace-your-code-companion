import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
} from "recharts";
import {
  Activity,
  BarChart3,
  Database,
  FileCode,
  Flame,
  GitCommit,
  Layers,
  TrendingUp,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { mockAnalytics, getRiskColor } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics Dashboard — TraceAI" },
      { name: "description", content: "Codebase analytics powered by Databricks — risk trends, complexity hotspots, and change patterns." },
    ],
  }),
  component: AnalyticsDashboard,
});

function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="size-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Powered by Databricks</span>
            </div>
            <h1 className="font-serif text-3xl font-medium">Codebase Analytics</h1>
            <p className="mt-1 text-muted-foreground">Real-time insights into codebase health, risk patterns, and developer activity.</p>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-card p-0.5">
            {["7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "rounded px-3 py-1.5 text-xs font-medium transition-colors",
                  timeRange === range ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Avg Risk Score", value: "43.2", change: "+2.1%", trend: "up", icon: Flame, color: "#f59e0b" },
            { label: "High-Risk Files", value: "7", change: "+16.7%", trend: "up", icon: Zap, color: "#ef4444" },
            { label: "Weekly Commits", value: "45", change: "+18.4%", trend: "up", icon: GitCommit, color: "#22c55e" },
            { label: "Code Complexity", value: "4.2", change: "-3.5%", trend: "down", icon: Layers, color: "#6366f1" },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium uppercase text-muted-foreground">{kpi.label}</span>
                  <div className="flex size-8 items-center justify-center rounded-md" style={{ backgroundColor: kpi.color + "18" }}>
                    <Icon className="size-4" style={{ color: kpi.color }} />
                  </div>
                </div>
                <p className="text-3xl font-bold">{kpi.value}</p>
                <p className={cn("text-xs font-medium mt-1", kpi.trend === "up" ? "text-emerald-600" : "text-red-500")}>
                  <TrendingUp className={cn("inline size-3 mr-1", kpi.trend === "down" && "rotate-180")} />
                  {kpi.change} from last period
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Risk Trend */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-medium">Risk Score Trends</h3>
              <Activity className="size-4 text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={mockAnalytics.riskTrends}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="highRiskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="avgRisk" stroke="#f59e0b" fill="url(#riskGradient)" strokeWidth={2} name="Avg Risk" />
                <Area type="monotone" dataKey="highRiskFiles" stroke="#ef4444" fill="url(#highRiskGradient)" strokeWidth={2} name="High Risk Files" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Activity */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-medium">Weekly Activity</h3>
              <BarChart3 className="size-4 text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockAnalytics.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="commits" fill="#6366f1" radius={[4, 4, 0, 0]} name="Commits" />
                <Bar dataKey="filesChanged" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Files Changed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Complexity Hotspots */}
          <div className="col-span-2 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-medium">Complexity Hotspots</h3>
              <Flame className="size-4 text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="complexity" name="Complexity" tick={{ fontSize: 11 }} stroke="#9ca3af" label={{ value: "Complexity", position: "insideBottom", offset: -5, fontSize: 11 }} />
                <YAxis dataKey="changes" name="Changes" tick={{ fontSize: 11 }} stroke="#9ca3af" label={{ value: "Changes (30d)", angle: -90, position: "insideLeft", fontSize: 11 }} />
                <ZAxis dataKey="risk" range={[100, 800]} name="Risk" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                  content={({ payload }) => {
                    if (!payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                        <p className="font-medium text-sm">{data.file}</p>
                        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>Complexity: {data.complexity}</span>
                          <span>Changes: {data.changes}</span>
                          <span>Bugs: {data.bugs}</span>
                          <span className="font-semibold" style={{ color: getRiskColor(data.risk) }}>
                            Risk: {data.risk}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Scatter data={mockAnalytics.complexityHotspots} name="Files">
                  {mockAnalytics.complexityHotspots.map((entry, i) => (
                    <Cell key={i} fill={getRiskColor(entry.risk)} fillOpacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            {/* Hotspot legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {mockAnalytics.complexityHotspots.slice(0, 4).map((h) => (
                <div key={h.file} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs">
                  <span className="size-2 rounded-full" style={{ backgroundColor: getRiskColor(h.risk) }} />
                  <span className="font-mono font-medium">{h.file}</span>
                  <span className="ml-auto text-muted-foreground">Risk: {h.risk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Language Distribution */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-medium">Languages</h3>
              <FileCode className="size-4 text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={mockAnalytics.languageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="percentage"
                  nameKey="language"
                  paddingAngle={2}
                >
                  {mockAnalytics.languageDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {mockAnalytics.languageDistribution.map((lang) => (
                <div key={lang.language} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded" style={{ backgroundColor: lang.color }} />
                    <span>{lang.language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{lang.files} files</span>
                    <span className="font-medium">{lang.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Module Coupling Table */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-medium">Module Coupling Analysis</h3>
            <span className="text-xs text-muted-foreground">Higher scores indicate tighter coupling</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Module A</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Module B</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Coupling Score</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Shared Deps</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Health</th>
                </tr>
              </thead>
              <tbody>
                {mockAnalytics.moduleCoupling.map((coupling, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{coupling.moduleA}</td>
                    <td className="px-4 py-3 font-mono text-xs">{coupling.moduleB}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${coupling.couplingScore}%`,
                              backgroundColor: getRiskColor(coupling.couplingScore),
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color: getRiskColor(coupling.couplingScore) }}>
                          {coupling.couplingScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{coupling.sharedDeps}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                        style={{ backgroundColor: getRiskColor(coupling.couplingScore) }}
                      >
                        {coupling.couplingScore >= 85 ? "Tight" : coupling.couplingScore >= 70 ? "Moderate" : "Loose"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
