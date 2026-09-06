// ============================================================
// TraceAI — Mock Data Layer
// Mirrors Entire Graph, Entire Checkpoints, and Databricks API
// shapes so the UI can be built now and swapped to real data later.
// ============================================================

// ---------- Graph Nodes & Edges (Entire Graph) ----------

export interface GraphNode {
  id: string;
  label: string;
  type: "module" | "file" | "function" | "class" | "component";
  language: string;
  path: string;
  complexity: number; // 1-10
  changeFrequency: number; // commits in last 30 days
  linesOfCode: number;
  riskScore: number; // 0-100
  dependencyCount: number;
  dependentCount: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "import" | "call" | "extend" | "implement" | "compose";
  weight: number; // strength of coupling
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    totalFiles: number;
    totalModules: number;
    avgComplexity: number;
    maxDepth: number;
    lastAnalyzed: string;
  };
}

// ---------- Sessions / Checkpoints (Entire Checkpoints) ----------

export interface TraceSession {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  authorAvatar: string;
  status: "active" | "paused" | "completed" | "shared";
  filesExplored: string[];
  questionsAsked: string[];
  findings: SessionFinding[];
  checkpointId: string;
  tags: string[];
}

export interface SessionFinding {
  type: "risk" | "insight" | "suggestion" | "warning";
  title: string;
  description: string;
  affectedFiles: string[];
  severity: "low" | "medium" | "high" | "critical";
}

// ---------- Impact Analysis ----------

export interface ImpactReport {
  targetFile: string;
  targetFunction?: string;
  riskScore: number;
  blastRadius: number; // number of affected files
  directDependents: string[];
  transitiveDependents: string[];
  affectedTests: string[];
  suggestions: string[];
  severity: "safe" | "moderate" | "high" | "critical";
  createdAt: string;
}

// ---------- Analytics (Databricks) ----------

export interface AnalyticsData {
  changeHeatmap: HeatmapEntry[];
  riskTrends: RiskTrendEntry[];
  complexityHotspots: HotspotEntry[];
  moduleCoupling: CouplingEntry[];
  weeklyActivity: WeeklyActivityEntry[];
  languageDistribution: LanguageEntry[];
}

export interface HeatmapEntry {
  file: string;
  day: string;
  changes: number;
}

export interface RiskTrendEntry {
  date: string;
  avgRisk: number;
  highRiskFiles: number;
  totalFiles: number;
}

export interface HotspotEntry {
  file: string;
  complexity: number;
  changes: number;
  bugs: number;
  risk: number;
}

export interface CouplingEntry {
  moduleA: string;
  moduleB: string;
  couplingScore: number;
  sharedDeps: number;
}

export interface WeeklyActivityEntry {
  week: string;
  commits: number;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
}

export interface LanguageEntry {
  language: string;
  files: number;
  percentage: number;
  color: string;
}

// ============================================================
// MOCK DATA
// ============================================================

export const mockGraphData: GraphData = {
  nodes: [
    { id: "app", label: "App.tsx", type: "component", language: "TypeScript", path: "src/App.tsx", complexity: 3, changeFrequency: 12, linesOfCode: 145, riskScore: 35, dependencyCount: 8, dependentCount: 1 },
    { id: "router", label: "router.tsx", type: "module", language: "TypeScript", path: "src/router.tsx", complexity: 2, changeFrequency: 4, linesOfCode: 52, riskScore: 20, dependencyCount: 3, dependentCount: 5 },
    { id: "auth-service", label: "auth.service.ts", type: "module", language: "TypeScript", path: "src/services/auth.service.ts", complexity: 7, changeFrequency: 18, linesOfCode: 312, riskScore: 78, dependencyCount: 5, dependentCount: 12 },
    { id: "api-client", label: "api-client.ts", type: "module", language: "TypeScript", path: "src/lib/api-client.ts", complexity: 6, changeFrequency: 15, linesOfCode: 289, riskScore: 65, dependencyCount: 3, dependentCount: 18 },
    { id: "user-store", label: "user.store.ts", type: "module", language: "TypeScript", path: "src/stores/user.store.ts", complexity: 5, changeFrequency: 9, linesOfCode: 178, riskScore: 52, dependencyCount: 4, dependentCount: 8 },
    { id: "dashboard", label: "Dashboard.tsx", type: "component", language: "TypeScript", path: "src/pages/Dashboard.tsx", complexity: 4, changeFrequency: 11, linesOfCode: 234, riskScore: 40, dependencyCount: 7, dependentCount: 2 },
    { id: "profile", label: "Profile.tsx", type: "component", language: "TypeScript", path: "src/pages/Profile.tsx", complexity: 3, changeFrequency: 6, linesOfCode: 156, riskScore: 25, dependencyCount: 5, dependentCount: 1 },
    { id: "settings", label: "Settings.tsx", type: "component", language: "TypeScript", path: "src/pages/Settings.tsx", complexity: 4, changeFrequency: 7, linesOfCode: 198, riskScore: 30, dependencyCount: 6, dependentCount: 1 },
    { id: "button", label: "Button.tsx", type: "component", language: "TypeScript", path: "src/components/ui/Button.tsx", complexity: 2, changeFrequency: 3, linesOfCode: 67, riskScore: 15, dependencyCount: 1, dependentCount: 22 },
    { id: "modal", label: "Modal.tsx", type: "component", language: "TypeScript", path: "src/components/ui/Modal.tsx", complexity: 4, changeFrequency: 5, linesOfCode: 134, riskScore: 28, dependencyCount: 2, dependentCount: 14 },
    { id: "form-utils", label: "form.utils.ts", type: "module", language: "TypeScript", path: "src/lib/form.utils.ts", complexity: 3, changeFrequency: 4, linesOfCode: 89, riskScore: 18, dependencyCount: 1, dependentCount: 9 },
    { id: "db-client", label: "db.client.ts", type: "module", language: "TypeScript", path: "src/lib/db.client.ts", complexity: 8, changeFrequency: 20, linesOfCode: 345, riskScore: 85, dependencyCount: 2, dependentCount: 15 },
    { id: "middleware", label: "middleware.ts", type: "module", language: "TypeScript", path: "src/middleware.ts", complexity: 6, changeFrequency: 8, linesOfCode: 167, riskScore: 55, dependencyCount: 4, dependentCount: 6 },
    { id: "types", label: "types.ts", type: "module", language: "TypeScript", path: "src/types/index.ts", complexity: 1, changeFrequency: 10, linesOfCode: 234, riskScore: 12, dependencyCount: 0, dependentCount: 25 },
    { id: "utils", label: "utils.ts", type: "module", language: "TypeScript", path: "src/lib/utils.ts", complexity: 2, changeFrequency: 6, linesOfCode: 123, riskScore: 10, dependencyCount: 1, dependentCount: 20 },
    { id: "hooks", label: "useAuth.ts", type: "function", language: "TypeScript", path: "src/hooks/useAuth.ts", complexity: 5, changeFrequency: 7, linesOfCode: 98, riskScore: 45, dependencyCount: 3, dependentCount: 10 },
    { id: "cache", label: "cache.ts", type: "module", language: "TypeScript", path: "src/lib/cache.ts", complexity: 6, changeFrequency: 5, linesOfCode: 156, riskScore: 42, dependencyCount: 2, dependentCount: 8 },
    { id: "logger", label: "logger.ts", type: "module", language: "TypeScript", path: "src/lib/logger.ts", complexity: 3, changeFrequency: 2, linesOfCode: 78, riskScore: 8, dependencyCount: 0, dependentCount: 30 },
    { id: "config", label: "config.ts", type: "module", language: "TypeScript", path: "src/config.ts", complexity: 1, changeFrequency: 3, linesOfCode: 45, riskScore: 5, dependencyCount: 0, dependentCount: 18 },
    { id: "error-handler", label: "errorHandler.ts", type: "module", language: "TypeScript", path: "src/lib/errorHandler.ts", complexity: 4, changeFrequency: 6, linesOfCode: 112, riskScore: 38, dependencyCount: 2, dependentCount: 12 },
  ],
  edges: [
    { source: "app", target: "router", type: "import", weight: 0.9 },
    { source: "app", target: "auth-service", type: "call", weight: 0.8 },
    { source: "router", target: "dashboard", type: "import", weight: 0.7 },
    { source: "router", target: "profile", type: "import", weight: 0.6 },
    { source: "router", target: "settings", type: "import", weight: 0.6 },
    { source: "dashboard", target: "api-client", type: "call", weight: 0.9 },
    { source: "dashboard", target: "user-store", type: "import", weight: 0.8 },
    { source: "dashboard", target: "button", type: "import", weight: 0.5 },
    { source: "dashboard", target: "modal", type: "import", weight: 0.5 },
    { source: "profile", target: "user-store", type: "import", weight: 0.8 },
    { source: "profile", target: "form-utils", type: "import", weight: 0.6 },
    { source: "profile", target: "button", type: "import", weight: 0.5 },
    { source: "settings", target: "user-store", type: "import", weight: 0.7 },
    { source: "settings", target: "api-client", type: "call", weight: 0.6 },
    { source: "settings", target: "form-utils", type: "import", weight: 0.5 },
    { source: "auth-service", target: "api-client", type: "call", weight: 0.9 },
    { source: "auth-service", target: "db-client", type: "call", weight: 0.8 },
    { source: "auth-service", target: "cache", type: "call", weight: 0.7 },
    { source: "auth-service", target: "logger", type: "call", weight: 0.5 },
    { source: "api-client", target: "config", type: "import", weight: 0.9 },
    { source: "api-client", target: "error-handler", type: "call", weight: 0.7 },
    { source: "api-client", target: "logger", type: "call", weight: 0.5 },
    { source: "api-client", target: "types", type: "import", weight: 0.8 },
    { source: "db-client", target: "config", type: "import", weight: 0.9 },
    { source: "db-client", target: "logger", type: "call", weight: 0.6 },
    { source: "db-client", target: "error-handler", type: "call", weight: 0.7 },
    { source: "user-store", target: "types", type: "import", weight: 0.9 },
    { source: "user-store", target: "api-client", type: "call", weight: 0.8 },
    { source: "hooks", target: "auth-service", type: "call", weight: 0.9 },
    { source: "hooks", target: "user-store", type: "import", weight: 0.8 },
    { source: "middleware", target: "auth-service", type: "call", weight: 0.9 },
    { source: "middleware", target: "logger", type: "call", weight: 0.6 },
    { source: "middleware", target: "error-handler", type: "call", weight: 0.7 },
    { source: "cache", target: "config", type: "import", weight: 0.6 },
    { source: "cache", target: "logger", type: "call", weight: 0.4 },
    { source: "error-handler", target: "logger", type: "call", weight: 0.8 },
  ],
  metadata: {
    totalFiles: 156,
    totalModules: 42,
    avgComplexity: 4.2,
    maxDepth: 7,
    lastAnalyzed: new Date().toISOString(),
  },
};

export const mockSessions: TraceSession[] = [
  {
    id: "trace-001",
    title: "Auth flow refactoring investigation",
    description: "Traced the authentication pipeline from login → token refresh → session management. Identified circular dependency between auth.service and cache module.",
    createdAt: "2026-09-06T08:30:00Z",
    updatedAt: "2026-09-06T09:15:00Z",
    author: "Dhruv Gautam",
    authorAvatar: "DG",
    status: "active",
    filesExplored: ["src/services/auth.service.ts", "src/lib/cache.ts", "src/hooks/useAuth.ts", "src/middleware.ts", "src/lib/api-client.ts"],
    questionsAsked: [
      "What happens if the token refresh fails mid-request?",
      "Is the cache invalidation synchronous or async?",
      "Which components depend on useAuth?",
    ],
    findings: [
      { type: "risk", title: "Circular dependency detected", description: "auth.service.ts imports cache.ts which imports config.ts that's also used by auth.service.ts through api-client.ts", affectedFiles: ["src/services/auth.service.ts", "src/lib/cache.ts"], severity: "high" },
      { type: "suggestion", title: "Extract token manager", description: "Token refresh logic should be separated from auth.service into its own module to reduce complexity", affectedFiles: ["src/services/auth.service.ts"], severity: "medium" },
    ],
    checkpointId: "ckpt-abc123",
    tags: ["auth", "refactoring", "security"],
  },
  {
    id: "trace-002",
    title: "Database connection pooling review",
    description: "Analyzed db.client.ts for connection pool exhaustion issues reported in production. Found that error handler doesn't properly release connections.",
    createdAt: "2026-09-05T14:00:00Z",
    updatedAt: "2026-09-05T16:30:00Z",
    author: "Maya Rodriguez",
    authorAvatar: "MR",
    status: "completed",
    filesExplored: ["src/lib/db.client.ts", "src/lib/errorHandler.ts", "src/config.ts", "src/lib/logger.ts"],
    questionsAsked: [
      "What's the max pool size configuration?",
      "Are connections released on error?",
      "Can we add connection health checks?",
    ],
    findings: [
      { type: "warning", title: "Connection leak on error", description: "errorHandler.ts catches database errors but doesn't call connection.release(), leading to pool exhaustion under load", affectedFiles: ["src/lib/errorHandler.ts", "src/lib/db.client.ts"], severity: "critical" },
      { type: "insight", title: "Pool size too small", description: "Config sets max pool to 5 connections but the app has 15+ concurrent query paths", affectedFiles: ["src/config.ts"], severity: "high" },
    ],
    checkpointId: "ckpt-def456",
    tags: ["database", "performance", "production-bug"],
  },
  {
    id: "trace-003",
    title: "Component library audit",
    description: "Reviewed all UI components for consistency, accessibility, and bundle size impact. Several components import the entire icon library.",
    createdAt: "2026-09-04T10:00:00Z",
    updatedAt: "2026-09-04T12:00:00Z",
    author: "Jake Lin",
    authorAvatar: "JL",
    status: "shared",
    filesExplored: ["src/components/ui/Button.tsx", "src/components/ui/Modal.tsx", "src/lib/form.utils.ts"],
    questionsAsked: [
      "Which components are most used across the app?",
      "Are there duplicate utility functions?",
    ],
    findings: [
      { type: "insight", title: "Button used in 22 files", description: "Button.tsx is the most widely used component — any breaking change has massive blast radius", affectedFiles: ["src/components/ui/Button.tsx"], severity: "medium" },
      { type: "suggestion", title: "Tree-shake icon imports", description: "Modal.tsx imports all icons instead of individual ones, adding ~45KB to the bundle", affectedFiles: ["src/components/ui/Modal.tsx"], severity: "low" },
    ],
    checkpointId: "ckpt-ghi789",
    tags: ["ui", "performance", "audit"],
  },
  {
    id: "trace-004",
    title: "API rate limiting investigation",
    description: "Explored how API requests are throttled and whether the current implementation handles 429 responses correctly.",
    createdAt: "2026-09-03T09:00:00Z",
    updatedAt: "2026-09-03T10:45:00Z",
    author: "Sam Kim",
    authorAvatar: "SK",
    status: "paused",
    filesExplored: ["src/lib/api-client.ts", "src/middleware.ts", "src/lib/errorHandler.ts", "src/lib/cache.ts"],
    questionsAsked: [
      "Do we retry on 429?",
      "Is there a request queue?",
      "What's the backoff strategy?",
    ],
    findings: [
      { type: "risk", title: "No retry logic for rate limits", description: "api-client.ts does not handle 429 responses — requests simply fail and error propagates to the UI", affectedFiles: ["src/lib/api-client.ts"], severity: "high" },
    ],
    checkpointId: "ckpt-jkl012",
    tags: ["api", "reliability", "rate-limiting"],
  },
];

export const mockImpactReports: ImpactReport[] = [
  {
    targetFile: "src/services/auth.service.ts",
    targetFunction: "refreshToken",
    riskScore: 78,
    blastRadius: 12,
    directDependents: ["src/hooks/useAuth.ts", "src/middleware.ts", "src/lib/api-client.ts"],
    transitiveDependents: ["src/pages/Dashboard.tsx", "src/pages/Profile.tsx", "src/pages/Settings.tsx", "src/App.tsx", "src/stores/user.store.ts", "src/components/ui/Modal.tsx", "src/lib/form.utils.ts", "src/lib/cache.ts", "src/lib/errorHandler.ts"],
    affectedTests: ["auth.test.ts", "middleware.test.ts", "api-client.test.ts", "useAuth.test.ts"],
    suggestions: [
      "Add integration tests for the full token refresh → request retry flow",
      "Consider implementing a circuit breaker pattern",
      "Extract token management into a dedicated module to reduce coupling",
    ],
    severity: "high",
    createdAt: new Date().toISOString(),
  },
  {
    targetFile: "src/lib/db.client.ts",
    riskScore: 85,
    blastRadius: 15,
    directDependents: ["src/services/auth.service.ts", "src/middleware.ts"],
    transitiveDependents: ["src/hooks/useAuth.ts", "src/pages/Dashboard.tsx", "src/pages/Profile.tsx", "src/pages/Settings.tsx", "src/App.tsx", "src/stores/user.store.ts", "src/lib/api-client.ts", "src/lib/cache.ts", "src/lib/errorHandler.ts", "src/lib/form.utils.ts", "src/components/ui/Button.tsx", "src/components/ui/Modal.tsx", "src/router.tsx"],
    affectedTests: ["db.test.ts", "auth.test.ts", "middleware.test.ts"],
    suggestions: [
      "Implement connection pool health monitoring",
      "Add graceful shutdown with connection draining",
      "Use connection wrapper pattern to ensure release on error",
    ],
    severity: "critical",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const mockAnalytics: AnalyticsData = {
  changeHeatmap: [
    { file: "auth.service.ts", day: "Mon", changes: 5 },
    { file: "auth.service.ts", day: "Tue", changes: 3 },
    { file: "auth.service.ts", day: "Wed", changes: 8 },
    { file: "auth.service.ts", day: "Thu", changes: 2 },
    { file: "auth.service.ts", day: "Fri", changes: 6 },
    { file: "api-client.ts", day: "Mon", changes: 4 },
    { file: "api-client.ts", day: "Tue", changes: 7 },
    { file: "api-client.ts", day: "Wed", changes: 2 },
    { file: "api-client.ts", day: "Thu", changes: 5 },
    { file: "api-client.ts", day: "Fri", changes: 3 },
    { file: "db.client.ts", day: "Mon", changes: 9 },
    { file: "db.client.ts", day: "Tue", changes: 6 },
    { file: "db.client.ts", day: "Wed", changes: 4 },
    { file: "db.client.ts", day: "Thu", changes: 7 },
    { file: "db.client.ts", day: "Fri", changes: 8 },
    { file: "Dashboard.tsx", day: "Mon", changes: 3 },
    { file: "Dashboard.tsx", day: "Tue", changes: 4 },
    { file: "Dashboard.tsx", day: "Wed", changes: 6 },
    { file: "Dashboard.tsx", day: "Thu", changes: 2 },
    { file: "Dashboard.tsx", day: "Fri", changes: 1 },
    { file: "utils.ts", day: "Mon", changes: 1 },
    { file: "utils.ts", day: "Tue", changes: 2 },
    { file: "utils.ts", day: "Wed", changes: 1 },
    { file: "utils.ts", day: "Thu", changes: 3 },
    { file: "utils.ts", day: "Fri", changes: 2 },
  ],
  riskTrends: [
    { date: "Aug 1", avgRisk: 32, highRiskFiles: 3, totalFiles: 156 },
    { date: "Aug 8", avgRisk: 35, highRiskFiles: 4, totalFiles: 158 },
    { date: "Aug 15", avgRisk: 38, highRiskFiles: 5, totalFiles: 160 },
    { date: "Aug 22", avgRisk: 42, highRiskFiles: 6, totalFiles: 162 },
    { date: "Aug 29", avgRisk: 40, highRiskFiles: 5, totalFiles: 164 },
    { date: "Sep 1", avgRisk: 45, highRiskFiles: 7, totalFiles: 165 },
    { date: "Sep 5", avgRisk: 43, highRiskFiles: 6, totalFiles: 167 },
  ],
  complexityHotspots: [
    { file: "db.client.ts", complexity: 8, changes: 20, bugs: 5, risk: 85 },
    { file: "auth.service.ts", complexity: 7, changes: 18, bugs: 3, risk: 78 },
    { file: "api-client.ts", complexity: 6, changes: 15, bugs: 2, risk: 65 },
    { file: "middleware.ts", complexity: 6, changes: 8, bugs: 1, risk: 55 },
    { file: "user.store.ts", complexity: 5, changes: 9, bugs: 2, risk: 52 },
    { file: "useAuth.ts", complexity: 5, changes: 7, bugs: 1, risk: 45 },
    { file: "cache.ts", complexity: 6, changes: 5, bugs: 1, risk: 42 },
    { file: "errorHandler.ts", complexity: 4, changes: 6, bugs: 2, risk: 38 },
  ],
  moduleCoupling: [
    { moduleA: "auth.service", moduleB: "api-client", couplingScore: 92, sharedDeps: 4 },
    { moduleA: "auth.service", moduleB: "db.client", couplingScore: 85, sharedDeps: 3 },
    { moduleA: "auth.service", moduleB: "cache", couplingScore: 78, sharedDeps: 2 },
    { moduleA: "api-client", moduleB: "errorHandler", couplingScore: 72, sharedDeps: 2 },
    { moduleA: "db.client", moduleB: "errorHandler", couplingScore: 68, sharedDeps: 2 },
    { moduleA: "middleware", moduleB: "auth.service", couplingScore: 88, sharedDeps: 3 },
    { moduleA: "user.store", moduleB: "api-client", couplingScore: 75, sharedDeps: 2 },
    { moduleA: "hooks", moduleB: "auth.service", couplingScore: 82, sharedDeps: 3 },
  ],
  weeklyActivity: [
    { week: "W31", commits: 34, filesChanged: 28, linesAdded: 1240, linesRemoved: 560 },
    { week: "W32", commits: 41, filesChanged: 35, linesAdded: 1580, linesRemoved: 720 },
    { week: "W33", commits: 28, filesChanged: 22, linesAdded: 890, linesRemoved: 340 },
    { week: "W34", commits: 52, filesChanged: 45, linesAdded: 2100, linesRemoved: 980 },
    { week: "W35", commits: 38, filesChanged: 31, linesAdded: 1450, linesRemoved: 610 },
    { week: "W36", commits: 45, filesChanged: 38, linesAdded: 1780, linesRemoved: 820 },
  ],
  languageDistribution: [
    { language: "TypeScript", files: 98, percentage: 62.8, color: "#3178c6" },
    { language: "CSS", files: 24, percentage: 15.4, color: "#663399" },
    { language: "JSON", files: 18, percentage: 11.5, color: "#f5a623" },
    { language: "Markdown", files: 12, percentage: 7.7, color: "#083fa1" },
    { language: "Shell", files: 4, percentage: 2.6, color: "#89e051" },
  ],
};

// ---------- Helper functions ----------

export function getNodeById(id: string): GraphNode | undefined {
  return mockGraphData.nodes.find((n) => n.id === id);
}

export function getNodeDependencies(nodeId: string): GraphNode[] {
  const targetIds = mockGraphData.edges
    .filter((e) => e.source === nodeId)
    .map((e) => e.target);
  return mockGraphData.nodes.filter((n) => targetIds.includes(n.id));
}

export function getNodeDependents(nodeId: string): GraphNode[] {
  const sourceIds = mockGraphData.edges
    .filter((e) => e.target === nodeId)
    .map((e) => e.source);
  return mockGraphData.nodes.filter((n) => sourceIds.includes(n.id));
}

export function getRiskColor(risk: number): string {
  if (risk >= 75) return "#ef4444";
  if (risk >= 50) return "#f59e0b";
  if (risk >= 25) return "#3b82f6";
  return "#22c55e";
}

export function getRiskLabel(risk: number): string {
  if (risk >= 75) return "Critical";
  if (risk >= 50) return "High";
  if (risk >= 25) return "Moderate";
  return "Safe";
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical": return "#ef4444";
    case "high": return "#f59e0b";
    case "medium": return "#3b82f6";
    case "low": return "#22c55e";
    default: return "#6b7280";
  }
}
