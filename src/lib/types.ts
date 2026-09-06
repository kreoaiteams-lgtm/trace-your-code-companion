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
  isRedacted?: boolean;
  repository: string;
}

export interface SessionFinding {
  type: "risk" | "insight" | "suggestion" | "warning";
  title: string;
  description: string;
  affectedFiles: string[];
  severity: "low" | "medium" | "high" | "critical";
  isRedacted?: boolean;
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

