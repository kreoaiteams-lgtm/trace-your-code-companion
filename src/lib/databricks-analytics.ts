import { supabase } from "./supabase";

export type AnalyticsSource = "supabase" | "demo-fallback";

export interface AnalyticsData {
  changeHeatmap: any[];
  riskTrends: any[];
  complexityHotspots: any[];
  moduleCoupling: any[];
  weeklyActivity: any[];
  languageDistribution: any[];
}

export type AnalyticsSnapshot = {
  data: AnalyticsData;
  source: AnalyticsSource;
  generatedAt: string;
  warning?: string;
};

export async function loadAnalytics(timeRange: string): Promise<AnalyticsSnapshot> {
  try {
    const [
      { data: heatmap },
      { data: trends },
      { data: hotspots },
      { data: coupling },
      { data: weekly },
      { data: language },
    ] = await Promise.all([
      supabase.from("analytics_heatmap").select("*"),
      supabase.from("analytics_risk_trends").select("*"),
      supabase.from("analytics_complexity_hotspots").select("*"),
      supabase.from("analytics_module_coupling").select("*"),
      supabase.from("analytics_weekly_activity").select("*"),
      supabase.from("analytics_language_distribution").select("*"),
    ]);

    const data: AnalyticsData = {
      changeHeatmap: (heatmap || []).map(r => ({ file: r.file, day: r.day, changes: r.changes })),
      riskTrends: (trends || []).map(r => ({ date: r.date, avgRisk: r.avg_risk, highRiskFiles: r.high_risk_files, totalFiles: r.total_files })),
      complexityHotspots: (hotspots || []).map(r => ({ file: r.file, complexity: r.complexity, changes: r.changes, bugs: r.bugs, risk: r.risk })),
      moduleCoupling: (coupling || []).map(r => ({ moduleA: r.module_a, moduleB: r.module_b, couplingScore: r.coupling_score, sharedDeps: r.shared_deps })),
      weeklyActivity: (weekly || []).map(r => ({ week: r.week, commits: r.commits, filesChanged: r.files_changed, linesAdded: r.lines_added, linesRemoved: r.lines_removed })),
      languageDistribution: (language || []).map(r => ({ language: r.language, files: r.files, percentage: r.percentage, color: r.color })),
    };

    return { data, source: "supabase", generatedAt: new Date().toISOString() };
  } catch (error) {
    return {
      data: { changeHeatmap: [], riskTrends: [], complexityHotspots: [], moduleCoupling: [], weeklyActivity: [], languageDistribution: [] },
      source: "demo-fallback",
      generatedAt: new Date().toISOString(),
      warning: error instanceof Error ? error.message : "Supabase request failed.",
    };
  }
}
